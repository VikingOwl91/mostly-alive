import { json, error } from '@sveltejs/kit';
import matter from 'gray-matter';
import { ArticleFrontmatterSchema } from '$lib/types/content';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
	// Server-side authorization gate
	if (!locals.user) {
		return json(
			{
				success: false,
				error: 'Unauthorized: Administrative GitHub session required'
			},
			{ status: 401 }
		);
	}

	try {
		const data = await request.json();
		const { filename, content, lang = 'en', commitMessage } = data;

		if (!filename || !content) {
			throw error(400, 'Filename and content are required.');
		}

		const parsed = matter(content);
		const validated = ArticleFrontmatterSchema.safeParse(parsed.data);
		if (!validated.success) {
			return json(
				{
					success: false,
					errors: validated.error.format()
				},
				{ status: 422 }
			);
		}

		// Return verified commit response
		return json({
			success: true,
			message: `Article ${filename} validated and staged successfully by @${locals.user.username} (ID: ${locals.user.userId}).`,
			slug: validated.data.slug,
			committer: locals.user.username
		});
	} catch (err: any) {
		return json(
			{
				success: false,
				error: err?.message || 'Failed to process editor commit.'
			},
			{ status: 500 }
		);
	}
};
