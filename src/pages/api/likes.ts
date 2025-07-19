import { getToken } from "@/lib/auth";
import { getUserDataByToken } from "@/lib/server/auth";
import type { APIRoute } from "astro";
import { z } from "astro:schema";

const postSchema = z.object({
	action: z.enum(['like', 'dislike']),
	review_id: z.number(),
});

const deleteSchema = z.object({
	review_id: z.number(),
});

export const POST: APIRoute = async ({ request, locals }) => {
		
	const authHeader = request.headers.get('Authorization')

	if (!authHeader) {
	return new Response('Unauthorized', { status: 401 })
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
	return new Response('Unauthorized', { status: 401 })
	}
	
	try {
		const body = await request.json();

		const state = postSchema.parse(body);
		const user = await getUserDataByToken(token)
	
		if (!user) {
			return new Response('Unauthorized', { status: 401 })
		}

		locals.runtime.env.DB
		.prepare(`
			INSERT OR REPLACE INTO user_vote_review 
			(user_id, review_id, vote) 
			VALUES (?, ?, ?)
		`).bind(
			user.id,
			state.review_id,
			state.action === "like" ? 1 : -1
		).run();

		return new Response('Vote recorded successfully', { status: 200 });

	} catch (error) {
		return new Response('Invalid JSON', { status: 400 });
	}
}


export const DELETE: APIRoute = async ({ request, locals }) => {
	const authHeader = request.headers.get('Authorization')

	if (!authHeader) {
		return new Response('Unauthorized', { status: 401 })
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		const body = await request.json();

		const state = deleteSchema.parse(body);
		const user = await getUserDataByToken(token)

		if (!user) {
			return new Response('Unauthorized', { status: 401 })
		}

		locals.runtime.env.DB
			.prepare(`
				DELETE FROM user_vote_review 
				WHERE user_id = ? AND review_id = ?
			`).bind(
				user.id,
				state.review_id
			).run();

		return new Response('Vote deleted successfully', { status: 200 });

	} catch (error) {
		return new Response('Invalid JSON', { status: 400 });
	}
};