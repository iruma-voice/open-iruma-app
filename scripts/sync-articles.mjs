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
    return { data: {}, content: fileContent.trim(), rawYaml: '' };
  }

  const yamlStr = match[1];
  const markdownContent = match[2].trim();
  const data = {};

  yamlStr.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(s => s);
      }

      data[key] = value;
    }
  });

  return { data, content: markdownContent, rawYaml: yamlStr };
}

// Write ID back to Markdown file
function writeIdToMarkdown(filePath, rawContent, rawYaml, newId) {
  // If id already exists, do nothing
  if (rawYaml.match(/^id:/m)) return;
  
  // Replace the closing of frontmatter with the new id line
  const newYaml = rawYaml + `\nid: "${newId}"`;
  const newContent = rawContent.replace(/^---\r?\n[\s\S]*?\r?\n---/, `---\n${newYaml}\n---`);
  
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Assigned new ID ${newId} to ${path.basename(filePath)}`);
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
  console.log('Starting article synchronization with permanent ID assignment...');
  
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
  
  // First pass: build mapping and assign IDs to Markdowns
  const articleMap = {};
  const processedFiles = [];

  for (const filePath of markdownFiles) {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content, rawYaml } = parseFrontmatter(rawContent);
    if (!data.title) continue;

    const basename = path.basename(filePath, '.md');
    
    // Determine ID: check Markdown frontmatter first
    let id = data.id;
    let existingIndex = existingIssues.findIndex(item => item.id === id);

    // If no ID in markdown, try to match by title from JSON, otherwise generate new
    if (!id) {
      existingIndex = existingIssues.findIndex(item => item.title === data.title || item.title === `"${data.title}"`);
      id = existingIndex >= 0 ? existingIssues[existingIndex].id : crypto.randomBytes(6).toString('hex');
      
      // Permanently write this ID back to the Markdown file
      writeIdToMarkdown(filePath, rawContent, rawYaml, id);
    }

    articleMap[basename] = id;
    processedFiles.push({ filePath, basename, id, data, content, existingIndex });
  }

  // Transform WikiLinks using the articleMap
  function transformWikiLinks(content) {
    return content.replace(/\[\[([^\]]+)\]\]/g, (match, inner) => {
      let linkPath = inner;
      let linkText = '';

      if (inner.includes('|')) {
        const parts = inner.split('|');
        linkPath = parts[0].trim();
        linkText = parts[1].trim();
      } else {
        linkPath = inner.trim();
        linkText = linkPath.split('/').pop().replace('.md', '');
      }

      const linkBasename = linkPath.split('/').pop().replace('.md', '');

      if (articleMap[linkBasename]) {
        return `[${linkText}](/issues/${articleMap[linkBasename]})`;
      } else {
        const displayText = inner.includes('|') ? linkText : `[${linkText}]`;
        return `<span class="text-gray-500 text-sm bg-gray-100 px-1 py-0.5 rounded border border-gray-200" data-original-path="${linkPath}">${displayText}</span>`;
      }
    });
  }

  let updatedCount = 0;
  let addedCount = 0;

  // Second pass: Process content and generate final JSON
  const finalIssuesData = [];

  for (const fileObj of processedFiles) {
    const { filePath, id, data, content, existingIndex } = fileObj;

    let processedContent = transformWikiLinks(content);
    
    // Process standard Markdown Images: ![alt](path)
    processedContent = processedContent.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
      // Ignore external HTTP images
      if (imgPath.startsWith('http')) return match;

      let absoluteImgPath = '';
      
      if (!imgPath.startsWith('/')) {
        // Relative path case
        absoluteImgPath = path.resolve(path.dirname(filePath), imgPath);
      }
      
      const fileName = path.basename(imgPath);
      
      // Fallback to Attachments folder
      if (!absoluteImgPath || !fs.existsSync(absoluteImgPath)) {
         const attachmentsFallbackPath = path.join(ROOT_DIR, '00.open-iruma/Attachments', fileName);
         if (fs.existsSync(attachmentsFallbackPath)) {
           absoluteImgPath = attachmentsFallbackPath;
         }
      }

      if (absoluteImgPath && fs.existsSync(absoluteImgPath)) {
        const destPath = path.join(PUBLIC_IMAGES_DIR, fileName);
        fs.copyFileSync(absoluteImgPath, destPath);
        return `![${alt}](/images/${fileName})`;
      }

      return match;
    });

    // Process Obsidian Images: ![[path]]
    processedContent = processedContent.replace(/!\[\[([^\]]+)\]\]/g, (match, imgPath) => {
      if (imgPath.startsWith('http')) return match;

      let absoluteImgPath = '';
      
      if (!imgPath.startsWith('/')) {
        absoluteImgPath = path.resolve(path.dirname(filePath), imgPath);
      }
      
      const fileName = path.basename(imgPath);
      
      if (!absoluteImgPath || !fs.existsSync(absoluteImgPath)) {
         const attachmentsFallbackPath = path.join(ROOT_DIR, '00.open-iruma/Attachments', fileName);
         if (fs.existsSync(attachmentsFallbackPath)) {
           absoluteImgPath = attachmentsFallbackPath;
         }
      }

      if (absoluteImgPath && fs.existsSync(absoluteImgPath)) {
        const destPath = path.join(PUBLIC_IMAGES_DIR, fileName);
        fs.copyFileSync(absoluteImgPath, destPath);
        return `![${fileName}](/images/${fileName})`;
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

    // Replace or push based on JSON array tracking
    const existingFinalIndex = finalIssuesData.findIndex(item => item.id === id);
    if (existingFinalIndex >= 0) {
       finalIssuesData[existingFinalIndex] = issueEntry;
       updatedCount++;
    } else {
       finalIssuesData.push(issueEntry);
       if (existingIndex < 0) addedCount++; else updatedCount++;
    }
  }

  fs.writeFileSync(ISSUES_JSON_PATH, JSON.stringify(finalIssuesData, null, 2), 'utf-8');
  console.log(`Sync complete! Final entry count: ${finalIssuesData.length} (Added new: ${addedCount})`);
}

syncArticles();
