const fs = require('fs');
const path = require('path');

const docsDir = path.join('d:/open-iruma/mobile', 'src/data/docs');

function getDocContent(id) {
  const decodedId = decodeURIComponent(id);
  
  const filePath1 = path.join(docsDir, `${id}.md`);
  const filePath2 = path.join(docsDir, `${decodedId}.md`);
  
  if (fs.existsSync(filePath1)) return "Found filePath1";
  if (fs.existsSync(filePath2)) return "Found filePath2";
  
  // Robust fallback
  if (fs.existsSync(docsDir)) {
    const files = fs.readdirSync(docsDir);
    const normalizedDecodedId = decodedId.normalize('NFC');
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      const baseName = file.replace('.md', '').normalize('NFC');
      if (baseName === normalizedDecodedId || encodeURIComponent(baseName) === id) {
        return "Found robust fallback";
      }
    }
  }
  
  return null;
}

const id1 = encodeURIComponent('01_評価基準とAIプロンプト');
const id2 = encodeURIComponent('02_免責事項とフィードバック窓口');

console.log("01:", getDocContent(id1));
console.log("02:", getDocContent(id2));
