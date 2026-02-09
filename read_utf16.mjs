import fs from 'fs';
const content = fs.readFileSync('test_run_new.log', 'utf16le');
console.log(content);
