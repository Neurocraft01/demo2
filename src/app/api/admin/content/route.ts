import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, COOKIE_NAME } from '@/lib/admin-auth';
import fs from 'fs';
import path from 'path';

// Import all static data as namespaces
import * as siteData from '@/data/site';
import * as homeData from '@/data/home';
import * as aboutData from '@/data/about';
import * as servicesData from '@/data/services';
import * as projectsData from '@/data/projects';
import * as contactData from '@/data/contact';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'data');

function checkAuth(req: NextRequest): boolean {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    return !!token && verifyToken(token);
}

export async function GET(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const sections = {
            site: { base: siteData },
            home: { base: homeData },
            about: { base: aboutData },
            services: { base: servicesData },
            projects: { base: projectsData },
            contact: { base: contactData },
        };

        return NextResponse.json({
            sections,
            lastModified: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error reading content:', err);
        return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    if (!checkAuth(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { section, data } = await req.json();

        if (!section || !data) {
            return NextResponse.json({ error: 'Section and data are required' }, { status: 400 });
        }

        let fileContent = `// ─── Auto-generated CMS Data (${section}) ───\n// This file was updated via the Admin Dashboard.\n\n`;

        // Iterate through each exported variable and write it
        for (const [key, val] of Object.entries(data)) {
            if (key === 'default' || key.startsWith('_')) continue;
            fileContent += `export const ${key} = ${JSON.stringify(val, null, 4)};\n\n`;
        }

        const filePath = path.join(CONTENT_DIR, `${section}.ts`);
        fs.writeFileSync(filePath, fileContent, 'utf-8');

        return NextResponse.json({
            success: true,
            message: `Section "${section}.ts" updated successfully.`,
        });
    } catch (err) {
        console.error('Error saving content:', err);
        return NextResponse.json({ error: 'Failed to rewrite file' }, { status: 500 });
    }
}
