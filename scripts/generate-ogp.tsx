import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import React from 'react';

// Setup paths
const CWD = process.cwd();
const OGP_DIR = path.join(CWD, 'public', 'images', 'ogp');

// Load Data
const topPageData = JSON.parse(fs.readFileSync(path.join(CWD, 'src', 'data', 'top_page_data.json'), 'utf-8'));
const issuesData = JSON.parse(fs.readFileSync(path.join(CWD, 'src', 'data', 'issues_data.json'), 'utf-8'));
const reportCardsData = JSON.parse(fs.readFileSync(path.join(CWD, 'src', 'data', 'report-cards.json'), 'utf-8'));

// Identify targets
const featuredIssueUrls = [];
for (const cat of topPageData.categories) {
  for (const item of cat.items) {
    if (item.url && item.url.startsWith('/issues/')) {
      featuredIssueUrls.push(item.url.replace('/issues/', ''));
    }
  }
}
// Expecting 11 items.

const members = reportCardsData.members; // 22 items

// Load Font
const fontPath = path.join(CWD, 'public', 'fonts', 'ZenMaruGothic-Bold.ttf');
if (!fs.existsSync(fontPath)) {
  console.error(`Font not found at ${fontPath}. Please ensure it is downloaded.`);
  process.exit(1);
}
const fontData = fs.readFileSync(fontPath);

// Raw SVG icons for Satori (Satori doesn't support React hooks used by lucide-react)
const SvgFileText = ({ color }: { color: string }) => (
  <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <line x1="10" y1="9" x2="8" y2="9" />
  </svg>
);

const SvgUser = ({ color }: { color: string }) => (
  <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SvgBaby = ({ color }: { color: string }) => (
  <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12h.01M15 12h.01" />
    <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 1.5-2 1.5c-2 0-3.5 1.1-3.5 2.5" />
  </svg>
);

const SvgHeart = ({ color }: { color: string }) => (
  <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const SvgBuilding = ({ color }: { color: string }) => (
  <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M16 10h.01M8 10h.01M8 14h.01M12 14h.01M16 14h.01" />
  </svg>
);

const SvgTrendingUp = ({ color }: { color: string }) => (
  <svg width="250" height="250" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

async function generateOgpImage(
  filename: string,
  title: string,
  category: string,
  impact: string | null = null,
  type: 'issue' | 'member' = 'issue'
) {
  // 文字数で自動調整（最大文字数制限）
  const displayTitle = title.length > 35 ? title.substring(0, 35) + '...' : title;

  let orbColor = '#E2E8F0';
  let iconColor = '#64748B';
  let IconComponent = SvgFileText;

  if (type === 'member') {
    orbColor = '#FFEDD5';
    iconColor = '#EA580C';
    IconComponent = SvgUser;
  } else {
    if (category.includes('子育て') || category.includes('教育') || category.includes('学校') || category.includes('こども')) {
      orbColor = '#FFEDD5'; iconColor = '#EA580C';
      IconComponent = SvgBaby;
    } else if (category.includes('福祉') || category.includes('健康') || category.includes('医療') || category.includes('ジェンダー')) {
      orbColor = '#FCE7F3'; iconColor = '#DB2777';
      IconComponent = SvgHeart;
    } else if (category.includes('都市') || category.includes('インフラ') || category.includes('交通') || category.includes('公園') || category.includes('水道') || category.includes('環境')) {
      orbColor = '#E0F2FE'; iconColor = '#0284C7';
      IconComponent = SvgBuilding;
    } else if (category.includes('経済') || category.includes('産業') || category.includes('農業') || category.includes('財政')) {
      orbColor = '#FEF9C3'; iconColor = '#CA8A04';
      IconComponent = SvgTrendingUp;
    } else {
      orbColor = '#E6F4F1'; iconColor = '#0D9488';
      IconComponent = SvgFileText;
    }
  }

  const element = (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#FAF9F5',
        padding: '60px',
        fontFamily: '"Zen Maru Gothic"',
        boxSizing: 'border-box',
      }}
    >
      {/* 左カラム (65%) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '65%',
          justifyContent: 'center',
          gap: '32px',
        }}
      >
        {/* ① カテゴリ & サイト名 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#E6F4F1',
              color: '#0D9488',
              padding: '8px 24px',
              borderRadius: '24px',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            {category}
          </div>
          <div style={{ display: 'flex', color: '#64748B', fontSize: '24px', fontWeight: 700 }}>
            いるまオープン議会
          </div>
        </div>
        
        {/* ② タイトル */}
        <div
          style={{
            display: 'flex',
            fontSize: displayTitle.length > 25 ? '56px' : '64px',
            fontWeight: 900,
            color: '#1E293B',
            lineHeight: 1.25,
          }}
        >
          {displayTitle}
        </div>
        
        {/* ③ インパクト数値 (データがある場合のみ) */}
        {impact && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFEDD5',
              borderLeft: '8px solid #EA580C',
              padding: '16px 24px',
              color: '#9A3412',
              fontSize: '28px',
              fontWeight: 700,
            }}
          >
            {impact}
          </div>
        )}
      </div>

      {/* 右カラム (35%) - アイコン領域 */}
      <div
        style={{
          display: 'flex',
          width: '35%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* 背景オーブ (円) */}
        <div
          style={{
            display: 'flex',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            backgroundColor: orbColor,
            position: 'absolute',
          }}
        />
        {/* SVGアイコン */}
        <div
          style={{
            display: 'flex',
            width: '250px',
            height: '250px',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <IconComponent color={iconColor} />
        </div>
      </div>
    </div>
  );

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Zen Maru Gothic',
        data: fontData,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  if (!fs.existsSync(OGP_DIR)) {
    fs.mkdirSync(OGP_DIR, { recursive: true });
  }

  const outPath = path.join(OGP_DIR, filename);
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`Generated: ${outPath}`);
}

async function generateTopOgpImage(
  filename: string,
  mainCatch: string,
  subCatch: string,
  badgeText: string = 'いるまオープン議会'
) {
  // Satori might have limited support for radial-gradient in CSS, 
  // but we will try the user's provided structure. If it fails or looks weird, 
  // we might need to use raw SVG defs for gradients.
  
  // Format mainCatch to include <br/> if needed, or we just render it directly
  const mainCatchElements = mainCatch.split('\n').map((line, i, arr) => (
    <React.Fragment key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </React.Fragment>
  ));

  const element = (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF9F5', // ベース背景
        fontFamily: '"Zen Maru Gothic"',
        position: 'relative',
        overflow: 'hidden', // はみ出た背景図形をカット
      }}
    >
      {/* 背景の抽象グラフィック（オーブ） - SatoriはCSSのradial-gradientをサポートしないため、SVGで描画 */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(253,186,116,0.4)" />
            <stop offset="70%" stopColor="rgba(253,186,116,0)" />
          </radialGradient>
          <radialGradient id="grad2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(94,234,212,0.3)" />
            <stop offset="70%" stopColor="rgba(94,234,212,0)" />
          </radialGradient>
        </defs>
        
        {/* オーブ1（オレンジ系 - 左下） - cx, cy, rで配置をシミュレート */}
        <circle cx="200" cy="780" r="300" fill="url(#grad1)" />
        
        {/* オーブ2（ティール系 - 右上） */}
        <circle cx="1050" cy="150" r="350" fill="url(#grad2)" />
      </svg>

      {/* 前面のコンテンツレイヤー */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
          gap: '24px',
        }}
      >
        {/* サイト名バッジ */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#E6F4F1',
            color: '#0D9488',
            padding: '12px 32px',
            borderRadius: '40px',
            fontSize: '28px',
            fontWeight: 700,
            marginBottom: '20px',
          }}
        >
          {badgeText}
        </div>

        {/* メインキャッチコピー */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontSize: '72px',
            fontWeight: 900,
            color: '#1E293B',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          {mainCatchElements}
        </div>

        {/* サブキャッチコピー */}
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: '#475569',
            fontWeight: 700,
            marginTop: '16px',
          }}
        >
          {subCatch}
        </div>
      </div>
    </div>
  );

  const svg = await satori(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Zen Maru Gothic',
        data: fontData,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  if (!fs.existsSync(OGP_DIR)) {
    fs.mkdirSync(OGP_DIR, { recursive: true });
  }

  const outPath = path.join(OGP_DIR, filename);
  fs.writeFileSync(outPath, pngBuffer);
  console.log(`Generated Top-style OGP: ${outPath}`);
}

