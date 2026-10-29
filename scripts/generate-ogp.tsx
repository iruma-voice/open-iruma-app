import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';
import React from 'react';

// パス設定
const CWD = process.cwd();
const OGP_DIR = path.join(CWD, 'public', 'images', 'ogp');
const DEFAULT_OGP_PATH = path.join(CWD, 'public', 'images', 'ogp-default.png');

// データ読み込み
const issuesData = JSON.parse(fs.readFileSync(path.join(CWD, 'src', 'data', 'issues_data.json'), 'utf-8'));
const budgetsData = JSON.parse(fs.readFileSync(path.join(CWD, 'src', 'data', 'budget_data.json'), 'utf-8'));
const reportCardsData = JSON.parse(fs.readFileSync(path.join(CWD, 'src', 'data', 'report-cards.json'), 'utf-8'));
const newsData = JSON.parse(fs.readFileSync(path.join(CWD, 'src', 'data', 'news_data.json'), 'utf-8'));

// フォント読み込み
const fontPath = path.join(CWD, 'public', 'fonts', 'ZenMaruGothic-Bold.ttf');
if (!fs.existsSync(fontPath)) {
  console.error(`Font not found at ${fontPath}. Please ensure it is downloaded.`);
  process.exit(1);
}
const fontData = fs.readFileSync(fontPath);

// ============================================================================
// ピュアSVGアイコン定義（Satori互換・React Hooks不使用）
// ============================================================================

const SvgBuilding = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <path d="M9 22v-4h6v4" />
    <path d="M8 6h.01M16 6h.01M12 6h.01M12 10h.01M16 10h.01M8 10h.01M8 14h.01M12 14h.01M16 14h.01" />
  </svg>
);

const SvgBaby = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12h.01M15 12h.01" />
    <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 1.5-2 1.5c-2 0-3.5 1.1-3.5 2.5" />
  </svg>
);

const SvgSchool = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const SvgTrendingUp = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const SvgCoins = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);

const SvgDroplet = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  </svg>
);

const SvgLeaf = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

const SvgScale = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
    <path d="M7 21h10" />
    <path d="M12 3v18" />
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
  </svg>
);

const SvgShield = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const SvgArchive = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="5" x="2" y="3" rx="1" />
    <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
    <path d="M10 12h4" />
  </svg>
);

const SvgFileSearch = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" />
    <path d="m9 18-1.5-1.5" />
    <circle cx="5" cy="14" r="3" />
  </svg>
);

const SvgMegaphone = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

