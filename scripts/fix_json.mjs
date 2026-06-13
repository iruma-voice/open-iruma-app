import fs from 'fs';

const file = 'src/data/issues_data.json';
let data = JSON.parse(fs.readFileSync(file, 'utf8'));

// 古いID（94e99f54c5d4）のタイトルを新しいMarkdownのタイトルに合わせる
const oldEntry = data.find(i => i.id === '94e99f54c5d4');
if (oldEntry) {
  oldEntry.title = 'ジョンソン基地跡地留保地開発';
  console.log('Fixed title for 94e99f54c5d4');
}

// タイトルが重複しているエントリ（新しく作られてしまった別IDの記事）を削除
const uniqueData = data.filter((item, index, self) => 
  index === self.findIndex((t) => t.title === item.title)
);

fs.writeFileSync(file, JSON.stringify(uniqueData, null, 2));
console.log('JSON cleanup complete.');
