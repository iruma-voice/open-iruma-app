const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/open-iruma/mobile/src/data/issues_data.json', 'utf8'));
data.forEach(i => {
  const matches = [...i.content.matchAll(/data-original-path=\"([^\"]+)\"/g)];
  if (matches.length > 0) {
    console.log(`[${i.title}]`);
    matches.forEach(m => console.log('  -> ' + m[1]));
  }
});
