const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/open-iruma/mobile/src/data/issues_data.json', 'utf8'));
data.forEach(i => console.log(i.id, i.title));
