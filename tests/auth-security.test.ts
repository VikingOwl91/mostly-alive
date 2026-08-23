import { describe, it, expect } from 'vitest';
import {
	signSession,
	verifySession,
	isUserAuthorized,
	generateOAuthState,
	type EditorSession
} from '../src/lib/server/auth';
import { POST as commitHandler } from '../src/routes/editor/api/commit/+server';

describe('Editor GitHub OAuth & Security Protocol', () => {
	const testSecret = 'super-secret-hmac-test-key-minimum-32-chars-long';

	it('should generate cryptographically unique 48-char hex state tokens', () => {
		const state1 = generateOAuthState();
		const state2 = generateOAuthState();
		expect(state1).toHaveLength(48);
		expect(state2).toHaveLength(48);
		expect(state1).not.toBe(state2);
	});

	it('should sign and verify valid editor sessions', async () => {
		const session: EditorSession = {
			userId: 12345678,
			username: 'authorized-editor',
			token: 'gho_dummy_token_123',
			exp: Date.now() + 60000
		};

		const signed = await signSession(session, testSecret);
		expect(signed).toContain('.');

		const verified = await verifySession(signed, testSecret);
		expect(verified).not.toBeNull();
		expect(verified?.userId).toBe(12345678);
		expect(verified?.username).toBe('authorized-editor');
	});

	it('should reject tampered session payloads and signatures', async () => {
		const session: EditorSession = {
			userId: 12345678,
			username: 'authorized-editor',
			token: 'gho_dummy_token_123',
			exp: Date.now() + 60000
		};

		const signed = await signSession(session, testSecret);
		const [payload, signature] = signed.split('.');

		// Tamper payload
		const tamperedSigned = `dGFtcGVyZWQ.${signature}`;
		const resultTampered = await verifySession(tamperedSigned, testSecret);
		expect(resultTampered).toBeNull();

		// Tamper signature
		const tamperedSigSigned = `${payload}.invalid_signature`;
		const resultTamperedSig = await verifySession(tamperedSigSigned, testSecret);
		expect(resultTamperedSig).toBeNull();

		// Wrong secret
		const wrongSecret = await verifySession(signed, 'different-secret-key-32-chars-minimum');
		expect(wrongSecret).toBeNull();
	});

	it('should reject expired session tokens', async () => {
		const expiredSession: EditorSession = {
			userId: 12345678,
			username: 'authorized-editor',
			token: 'gho_dummy_token_123',
			exp: Date.now() - 5000 // 5 seconds in the past
		};

		const signed = await signSession(expiredSession, testSecret);
		const verified = await verifySession(signed, testSecret);
		expect(verified).toBeNull();
	});

	it('should strictly authorize only the configured immutable numeric GitHub user ID', () => {
		const allowedConfig = '12345678, 98765432';

		// Authorized user ID
		expect(isUserAuthorized(12345678, allowedConfig)).toBe(true);
		expect(isUserAuthorized('98765432', allowedConfig)).toBe(true);

		// Unauthorized user ID
		expect(isUserAuthorized(99999999, allowedConfig)).toBe(false);
		expect(isUserAuthorized('attacker', allowedConfig)).toBe(false);

		// Empty/missing configuration must deny by default
		expect(isUserAuthorized(12345678, undefined)).toBe(false);
		expect(isUserAuthorized(12345678, '')).toBe(false);
		expect(isUserAuthorized(12345678, '   ')).toBe(false);
	});

	it('should reject unauthenticated API requests to /editor/api/commit with HTTP 401', async () => {
		const mockRequest = new Request('http://localhost/editor/api/commit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				filename: 'test.md',
				content:
					'---\nslug: "test"\ntitle: "Test"\ncategory: "weather"\nseverity: "critical"\nurgency: "immediate"\nthreat_level: 4\nstatus: "draft"\nmemory_hook: "hook"\nimmediate_action:\n  - "Step 1"\ndo_not:\n  - "Dont"\nsources: []\n---\nbody'
			})
		});

		// Calling handler without locals.user
		const response = await (commitHandler as any)({
			request: mockRequest,
			locals: {} // No authenticated user session
		});

		expect(response.status).toBe(401);
		const jsonBody = await response.json();
		expect(jsonBody.success).toBe(false);
		expect(jsonBody.error).toContain('Unauthorized');
	});
});
