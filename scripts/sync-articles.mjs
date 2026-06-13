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

// Transform WikiLinks: [[path|text]] -> <span ...>text</span>
function transformWikiLinks(content) {
  return content.replace(/\[\[(.*?)\|(.*?)\]\]/g, (match, p1, p2) => {
    return `<span class="text-gray-500 text-sm bg-gray-100 px-1 py-0.5 rounded border border-gray-200" data-original-path="${p1.trim()}">📄 ${p2.trim()}</span>`;
  });
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
  let issuesData = [];
  if (fs.existsSync(ISSUES_JSON_PATH)) {
    try {
      issuesData = JSON.parse(fs.readFileSync(ISSUES_JSON_PATH, 'utf-8'));
    } catch (e) {
      console.error('Failed to parse existing issues_data.json', e);
      issuesData = [];
    }
  }

  const markdownFiles = findMarkdownFiles(SOURCE_DIR);
  let updatedCount = 0;
  let addedCount = 0;

  for (const filePath of markdownFiles) {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = parseFrontmatter(rawContent);
    
    // Skip if it doesn't have a title (probably not an article)
    if (!data.title) continue;

    // Process Content
    let processedContent = transformWikiLinks(content);
    
    // Process Images (match standard markdown images: ![alt](path))
    processedContent = processedContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
      // If it's a relative path to an image (e.g. ../../assets/images/xxx.png or similar)
      if (!imgPath.startsWith('http') && !imgPath.startsWith('/')) {
        const absoluteImgPath = path.resolve(path.dirname(filePath), imgPath);
        if (fs.existsSync(absoluteImgPath)) {
          const fileName = path.basename(absoluteImgPath);
          const destPath = path.join(PUBLIC_IMAGES_DIR, fileName);
          // Copy image
          fs.copyFileSync(absoluteImgPath, destPath);
          // Return new markdown image tag with path relative to mobile root
          return `![${alt}](/images/${fileName})`;
        }
      }
      return match; // Keep original if not found or already absolute/web URL
    });

    // Find if article exists in JSON
    const existingIndex = issuesData.findIndex(item => item.title === data.title || item.title === `"${data.title}"`);
    
    const issueEntry = {
      id: existingIndex >= 0 ? issuesData[existingIndex].id : crypto.randomBytes(6).toString('hex'),
      title: data.title,
      date: data.date || '',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      content: processedContent
    };

    if (existingIndex >= 0) {
      issuesData[existingIndex] = issueEntry;
      updatedCount++;
    } else {
      issuesData.push(issueEntry);
      addedCount++;
    }
  }

  // Write back to JSON
  fs.writeFileSync(ISSUES_JSON_PATH, JSON.stringify(issuesData, null, 2), 'utf-8');
  console.log(`Sync complete! Updated: ${updatedCount}, Added: ${addedCount}`);
}

syncArticles();
