import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST() {
    const filePath = path.join(process.cwd(), 'src/data/analytics.json');
    try {
        let data: Record<string, number> = {};
        if (fs.existsSync(filePath)) {
            data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        
        // Track by date YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        
        data[today] = (data[today] || 0) + 1;
        
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return NextResponse.json({ success: true, count: data[today] });
    } catch (err) {
        console.error('Tracking Error:', err);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}

export async function GET() {
    const filePath = path.join(process.cwd(), 'src/data/analytics.json');
    try {
        if (fs.existsSync(filePath)) {
            return NextResponse.json(JSON.parse(fs.readFileSync(filePath, 'utf8')));
        }
        return NextResponse.json({});
    } catch {
        return NextResponse.json({});
    }
}
