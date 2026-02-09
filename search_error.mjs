import fs from 'fs';
try {
    // Attempt to read as utf8, if that fails, maybe it's utf16le? But previous steps suggested utf8 worked for partial reading.
    const content = fs.readFileSync('tsc_log_3.txt', 'utf8');
    const lines = content.split('\n');
    lines.forEach(line => {
        if (line.includes('error TS') || line.includes('src/app/admin/finance') || line.includes('The inferred type')) {
            console.log(line.trim());
        }
    });
} catch (e) {
    console.error(e);
}
