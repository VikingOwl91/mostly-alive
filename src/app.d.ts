// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { EditorSession } from '$lib/server/auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: EditorSession;
		}
		// interface PageData {}
		// interface PageState {}
		interface Platform {
			env?: {
				GITHUB_CLIENT_ID?: string;
				GITHUB_CLIENT_SECRET?: string;
				ALLOWED_GITHUB_USER_ID?: string;
				SESSION_SECRET?: string;
				[key: string]: string | undefined;
			};
			context?: {
				waitUntil(promise: Promise<unknown>): void;
			};
			caches?: CacheStorage & { default: Cache };
		}
	}
}

export {};
