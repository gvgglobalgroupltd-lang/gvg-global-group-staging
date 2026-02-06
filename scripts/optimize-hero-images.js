const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(process.cwd(), 'public', 'images');

async function optimizeHeroImages() {
    const heroFiles = ['hero_foundry.png', 'hero_logistics.png', 'hero_scrap_yard.png'];

    for (const file of heroFiles) {
        const inputPath = path.join(imagesDir, file);

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠ Skipping ${file} - not found`);
            continue;
        }

        const outputPathWebP = path.join(imagesDir, file.replace('.png', '.webp'));

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
