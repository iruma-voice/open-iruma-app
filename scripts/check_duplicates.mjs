import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '../../');
const SOURCE_DIR = path.join(ROOT_DIR, '00.open-iruma/02_地域課題と議論_Issues_Debates');
const ISSUES_JSON_PATH = path.join(ROOT_DIR, 'mobile/src/data/issues_data.json');

function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: fileContent.trim() };
  const yamlStr = match[1];
  const data = {};
  yamlStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      data[key] = value;
    }
  });
  return { data };
}

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

// 1. Markdownの最新タイトルを取得
const markdownFiles = findMarkdownFiles(SOURCE_DIR);
const validTitles = new Set();
for (const filePath of markdownFiles) {
  const rawContent = fs.readFileSync(filePath, 'utf-8');
  const { data } = parseFrontmatter(rawContent);
  if (data.title) validTitles.add(data.title);
}

// 2. JSON内のタイトルを取得し、Markdownに存在しないもの（古いゴミ）を見つける
let issuesData = [];
if (fs.existsSync(ISSUES_JSON_PATH)) {
  issuesData = JSON.parse(fs.readFileSync(ISSUES_JSON_PATH, 'utf-8'));
}

const oldOrphanedEntries = [];
const validEntries = [];

for (const issue of issuesData) {
  // タイトルの両端のダブルクォーテーションを念のため削除して比較
  const cleanTitle = issue.title.replace(/^["']|["']$/g, '');
  if (!validTitles.has(cleanTitle)) {
    oldOrphanedEntries.push({ id: issue.id, title: issue.title });
  } else {
    validEntries.push({ id: issue.id, title: issue.title });
  }
}

console.log("=== Markdownの正しい記事件数 ===");
console.log(validTitles.size + "件\n");

console.log("=== JSON内に残っている古い（重複した）記事の数 ===");
console.log(oldOrphanedEntries.length + "件\n");

if (oldOrphanedEntries.length > 0) {
  console.log("【古いタイトルのリスト（ゴミデータ）】");
  oldOrphanedEntries.forEach(item => console.log(`- ID: ${item.id} | Title: ${item.title}`));
}
