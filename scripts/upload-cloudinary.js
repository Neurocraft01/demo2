// RUN THIS SCRIPT TO MIGRATE LOCAL IMAGES TO YOUR CLOUDINARY
// 1. Put your real keys inside .env.local
// 2. Run: npm install cloudinary
// 3. Run: node scripts/upload-cloudinary.js

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // loads .env.local

// Configure Cloudinary from .env.local
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadTools() {
    const toolsDir = path.join(process.cwd(), 'public', 'images', 'tools');
    const files = fs.readdirSync(toolsDir);

    console.log(`Starting upload for ${files.length} images to Cloudinary...`);

    for (const file of files) {
        if (!file.match(/\.(png|jpe?g|webp|gif)$/i)) continue;

        const filePath = path.join(toolsDir, file);
        const publicId = `tools/${path.parse(file).name}`; // e.g., tools/aws

        try {
            const result = await cloudinary.uploader.upload(filePath, {
                public_id: publicId,
                folder: 'aks-automations',
                overwrite: true
            });
            console.log(`✅ Uploaded ${file} -> ${result.secure_url}`);
        } catch (error) {
            console.error(`❌ Failed to upload ${file}:`, error);
        }
    }

    console.log('🎉 All uploads complete!');
    console.log('You can now update src/data/home.ts to point TECH_STACK icons directly to the new Cloudinary URLs if you prefer.');
}

uploadTools();