const SvgUser = ({ color }: { color: string }) => (
  <svg width="210" height="210" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// インパクトボックス左端のアクセント小アイコン（絵文字文字化け防止用）
const SvgBulletIcon = ({ color }: { color: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px', flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// ============================================================================
// カラー＆アイコンテーマ定義
// ============================================================================

type ThemeKey =
  | 'facility'   // 公共施設・まちづくり（ブルー系）
  | 'education'  // 子育て・教育・学校（ウォームオレンジ系）
  | 'finance'    // 財政・予算・決算（アンバー・ゴールド系）
  | 'water'      // 水道・インフラ（スカイブルー系）
  | 'tourism'    // 観光・狭山茶（エメラルド・グリーン系）
  | 'governance' // 議会・パーパス・ガバナンス（ティール系）
  | 'safety'     // 防災・防犯・安全（ローズ・レッド系）
  | 'archive'    // 議事録・一次資料アーカイブ（スレート系）
  | 'disclosure' // 開示請求公文書アーカイブ（インディゴ系）
  | 'member'     // 議員の通信簿（オレンジ系）
  | 'news';      // お知らせ（ティール系）

interface ThemeConfig {
  badgeBg: string;
  badgeText: string;
  orbColor: string;
  iconColor: string;
  calloutBg: string;
  calloutBorder: string;
  calloutText: string;
  Icon: React.FC<{ color: string }>;
}

const THEMES: Record<ThemeKey, ThemeConfig> = {
  facility: {
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    orbColor: '#E0F2FE',
    iconColor: '#0284C7',
    calloutBg: '#F0F9FF',
    calloutBorder: '#0284C7',
    calloutText: '#0C4A6E',
    Icon: SvgBuilding,
  },
  education: {
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
    orbColor: '#FFEDD5',
    iconColor: '#EA580C',
    calloutBg: '#FFF7ED',
    calloutBorder: '#EA580C',
    calloutText: '#9A3412',
    Icon: SvgSchool,
  },
  finance: {
    badgeBg: '#FEF3C7',
    badgeText: '#B45309',
    orbColor: '#FEF3C7',
    iconColor: '#D97706',
    calloutBg: '#FFFBEB',
    calloutBorder: '#D97706',
    calloutText: '#92400E',
    Icon: SvgCoins,
  },
  water: {
    badgeBg: '#E0F2FE',
    badgeText: '#0369A1',
    orbColor: '#E0F2FE',
    iconColor: '#0284C7',
    calloutBg: '#F0F9FF',
    calloutBorder: '#0284C7',
    calloutText: '#0C4A6E',
    Icon: SvgDroplet,
  },
  tourism: {
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    orbColor: '#DCFCE7',
    iconColor: '#16A34A',
    calloutBg: '#F0FDF4',
    calloutBorder: '#16A34A',
    calloutText: '#14532D',
    Icon: SvgLeaf,
  },
  governance: {
    badgeBg: '#E6F4F1',
    badgeText: '#0F766E',
    orbColor: '#E6F4F1',
    iconColor: '#0D9488',
    calloutBg: '#F0FDFA',
    calloutBorder: '#0D9488',
    calloutText: '#115E59',
    Icon: SvgScale,
  },
  safety: {
    badgeBg: '#FFE4E6',
    badgeText: '#BE123C',
    orbColor: '#FFE4E6',
    iconColor: '#E11D48',
    calloutBg: '#FFF1F2',
    calloutBorder: '#E11D48',
    calloutText: '#881337',
    Icon: SvgShield,
  },
  archive: {
    badgeBg: '#E2E8F0',
    badgeText: '#334155',
    orbColor: '#E2E8F0',
    iconColor: '#475569',
    calloutBg: '#F1F5F9',
    calloutBorder: '#475569',
    calloutText: '#1E293B',
    Icon: SvgArchive,
  },
  disclosure: {
    badgeBg: '#E0E7FF',
    badgeText: '#3730A3',
    orbColor: '#E0E7FF',
    iconColor: '#4F46E5',
    calloutBg: '#EEF2FF',
    calloutBorder: '#4F46E5',
    calloutText: '#312E81',
    Icon: SvgFileSearch,
  },
  member: {
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
    orbColor: '#FFEDD5',
    iconColor: '#EA580C',
    calloutBg: '#FFF7ED',
    calloutBorder: '#EA580C',
    calloutText: '#9A3412',
    Icon: SvgUser,
  },
  news: {
    badgeBg: '#E6F4F1',
    badgeText: '#0F766E',
    orbColor: '#E6F4F1',
    iconColor: '#0D9488',
    calloutBg: '#F0FDFA',
    calloutBorder: '#0D9488',
    calloutText: '#115E59',
    Icon: SvgMegaphone,
  },
};

// ============================================================================
// 全33件の地域課題・アーカイブ 個別キュレーション定義
// （すべて1行あたり12〜14文字以内・コールアウト24文字以内で1行収まりを保証）
// ============================================================================

interface CuratedOgpItem {
  category: string;
  lines: string[];
  impact: string;
  theme: ThemeKey;
  customIcon?: React.FC<{ color: string }>;
}

const CURATED_ISSUES: Record<string, CuratedOgpItem> = {
  // --- 公共施設マネジメント・地区センター分館 ---
  'cb1824b1416e': {
    category: '公共施設マネジメント',
    lines: ['地区センター4分館廃止問題', '「決定事項」と説明会の裏側'],
    impact: '開示公文書45件・説明会634名の記録を検証',
    theme: 'facility',
  },
  '0d22e1dcc4c4': {
    category: '公共施設マネジメント',
    lines: ['地区センターと4分館の', '廃止・統合計画（概要編）'],
    impact: '令和10年度末の一斉廃止計画と地域の課題',
    theme: 'facility',
  },
  'a9656f4ad226': {
    category: '一次資料・議事録アーカイブ',
    lines: ['地区センター4分館廃止', '市議会議事録 全発言記録'],
    impact: '2019〜2025年 全12会議の質疑・討論を収録',
    theme: 'archive',
  },
  'acfd14b0cbd1': {
    category: '情報公開請求アーカイブ',
    lines: ['地区センター4分館廃止', '開示公文書45件 完全記録'],
    impact: '市長説明報告書・全16回説明会181件の声',
    theme: 'disclosure',
  },
  '14cfec1930f9': {
    category: '公共施設マネジメント',
    lines: ['新庁舎建て替え計画と', '建設費103億円への膨張'],
    impact: '面積16%縮小・1社入札で20%増額の経緯',
    theme: 'facility',
  },
  '79ec24655819': {
    category: '一次資料・議事録アーカイブ',
    lines: ['新庁舎建て替え計画', '情報収集・議事録アーカイブ'],
    impact: '基本設計から入札・事業費増額までの全記録',
    theme: 'archive',
  },
  '918b74e27810': {
    category: '学校再編・公共施設',
    lines: ['西武中学校の建て替えと', '建設費88億円への膨張問題'],
    impact: '当初見込みの約4倍へ急増・野田中案との対立',
    theme: 'education',
  },
  '918b74e27811': {
    category: '一次資料・議事録アーカイブ',
    lines: ['西武中学校の建て替え問題', '情報収集・議事録アーカイブ'],
    impact: '学校統合・建設費・通学路安全の全質疑記録',
    theme: 'archive',
  },
  '9fcbec08e17e': {
    category: '子育て・学校再編',
    lines: ['小中学校・公立保育所の', '統廃合計画と地域の未来'],
    impact: '少子化に伴う学校再編・通学距離と跡地活用',
    theme: 'education',
  },
  'c4871ec8abd5': {
    category: '公共施設マネジメント',
    lines: ['公共施設マネジメントの', '現在地と維持管理費の課題'],
    impact: '40年間で1,882億円の更新推計と施設縮減議論',
    theme: 'facility',
  },

  // --- 子育て・教育 ---
  '6021a48d811a': {
    category: '子育て・学童保育',
    lines: ['学童保育室の一括民営化と', '保育料・支援員体制の課題'],
    impact: '2026年度から全室民営化・保育の質と安全は',
    theme: 'education',
    customIcon: SvgBaby,
  },
  '5802f44f97c4': {
    category: '一次資料・議事録アーカイブ',
    lines: ['学童保育室の一括民営化', '情報収集・議事録アーカイブ'],
    impact: '民間委託導入・利用料改定・処遇の質疑記録',
    theme: 'archive',
  },
  '0991ba104335': {
    category: '子育て・教育支援',
    lines: ['学校給食費の無償化と', '約4億円の財源確保の行方'],
    impact: '第3子以降の無償化開始と完全無償化への課題',
    theme: 'education',
    customIcon: SvgBaby,
  },
  'ca2e6ea1c006': {
    category: '一次資料・議事録アーカイブ',
    lines: ['学校給食費無償化', '情報収集・議事録アーカイブ'],
    impact: '給食無償化を巡る各会派の質問と市の答弁録',
    theme: 'archive',
  },

  // --- まちづくり・基地跡地 ---
  '94e99f54c5d4': {
    category: 'まちづくり・基地跡地',
    lines: ['ジョンソン基地跡地留保地', '（入間市駅前側）開発問題'],
    impact: '官民連携への転換と市民会館「空白期間」懸念',
    theme: 'facility',
  },
  '2ac5e7513535': {
    category: '一次資料・調査アーカイブ',
    lines: ['ジョンソン基地跡地留保地', '事前調査・基本計画資料'],
    impact: '基地跡地留保地の歴史的経緯と開発構想データ',
    theme: 'archive',
  },
  'ab2b3c44f3bf': {
    category: '一次資料・議事録アーカイブ',
    lines: ['ジョンソン基地跡地留保地', '情報収集・議事録アーカイブ'],
    impact: 'サウンディング調査・市民会館複合化の全記録',
    theme: 'archive',
  },
  '2d86710d46ca': {
    category: 'まちづくり・最上位計画',
    lines: ['次期入間市総合計画と', '人口10万人時代への転換'],
    impact: '2060年人口推計を見据えた行財政運営の指針',
    theme: 'facility',
    customIcon: SvgTrendingUp,
  },
  '8b770937efc4': {
    category: '一次資料・議事録アーカイブ',
    lines: ['次期入間市総合計画', '情報収集・議事録アーカイブ'],
    impact: '総合計画策定・人口推計・行革の議会質疑記録',
    theme: 'archive',
  },

  // --- インフラ・水道 ---
  'c412ed17c087': {
    category: '生活インフラ・上下水道',
    lines: ['27年ぶりの水道料金改定', '（上水35%・下水33%増）'],
    impact: '2026年3月可決・老朽管の耐震更新と家計負担',
    theme: 'water',
  },
  'badc09d776cd': {
    category: '一次資料・議事録アーカイブ',
    lines: ['水道料金・下水道使用料改定', '情報収集・議事録アーカイブ'],
    impact: '県水値上げ・管路更新費・改定案の審議全記録',
    theme: 'archive',
  },

  // --- 財政の逼迫 ---
  '037b5ba67b5e': {
    category: '財政・行財政改革',
    lines: ['入間市の「財政の逼迫」', '大型事業229億円集中の危機'],
    impact: '経常収支比率95%超・基金減少と将来負担',
    theme: 'finance',
    customIcon: SvgTrendingUp,
  },
  '7c0a15412516': {
    category: '一次資料・議事録アーカイブ',
    lines: ['財政の逼迫・大型事業集中', '情報収集・議事録アーカイブ'],
    impact: '経常収支比率・起債・基金残高の議会論戦記録',
    theme: 'archive',
  },

  // --- 地域の振興・観光 ---
  '01aebbf78e03': {
    category: '観光振興・狭山茶',
    lines: ['茶畑テラス「茶の輪」事業', '公費投入と直営転換の検証'],
    impact: '年利用200〜300人・民間移行断念と維持費課題',
    theme: 'tourism',
  },
  '247a6f08359d': {
    category: '一次資料・議事録アーカイブ',
    lines: ['茶畑テラス「茶の輪」事業', '情報収集・議事録アーカイブ'],
    impact: '整備費・利用実績・指定管理断念の質疑記録',
    theme: 'archive',
  },
  '4ecf3129819b': {
    category: '一次資料・議事録アーカイブ',
    lines: ['茶畑テラス・茶の輪事業', '生発言・全件網羅アーカイブ'],
    impact: '茶畑テラス関連の全会議録・発言を時系列収録',
    theme: 'archive',
  },

  // --- 議会の透明性とガバナンス ---
  '1b42f31f69de': {
    category: '市政運営・ガバナンス',
    lines: ['入間市パーパス（策定編）', '職員の合言葉から最上位へ'],
    impact: '博報堂へ随意契約450万円・開示文書から検証',
    theme: 'governance',
  },
  '3e2ef1b80a7d': {
    category: '市政運営・ガバナンス',
    lines: ['入間市パーパス（運用編）', '公金継続と総合計画最上位化'],
    impact: '効果測定なき広報予算と地方自治のねじれ',
    theme: 'governance',
  },
  'dcbbab45d8e9': {
    category: '情報公開・議事録アーカイブ',
    lines: ['入間市パーパス検証', '開示公文書・議事録全記録'],
    impact: '起案文書・契約・職員アンケート・質疑を収録',
    theme: 'disclosure',
  },
  'a439c6fdc132': {
    category: '議会改革・政治倫理',
    lines: ['政務活動に関する', '調査特別委員会（百条調査）'],
    impact: '請願署名問題と職員への圧力・議会の自浄作用',
    theme: 'governance',
  },
  'f2bd8e135d5f': {
    category: '一次資料・議事録アーカイブ',
    lines: ['政務活動に関する調査特別委', '情報収集・審議アーカイブ'],
    impact: '特別委員会での証人喚問・調査報告の詳細記録',
    theme: 'archive',
  },

  // --- 安全・安心 ---
  '2cdf16f38a45': {
    category: '防犯・地域の安全',
    lines: ['防犯カメラの設置基準と', '今後の防犯対策の課題'],
    impact: '通学路や市街地の設置方針と維持管理コスト',
    theme: 'safety',
  },
  '1af93cb022d6': {
    category: '一次資料・議事録アーカイブ',
    lines: ['防犯カメラの設置基準と今後', '情報収集・議事録アーカイブ'],
    impact: '自治会補助・警察連携・プライバシー保護記録',
    theme: 'archive',
  },
};

// ============================================================================
// 予算・決算（全40件）の自動最適化ヘルパー
// ============================================================================

const BUDGET_FIGURES: Record<string, string> = {
  '令和元年度': '一般会計 約421億円 ｜ 消費税10%・台風19号対応',
  '令和2年度': '一般会計 439.5億円 ｜ 新型コロナ緊急対策・給付金',
  '令和3年度': '一般会計 441.6億円 ｜ ワクチン接種・生活支援',
  '令和4年度': '一般会計 450.1億円 ｜ 物価高対策と新庁舎始動',
  '令和5年度': '一般会計 480.1億円 ｜ 実質収支約9.95億円黒字',
  '令和6年度': '一般会計 512.3億円 ｜ 初の500億円突破・財政分析',
  '令和7年度': '一般会計 553.1億円 ｜ 前年比+8.0%・大型事業集中',
  '令和8年度': '一般会計 564.2億円 ｜ 過去最大規模（8年で+34%）',
};

function getCuratedBudgetOgp(budget: any): CuratedOgpItem {
  const rawTitle: string = budget.title || '予算・財政';
  const isArchive = rawTitle.includes('情報収集') || rawTitle.includes('アーカイブ');

  if (budget.id === '391086d18a02') {
    return {
      category: '予算・財政トレンド',
      lines: ['入間市 当初予算の推移', '（令和元年度〜令和8年度）'],
      impact: '421億円から564億円へ：8年で約143億円増',
      theme: 'finance',
      customIcon: SvgTrendingUp,
    };
  }

  // 年度抽出
  const yearMatch = rawTitle.match(/令和[元2-8]年度/);
  const yearStr = yearMatch ? yearMatch[0] : '入間市財政';
  const westYearMap: Record<string, string> = {
    '令和元年度': '2019年度',
    '令和2年度': '2020年度',
    '令和3年度': '2021年度',
    '令和4年度': '2022年度',
    '令和5年度': '2023年度',
    '令和6年度': '2024年度',
    '令和7年度': '2025年度',
    '令和8年度': '2026年度',
  };
  const westYear = westYearMap[yearStr] || '';

  let docType = '予算・財政まとめ';
  if (rawTitle.includes('当初予算') || rawTitle.includes('入間市の予算')) docType = '当初予算の使い道と論点';
  else if (rawTitle.includes('補正予算')) docType = '補正予算の推移と緊急対策';
  else if (rawTitle.includes('決算')) docType = '決算まとめ（財政の通信簿）';
  else if (rawTitle.includes('財政まとめ')) docType = '予算・決算 総合まとめ';

  if (isArchive) {
    let archiveType = '当初予算';
    if (rawTitle.includes('補正予算')) archiveType = '補正予算';
    else if (rawTitle.includes('決算')) archiveType = '決算審査';
    return {
      category: `${yearStr} 一次資料アーカイブ`,
      lines: [`${yearStr}（${westYear}）`, `${archiveType} 審議・情報収集記録`],
      impact: BUDGET_FIGURES[yearStr] || '議会での予算・決算審議の生データ記録',
      theme: 'archive',
    };
  }

  return {
    category: `${yearStr}（${westYear}）財政`,
    lines: [`${yearStr} 入間市の`, docType],
    impact: BUDGET_FIGURES[yearStr] || '入間市のお金の使い道と議会での主な議論',
    theme: 'finance',
  };
}

// ============================================================================
// 画像レンダリング関数（個別2カラム型 & トップ中央配置型）
// ============================================================================

async function generateSplitOgpImage(
  filename: string,
  item: CuratedOgpItem
) {
  const theme = THEMES[item.theme];
  const IconComponent = item.customIcon || theme.Icon;
  const maxLineLen = Math.max(...item.lines.map((l) => l.length));

  // 左カラム有効幅(約690px)に確実に1行で収まるよう文字数別フォントサイズを厳密計算
  let titleFontSize = '54px';
  if (maxLineLen <= 10) titleFontSize = '60px';
  else if (maxLineLen === 11) titleFontSize = '55px';
  else if (maxLineLen === 12) titleFontSize = '51px';
  else if (maxLineLen === 13) titleFontSize = '47px';
  else if (maxLineLen === 14) titleFontSize = '44px';
  else if (maxLineLen === 15) titleFontSize = '41px';
  else titleFontSize = '38px';

  // インパクトボックスも確実に1行で収まるよう文字数別にフォントサイズ調整
  let impactFontSize = '24px';
  if (item.impact.length <= 21) impactFontSize = '25px';
  else if (item.impact.length <= 24) impactFontSize = '23px';
  else if (item.impact.length <= 27) impactFontSize = '21px';
  else impactFontSize = '19px';

  const element = (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#FAF9F5',
        padding: '56px 56px',
        fontFamily: '"Zen Maru Gothic"',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      {/* 左カラム (66%) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '66%',
          paddingRight: '28px',
          justifyContent: 'center',
          gap: '28px',
        }}
      >
        {/* ① カテゴリバッジ & サイト名 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: theme.badgeBg,
              color: theme.badgeText,
              padding: '8px 22px',
              borderRadius: '24px',
              fontSize: '23px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
            }}
          >
            {item.category}
          </div>
          <div style={{ display: 'flex', color: '#64748B', fontSize: '23px', fontWeight: 700, whiteSpace: 'nowrap' }}>
            いるまオープン議会
          </div>
        </div>

        {/* ② タイトル（意図した改行位置で1行ずつ美しく表示） */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            fontSize: titleFontSize,
            fontWeight: 900,
            color: '#1E293B',
            lineHeight: 1.22,
          }}
        >
          {item.lines.map((line, idx) => (
            <div key={idx} style={{ display: 'flex', whiteSpace: 'nowrap' }}>
              {line}
            </div>
          ))}
        </div>

        {/* ③ インパクト・要点コールアウトボックス（1行収まり保証） */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.calloutBg,
            borderLeft: `8px solid ${theme.calloutBorder}`,
            borderRadius: '0 12px 12px 0',
            padding: '14px 18px',
            color: theme.calloutText,
            fontSize: impactFontSize,
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          <SvgBulletIcon color={theme.calloutBorder} />
          <div style={{ display: 'flex', whiteSpace: 'nowrap' }}>{item.impact}</div>
        </div>
      </div>

      {/* 右カラム (34%) - アイコン領域 */}
      <div
        style={{
          display: 'flex',
          width: '34%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* 背景オーブ (円) */}
        <div
          style={{
            display: 'flex',
            width: '360px',
            height: '360px',
            borderRadius: '50%',
            backgroundColor: theme.orbColor,
            position: 'absolute',
          }}
        />
        {/* SVGアイコン */}
        <div
          style={{
            display: 'flex',
            width: '210px',
            height: '210px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconComponent color={theme.iconColor} />
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

  const pngBuffer = resvg.render().asPng();

  if (!fs.existsSync(OGP_DIR)) {
    fs.mkdirSync(OGP_DIR, { recursive: true });
  }

  const outPath = path.join(OGP_DIR, filename);
  fs.writeFileSync(outPath, pngBuffer);
}

async function generateTopOgpImage(
  filename: string,
  mainCatch: string,
  subCatch: string,
  badgeText: string = 'いるまオープン議会'
): Promise<Buffer> {
  const lines = mainCatch.split('\n');

  const element = (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FAF9F5',
        fontFamily: '"Zen Maru Gothic"',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景の抽象グラフィック（オーブ） */}
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
        <circle cx="200" cy="780" r="300" fill="url(#grad1)" />
        <circle cx="1050" cy="150" r="350" fill="url(#grad2)" />
      </svg>

      {/* 前面のコンテンツレイヤー */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
            marginBottom: '16px',
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
            gap: '8px',
            fontSize: '70px',
            fontWeight: 900,
            color: '#1E293B',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            textAlign: 'center',
          }}
        >
          {lines.map((line, i) => (
            <div key={i} style={{ display: 'flex' }}>
              {line}
            </div>
          ))}
        </div>

        {/* サブキャッチコピー */}
        <div
          style={{
            display: 'flex',
            fontSize: '32px',
            color: '#475569',
            fontWeight: 700,
            marginTop: '14px',
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

  const pngBuffer = resvg.render().asPng();

  if (!fs.existsSync(OGP_DIR)) {
    fs.mkdirSync(OGP_DIR, { recursive: true });
  }

  const outPath = path.join(OGP_DIR, filename);
  fs.writeFileSync(outPath, pngBuffer);
  return pngBuffer;
}

// ============================================================================
// メイン実行処理
// ============================================================================

async function main() {
  let count = 0;

  // 1. トップ・各セクションインデックス用OGP画像（9種 + ogp-default.png上書き）
  console.log('1. Generating Top and Section Index OGP images...');
  const topBuffer = await generateTopOgpImage(
    'top.png',
    '議会のリアルを、\n市民の手に。',
    '3分でわかる、入間市議会まとめデータベース'
  );
  // 「子育て応援アプリ」になっていた ogp-default.png を公式トップOGPで上書き
  fs.writeFileSync(DEFAULT_OGP_PATH, topBuffer);
  count += 2;

  await generateTopOgpImage(
    'about.png',
    'このサイトについて\n（有志プロジェクト）',
    '入間市議会の議論を可視化する取り組み'
  );
  await generateTopOgpImage(
    'issues-top.png',
    '入間市の地域課題と\n議会の議論一覧',
    '3分要約 × 議論の変遷 × 生の議事録・開示文書'
  );
  await generateTopOgpImage(
    'budget.png',
    '予算と財政の\n使い道・変遷',
    '入間市のお金に関する議論まとめ（令和元〜8年度）'
  );
  await generateTopOgpImage(
    'budget-guide.png',
    '3分でわかる！\n自治体財政ガイド',
    '当初予算・補正予算・決算・財政指標の読み方'
  );
  await generateTopOgpImage(
    'budget-trends.png',
    '入間市の財政推移\nデータダッシュボード',
    '歳入・歳出・基金残高・市債の長期トレンド'
  );
  await generateTopOgpImage(
    'report-cards-top.png',
    '市議会議員23人の\n「通信簿」',
    '公約達成状況と議会での一般質問・活動データ'
  );
  await generateTopOgpImage(
    'news-top.png',
    '更新履歴・お知らせ',
    'いるまオープン議会 新着検証記事・アップデート情報'
  );
  await generateTopOgpImage(
    'proposals.png',
    'みんなの「一般質問」\nアイデアボード',
    '「これ、議会で聞いてほしい！」地域の課題をシェアしよう'
  );
  count += 8;

  // 2. 地域課題・アーカイブ 全33件の個別OGP画像
  console.log(`2. Generating all ${issuesData.length} Issue & Archive OGP images...`);
  for (const issue of issuesData) {
    const curated = CURATED_ISSUES[issue.id] || {
      category: (issue.tags && issue.tags[0] ? issue.tags[0].replace('issue/', '') : '市政課題'),
      lines: [issue.title.slice(0, 13), issue.title.slice(13, 26)].filter(Boolean),
      impact: '入間市議会の議事録・一次資料に基づく検証',
      theme: 'governance' as ThemeKey,
    };
    await generateSplitOgpImage(`issue-${issue.id}.png`, curated);
    count++;
  }

  // 3. 予算・決算 全40件の個別OGP画像
  console.log(`3. Generating all ${budgetsData.length} Budget & Settlement OGP images...`);
  for (const budget of budgetsData) {
    const curated = getCuratedBudgetOgp(budget);
    await generateSplitOgpImage(`budget-${budget.id}.png`, curated);
    count++;
  }

  // 4. 議員の通信簿 全23名の個別OGP画像
  const members = reportCardsData.members;
  console.log(`4. Generating all ${members.length} Member Report Card OGP images...`);
  for (const member of members) {
    const hasActivity = member.progressRate > 0 || (member.themes && member.themes.length > 0);
    const impactText = hasActivity
      ? `公約進捗率: 約${member.progressRate}% ｜ 一般質問・活動実績`
      : '議長・監査等の役職および選挙公約データ';
    await generateSplitOgpImage(`report-card-${member.id}.png`, {
      category: member.faction || '無所属',
      lines: [`${member.name} 議員の`, '公約・議会活動「通信簿」'],
      impact: impactText,
      theme: 'member',
    });
    count++;
  }

  // 5. お知らせ個別記事（2件）のOGP画像
  console.log(`5. Generating all ${newsData.length} News Detail OGP images...`);
  for (const news of newsData) {
    const isPurpose = news.title.includes('パーパス');
    await generateSplitOgpImage(`news-${news.id}.png`, {
      category: `更新情報（${news.date.replace(/-/g, '.')}）`,
      lines: isPurpose
        ? ['新着：入間市パーパス', '検証記事2部作を公開']
        : ['2026年9月 更新情報', '（令和8年6月議会反映分）'],
      impact: isPurpose
        ? '開示公文書とアンケートから策定・運用を検証'
        : '新庁舎・西武中・水道・給食など6記事を更新',
      theme: 'news',
    });
    count++;
  }

  console.log(`✅ Done! Successfully generated ${count} OGP images.`);
}

main().catch(console.error);
