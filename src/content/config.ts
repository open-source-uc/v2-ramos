import { file } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { link } from "fs";

const resourcesSchema =
    z.object({
        title: z.string(),
        readtime: z.number(),
        description: z.string(),
        author: z.object({
            name: z.string(),
            title: z.string(),
            picture: z.string().optional(),
            link: z.string().optional(),
        }).optional(),
    })

const resources = defineCollection({
    schema: resourcesSchema,
})

const blogs = defineCollection({
    schema: resourcesSchema.extend({
        tags: z.array(z.string())
    }),
})

const initiatives = defineCollection({
    schema: z.object({
        title: z.string(),
        name: z.string(),
        picture: z.string().optional(),
        faculty: z.string(),
        rrss: z.object({
            instagram: z.string().optional(),
            github: z.string().optional(),
            linkedin: z.string().optional(),
            twitter: z.string().optional(),
        })
    })
});

const recommendations = defineCollection({
    schema: z.object({
        title: z.string(),
        code: z.string(),
        initiative: z.string(),
        period: z.string(),
        faculty: z.string(),
        qualification: z.number().min(1).max(7),
        tags: z.array(z.string()),
        resume: z.string(),
    })
})


const coursesStatic = defineCollection({
    loader: file("src/../migration/json/cursos-simplificado.json", {
        parser: (content) => {

            const coursesData: Record<string, object> = JSON.parse(content);

            const entries = Object.entries(coursesData).map(([key, course]) => ({
                id: key, // Usa la clave como ID (ej: "AGC204")
                ...course // Spread de las propiedades del curso
            }));

            return entries;
        }
    }),
    schema: z.object({
        sigle: z.string(),
        name: z.string(),
        credits: z.number(),
        req: z.string(),
        conn: z.string(),
        restr: z.string(),
        equiv: z.string(),
        school: z.string(),
        area: z.string(),
        category: z.string(),
        format: z.array(z.string()),
        campus: z.array(z.string()),
        is_removable: z.array(z.boolean()),
        is_special: z.array(z.boolean()),
        is_english: z.array(z.boolean()),
        description: z.string(),
        last_semester: z.string(), // Formato: YYYY-S
    })
})

const contribuidores = defineCollection({
    loader: file("src/content/contribuidores/data.json", {
        parser: (content) => {
            const data = JSON.parse(content);
            return data; // Return the array directly
        }
    }),
    schema: z.object({
        id: z.string(),
        nombre: z.string(),
        rol: z.string(),
        carrera: z.string(),
        linkedin: z.string().url(),
        github: z.string().url(),
        imagen: z.string(),
    }),
});

const agradecimientos = defineCollection({
    loader: file("src/content/agradecimientos/data.json", {
        parser: (content) => {
            const data = JSON.parse(content);
            return data; // Return the array directly
        }
    }),
    schema: z.object({
        id: z.string(),
        nombre: z.string(),
        apellido: z.string(),
        imagen: z.string(),
        linkedin: z.string().url().optional()
    }),
});


export const collections = { resources, blogs, initiatives, recommendations, coursesStatic, contribuidores, agradecimientos };
