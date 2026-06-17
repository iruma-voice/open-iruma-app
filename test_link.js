const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../../');
const SOURCE_DIR = path.join(ROOT_DIR, '00.open-iruma/02_地域課題と議論_Issues_Debates');

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

const markdownFiles = findMarkdownFiles(SOURCE_DIR);
const articleMap = {};
markdownFiles.forEach(f => {
  articleMap[path.basename(f, '.md')] = "TEST_ID";
});

console.log(articleMap['学童保育室の一括民営化_情報収集']);

const inner = "学童保育室の一括民営化_情報収集.md";
const linkBasename = inner.split('/').pop().replace('.md', '');
console.log(linkBasename);
console.log(articleMap[linkBasename]);
