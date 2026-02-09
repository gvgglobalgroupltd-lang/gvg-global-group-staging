import fs from 'fs';

try {
    const buffer = fs.readFileSync('test_output_commodities.txt');
    // detailed check for encoding or just try utf16le
    const content = buffer.toString('utf8');
    console.log(content);
} catch (e) {
    console.error('Error reading file:', e);
}
