import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(process.cwd(), 'public', 'images');

async function optimizeHeroImages() {
    const heroFiles = ['hero_foundry.jpg', 'hero_logistics.jpg', 'hero_scrap_yard.jpg'];

    for (const file of heroFiles) {
        const inputPath = path.join(imagesDir, file);

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠ Skipping ${file} - not found`);
            continue;
        }

        const ext = path.extname(file);
        const outputPathWebP = path.join(imagesDir, file.replace(ext, '.webp'));

        try {
            const inputStats = fs.statSync(inputPath);

            // Convert to WebP
            await sharp(inputPath)
                .webp({ quality: 85 })
                .toFile(outputPathWebP);

            const outputStats = fs.statSync(outputPathWebP);
            const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

            console.log(`✓ ${file} → ${file.replace('.png', '.webp')}`);
            console.log(`  Size: ${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB (${reduction}% reduction)`);
        } catch (error) {
            console.error(`✗ Failed to convert ${file}:`, error.message);
        }
    }

    console.log('\n✓ All hero images optimized!');
}

optimizeHeroImages().catch(console.error);
