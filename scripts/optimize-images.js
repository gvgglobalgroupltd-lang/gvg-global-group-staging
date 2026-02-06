const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const materialsDir = path.join(process.cwd(), 'public', 'images', 'materials');

async function optimizeImages() {
    const files = fs.readdirSync(materialsDir);

    for (const file of files) {
        if (file.endsWith('.png')) {
            const inputPath = path.join(materialsDir, file);
            const outputPath = path.join(materialsDir, file.replace('.png', '.webp'));

            try {
                const inputStats = fs.statSync(inputPath);

                await sharp(inputPath)
                    .webp({ quality: 85 })
                    .toFile(outputPath);

                const outputStats = fs.statSync(outputPath);
                const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

                console.log(`✓ ${file} → ${file.replace('.png', '.webp')}`);
                console.log(`  Size: ${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB (${reduction}% reduction)`);
            } catch (error) {
                console.error(`✗ Failed to convert ${file}:`, error.message);
            }
        }
    }

    console.log('\n✓ All images converted to WebP!');
}

optimizeImages().catch(console.error);