async function main() {
  console.log('Generating Top and About images...');
  await generateTopOgpImage('top.png', '議会のリアルを、\n市民の手に。', '3分でわかる、まとめデータベース', 'いるまオープン議会');
  await generateTopOgpImage('about.png', 'このサイトについて\n（有志プロジェクト）', '入間市議会の議論を可視化する取り組み', 'いるまオープン議会');
  
  console.log('Generating Budget and Report Cards Top images...');
  await generateTopOgpImage('budget.png', '予算と財政の\n使い道・変遷', '入間市のお金に関する議論まとめ', 'いるまオープン議会');
  await generateTopOgpImage('report-cards-top.png', '市議会議員22人の\n「通信簿」', '公約達成状況と議会での活動データ', 'いるまオープン議会');

  console.log(`Generating ${featuredIssueUrls.length} Featured Issues images...`);
  for (const id of featuredIssueUrls) {
    const issue = issuesData.find((i: any) => i.id === id);
    if (issue) {
      const category = (issue.tags && issue.tags[0] ? issue.tags[0].replace('issue/', '') : '市政課題');
      // impact data is currently absent in the JSON, so we pass null.
      await generateOgpImage(`issue-${id}.png`, issue.title, category, null, 'issue');
    }
  }

  console.log(`Generating ${members.length} Member Report Cards images...`);
  for (const member of members) {
    const title = `${member.name}議員の通信簿`;
    // We can show progress rate as impact
    const impact = `💡 公約進捗: 約${member.progressRate}%達成`;
    await generateOgpImage(`report-card-${member.id}.png`, title, member.faction || '無所属', impact, 'member');
  }
  
  console.log('✅ Done! 37 OGP images generated.');
}

main().catch(console.error);
