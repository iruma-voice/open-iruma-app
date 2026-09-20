import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const ROOT_DIR = path.resolve(__dirname, '../../');
const SOURCE_DIR = path.join(ROOT_DIR, '00.open-iruma/08_お知らせ_News');
const MOBILE_DIR = path.join(ROOT_DIR, 'mobile');
const NEWS_JSON_PATH = path.join(MOBILE_DIR, 'src/data/news_data.json');

// Ensure source directory exists
if (!fs.existsSync(SOURCE_DIR)) {
  fs.mkdirSync(SOURCE_DIR, { recursive: true });
}

// Simple Frontmatter parser
function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: fileContent.trim(), rawYaml: '' };
  }

  const yamlStr = match[1];
  const markdownContent = match[2].trim();
  const lines = match[1].split('\n');
  const data = {};
  let currentKey = null;

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('- ') && currentKey) {
      if (!Array.isArray(data[currentKey])) {
        data[currentKey] = [];
      }
      let val = trimmedLine.slice(2).trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      data[currentKey].push(val);
      return;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      currentKey = key;
      let value = line.slice(colonIdx + 1).trim();
      
      if (value) {
        if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
        else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
        
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(s => s);
        }
        data[key] = value;
      } else {
        data[key] = [];
      }
    }
  });

  return { data, content: markdownContent, rawYaml: yamlStr };
}

// Write ID back to Markdown file
function writeIdToMarkdown(filePath, rawContent, rawYaml, newId) {
  if (rawYaml.match(/^id:/m)) return;
  const newYaml = rawYaml + `\nid: "${newId}"`;
  const newContent = rawContent.replace(/^---\r?\n[\s\S]*?\r?\n---/, `---\n${newYaml}\n---`);
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Assigned new ID ${newId} to ${path.basename(filePath)}`);
}

// Main sync function
function syncNews() {
  console.log('Starting news/changelog synchronization...');
  
  let existingNews = [];
  if (fs.existsSync(NEWS_JSON_PATH)) {
    try {
      existingNews = JSON.parse(fs.readFileSync(NEWS_JSON_PATH, 'utf-8'));
    } catch (e) {
      console.error('Failed to parse existing news_data.json', e);
    }
  }

  const files = fs.readdirSync(SOURCE_DIR);
  const finalNewsData = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const filePath = path.join(SOURCE_DIR, file);
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content, rawYaml } = parseFrontmatter(rawContent);

    if (!data.title || data.status !== 'published') continue;
    
    let id = data.id;
    if (!id) {
      const existingIndex = existingNews.findIndex(item => item.title === data.title);
      id = existingIndex >= 0 ? existingNews[existingIndex].id : crypto.randomBytes(6).toString('hex');
      writeIdToMarkdown(filePath, rawContent, rawYaml, id);
    }

    // Downgrade GitHub Alerts to plain blockquotes
    let processedContent = content.replace(/^>\s*\[![A-Za-z]+\]\s*(.*)$/gm, '> $1');

    // WikiLinkは一旦外部リンク化またはテキスト化する（内部リンクを正しくパースするマップがないため）
    processedContent = processedContent.replace(/\[\[([^\]]+)\]\]/g, (match, inner) => {
      let linkText = '';
      if (inner.includes('|')) {
        linkText = inner.split('|')[1].trim();
      } else {
        linkText = inner.trim().split('/').pop().replace('.md', '');
      }
      return `**${linkText}**`; // 一旦太字のテキストとして扱う
    });

    finalNewsData.push({
      id: id,
      title: data.title,
      date: data.date || '',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      status: data.status || 'draft',
      content: processedContent
    });
  }

  // 日付の降順（新しい順）にソート
  finalNewsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Ensure data directory exists
  if (!fs.existsSync(path.dirname(NEWS_JSON_PATH))) {
    fs.mkdirSync(path.dirname(NEWS_JSON_PATH), { recursive: true });
  }

  fs.writeFileSync(NEWS_JSON_PATH, JSON.stringify(finalNewsData, null, 2), 'utf-8');
  console.log(`News sync complete! Final entry count: ${finalNewsData.length}`);
}

syncNews();
