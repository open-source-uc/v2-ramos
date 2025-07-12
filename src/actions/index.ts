// Agregar al archivo src/actions/index.js

import { OsucPermissions } from "@/types/permissions";
import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import { getUserDataByToken } from "@/lib/server/auth";
import { getToken } from "@/lib/auth";
import type { CourseReview } from "@/types";

const courseReviewSchema = z.object({
    course_sigle: z.string()
        .min(1, "La sigla del curso es requerida")
        .max(20, "La sigla del curso no puede exceder 20 caracteres"),

    like_dislike: z.number()
        .int("El voto debe ser un número entero")
        .min(0, "El voto debe ser 0 (dislike), 1 (like) o 2 (superlike)")
        .max(2, "El voto debe ser 0 (dislike), 1 (like) o 2 (superlike)"),

    workload_vote: z.number()
        .int("El voto de carga debe ser un número entero")
        .min(0, "El voto debe ser 0 (bajo), 1 (medio) o 2 (alto)")
        .max(2, "El voto debe ser 0 (bajo), 1 (medio) o 2 (alto)"),

    attendance_type: z.number()
        .int("El tipo de asistencia debe ser un número entero")
        .min(0, "El tipo debe ser 0 (obligatoria) o 1 (opcional)")
        .max(1, "El tipo debe ser 0 (obligatoria) o 1 (opcional)"),

    weekly_hours: z.number()
        .int("Las horas semanales deben ser un número entero")
        .min(0, "Las horas semanales no pueden ser negativas")
        .max(168, "No puede haber más de 168 horas en una semana"),

    year_taken: z.number()
        .int("El año debe ser un número entero"),

    semester_taken: z.number()
        .int("El semestre debe ser un número entero")
        .min(1, "El semestre debe ser 1, 2 o 3")
        .max(3, "El semestre debe ser 1, 2 o 3"),

    comment: z.string()
        .max(10000, "El comentario no puede exceder 10,000 caracteres")
        .optional()
});

// Función helper para subir texto Markdown a R2
async function uploadMarkdownToR2(locals: App.Locals, markdownContent: string, filePath: string) {
    try {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(markdownContent);

        await locals.runtime.env.R2.put(filePath, uint8Array, {
            httpMetadata: {
                contentType: 'text/markdown; charset=utf-8',
                contentDisposition: `attachment; filename="${filePath.split('/').pop()}"`
            },
            customMetadata: {
                uploadedAt: new Date().toISOString(),
                contentLength: markdownContent.length.toString()
            }
        });

        return true;
    } catch (error) {
        console.error('Error uploading markdown to R2:', error);
        return false;
    }
}



// Función helper para generar path único
function generateReviewPath(courseId: string, reviewId: number) {
    const timestamp = Date.now();
    return `reviews/${courseId}/${reviewId}-${timestamp}.md`;
}

