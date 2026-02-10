import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(process.cwd(), 'public', 'images');

async function optimizeDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            await optimizeDirectory(fullPath);
        } else if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
            const ext = path.extname(file);
            const outputPath = fullPath.replace(ext, '.webp');

            try {
                await sharp(fullPath)
                    .webp({ quality: 85 })
                    .toFile(outputPath);

                const outputStats = fs.statSync(outputPath);
                const reduction = ((1 - outputStats.size / stats.size) * 100).toFixed(1);

                console.log(`✓ ${path.relative(imagesDir, fullPath)} → ${path.relative(imagesDir, outputPath)} (${reduction}% reduction)`);
            } catch (error) {
                console.error(`✗ Failed to convert ${file}:`, error.message);
            }
        }
    }
}

async function optimizeImages() {
    console.log('Starting global image optimization...');
    await optimizeDirectory(imagesDir);
    console.log('\n✓ Global image optimization completed!');
}

optimizeImages().catch(console.error);
