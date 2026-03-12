import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/admin-auth';
import { getAllSiteContent, saveSiteContent, seedSiteContent } from '@/lib/content';

function checkAuth(req: NextRequest): boolean {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return !!token && verifyToken(token);
}

// ─── GET: Fetch Content from DB (with fallback to code) ─────────────────────
export async function GET(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const sectionsData = await getAllSiteContent();
        const sections: Record<string, { base: any }> = {};

        // Format to match the old shape expected by admin dashboard
        for (const [key, val] of Object.entries(sectionsData)) {
            sections[key] = { base: val };
        }

        return NextResponse.json({
            sections,
            lastModified: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error reading content from DB:', err);
        return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
    }
}

// ─── POST: Save Content to DB ───────────────────────────────────────────────
export async function POST(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { section, data } = await req.json();

        if (!section || !data) {
            return NextResponse.json({ error: 'Section and data are required' }, { status: 400 });
        }

        const result = await saveSiteContent(section, data, 'admin');

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Section "${section}" updated securely in Database.`,
        });
    } catch (err) {
        console.error('Error saving content:', err);
        return NextResponse.json({ error: 'Failed to save to DB' }, { status: 500 });
    }
}

// ─── PATCH: Seed Initial Data ─────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await seedSiteContent();
        return NextResponse.json({
            success: true,
            message: 'CMS seeded successfully',
            ...result
        });
    } catch (err) {
        console.error('Error seeding content:', err);
        return NextResponse.json({ error: 'Failed to seed DB' }, { status: 500 });
    }
}