export const server = {

    // Crear o sobrescribir una reseña existente
    createCourseReview: defineAction({
        accept: "form",
        input: courseReviewSchema,
        handler: async (state, ctx) => {
            const { locals, cookies } = ctx;
            const min_year = new Date().getFullYear() - 6
            const max_year = new Date().getFullYear();

            if (state.year_taken < min_year || state.year_taken > max_year) {
                throw new ActionError({
                    code: "BAD_REQUEST",
                    message: `El año debe estar entre ${min_year} y ${max_year}`
                });
            }
            // Verificar autenticación
            const token = getToken(cookies);
            const user = await getUserDataByToken(token);


            if (!user) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Debes iniciar sesión para crear una reseña"
                });
            }

            if (!user.permissions.includes(OsucPermissions.userCanEditAndCreateReview)) {
                throw new ActionError({
                    code: "FORBIDDEN",
                    message: "No tienes permisos para crear o editar reseñas"
                });
            }

            try {
                // Verificar si el curso existe en course_summary
                const courseExists = await locals.runtime.env.DB
                    .prepare("SELECT sigle FROM course_summary WHERE sigle = ?")
                    .bind(state.course_sigle.toUpperCase())
                    .first();

                if (!courseExists) {
                    throw new ActionError({
                        code: "NOT_FOUND",
                        message: "El curso especificado no existe"
                    });
                }

                // Verificar si ya existe una reseña para este usuario y curso
                const existingReview = await locals.runtime.env.DB
                    .prepare("SELECT id, comment_path FROM course_reviews WHERE user_id = ? AND course_sigle = ?")
                    .bind(user.id, state.course_sigle.toUpperCase())
                    .first<CourseReview>();

                let reviewId;
                let isUpdate = false;

                if (existingReview) {
                    // Si existe, la vamos a sobrescribir
                    reviewId = existingReview.id;
                    isUpdate = true;

                    // Eliminar el archivo anterior de R2 si existe
                    if (existingReview.comment_path) {
                        try {
                            await locals.runtime.env.R2.delete(existingReview.comment_path);
                        } catch (error) {
                            console.warn('No se pudo eliminar el archivo anterior:', error);
                        }
                    }
                } else {
                    // Si no existe, crear una nueva entrada
                    const result = await locals.runtime.env.DB
                        .prepare(`
                        INSERT INTO course_reviews (
                            user_id, course_sigle, like_dislike, workload_vote, 
                            attendance_type, weekly_hours, year_taken, semester_taken, comment_path
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `)
                        .bind(
                            user.id,
                            state.course_sigle.toUpperCase(),
                            state.like_dislike,
                            state.workload_vote,
                            state.attendance_type,
                            state.weekly_hours,
                            state.year_taken,
                            state.semester_taken,
                            null // Inicialmente null, se actualizará con el path si hay comentario
                        )
                        .run();

                    if (!result.success) {
                        throw new ActionError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: "Error al guardar la reseña"
                        });
                    }

                    reviewId = result.meta.last_row_id;
                }

                let filePath = null;

                // Si hay un comentario, subirlo a R2
                if (state.comment && state.comment.trim().length > 0) {
                    filePath = generateReviewPath(state.course_sigle.toUpperCase(), reviewId);

                    const uploadSuccess = await uploadMarkdownToR2(locals, state.comment, filePath);

                    if (!uploadSuccess) {
                        // Si falla la subida y es una nueva reseña, eliminarla
                        if (!isUpdate) {
                            await locals.runtime.env.DB
                                .prepare("DELETE FROM course_reviews WHERE id = ?")
                                .bind(reviewId)
                                .run();
                        }

                        throw new ActionError({
                            code: "INTERNAL_SERVER_ERROR",
                            message: "Error al subir el comentario"
                        });
                    }
                }

                // Actualizar o mantener la reseña con los nuevos datos
                const updateResult = await locals.runtime.env.DB
                    .prepare(`
                    UPDATE course_reviews 
                    SET like_dislike = ?, workload_vote = ?, attendance_type = ?, 
                        weekly_hours = ?, year_taken = ?, semester_taken = ?, comment_path = ?
                    WHERE id = ?
                `)
                    .bind(
                        state.like_dislike,
                        state.workload_vote,
                        state.attendance_type,
                        state.weekly_hours,
                        state.year_taken,
                        state.semester_taken,
                        filePath,
                        reviewId
                    )
                    .run();

                if (!updateResult.success) {
                    throw new ActionError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Error al actualizar la reseña"
                    });
                }

                return {
                    message: isUpdate ? "Reseña actualizada exitosamente" : "Reseña creada exitosamente",
                    code: isUpdate ? 200 : 201,
                    reviewId: reviewId,
                    filePath: filePath,
                    wasUpdated: isUpdate
                };

            } catch (error) {
                // Si es un ActionError, re-lanzarlo
                if (error instanceof ActionError) {
                    throw error;
                }

                // Log del error para debugging
                console.error("Error creating/updating course review:", error);

                throw new ActionError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Error interno del servidor al procesar la reseña"
                });
            }
        }
    }),

    // Acción para eliminar una reseña
    deleteCourseReview: defineAction({
        accept: "form",
        input: z.object({
            review_id: z.number().int().positive("ID de reseña inválido")
        }),
        handler: async (state, ctx) => {
            const { locals, cookies } = ctx;

            const token = getToken(cookies);
            const user = await getUserDataByToken(token);

            if (!user) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Debes iniciar sesión para eliminar una reseña"
                });
            }

            try {
                // Verificar que la reseña existe y pertenece al usuario, y obtener el path del archivo
                const existingReview = await locals.runtime.env.DB
                    .prepare("SELECT id, comment_path FROM course_reviews WHERE id = ? AND user_id = ? AND status != 3") // una reseña ocultada no puede ser eliminada pues el usuario malisioso la podria eliminar para volver a publicarla
                    // TODO: Tener en cuenta que el usuario podria borrar su cuenta para tener un nuevo id de usuario y volver a publicar la reseña, por lo que seria importante crear en el auth una lista de hashes baneados para evitar que se puedan volver a REGISTRAR 
                    .bind(state.review_id, user.id)
                    .first<CourseReview>();

                if (!existingReview) {
                    throw new ActionError({
                        code: "NOT_FOUND",
                        message: "Reseña no encontrada o no tienes permisos para eliminarla"
                    });
                }

                // Eliminar el archivo de R2 si existe
                if (existingReview.comment_path) {
                    try {
                        await locals.runtime.env.R2.delete(existingReview.comment_path);
                    } catch (error) {
                        console.warn('No se pudo eliminar el archivo de R2:', error);
                        // No fallar si no se puede eliminar el archivo, continuar con la eliminación de la reseña
                    }
                }

                // Eliminar la reseña de la base de datos
                const result = await locals.runtime.env.DB
                    .prepare("DELETE FROM course_reviews WHERE id = ? AND user_id = ?")
                    .bind(state.review_id, user.id)
                    .run();

                if (!result.success) {
                    throw new ActionError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Error al eliminar la reseña"
                    });
                }

                return {
                    message: "Reseña eliminada exitosamente",
                    code: 200
                };

            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }

                console.error("Error deleting course review:", error);

                throw new ActionError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Error interno del servidor al eliminar la reseña"
                });
            }
        }
    }),
    reportCourseReview: defineAction({
        accept: "form",
        input: z.object({
            review_id: z.number().int().positive("ID de reseña inválido")
        }),
        handler: async (state, ctx) => {
            console.log(state)
            try {
                // Verificar que la reseña existe
                const existingReview = await ctx.locals.runtime.env.DB
                    .prepare("SELECT id, status FROM course_reviews WHERE id = ?")
                    .bind(state.review_id)
                    .first<{ id: number; status: number }>();

                if (!existingReview) {
                    throw new ActionError({
                        code: "NOT_FOUND",
                        message: "Reseña no encontrada"
                    });
                }

                // Evitar múltiples reportes de una reseña ya reportada o moderada
                // if (existingReview.status === 1) {
                //     return {
                //         code: 200,
                //         message: "Reseña reportada exitosamente"
                //     }
                // }

                // evitar reportar reseñas que ya estan reportadas
                if (existingReview.status === 2) {
                    return {
                        code: 200,
                        message: "Reseña reportada exitosamente"
                    }
                }

                // Evitar reportar reseñas que ya han sido ocultadas
                if (existingReview.status === 3) {
                    throw new ActionError({
                        code: "BAD_REQUEST",
                        message: "La reseña ya ha sido ocultada"
                    });
                }

                const updateResult = await ctx.locals.runtime.env.DB
                    .prepare("UPDATE course_reviews SET status = 2 WHERE id = ?")
                    .bind(state.review_id)
                    .run();

                if (!updateResult.success) {
                    throw new ActionError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Error al actualizar el estado de la reseña"
                    });
                }

                return {
                    message: "Reseña reportada exitosamente",
                    code: 200
                };

            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }

                console.error("Error al reportar la reseña:", error);

                throw new ActionError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Error interno del servidor al reportar la reseña"
                });
            }
        }
    }),
    updateReviewStatus: defineAction({
        accept: "form",
        input: z.object({
            review_id: z.number().int().positive("ID de reseña inválido"),
            status: z.enum(["0", "1", "2", "3"], {
                errorMap: () => ({ message: "El estado debe ser 0 (pendiente), 1 (aprobada), 2 (reportada) o 3 (ocultada)" })
            })
        }),
        handler: async (state, ctx) => {
            const { locals, cookies } = ctx;

            const token = getToken(cookies)
            const user = await getUserDataByToken(token);

            if (!user) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Debes iniciar sesión para eliminar una reseña"
                });
            }

            if (!user.permissions.includes(OsucPermissions.userIsRoot)) {
                throw new ActionError({
                    code: "FORBIDDEN",
                    message: "No tienes permisos para eliminar reseñas"
                });
            }

            try {
                const existingReview = await locals.runtime.env.DB
                    .prepare("SELECT id, comment_path FROM course_reviews WHERE id = ?")
                    .bind(state.review_id)
                    .first<CourseReview>();

                if (!existingReview) {
                    throw new ActionError({
                        code: "NOT_FOUND",
                        message: "Reseña no encontrada."
                    });
                }

                // Actualizar el estado de la reseña
                const updateResult = await locals.runtime.env.DB
                    .prepare("UPDATE course_reviews SET status = ? WHERE id = ?")
                    .bind(state.status, state.review_id)
                    .run();

                if (!updateResult.success) {
                    throw new ActionError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Error al actualizar el estado de la reseña"
                    });
                }

                return {
                    message: "Reseña actualizada exitosamente",
                    code: 200
                };

            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }

                throw new ActionError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Error interno del servidor al eliminar la reseña"
                });
            }
        }
    }),
    deleteAnyReview: defineAction({
        accept: "form",
        input: z.object({
            review_id: z.number().int().positive("ID de reseña inválido")
        }),
        handler: async (state, ctx) => {
            const { locals, cookies } = ctx;

            const token = getToken(cookies);
            const user = await getUserDataByToken(token);

            if (!user) {
                throw new ActionError({
                    code: "UNAUTHORIZED",
                    message: "Debes iniciar sesión para eliminar una reseña"
                });
            }

            if (!user.permissions.includes(OsucPermissions.userIsRoot)) {
                throw new ActionError({
                    code: "FORBIDDEN",
                    message: "No tienes permisos para eliminar reseñas"
                });
            }

            try {
                // Verificar que la reseña existe y pertenece al usuario, y obtener el path del archivo
                const existingReview = await locals.runtime.env.DB
                    .prepare("SELECT id, comment_path FROM course_reviews WHERE id = ?")
                    // en caso de borrar una reseña, hay que banear pues el usuario la podria volver a publicar D:
                    .bind(state.review_id)
                    .first<CourseReview>();

                if (!existingReview) {
                    throw new ActionError({
                        code: "NOT_FOUND",
                        message: "Reseña no encontrada o no tienes permisos para eliminarla"
                    });
                }

                // Eliminar el archivo de R2 si existe
                if (existingReview.comment_path) {
                    try {
                        await locals.runtime.env.R2.delete(existingReview.comment_path);
                    } catch (error) {
                        console.warn('No se pudo eliminar el archivo de R2:', error);
                        // No fallar si no se puede eliminar el archivo, continuar con la eliminación de la reseña
                    }
                }

                // Eliminar la reseña de la base de datos
                const result = await locals.runtime.env.DB
                    .prepare("DELETE FROM course_reviews WHERE id = ?")
                    .bind(state.review_id)
                    .run();

                if (!result.success) {
                    throw new ActionError({
                        code: "INTERNAL_SERVER_ERROR",
                        message: "Error al eliminar la reseña"
                    });
                }

                return {
                    message: "Reseña eliminada exitosamente",
                    code: 200
                };

            } catch (error) {
                if (error instanceof ActionError) {
                    throw error;
                }

                console.error("Error deleting course review:", error);

                throw new ActionError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Error interno del servidor al eliminar la reseña"
                });
            }
        }
    }),
}