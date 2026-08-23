export interface EditorSession {
	userId: number;
	username: string;
	token: string;
	exp: number;
}

export function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	let binary = '';
	for (let i = 0; i < bytes.byteLength; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function base64UrlToUint8Array(base64url: string): Uint8Array {
	let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
	while (base64.length % 4) {
		base64 += '=';
	}
	const binary = atob(base64);
	const buffer = new ArrayBuffer(binary.length);
	const bytes = new Uint8Array(buffer);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

export function generateOAuthState(): string {
	const array = new Uint8Array(24);
	crypto.getRandomValues(array);
	return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function signSession(payload: EditorSession, secret: string): Promise<string> {
	const encoder = new TextEncoder();
	const keyData = encoder.encode(secret);
	const key = await crypto.subtle.importKey(
		'raw',
		keyData,
		{ name: 'HMAC', hash: 'SHA-256' },
		false,
		['sign']
	);

	const jsonStr = JSON.stringify(payload);
	const payloadEncoded = arrayBufferToBase64Url(encoder.encode(jsonStr).buffer as ArrayBuffer);

	const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(payloadEncoded));

	const signatureEncoded = arrayBufferToBase64Url(signatureBuffer);
	return `${payloadEncoded}.${signatureEncoded}`;
}

export async function verifySession(
	signedValue: string,
	secret: string
): Promise<EditorSession | null> {
	if (!signedValue || !signedValue.includes('.')) return null;

	const parts = signedValue.split('.');
	if (parts.length !== 2) return null;

	const [payloadEncoded, signatureEncoded] = parts;

	try {
		const encoder = new TextEncoder();
		const keyData = encoder.encode(secret);
		const key = await crypto.subtle.importKey(
			'raw',
			keyData,
			{ name: 'HMAC', hash: 'SHA-256' },
			false,
			['verify']
		);

		const signatureBytes = base64UrlToUint8Array(signatureEncoded);
		const isValid = await crypto.subtle.verify(
			'HMAC',
			key,
			signatureBytes.buffer as ArrayBuffer,
			encoder.encode(payloadEncoded)
		);

		if (!isValid) return null;

		const payloadBytes = base64UrlToUint8Array(payloadEncoded);
		const jsonStr = new TextDecoder().decode(payloadBytes);
		const session = JSON.parse(jsonStr) as EditorSession;

		if (!session || typeof session.userId !== 'number' || typeof session.exp !== 'number') {
			return null;
		}

		if (Date.now() > session.exp) {
			return null;
		}

		return session;
	} catch {
		return null;
	}
}

export function isUserAuthorized(
	numericUserId: number | string,
	allowedUserIdConfig?: string
): boolean {
	if (!allowedUserIdConfig || !allowedUserIdConfig.trim()) {
		return false;
	}

	const allowedIds = allowedUserIdConfig
		.split(',')
		.map((id) => id.trim())
		.filter(Boolean);

	const targetIdStr = numericUserId.toString().trim();
	return allowedIds.includes(targetIdStr);
}

export function getSecret(name: string, platform?: Readonly<App.Platform>): string | undefined {
	return (
		platform?.env?.[name] || (typeof process !== 'undefined' ? process.env?.[name] : undefined)
	);
}
