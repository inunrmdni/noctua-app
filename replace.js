const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'public', 'admin.html');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/--gold-light/g, '--accent-light');
content = content.replace(/--gold/g, '--accent');
content = content.replace(/--font-mono/g, '--font-sans');
content = content.replace(/--cream/g, '--text');
content = content.replace('<body>', '<body data-theme="dark">');

fs.writeFileSync(filePath, content);
console.log('Replacement done');
