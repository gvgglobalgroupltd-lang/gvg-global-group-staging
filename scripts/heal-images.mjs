import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.join(process.cwd(), 'public');
const logFile = path.join(process.cwd(), 'image-format-errors.txt');

async function healImages() {
    if (!fs.existsSync(logFile)) {
        console.error('Diagnostic log not found. Please run check-image-formats.mjs first.');
        return;
    }

    const content = fs.readFileSync(logFile, 'utf8');
    const lines = content.split('\n');

    console.log('Starting image healing process...\n');

    for (const line of lines) {
        if (!line.startsWith('Mismatch:')) continue;

        const match = line.match(/Mismatch: (.*) \(Extension: (.*), Actual: (.*)\)/);
        if (!match) continue;

        const relativePath = match[1];
        const expectedExt = match[2]; // e.g., PNG
        const actualType = match[3];  // e.g., JPEG

        const fullPath = path.join(publicDir, relativePath);

        if (!fs.existsSync(fullPath)) {
            console.warn(`File not found: ${relativePath}`);
            continue;
        }

        try {
            console.log(`Healing ${relativePath}: ${actualType} → ${expectedExt}`);

            const buffer = fs.readFileSync(fullPath);
            const tempPath = fullPath + '.temp';

            let pipeline = sharp(buffer);

            if (expectedExt === 'PNG') {
                pipeline = pipeline.png();
            } else if (expectedExt === 'JPG' || expectedExt === 'JPEG') {
                pipeline = pipeline.jpeg({ quality: 95 });
            } else if (expectedExt === 'WEBP') {
                pipeline = pipeline.webp({ quality: 85 });
            }

            await pipeline.toFile(tempPath);
            fs.renameSync(tempPath, fullPath);

            console.log(`✓ Successfully healed ${relativePath}`);
        } catch (error) {
            console.error(`✗ Failed to heal ${relativePath}:`, error.message);
        }
    }

    console.log('\nHealing process completed.');
}

healImages().catch(console.error);
