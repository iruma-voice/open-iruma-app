import fs from 'fs';
import path from 'path';

const issues = JSON.parse(fs.readFileSync('src/data/issues_data.json', 'utf8'));

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.md')) {
      results.push(full);
    }
  });
  return results;
}

const obsFiles = walk('d:/open-iruma/00.open-iruma/02_地域課題と議論_Issues_Debates');
const fileContents = {};
obsFiles.forEach(f => {
  fileContents[f] = fs.readFileSync(f, 'utf8');
});

console.log('=== DIFF CHECK BETWEEN OBSIDIAN AND JSON ===');

issues.forEach((issue, idx) => {
  let matchedFile = null;
  let matchedRaw = null;
  for (const f of obsFiles) {
    const raw = fileContents[f];
    if (raw.includes(`id: "${issue.id}"`) || raw.includes(`id: '${issue.id}'`)) {
      matchedFile = f;
      matchedRaw = raw;
      break;
    }
  }
  if (!matchedFile) {
    for (const f of obsFiles) {
      const raw = fileContents[f];
      if (raw.includes(`title: "${issue.title}"`) || raw.includes(`title: '${issue.title}'`)) {
        matchedFile = f;
        matchedRaw = raw;
        break;
      }
    }
  }

  if (!matchedFile) {
    console.log(`[${idx}] ${issue.title} -> NOT FOUND IN OBSIDIAN!`);
    return;
  }

  const relPath = path.relative('d:/open-iruma/00.open-iruma/02_地域課題と議論_Issues_Debates', matchedFile);
  const bodyMatch = matchedRaw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
  const rawBody = bodyMatch ? bodyMatch[1].trim() : matchedRaw.trim();
  const jsonContent = issue.content.trim();

  const diffs = [];
  const rawWiki = (rawBody.match(/\[\[.*?\]\]/g) || []).length;
  const jsonWiki = (jsonContent.match(/\[\[.*?\]\]/g) || []).length;
  if (rawWiki > 0 || jsonWiki > 0) {
    diffs.push(`WikiLinks: Raw=${rawWiki} -> JSON=${jsonWiki}`);
  }
  const jsonHtmlLinks = (jsonContent.match(/<a\s+href=.*?>/g) || []).length;
  if (jsonHtmlLinks > 0) {
    diffs.push(`HTML <a> links in JSON: ${jsonHtmlLinks}`);
  }
  const jsonMdIssuesLinks = (jsonContent.match(/\[.*?\]\(\/issues\/.*?\)/g) || []).length;
  if (jsonMdIssuesLinks > 0) {
    diffs.push(`Markdown /issues/ links: ${jsonMdIssuesLinks}`);
  }
  const jsonSpans = (jsonContent.match(/<span\s+class="text-gray-500/g) || []).length;
  if (jsonSpans > 0) {
    diffs.push(`Gray unlinked spans: ${jsonSpans}`);
  }
  const rawImgMd = (rawBody.match(/!\[.*?\]\(.*?\)/g) || []).length;
  const rawImgObs = (rawBody.match(/!\[\[.*?\]\]/g) || []).length;
  const jsonImgTags = (jsonContent.match(/<img\s+src=.*?\/>/g) || []).length;
  if (rawImgMd > 0 || rawImgObs > 0 || jsonImgTags > 0) {
    diffs.push(`Images: Raw(md:${rawImgMd}, obs:${rawImgObs}) -> JSON(<img>:${jsonImgTags})`);
  }
  
  // Check tables
  const rawTableLines = rawBody.split('\n').filter(l => l.trim().startsWith('|')).length;
  const jsonTableLines = jsonContent.split('\n').filter(l => l.trim().startsWith('|')).length;
  if (rawTableLines > 0 || jsonTableLines > 0) {
    diffs.push(`Table lines: Raw=${rawTableLines} -> JSON=${jsonTableLines}`);
  }

  console.log(`[${idx}] ${issue.title} (${relPath})`);
  diffs.forEach(d => console.log(`   * ${d}`));
});
