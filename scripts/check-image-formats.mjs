import fs from 'fs';
import path from 'path';

const imagesDir = path.join(process.cwd(), 'public');

function getSignature(buffer) {
    if (buffer[0] === 0xFF && buffer[1] === 0xD8) return 'JPEG';
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return 'PNG';
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) return 'WebP/RIFF';
    return 'Unknown';
}

const logFile = path.join(process.cwd(), 'image-format-errors.txt');
fs.writeFileSync(logFile, 'Image Format Mismatches:\n\n');

function checkDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            checkDirectory(fullPath);
        } else if (/\.(png|jpg|jpeg|webp)$/i.test(file)) {
            const buffer = fs.readFileSync(fullPath);
            const signature = getSignature(buffer);
            const ext = path.extname(file).toUpperCase().substring(1);

            // Normalize JPG/JPEG
            const actualExt = (signature === 'JPEG') ? 'JPG' : signature;
            const expectedExt = (ext === 'JPEG') ? 'JPG' : ext;

            if (signature !== 'Unknown' && actualExt !== expectedExt) {
                const msg = `Mismatch: ${path.relative(imagesDir, fullPath)} (Extension: ${ext}, Actual: ${signature})\n`;
                process.stdout.write(msg);
                fs.appendFileSync(logFile, msg);
            }
        }
    }
}

console.log('Checking for image format mismatches...\n');
checkDirectory(imagesDir);
console.log(`\nCheck completed. Results saved to ${logFile}`);
