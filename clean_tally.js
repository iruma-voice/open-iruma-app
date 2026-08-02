const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const targetDir = 'd:\\open-iruma\\00.open-iruma';

walkDir(targetDir, function(filePath) {
  if (filePath.endsWith('.md')) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Remove Tally iframes and script
    content = content.replace(/<iframe.*?tally\.so.*?<\/iframe>\n?/g, '');
    content = content.replace(/<script>var d=document,w="https:\/\/tally\.so.*?<\/script>\n?/g, '');
    content = content.replace(/\n*### 📮 ご意見・フィードバック\n*/g, '\n');

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
      console.log(`Cleaned: ${filePath}`);
    }
  }
});
