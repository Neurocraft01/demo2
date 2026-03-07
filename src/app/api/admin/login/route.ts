import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyPassword, verifyToken, COOKIE_NAME } from '@/lib/admin-auth';

// POST /api/admin/login — Authenticate admin
export async function POST(req: NextRequest) {
    try {
        const { password } = await req.json();

        if (!password) {
            return NextResponse.json({ error: 'Password is required' }, { status: 400 });
        }

        if (!verifyPassword(password)) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        const token = generateToken();

        const response = NextResponse.json({ success: true, message: 'Login successful' });
        response.cookies.set(COOKIE_NAME, token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60, // 24 hours
            path: '/',
        });

        return response;
    } catch {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}

// GET /api/admin/login — Check if authenticated
export async function GET(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token || !verifyToken(token)) {
        return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true });
}

// DELETE /api/admin/login — Logout
export async function DELETE() {
    const response = NextResponse.json({ success: true, message: 'Logged out' });
    response.cookies.set(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0,
        path: '/',
    });
    return response;
}
