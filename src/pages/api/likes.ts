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

export const GET: APIRoute = async ({ request, locals, cookies }) => {
	// Obtener el token de la cookie osucookie
	const token = cookies.get('osucookie')?.value;	
	if (!token) {
		return new Response('Unauthorized', { status: 401 })
	}
	const user = await getUserDataByToken(token);
	if (!user) {
		return new Response('Unauthorized', { status: 401 })
	}
	const reviewId = new URL(request.url).searchParams.get('review_id');
	if (!reviewId) {
		return new Response('Missing review_id', { status: 400 });
	}
	
	const votes = await locals.runtime.env.DB
		.prepare(`
			SELECT vote FROM user_vote_review 
			WHERE user_id = ? AND review_id = ?
		`).bind(user.id, reviewId).first<{
			vote: 1 | -1
		}>();
	
	return new Response(JSON.stringify({
		vote: votes ? (votes.vote === 1 ? 'up' : 'down') : null
	}), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',	
		}
	});
}

export const POST: APIRoute = async ({ request, locals, cookies }) => {
	// Obtener el token de la cookie osucookie
	const token = cookies.get('osucookie')?.value;

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

		// Verificar si ya existe un voto para este usuario y review
		const existingVote = await locals.runtime.env.DB
			.prepare(`
				SELECT vote FROM user_vote_review 
				WHERE user_id = ? AND review_id = ?
			`).bind(user.id, state.review_id).first<{ vote: 1 | -1 }>();

		const newVote = state.action === "like" ? 1 : -1;
		
		// Calcular la diferencia en el contador de votos
		let voteDifference = 0;
		
		if (existingVote) {
			// Si cambia el voto, la diferencia es el doble del nuevo voto
			// Ejemplo: de -1 a +1 = diferencia de +2
			voteDifference = newVote - existingVote.vote;
		} else {
			// Si no había voto previo, la diferencia es el nuevo voto
			voteDifference = newVote;
		}

		// Usar batch para operaciones atómicas en D1
		await locals.runtime.env.DB.batch([
			locals.runtime.env.DB.prepare(`
				INSERT OR REPLACE INTO user_vote_review 
				(user_id, review_id, vote) 
				VALUES (?, ?, ?)
			`).bind(user.id, state.review_id, newVote),
			
			locals.runtime.env.DB.prepare(`
				UPDATE course_reviews 
				SET votes = votes + ?, updated_at = CURRENT_TIMESTAMP
				WHERE id = ?
			`).bind(voteDifference, state.review_id)
		]);

		return new Response('Vote recorded successfully', { status: 200 });

	} catch (error) {
		return new Response('Invalid JSON', { status: 400 });
	}
}

export const DELETE: APIRoute = async ({ request, locals, cookies }) => {
	// Obtener el token de la cookie osucookie
	const token = cookies.get('osucookie')?.value;

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

		// Obtener el voto actual antes de eliminarlo
		const existingVote = await locals.runtime.env.DB
			.prepare(`
				SELECT vote FROM user_vote_review 
				WHERE user_id = ? AND review_id = ?
			`).bind(user.id, state.review_id).first<{ vote: 1 | -1 }>();

		if (!existingVote) {
			return new Response('Vote not found', { status: 404 });
		}

		// Usar batch para operaciones atómicas
		await locals.runtime.env.DB.batch([
			locals.runtime.env.DB.prepare(`
				DELETE FROM user_vote_review 
				WHERE user_id = ? AND review_id = ?
			`).bind(user.id, state.review_id),
			
			locals.runtime.env.DB.prepare(`
				UPDATE course_reviews 
				SET votes = votes - ?, updated_at = CURRENT_TIMESTAMP
				WHERE id = ?
			`).bind(existingVote.vote, state.review_id)
		]);

		return new Response('Vote deleted successfully', { status: 200 });

	} catch (error) {
		return new Response('Invalid JSON', { status: 400 });
	}
};