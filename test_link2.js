const fs = require('fs');
const path = require('path');

const SOURCE_DIR = 'd:/open-iruma/00.open-iruma/02_地域課題と議論_Issues_Debates';

function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (filePath.endsWith('.md')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {} };
  const lines = match[1].split('\n');
  const data = {};
  lines.forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      data[key] = value;
    }
  });
  return { data };
}

const markdownFiles = findMarkdownFiles(SOURCE_DIR);
const articleMap = {};
for (const filePath of markdownFiles) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = parseFrontmatter(rawContent);
  if (!data.title) continue;
  if (!['published', 'archive', 'unlisted'].includes(data.status)) continue;
  articleMap[path.basename(filePath, '.md')] = data.id || 'NO_ID';
}

console.log("articleMap['茶畑テラス_情報収集'] =", articleMap['茶畑テラス_情報収集']);
console.log("articleMap['学童保育室の一括民営化_情報収集'] =", articleMap['学童保育室の一括民営化_情報収集']);

const files = Object.keys(articleMap);
console.log("All processed markdown basenames:", files);
