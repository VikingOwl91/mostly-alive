import { json, error } from '@sveltejs/kit';
import matter from 'gray-matter';
import { ArticleFrontmatterSchema } from '$lib/types/content';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
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

		// In development or when token is not present, return validated payload confirmation
		return json({
			success: true,
			message: `Article ${filename} validated successfully for language ${lang}.`,
			slug: validated.data.slug
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
