const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = process.cwd();

const context = {};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'translations.js'), 'utf8'), context);
const translations = context.translations || {};
const en = translations.en || {};

const files = [];
(function gather(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      gather(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
})(root);

const updatePlaceholder = (html) => html.replace(/(<(input|textarea)[^>]*data-translate="([^"]+)"[^>]*placeholder=")([^"]*)"/gi, (m, prefix, tag, key) => {
  const val = en[key];
  return val ? `${prefix}${val}"` : m;
});

const updateDataTranslateText = (html) => html.replace(/(data-translate="([^"]+)")([^>]*>)([^<]*)(<\/[^>]+>)/g, (m, attr, key, between, text, close) => {
  const val = en[key];
  if (val === undefined) return m;
  return `${attr}${between}${val}${close}`;
});

const updateIdText = (html) => html.replace(/<([a-zA-Z0-9]+)([^>]*id="([^"]+)"[^>]*)>([^<]*)<\/\1>/g, (m, tag, attrs, key) => {
  const val = en[key];
  if (val === undefined) return m;
  return `<${tag}${attrs}>${val}</${tag}>`;
});

const ensureLang = (html) => html.replace(/<html[^>]*lang="[^"]*"[^>]*>/i, (tag) => tag.replace(/lang="[^"]*"/i, 'lang="en"'));

const ensureMeta = (html) => {
  if (/meta\s+charset="utf-8"/i.test(html)) return html;
  return html.replace(/<head>/i, '<head>\n    <meta charset="UTF-8">');
};

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  html = ensureLang(html);
  html = ensureMeta(html);
  html = updatePlaceholder(html);
  html = updateDataTranslateText(html);
  html = updateIdText(html);
  fs.writeFileSync(file, html, 'utf8');
}
console.log(`Updated ${files.length} HTML files with English defaults.`);
