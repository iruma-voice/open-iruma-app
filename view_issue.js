const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/open-iruma/mobile/src/data/issues_data.json', 'utf8'));
const issue = data.find(i => i.id === '037b5ba67b5e');
console.log(issue.content.substring(0, 500));
