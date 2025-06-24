import { file } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import CoursesRaw from "../../migration/json/2025-1.json";
import Id2NameRaw from "../../migration/json/valores_unicos.json";
import type { CourseStaticInfo, CourseSummary } from "@/types";


const coursesData = CoursesRaw as Record<string, CourseStaticInfo>;
const id2NameData = Id2NameRaw as Record<string, string>;

const resources = defineCollection({
    schema: z.object({
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
})

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

const coursesScore = defineCollection({
    loader: async () => {
        console.log("=== SI PASA MUCHO ES MUY MALO ===");


        const response = await fetch("https://v2-ramos.pages.dev/api/courses", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${import.meta.env.API_SECRET}`,
            }
        });
        console.log(import.meta.env.PROD);
        const data = await response.json() as CourseSummary[];

        // const coursesWithNames = Object.entries(coursesScore).map(
        //   ([sigle, details], index) => {
        //     const moredata = coursesData[details.data.sigle];
        //     return {
        //       id: details.id,
        //       sigle: details.data.sigle,

        //       name: moredata.name,
        //       credits: moredata.credits,

        //       school: id2NameData[details.data.school_id],
        //       area: id2NameData[details.data.area_id],
        //       category: id2NameData[details.data.category_id],

        //       likes: details.data.likes,
        //       superlikes: details.data.superlikes,
        //       dislikes: details.data.dislikes,

        //       votes_low_workload: details.data.votes_low_workload,
        //       votes_medium_workload: details.data.votes_medium_workload,
        //       votes_high_workload: details.data.votes_high_workload,

        //       votes_mandatory_attendance: details.data.votes_mandatory_attendance,
        //       votes_optional_attendance: details.data.votes_optional_attendance,

        //       avg_weekly_hours: details.data.avg_weekly_hours,

        //       sort_index: details.data.sort_index,
        //     };
        //   },
        // );

        return data.map((c) => {
            const staticInfo = coursesData[c.sigle];
            return {
                id: c.sigle, // id para buscar con collection
                db_id: c.id, // id de la base de datos, para buscar con API, igual tambien se puede usar el id en la base de datos, y es LO RECOMENDADO
                sigle: c.sigle,
                name: staticInfo?.name ?? c.sigle,
                credits: staticInfo?.credits ?? 0,
                school_id: c.school_id,
                school: id2NameData[c.school_id] || "",
                area_id: c.area_id,
                area: id2NameData[c.area_id] || "",
                category_id: c.category_id,
                category: id2NameData[c.category_id] || "",
                superlikes: c.superlikes,
                likes: c.likes,
                dislikes: c.dislikes,
                votes_low_workload: c.votes_low_workload,
                votes_medium_workload: c.votes_medium_workload,
                votes_high_workload: c.votes_high_workload,
                avg_weekly_hours: c.avg_weekly_hours,
                sort_index: c.sort_index,
                votes_mandatory_attendance: c.votes_mandatory_attendance,
                votes_optional_attendance: c.votes_optional_attendance,
            }
        })
    },
    schema: z.object({
        id: z.string().transform((val) => val ?? ""),
        db_id: z.number().nullable().transform((val) => val ?? 0),
        sigle: z.string().transform((val) => val ?? ""),
        name: z.string().transform((val) => val ?? ""),
        credits: z.number().nullable().transform((val) => val ?? 0),
        school_id: z.number().nullable().transform((val) => val ?? 0),
        school: z.string().transform((val) => val ?? ""),
        area_id: z.number().nullable().transform((val) => val ?? 0),
        area: z.string().transform((val) => val ?? ""),
        category_id: z.number().nullable().transform((val) => val ?? 0),
        category: z.string().transform((val) => val ?? ""),
        superlikes: z.number().nullable().transform((val) => val ?? 0),
        likes: z.number().nullable().transform((val) => val ?? 0),
        dislikes: z.number().nullable().transform((val) => val ?? 0),
        votes_low_workload: z.number().nullable().transform((val) => val ?? 0),
        votes_medium_workload: z.number().nullable().transform((val) => val ?? 0),
        votes_high_workload: z.number().nullable().transform((val) => val ?? 0),
        avg_weekly_hours: z.number().nullable().transform((val) => val ?? 0),
        sort_index: z.number().nullable().transform((val) => val ?? 0),
        votes_mandatory_attendance: z.number().nullable().transform((val) => val ?? 0),
        votes_optional_attendance: z.number().nullable().transform((val) => val ?? 0),
    })
})

const coursesStatic = defineCollection({
    loader: file("src/../migration/json/2025-1.json", {
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
        program: z.string(),
        school: z.string(),
        area: z.string(),
        category: z.string(),
    })
})


export const collections = { resources, recommendations, coursesScore, coursesStatic }