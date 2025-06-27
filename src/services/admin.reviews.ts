import { OsucPermissions } from "@/types/permissions";
import { getUserDataByToken } from "./auth";

export async function getPendingReviews(locals: App.Locals, token: string) {
    const user = await getUserDataByToken(token)

    if (!user)
        throw new Error("User not found");


    if (!user.permissions.includes(OsucPermissions.userIsRoot))
        throw new Error("You do not have permission to access this resource");

    const DB = locals.runtime.env.DB;

    const result = await DB.prepare("SELECT id, user_id, course_sigle, like_dislike, workload_vote, attendance_type, weekly_hours, year_taken, semester_taken, comment_path, status, created_at, updated_at FROM course_reviews WHERE status = 0 ORDER BY updated_at DESC").all<CourseReview>();

    const reviews = result.results;

    return reviews;
}

export async function getReportedReviews(locals: App.Locals, token: string) {
    const user = await getUserDataByToken(token)

    if (!user)
        throw new Error("User not found");

    if (!user.permissions.includes(OsucPermissions.userIsRoot))
        throw new Error("You do not have permission to access this resource");

    const DB = locals.runtime.env.DB;

    const result = await DB.prepare("SELECT id, user_id, course_sigle, like_dislike, workload_vote, attendance_type, weekly_hours, year_taken, semester_taken, comment_path, status, created_at, updated_at FROM course_reviews WHERE status = 2 ORDER BY updated_at DESC").all<CourseReview>();

    const reviews = result.results;

    return reviews;
}



