import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'aks-admin-token';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a signed session token
 */
export function generateToken(): string {
    const secret = process.env.ADMIN_SECRET || 'default-secret-change-me';
    const payload = {
        iat: Date.now(),
        exp: Date.now() + TOKEN_EXPIRY,
        nonce: crypto.randomBytes(16).toString('hex'),
    };
    const data = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
        .createHmac('sha256', secret)
        .update(data)
        .digest('base64url');
    return `${data}.${signature}`;
}

/**
 * Verify a session token
 */
export function verifyToken(token: string): boolean {
    try {
        const secret = process.env.ADMIN_SECRET || 'default-secret-change-me';
        const [data, signature] = token.split('.');
        if (!data || !signature) return false;

        // Verify signature
        const expectedSig = crypto
            .createHmac('sha256', secret)
            .update(data)
            .digest('base64url');
        if (signature !== expectedSig) return false;

        // Check expiry
        const payload = JSON.parse(Buffer.from(data, 'base64url').toString());
        if (payload.exp < Date.now()) return false;

        return true;
    } catch {
        return false;
    }
}

/**
 * Check if the current request is authenticated (server component)
 */
export async function isAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(COOKIE_NAME)?.value;
        if (!token) return false;
        return verifyToken(token);
    } catch {
        return false;
    }
}

/**
 * Verify password against env variable
 */
export function verifyPassword(password: string): boolean {
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
        console.error('ADMIN_PASSWORD is not set in environment variables');
        return false;
    }
    return password === adminPassword;
}

export { COOKIE_NAME };
