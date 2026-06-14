# 実装計画書: 議員IDのローマ字Slug化によるNFC/NFD問題の根本解決

本計画は、`D:\open-iruma\mobile` の Next.js アプリケーションにおいて、日本語名（例: `内村忠久`）を議員IDおよびファイル名として使用している現在の設計を、半角英数字のSlug（例: `uchimura-tadahisa`）に移行することで、OS間（Mac/Windows/Linux）の文字コード（NFC/NFD）の不一致によるファイル読み込みエラーや、URLエンコーディングの不整合を解消するものです。

---

## 修正対象コンポーネントと変更点

### 1. [NEW] 議員名マッピング辞書ファイルの作成
#### [NEW] [member_mapping.json](file:///D:/open-iruma/mobile/src/data/member_mapping.json)
日本語名と半角英数字Slugの相互対応関係を定義し、データ生成時およびフロントエンド側で一貫したIDとして参照できるマッピング定義を作成します。

```json
{
  "小島清人": "kojima-kiyoto",
  "長谷川渉": "hasegawa-wataru",
  "横田淳一": "yokota-junichi",
  "益田英主": "masuda-hidetoshi",
  "佐藤匡": "sato-tadashi",
  "栗山英美": "kuriyama-hidemi",
  "池畠司": "ikehata-tsukasa",
  "細田智也": "hosoda-tomoya",
  "双木小百合": "namiki-sayuri",
  "山川さおり": "yamakawa-saori",
  "向口文恵": "mukaiguchi-fumie",
  "田山雅子": "tayama-masako",
  "大野勉": "ono-tsutsumu",
  "安道佳子": "ando-yoshiko",
  "古仲リカ": "konaka-rika",
  "吉田賢一": "yoshida-kenichi",
  "末次正": "suetsugu-tadashi",
  "内村忠久": "uchimura-tadahisa",
  "永澤美恵子": "nagasawa-mieko",
  "野口哲次": "noguchi-tetsuji",
  "宮岡治郎": "miyaoka-jiro",
  "町田健治": "machida-kenji",
  "丹下敦子": "tange-atsuko"
}
```

---

### 2. データ生成スクリプトの修正
#### [MODIFY] [generate-report-cards.js](file:///D:/open-iruma/mobile/scripts/generate-report-cards.js)
*   `member_mapping.json` を読み込み、日本語ID（ファイル名から抽出した名前）をローマ字Slugに変換してデータファイルを出力するように変更します。
*   `membersDir` 以下の個別JSONの保存ファイル名を、`佐藤匡.json` から `sato-tadashi.json` に変更します。
*   サマリーJSON `report-cards.json` 内の `members` 配列の `id` プロパティ値もローマ字Slugに変更します。

```javascript
// 追加: マッピング定義のロード
const mappingPath = path.resolve(__dirname, '../src/data/member_mapping.json');
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// 修正: 議員ID（日本語名）からローマ字Slugへの変換
const slug = mapping[id] || id;

// 修正: 個別JSONのファイル名変更
fs.writeFileSync(path.join(membersDestDir, `${slug}.json`), JSON.stringify(memberData, null, 2));

// 修正: サマリー用オブジェクトのidプロパティをslugに変更
reportCards.push({
  id: slug, // ここを日本語名からslugに変更
  name: id, // 表示用の名前は日本語名のまま保持
  ...
});
```

---

### 3. フロントエンド詳細ページの修正
#### [MODIFY] [[id]/page.tsx](file:///D:/open-iruma/mobile/src/app/report-cards/[id]/page.tsx)
*   URL（`id`パラメータ）が英数字のSlugになるため、`getMemberData(id)` の中身を、複雑な文字コードのデコード処理やファイルシステムのループ検索から、直接ファイルアクセスする単純かつ安全な処理に置き換えます。

```typescript
async function getMemberData(id: string) {
  const membersDir = path.join(process.cwd(), 'src/data/members');
  if (!fs.existsSync(membersDir)) return null;

  // URLパラメータの id (slug) を元にファイルを直接検索
  const filePath = path.join(membersDir, `${id}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  console.log(`[DEBUG] Member data not found for id=${id}.`);
  return null;
}
```

---

## 検証計画（Verification Plan）

### 1. データ生成と互換性の確認
1.  修正後、ローカル環境で `node scripts/generate-report-cards.js` を実行。
2.  `src/data/members/` 配下に各議員のローマ字ファイル（例: `uchimura-tadahisa.json`）が正しく出力され、従来の日本語名ファイルが存在しなくなっている（または新規生成されていない）ことを確認。
3.  `src/data/report-cards.json` 内の `members[].id` がすべてローマ字Slugに更新されていることを確認。

### 2. フロントエンドビルド及び動作確認
1.  ローカルサーバーを起動し（`npm run dev`）、ブラウザで `/report-cards` 一覧ページにアクセス。
2.  各議員カードをクリックした際、URLが `/report-cards/uchimura-tadahisa` のようなローマ字のURLに正しく遷移することを確認。
3.  詳細ページがエラーにならず、選挙公報や進捗チェックリスト、一般質問のタイムラインが正しく表示されることを確認。
4.  ローカルビルドを実行し（`npm run build`）、Vercelのデプロイ時と同様に静的ファイル生成（SSG）がエラーなく完了することを確認。
