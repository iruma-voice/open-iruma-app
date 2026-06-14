const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../00.open-iruma/06_市議会議員通信簿');
const membersDir = path.resolve(__dirname, '../../00.open-iruma/01_議員名鑑_Members');
const destDir = path.resolve(__dirname, '../src/data');
const membersDestDir = path.join(destDir, 'members');
const publicImagesDir = path.resolve(__dirname, '../public/images/manifestos');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
if (!fs.existsSync(membersDestDir)) fs.mkdirSync(membersDestDir, { recursive: true });
if (!fs.existsSync(publicImagesDir)) fs.mkdirSync(publicImagesDir, { recursive: true });

const files = fs.readdirSync(srcDir).filter(f => /^\d{2}_通信簿_.*\.md$/.test(f));
const reportCards = [];

files.forEach(f => {
  const content = fs.readFileSync(path.join(srcDir, f), 'utf8');
  const id = f.replace(/^\d{2}_通信簿_/, '').replace('.md', '');
  
  // Extract progress
  const rateMatch = content.match(/progress_rate:\s*(\d+)/);
  const totalMatch = content.match(/manifesto_total:\s*(\d+)/);
  const progMatch = content.match(/manifesto_progressed:\s*(\d+)/);
  
  const progressRate = rateMatch ? parseInt(rateMatch[1]) : 0;
  const manifestoTotal = totalMatch ? parseInt(totalMatch[1]) : 0;
  const manifestoProgressed = progMatch ? parseInt(progMatch[1]) : 0;
  
  // Extract topics
  const themeMatches = content.match(/\*\*テーマ:\s*([^*]+)\*\*/g);
  let themes = [];
  if (themeMatches) {
    themes = themeMatches.map(t => t.replace('**テーマ:', '').replace(/\*\*/g, '').trim());
  }
  
  // Extract categories
  const catMatches = content.match(/\*\s*カテゴリ:\s*([^*]+)/g);
  let cats = new Set();
  if (catMatches) {
    catMatches.forEach(m => {
      m.replace('* カテゴリ:', '').replace(/\*/g, '').trim().split(/\s+/).forEach(c => {
        const cleanC = c.replace(/`/g, '').trim();
        if (cleanC) cats.add(cleanC);
      });
    });
  }
  
  // General Questions count
  let questionCount = 0;
  if (!content.includes('登壇実績はありません')) {
    const sessions = content.match(/## \d+\.\s*\d+年\d+月定例会/g);
    questionCount = sessions ? sessions.length : 0;
  }
  
  // Extract faction, seat number, and image from member profile
  let faction = '';
  let seatNumber = 999;
  let manifestoImage = null;
  const memberFilePath = path.join(membersDir, id + '.md');
  
  if (fs.existsSync(memberFilePath)) {
    const memberContent = fs.readFileSync(memberFilePath, 'utf8');
    const factionMatch = memberContent.match(/faction:\s*"?([^"\n]+)"?/);
    if (factionMatch) {
      faction = factionMatch[1].trim();
    }
    const seatMatch = memberContent.match(/seat_number:\s*(\d+)/);
    if (seatMatch) {
      seatNumber = parseInt(seatMatch[1], 10);
    }
    
    // image
    const imgMatch = memberContent.match(/!\[\[\.\.\/Attachments\/([^\]]+)\]\]/);
    if (imgMatch) {
      const imgFileName = imgMatch[1];
      const sourceImg = path.resolve(__dirname, '../../00.open-iruma/Attachments', imgFileName);
      if (fs.existsSync(sourceImg)) {
        const destImg = path.join(publicImagesDir, imgFileName);
        fs.copyFileSync(sourceImg, destImg);
        manifestoImage = `/images/manifestos/${imgFileName}`;
      }
    }
  }

  // --- Parse detailed data for [id].json ---
  
  // 1. Checklist
  const checklist = [];
  const listMatches = content.matchAll(/^- \[(x| )\] (.*)$/gm);
  for (const m of listMatches) {
    checklist.push({
      completed: m[1] === 'x' || m[1] === 'X',
      text: m[2].trim()
    });
  }

  // 2. Timeline
  const timeline = [];
  const sectionSplit = content.split(/## \d+\.\s*/);
  sectionSplit.shift(); // remove everything before the first "## 1."
  
  sectionSplit.forEach(section => {
    const titleMatch = section.match(/^(\d+年\d+月定例会)/);
    if (!titleMatch) return;
    
    const sessionName = titleMatch[1];
    
    const tMatch = section.match(/\*\*テーマ:\s*([^*]+)\*\*/);
    const theme = tMatch ? tMatch[1].trim() : '';
    
    const bgMatch = section.match(/\*\s*\*\*① 課題の背景\*\*\s*([\s\S]*?)(?=\*\s*\*\*②|$)/);
    const background = bgMatch ? bgMatch[1].trim() : '';

    const propMatch = section.match(/\*\s*\*\*② 議員の主張・提案\*\*\s*([\s\S]*?)(?=\*\s*\*\*③|$)/);
    const proposal = propMatch ? propMatch[1].trim() : '';

    const resMatch = section.match(/\*\s*\*\*③ 市側の回答方針\*\*\s*([\s\S]*?)(?=\*\*【分類|$)/);
    const response = resMatch ? resMatch[1].trim() : '';
    
    timeline.push({
      session: sessionName,
      theme,
      background,
      proposal,
      response
    });
  });

  // Sort timeline by session descending (newest first)
  timeline.reverse();

  const memberData = {
    id,
    name: id,
    seatNumber,
    faction,
    progressRate,
    manifestoTotal,
    manifestoProgressed,
    questionCount,
    themes: themes.slice(0, 4),
    categories: Array.from(cats).slice(0, 5),
    manifestoImage,
    checklist,
    timeline
  };
  
  // Save individual json
  fs.writeFileSync(path.join(membersDestDir, `${id}.json`), JSON.stringify(memberData, null, 2));

  // Add summary data to reportCards list
  reportCards.push({
    id,
    name: id,
    seatNumber,
    faction,
    progressRate,
    manifestoTotal,
    manifestoProgressed,
    questionCount,
    themes: themes.slice(0, 4),
    categories: Array.from(cats).slice(0, 5)
  });
});

// Sort summary list by seat number
reportCards.sort((a, b) => {
  return a.seatNumber - b.seatNumber;
});

// Save summary json
const destFile = path.join(destDir, 'report-cards.json');
fs.writeFileSync(destFile, JSON.stringify({ members: reportCards }, null, 2));

console.log(`Successfully generated summary and ${reportCards.length} detailed member JSON files.`);
