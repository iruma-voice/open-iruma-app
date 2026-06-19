import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const ROOT_DIR = path.resolve(__dirname, '../../');
const SOURCE_DIR = path.join(ROOT_DIR, '00.open-iruma/05_予算・財政_Budget_Finance');
const MOBILE_DIR = path.join(ROOT_DIR, 'mobile');
const BUDGET_JSON_PATH = path.join(MOBILE_DIR, 'src/data/budget_data.json');
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
  
  // Use UTF-8 without BOM explicitly (via Node.js writeFileSync)
  fs.writeFileSync(filePath, newContent, 'utf-8');
  console.log(`Assigned new ID ${newId} to ${path.basename(filePath)}`);
}

// Find all markdown files recursively
function findMarkdownFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
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
function syncBudget() {
  console.log('Starting budget and finance article synchronization...');
  
  const titleToIdMap = {};
  const idToRouteMap = {};

  // 1. Load existing issues to allow cross-links
  if (fs.existsSync(ISSUES_JSON_PATH)) {
    try {
      const issues = JSON.parse(fs.readFileSync(ISSUES_JSON_PATH, 'utf-8'));
      issues.forEach(item => {
        titleToIdMap[item.title] = item.id;
        idToRouteMap[item.id] = '/issues';
      });
    } catch (e) {
      console.error('Failed to parse issues_data.json for mapping', e);
    }
  }

  // 2. Load existing budget JSON
  let existingBudgets = [];
  if (fs.existsSync(BUDGET_JSON_PATH)) {
    try {
      existingBudgets = JSON.parse(fs.readFileSync(BUDGET_JSON_PATH, 'utf-8'));
      existingBudgets.forEach(item => {
        titleToIdMap[item.title] = item.id;
        idToRouteMap[item.id] = '/budget';
      });
    } catch (e) {
      console.error('Failed to parse existing budget_data.json', e);
      existingBudgets = [];
    }
  }

  const markdownFiles = findMarkdownFiles(SOURCE_DIR);
  const processedFiles = [];

  // First pass: assign IDs and build local mapping
  for (const filePath of markdownFiles) {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content, rawYaml } = parseFrontmatter(rawContent);
    if (!data.title) continue;

    const basename = path.basename(filePath, '.md');

    if (!['published', 'archive', 'unlisted'].includes(data.status)) {
      console.log(`Skipping ${basename}: status is ${data.status || 'undefined'}`);
      continue;
    }
    
    let id = data.id;
    let existingIndex = existingBudgets.findIndex(item => item.id === id);

    if (!id) {
      existingIndex = existingBudgets.findIndex(item => item.title === data.title || item.title === `"${data.title}"`);
      id = existingIndex >= 0 ? existingBudgets[existingIndex].id : crypto.randomBytes(6).toString('hex');
      writeIdToMarkdown(filePath, rawContent, rawYaml, id);
    }

    titleToIdMap[basename] = id;
    titleToIdMap[data.title] = id;
    idToRouteMap[id] = '/budget';

    processedFiles.push({ filePath, basename, id, data, content, existingIndex });
  }

  // WikiLink transformer
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

      if (titleToIdMap[linkBasename]) {
        const targetId = titleToIdMap[linkBasename];
        const route = idToRouteMap[targetId] || '/budget';
        return `[${linkText}](${route}/${targetId})`;
      } else if (titleToIdMap[linkPath]) {
        const targetId = titleToIdMap[linkPath];
        const route = idToRouteMap[targetId] || '/budget';
        return `[${linkText}](${route}/${targetId})`;
      } else {
        const displayText = inner.includes('|') ? linkText : `[${linkText}]`;
        return `<span class="text-gray-500 text-sm bg-gray-100 px-1 py-0.5 rounded border border-gray-200" data-original-path="${linkPath}">${displayText}</span>`;
      }
    });
  }

  let updatedCount = 0;
  let addedCount = 0;
  const finalBudgetData = [];

  // Second pass: process images, WikiLinks and generate JSON
  for (const fileObj of processedFiles) {
    const { filePath, id, data, content, existingIndex } = fileObj;

    // Process Standard Images
    let processedContent = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, imgPath) => {
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
        return `<img src="/images/${fileName}" alt="${alt || fileName}" class="w-full h-auto rounded-xl shadow-md my-6" loading="lazy" />`;
      }

      return match;
    });

    // Process Obsidian Images
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
        return `<img src="/images/${fileName}" alt="${fileName}" class="w-full h-auto rounded-xl shadow-md my-6" loading="lazy" />`;
      }

      return match;
    });

    // Transform WikiLinks
    processedContent = transformWikiLinks(processedContent);

    const budgetEntry = {
      id: id,
      title: data.title,
      date: data.date || '',
      tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
      status: data.status || 'draft',
      content: processedContent
    };

    const existingFinalIndex = finalBudgetData.findIndex(item => item.id === id);
    if (existingFinalIndex >= 0) {
       finalBudgetData[existingFinalIndex] = budgetEntry;
       updatedCount++;
    } else {
       finalBudgetData.push(budgetEntry);
       if (existingIndex < 0) addedCount++; else updatedCount++;
    }
  }

  // Explicitly write UTF-8 (BOM-less)
  fs.writeFileSync(BUDGET_JSON_PATH, JSON.stringify(finalBudgetData, null, 2), 'utf-8');
  console.log(`Budget sync complete! Final entry count: ${finalBudgetData.length} (Added new: ${addedCount}, Updated: ${updatedCount})`);
}

syncBudget();
