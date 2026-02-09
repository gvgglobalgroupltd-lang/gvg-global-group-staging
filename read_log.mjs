import fs from 'fs';

// Read the debug file. Try reading as buffer first.
const buffer = fs.readFileSync('test_output_debug3.txt');

// Try with iconv-lite if available, otherwise just use buffer toString
let content;
try {
    const iconv = await import('iconv-lite');
    // Try utf16le as command output redirection often uses it in PowerShell/CMD context
    content = iconv.default.decode(buffer, 'utf16le');

    // If it looks garbage (e.g. lots of nulls or asian chars), try win1252 or utf8
    if (content.includes('') || content.trim().length === 0) {
        content = iconv.default.decode(buffer, 'win1252');
    }
} catch (e) {
    console.log('iconv-lite not found, using utf8');
    content = buffer.toString('utf8');
}

console.log(content);
