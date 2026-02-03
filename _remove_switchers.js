const fs = require('fs');
const path = require('path');
const root = process.cwd();

const files = [];
(function gather(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['en', 'es', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      gather(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
})(root);

const pattern = /\s*<div class="lang-switcher"[\s\S]*?<\/div>\s*/gi;

let updatedCount = 0;
for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const cleaned = original.replace(pattern, '\n');
  if (cleaned !== original) {
    fs.writeFileSync(file, cleaned, 'utf8');
    updatedCount += 1;
  }
}

console.log(`Removed switchers from ${updatedCount} files.`);
