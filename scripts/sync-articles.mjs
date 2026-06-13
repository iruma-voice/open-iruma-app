import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const ROOT_DIR = path.resolve(__dirname, '../../');
const SOURCE_DIR = path.join(ROOT_DIR, '00.open-iruma/02_地域課題と議論_Issues_Debates');
const MOBILE_DIR = path.join(ROOT_DIR, 'mobile');
const ISSUES_JSON_PATH = path.join(MOBILE_DIR, 'src/data/issues_data.json');
const PUBLIC_IMAGES_DIR = path.join(MOBILE_DIR, 'public/images');

// Ensure public images directory exists
if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
  fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
}

// Simple Frontmatter parser
function parseFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { data: {}, content: fileContent.trim() };
  }

  const yamlStr = match[1];
  const markdownContent = match[2].trim();
  const data = {};

  yamlStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      
      // Remove quotes if present
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      
      // Handle array format like [tag1, tag2]
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(s => s);
      }

      data[key] = value;
    }
  });

  return { data, content: markdownContent };
}

// Find all markdown files recursively
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

// Main sync function
function syncArticles() {
  console.log('Starting article synchronization...');
  
  // Load existing JSON
  let existingIssues = [];
  if (fs.existsSync(ISSUES_JSON_PATH)) {
    try {
      existingIssues = JSON.parse(fs.readFileSync(ISSUES_JSON_PATH, 'utf-8'));
    } catch (e) {
      console.error('Failed to parse existing issues_data.json', e);
      existingIssues = [];
    }
  }

  const markdownFiles = findMarkdownFiles(SOURCE_DIR);
  
  // First pass: build mapping of basename -> id
  const articleMap = {};
  const processedFiles = [];

  for (const filePath of markdownFiles) {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = parseFrontmatter(rawContent);
    if (!data.title) continue;

    const basename = path.basename(filePath, '.md');
    const existingIndex = existingIssues.findIndex(item => item.title === data.title || item.title === `"${data.title}"`);
    const id = existingIndex >= 0 ? existingIssues[existingIndex].id : crypto.randomBytes(6).toString('hex');

    articleMap[basename] = id;
    processedFiles.push({ filePath, basename, id, data, content, existingIndex });
  }

  // Transform WikiLinks using the articleMap
  function transformWikiLinks(content) {
    // Process both [[path|text]] and [[path]]
    return content.replace(/\[\[([^\]]+)\]\]/g, (match, inner) => {
      let linkPath = inner;
      let linkText = '';

      if (inner.includes('|')) {
        const parts = inner.split('|');
        linkPath = parts[0].trim();
        linkText = parts[1].trim();
      } else {
        linkPath = inner.trim();
        linkText = linkPath.split('/').pop().replace('.md', ''); // Extract filename
      }

      const linkBasename = linkPath.split('/').pop().replace('.md', '');

      // Check if it links to another article
      if (articleMap[linkBasename]) {
        // It's a link to another issue article. Convert to an actual hyperlink.
        return `[${linkText}](/issues/${articleMap[linkBasename]})`;
      } else {
        // Not a mobile article (e.g. 議事録 or 議員名鑑). Display as a styled text box.
        // If it had a file icon emoji from the pipe, keep it, otherwise just wrap in brackets as requested.
        const displayText = inner.includes('|') ? linkText : `[${linkText}]`;
        return `<span class="text-gray-500 text-sm bg-gray-100 px-1 py-0.5 rounded border border-gray-200" data-original-path="${linkPath}">${displayText}</span>`;
      }
    });
  }

  let updatedCount = 0;
  let addedCount = 0;
  const newIssuesData = [];

  // Second pass: Process content and generate final data
  for (const fileObj of processedFiles) {
    const { filePath, id, data, content, existingIndex } = fileObj;

    // Process Content Links
    let processedContent = transformWikiLinks(content);
    
    // Process Images
    processedContent = processedContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
      if (!imgPath.startsWith('http') && !imgPath.startsWith('/')) {
        const absoluteImgPath = path.resolve(path.dirname(filePath), imgPath);
        if (fs.existsSync(absoluteImgPath)) {
          const fileName = path.basename(absoluteImgPath);
          const destPath = path.join(PUBLIC_IMAGES_DIR, fileName);
          fs.copyFileSync(absoluteImgPath, destPath);
          return `![${alt}](/images/${fileName})`;
        }
      }
      return match;
    });

    const issueEntry = {
      id: id,
      title: data.title,
      date: data.date || '',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      content: processedContent
    };

    if (existingIndex >= 0) {
      existingIssues[existingIndex] = issueEntry;
      updatedCount++;
    } else {
      existingIssues.push(issueEntry);
      addedCount++;
    }
  }

  // Write back to JSON
  fs.writeFileSync(ISSUES_JSON_PATH, JSON.stringify(existingIssues, null, 2), 'utf-8');
  console.log(`Sync complete! Updated: ${updatedCount}, Added: ${addedCount}`);
}

syncArticles();
