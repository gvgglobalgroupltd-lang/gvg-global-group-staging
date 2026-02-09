import fs from 'fs';

try {
    const buffer = fs.readFileSync('tsc_log.txt');
    const content = buffer.toString('utf8');
    console.log(content);
} catch (e) {
    console.error('Error reading file:', e);
}
