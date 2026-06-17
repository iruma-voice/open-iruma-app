const fs = require('fs');
const data = JSON.parse(fs.readFileSync('d:/open-iruma/mobile/src/data/issues_data.json', 'utf8'));
const ids = data.map(i => i.id);

data.forEach(item => {
  const links = item.content.match(/\/issues\/[a-zA-Z0-9_-]+/g);
  if (links) {
    links.forEach(link => {
      const targetId = link.split('/').pop();
      if (!ids.includes(targetId)) {
        console.log("Broken link in " + item.title + ": " + link);
      }
    });
  }
});
