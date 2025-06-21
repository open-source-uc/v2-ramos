import { defineCollection, z } from "astro:content";

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
        const data = await response.json() as CourseSummary[];

        return data.map((c) => ({
            id: c.id + "", // debe ser texto why, idk xd
            sigle: c.sigle,
            school_id: c.school_id,
            area_id: c.area_id,
            category_id: c.category_id,
            superlikes: c.superlikes,
            likes: c.likes,
            dislikes: c.dislikes,
            votes_low_workload: c.votes_low_workload,
            votes_medium_workload: c.votes_medium_workload,
            votes_high_workload: c.votes_high_workload,
            avg_weekly_hours: c.avg_weekly_hours,
            sort_index: c.sort_index
        }))
    },
    schema: z.object({
        id: z.string(),
        sigle: z.string(),
        school_id: z.number(),
        area_id: z.number(),
        category_id: z.number(),
        superlikes: z.number(),
        likes: z.number(),
        dislikes: z.number(),
        votes_low_workload: z.number(),
        votes_medium_workload: z.number(),
        votes_high_workload: z.number(),
        avg_weekly_hours: z.number(),
        sort_index: z.number()
    })
})


export const collections = { recommendations, coursesScore }