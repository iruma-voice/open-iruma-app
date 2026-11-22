'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import IrumaMapHeroBanner from './IrumaMapHeroBanner';
import {
  ArrowRight,
  BarChart3,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ClipboardList,
  Clock,
  ExternalLink,
  FileText,
  HeartHandshake,
  Info,
  MapPin,
  MessageSquare,
  Search,
  ShieldAlert,
  Users,
  Wallet,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

// 入間市・狭山茶グリーン × アイボリー × マスタードの全面ライトテーマ定義
const STATUS_TONES: Record<string, string> = {
  emerald: 'bg-[#EEF5F0] text-[#236247] border-[#C5DEC9]',
  rose: 'bg-[#FDECEA] text-[#B32D22] border-[#F5C6C0]',
  amber: 'bg-[#FFF8E1] text-[#8A5A00] border-[#F2DC96]',
};

export interface DocItem {
  image: string;
  shortTitle: string;
  title: string;
  source: string;
  note: string;
  orientation: 'landscape' | 'portrait' | string;
}

interface VisualData {
  hero: {
    unofficialNotice: string;
    badge: string;
    titleLead: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
    localLandmarks: string[];
  };
  gaugeDocs: DocItem[];
  gauges: {
    id: string;
    title: string;
    status: string;
    statusTone: string;
    mainNumber: string;
    subNumber: string;
    chartType: string;
    oneLiner: string;
    citizenNote: string;
  }[];
  tabs: {
    id: string;
    shortLabel: string;
    title: string;
    color: string;
    summary: string;
    cards: {
      targetTag: string;
      title: string;
      quickAnswer: string;
      highlightNumber: string;
      highlightBadge: string;
      citizenNote: string;
      vsBefore: string;
      vsNow: string;
      proPoint: string;
      issuePoint: string;
      docs: DocItem[];
      link: {
        title: string;
        url: string;
      };
    }[];
  }[];
  otherTopics: {
    title: string;
    url: string;
  }[];
}

interface LightboxState {
  docs: DocItem[];
  index: number;
  linkUrl?: string;
  linkTitle?: string;
}

// 市民1人あたり換算メモ（やさしい黄色ピル枠）
function CitizenMemoNote({ note }: { note: string }) {
  const cleanText = note.replace(/^✎\s*/, '');
  return (
    <div className="my-3 bg-[#FFFBEB] border border-[#EFE1A8] rounded-2xl px-3.5 py-2.5">
      <div className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold text-[#8A5A00] mb-1">
        <Wallet className="w-3.5 h-3.5 shrink-0 text-[#C68900]" />
        <Users className="w-3.5 h-3.5 shrink-0 text-[#C68900]" />
        <span>市民1人あたり・家計への影響メモ</span>
      </div>
      <p className="text-[12px] font-bold text-[#3D392B] leading-relaxed">
        {cleanText}
      </p>
    </div>
  );
}

// スマホで1枚ずつ大きく確認できる資料デッキ（2枚ある場合はボタンで切り替え）
function DocumentDeck({
  docs,
  failedImages,
  onImageError,
  onOpenLightbox,
}: {
  docs: DocItem[];
  failedImages: Record<string, boolean>;
  onImageError: (src: string) => void;
  onOpenLightbox: (index: number) => void;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!docs || docs.length === 0) return null;

  const safeIndex = selectedIndex < docs.length ? selectedIndex : 0;
  const activeDoc = docs[safeIndex];
  const isPortrait = activeDoc.orientation === 'portrait';
  const hasMultiple = docs.length > 1;

  if (failedImages[activeDoc.image]) return null;

  return (
    <div className="bg-[#FAF8F2] border border-[#DDD6C3] rounded-2xl p-3">
      {/* 上段ヘッダー：資料種別ラベル ＋ 件数 */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#236247] bg-[#E3F0E7] px-2.5 py-0.5 rounded-full">
          📄 開示請求等による市作成資料（引用）
        </span>
        {hasMultiple && (
          <span className="text-[10.5px] font-mono font-black text-[#5C615D]">
            {safeIndex + 1} / {docs.length}
          </span>
        )}
      </div>

      {/* 複数資料がある場合の1枚切替タブ */}
      {hasMultiple && (
        <div className="grid grid-cols-2 gap-1.5 mb-2.5">
          {docs.map((doc, idx) => {
            const active = idx === safeIndex;
            return (
              <button
                key={doc.image}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`py-1.5 px-2.5 rounded-xl text-[11px] font-extrabold border text-left truncate transition-all ${
                  active
                    ? 'bg-[#2E7D5B] text-white border-[#2E7D5B] shadow-2xs'
                    : 'bg-white text-[#474C48] border-[#DFD8C4] hover:border-[#2E7D5B]/50'
                }`}
              >
                {doc.shortTitle}
              </button>
            );
          })}
        </div>
      )}

      {/* 1枚ずつカード横幅100%で大きく表示 */}
      <button
        type="button"
        onClick={() => onOpenLightbox(safeIndex)}
        className="w-full text-left block group"
      >
        <div
          className={`relative w-full rounded-xl overflow-hidden border border-[#CFC7B2] bg-white ${
            isPortrait ? 'aspect-[16/10]' : 'aspect-video'
          }`}
        >
          <img
            src={activeDoc.image}
            alt={activeDoc.title}
            className={
              isPortrait
                ? 'w-full h-full object-cover object-top group-hover:scale-[1.01] transition-transform duration-200'
                : 'w-full h-full object-contain bg-white group-hover:scale-[1.01] transition-transform duration-200'
            }
            onError={() => onImageError(activeDoc.image)}
          />

          {/* 縦長A4文書の場合は下端にフェード＋全文案内を重ねる */}
          {isPortrait && (
            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none flex items-end justify-center pb-2">
              <span className="text-[10.5px] font-extrabold text-white tracking-tight">
                ▼ タップしてA4全文を拡大して読む
              </span>
            </div>
          )}

          <span className="absolute top-2 right-2 bg-black/75 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-xs">
            <ZoomIn className="w-3 h-3" />
            <span>大きく見る</span>
          </span>
        </div>

        {/* キャプション＆出典 */}
        <div className="mt-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[12px] font-extrabold text-[#1E221F] leading-snug mb-0.5">
              {activeDoc.title}
            </p>
            <p className="text-[10.5px] font-medium text-[#5C615D] leading-snug">
              {activeDoc.source}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}

// ライトテーマ用ミニSVGグラフ（ネガティブ数値「-89.6億円」等のみ赤系で強調）
function GaugeVisualChart({ chartType }: { chartType: string }) {
  if (chartType === 'fixedCostBar') {
    return (
      <div className="my-2.5 bg-white border border-[#E6E1D3] rounded-2xl p-3">
        <div className="flex justify-between text-[10.5px] font-extrabold mb-1.5">
          <span className="text-[#C83E31]">動かせない固定費（福祉等） 95.0%</span>
          <span className="text-[#2E7D5B]">自由な余力 5%</span>
        </div>
        <div className="w-full h-3.5 bg-[#EAE5D7] rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-[#E6A817] via-[#DF6C32] to-[#C83E31]"
            style={{ width: '95%' }}
          />
          <div className="h-full bg-[#2E7D5B]" style={{ width: '5%' }} />
        </div>
        <div className="flex justify-between text-[9.5px] font-mono text-[#6B706C] mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>95%</span>
          <span>100%</span>
        </div>
      </div>
    );
  }

  if (chartType === 'gapBar') {
    return (
      <div className="my-2.5 bg-white border border-[#E6E1D3] rounded-2xl p-3">
        <svg
          viewBox="0 0 300 96"
          className="w-full h-24 overflow-visible"
          aria-label="現在と10年後の収支イメージ比較"
        >
          <line
            x1="16"
            y1="36"
            x2="284"
            y2="36"
            stroke="#D6D0BE"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          <text x="16" y="32" fill="#6B706C" fontSize="9" fontWeight="bold">
            収支トントン（0円）
          </text>

          <rect x="70" y="18" width="54" height="18" rx="4" fill="#2E7D5B" />
          <text
            x="97"
            y="12"
            textAnchor="middle"
            fill="#236247"
            fontSize="10"
            fontWeight="bold"
          >
            +22.5億円
          </text>
          <text
            x="97"
            y="50"
            textAnchor="middle"
            fill="#474C48"
            fontSize="9"
            fontWeight="bold"
          >
            いま（R7決算）
          </text>

          <rect x="184" y="36" width="54" height="44" rx="4" fill="#C83E31" />
          <text
            x="211"
            y="92"
            textAnchor="middle"
            fill="#B32D22"
            fontSize="10.5"
            fontWeight="bold"
          >
            -89.6億円
          </text>
          <text
            x="211"
            y="28"
            textAnchor="middle"
            fill="#474C48"
            fontSize="9"
            fontWeight="bold"
          >
            10年後（試算）
          </text>

          <path
            d="M134 28 L174 52"
            stroke="#C83E31"
            strokeWidth="2"
            strokeDasharray="3 2"
            fill="none"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="my-2.5 bg-white border border-[#E6E1D3] rounded-2xl p-3">
      <div className="w-full h-3.5 bg-[#EAE5D7] rounded-full overflow-hidden flex mb-2">
        <div
          className="h-full bg-[#F2B705]"
          style={{ width: '51%' }}
          title="新庁舎 129.2億"
        />
        <div
          className="h-full bg-[#2E7D5B] border-l border-white"
          style={{ width: '30%' }}
          title="西武中 76.8億"
        />
        <div
          className="h-full bg-[#5F9EA0] border-l border-white"
          style={{ width: '19%' }}
          title="給食 49.4億"
        />
      </div>
      <div className="grid grid-cols-3 gap-1 text-[10px] font-bold">
        <div className="flex items-center gap-1 text-[#8A5A00]">
          <span className="w-2 h-2 rounded-full bg-[#F2B705] shrink-0" />
          <span className="truncate">庁舎 129億</span>
        </div>
        <div className="flex items-center gap-1 text-[#236247]">
          <span className="w-2 h-2 rounded-full bg-[#2E7D5B] shrink-0" />
          <span className="truncate">西武中 77億</span>
        </div>
        <div className="flex items-center gap-1 text-[#2E5D60]">
          <span className="w-2 h-2 rounded-full bg-[#5F9EA0] shrink-0" />
          <span className="truncate">給食 49億</span>
        </div>
      </div>
    </div>
  );
}

const ZOOM_LEVELS = [1, 1.8, 2.6] as const;
type ZoomLevel = (typeof ZOOM_LEVELS)[number];

// 1枚ずつ大きく見られる全画面ライトボックスモーダル（PortalでBottomNavより最前面描画）
function DocumentLightboxModal({
  lightbox,
  onChangeIndex,
  onClose,
}: {
  lightbox: LightboxState | null;
  onChangeIndex: (newIndex: number) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const zoomLevel: ZoomLevel = ZOOM_LEVELS[zoomIndex] || 1;
  const currentDoc = lightbox
    ? lightbox.docs[lightbox.index] || lightbox.docs[0]
    : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setZoomIndex(0);
    setShowInfo(false);
  }, [lightbox?.index, currentDoc?.image]);

  useEffect(() => {
    if (!lightbox) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && lightbox.docs.length > 1) {
        onChangeIndex(
          (lightbox.index - 1 + lightbox.docs.length) % lightbox.docs.length
        );
      } else if (e.key === 'ArrowRight' && lightbox.docs.length > 1) {
        onChangeIndex((lightbox.index + 1) % lightbox.docs.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightbox, onChangeIndex, onClose]);

  if (!mounted || !lightbox || !currentDoc) return null;

  const hasMultiple = lightbox.docs.length > 1;
  const isPortrait = currentDoc.orientation === 'portrait';

  // 画像タップで 100% → 180% → 260% → 100% へ順送り
  const cycleZoom = () => {
    setZoomIndex((prev) => (prev + 1) % ZOOM_LEVELS.length);
  };

  // 倍率に応じた画像サイズクラス（m-auto + shrink-0 により上下左右中央揃え＆全方向スクロール）
  const getImageContainerClass = () => {
    if (zoomLevel === 1.8) {
      return 'm-auto shrink-0 w-[180vw] sm:w-[min(150vw,1600px)] max-w-none bg-white rounded-lg p-1 shadow-2xl';
    }
    if (zoomLevel === 2.6) {
      return 'm-auto shrink-0 w-[260vw] sm:w-[min(220vw,2200px)] max-w-none bg-white rounded-lg p-1 shadow-2xl';
    }
    return isPortrait
      ? 'm-auto shrink-0 w-[96vw] sm:w-[88vw] max-w-[920px] bg-white rounded-xl p-1 shadow-2xl'
      : 'm-auto shrink-0 w-[98vw] sm:w-[92vw] max-w-[1280px] bg-white rounded-xl p-1 shadow-2xl';
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] h-[100dvh] w-screen bg-black/95 flex flex-col overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label={currentDoc.title}
      onClick={onClose}
    >
      {/* 上部バー（極小化して画像領域を最大化） */}
      <div
        className="shrink-0 px-3 pt-2.5 pb-1.5 flex items-center justify-between gap-2 bg-black/70 border-b border-white/10 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8FE0B8] mb-0.5">
            <span>📄 引用資料</span>
            {hasMultiple && (
              <span className="font-mono text-[#FFF0B3]">
                （{lightbox.index + 1}/{lightbox.docs.length}枚目）
              </span>
            )}
          </div>
          <h3 className="text-[11.5px] sm:text-xs font-black truncate">
            {currentDoc.title}
          </h3>
        </div>

        {/* ズーム段階操作 ＋ 閉じるボタン */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setZoomIndex((z) => Math.max(0, z - 1))}
            disabled={zoomIndex === 0}
            aria-label="縮小"
            className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-35 flex items-center justify-center transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={cycleZoom}
            className="px-2 py-1 rounded-full bg-white/15 hover:bg-white/25 text-[10.5px] font-mono font-bold min-w-[44px] text-center"
            title="タップで倍率切替"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            type="button"
            onClick={() =>
              setZoomIndex((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1))
            }
            disabled={zoomIndex === ZOOM_LEVELS.length - 1}
            aria-label="拡大"
            className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 disabled:opacity-35 flex items-center justify-center transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="閉じる"
            className="ml-1 w-8 h-8 rounded-full bg-white text-[#1E221F] flex items-center justify-center font-bold hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 中央画像ステージ：常に上下左右中央（m-auto）＋ 拡大時は全方向スクロール */}
      <div
        className="flex-1 min-h-0 overflow-auto flex p-1.5 sm:p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          className={getImageContainerClass()}
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={currentDoc.image}
            alt={currentDoc.title}
            onClick={cycleZoom}
            className={`w-full h-auto rounded-md select-none ${
              zoomIndex < ZOOM_LEVELS.length - 1
                ? 'cursor-zoom-in'
                : 'cursor-zoom-out'
            } ${
              zoomLevel === 1 && !isPortrait
                ? 'max-h-[78dvh] object-contain mx-auto'
                : ''
            }`}
          />
        </div>
      </div>

      {/* 下部コントロール＆折りたたみ式解説ドロワー（BottomNavに絶対に隠れない最前面配置） */}
      <div
        className="shrink-0 bg-[#1A1E1B]/95 border-t border-white/15 text-white px-3 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        {showInfo && (
          <div className="mb-2.5 bg-white text-[#262A27] rounded-2xl p-3.5 max-h-[34dvh] overflow-y-auto shadow-xl">
            <p className="text-[10.5px] font-extrabold text-[#236247] mb-1">
              {currentDoc.source}
            </p>
            <p className="text-[12px] font-bold text-[#2E332F] leading-relaxed mb-2.5">
              {currentDoc.note}
            </p>
            {lightbox.linkUrl && lightbox.linkTitle && (
              <Link
                href={lightbox.linkUrl}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 bg-[#2E7D5B] hover:bg-[#236247] text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full transition-colors"
              >
                <span>{lightbox.linkTitle}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        )}

        <div className="max-w-3xl mx-auto flex items-center justify-between gap-1.5">
          {/* 左：複数資料の切替（または戻る余白） */}
          <div className="flex items-center gap-1">
            {hasMultiple ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    onChangeIndex(
                      (lightbox.index - 1 + lightbox.docs.length) %
                        lightbox.docs.length
                    )
                  }
                  className="inline-flex items-center gap-0.5 bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>前</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onChangeIndex((lightbox.index + 1) % lightbox.docs.length)
                  }
                  className="inline-flex items-center gap-0.5 bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full"
                >
                  <span>次</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <span className="text-[10.5px] text-white/70 font-medium pl-1">
                画像タップで拡大切替
              </span>
            )}
          </div>

          {/* 右：解説トグル ＋ 別タブ原寸表示 ＋ 閉じる */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowInfo((s) => !s)}
              className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1.5 rounded-full transition-colors ${
                showInfo
                  ? 'bg-[#FFF0B3] text-[#1E221F]'
                  : 'bg-white/15 hover:bg-white/25 text-white'
              }`}
            >
              <span>{showInfo ? '解説を閉じる' : '解説を見る'}</span>
              {showInfo ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronUp className="w-3.5 h-3.5" />
              )}
            </button>

            <a
              href={currentDoc.image}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-full"
              title="画像を別タブで開く"
            >
              <span>原寸</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="bg-white text-[#1E221F] hover:bg-slate-200 text-[11px] font-black px-3 py-1.5 rounded-full"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default function OverviewVisualClient({ data }: { data: VisualData }) {
  const [activeTabId, setActiveTabId] = useState<string>(
    data.tabs[0]?.id || 'tab-01'
  );
  const [openCards, setOpenCards] = useState<Record<string, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const activeTabIndex = Math.max(
    0,
    data.tabs.findIndex((t) => t.id === activeTabId)
  );
  const activeTab = data.tabs[activeTabIndex] || data.tabs[0];
  const nextTab = data.tabs[(activeTabIndex + 1) % data.tabs.length];

  const toggleCard = (key: string) => {
    setOpenCards((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectTab = (tabId: string) => {
    setActiveTabId(tabId);
    const anchor = document.getElementById('visual-tabs-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F2] pb-36 text-[#262A27] font-sans">
      {/* 最上部モード切替スイッチャー（実資料・図解版 ⇄ 文章版） */}
      <div className="sticky top-0 z-40 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E6E1D3] px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex bg-[#EAE5D7] p-0.5 rounded-full border border-[#DDD6C3] w-full max-w-xl mx-auto">
          <span className="flex-1 text-center py-1.5 px-2 rounded-full bg-[#2E7D5B] text-white text-[11px] font-black shadow-2xs">
            📄 実資料とQ&Aで見る
          </span>
          <Link
            href="/overview"
            className="flex-1 text-center py-1.5 px-2 rounded-full text-[#4C524D] hover:text-[#1E221F] text-[11px] font-bold transition-colors"
          >
            📖 文章でじっくり読む
          </Link>
        </div>
      </div>

      {/* 非公式データベース明示バー（入間市公式サイトとの誤認防止） */}
      <div className="bg-[#EFECE2] border-b border-[#DFD8C4] px-3.5 py-2">
        <p className="max-w-2xl mx-auto text-center text-[11px] font-extrabold text-[#474C48] flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#2E7D5B] shrink-0" />
          <span>{data.hero.unofficialNotice}</span>
        </p>
      </div>

      {/* Section 01: トップ（入間市シルエット地図 × 4現場ピンバナー ＋ リード文） */}
      <section className="px-3.5 pt-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#E6E1D3] shadow-xs overflow-hidden">
          <IrumaMapHeroBanner
            activeTabId={activeTab.id}
            onSelectTab={handleSelectTab}
          />

          <div className="p-5 sm:p-6">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold bg-[#FFF8E1] text-[#8A5A00] border border-[#F2DC96] px-2.5 py-0.5 rounded-full mb-2.5">
              <MapPin className="w-3 h-3" />
              {data.hero.badge}
            </span>

            <h1 className="text-[22px] sm:text-[26px] font-black leading-[1.35] tracking-tight text-[#1E221F] mb-2.5">
              <span className="block">{data.hero.titleLead}</span>
              <span className="inline bg-[#FFF0B3] px-1.5 py-0.5 rounded-md">
                {data.hero.titleHighlight}
              </span>
              <span>{data.hero.titleEnd}</span>
            </h1>

            <p className="text-[13px] text-[#454A46] font-medium leading-relaxed mb-4">
              {data.hero.subtitle}
            </p>

            {/* テーマ地名タグ */}
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {data.hero.localLandmarks.map((spot) => (
                <span
                  key={spot}
                  className="text-[10.5px] font-bold bg-[#FAF8F2] text-[#3B403C] border border-[#DFD8C4] px-2.5 py-0.5 rounded-full"
                >
                  📍 {spot}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#666B67]">
              <Clock className="w-3.5 h-3.5 text-[#2E7D5B]" />
              <span>情報公開請求資料25ページ分＋最新議会反映（2026年11月更新）</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: 数字で見る入間市の家計（明るいアイボリー＆白カード計器盤＋1枚切替資料デッキ） */}
      <section className="px-3.5 pt-5 max-w-2xl mx-auto">
        <div className="bg-white border border-[#E6E1D3] rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <div>
              <span className="text-[11px] font-extrabold text-[#2E7D5B] block mb-0.5">
                💰 まずは基本の3つの数字から
              </span>
              <h2 className="text-base sm:text-lg font-black text-[#1E221F]">
                数字と1人あたり換算で見る「入間市の家計」
              </h2>
            </div>
            <Link
              href="/budget/trends"
              className="text-[11px] font-extrabold text-[#2E7D5B] hover:underline flex items-center gap-0.5 shrink-0 bg-[#EEF5F0] px-2.5 py-1 rounded-full"
            >
              <span>詳細グラフ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3.5 mb-4">
            {data.gauges.map((g) => {
              const isNegativeAlert = g.statusTone === 'rose';
              return (
                <div
                  key={g.id}
                  className="bg-[#FAF8F2] border border-[#E6E1D3] rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11.5px] font-extrabold text-[#3B403C]">
                      {g.title}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        STATUS_TONES[g.statusTone] || STATUS_TONES.amber
                      }`}
                    >
                      {g.status}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span
                      className={`text-2xl font-mono font-black tracking-tight ${
                        isNegativeAlert ? 'text-[#C83E31]' : 'text-[#1E221F]'
                      }`}
                    >
                      {g.mainNumber}
                    </span>
                    <span className="text-[11.5px] font-bold text-[#5C615D]">
                      {g.subNumber}
                    </span>
                  </div>

                  <GaugeVisualChart chartType={g.chartType} />

                  <CitizenMemoNote note={g.citizenNote} />

                  <p className="text-[11.5px] text-[#4C524D] font-medium leading-snug">
                    {g.oneLiner}
                  </p>
                </div>
              );
            })}
          </div>

          {/* 証拠となる市作成資料の1枚ずつ切替デッキ */}
          <DocumentDeck
            docs={data.gaugeDocs}
            failedImages={failedImages}
            onImageError={(src) =>
              setFailedImages((prev) => ({ ...prev, [src]: true }))
            }
            onOpenLightbox={(index) =>
              setLightbox({
                docs: data.gaugeDocs,
                index,
                linkUrl: '/budget',
                linkTitle: '市の予算・決算データへ',
              })
            }
          />
        </div>
      </section>

      {/* やさしい導入ブリッジ */}
      <section className="px-3.5 pt-5 max-w-2xl mx-auto">
        <div className="bg-[#EEF5F0] border border-[#CDE0D4] rounded-2xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2E7D5B] text-white flex items-center justify-center shrink-0 mt-0.5">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <p className="text-[12px] font-bold text-[#234737] leading-relaxed">
            下の4つのタブから気になるテーマを選ぶと、いま市議会で議論されている項目が3つずつ表示されます。資料画像はタブで1枚ずつ切り替え、タップして大きく読めます。
          </p>
        </div>
      </section>

      {/* Section 03: Sticky 4タブ切り替え（段階的開示・選択中タブの3カードのみ表示） */}
      <section id="visual-tabs-anchor" className="scroll-mt-14 pt-5">
        <div className="px-3.5 max-w-2xl mx-auto mb-2">
          <span className="text-[11px] font-extrabold text-[#2E7D5B] block">
            📌 テーマを選んで切り替え（全12トピック・3件ずつ表示）
          </span>
          <h2 className="text-lg font-black text-[#1E221F]">
            いま入間市で起きている4つの論点
          </h2>
        </div>

        {/* Sticky タブセレクター */}
        <div className="sticky top-[48px] z-30 bg-[#FAF8F2]/95 backdrop-blur-md border-y border-[#E6E1D3] py-2.5 px-3.5">
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-2">
            {data.tabs.map((tab) => {
              const isSelected = tab.id === activeTab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectTab(tab.id)}
                  className={`py-2 px-3 rounded-xl text-[12px] font-extrabold border text-left transition-all active:scale-[0.98] ${
                    isSelected
                      ? 'bg-[#2E7D5B] text-white border-[#2E7D5B] shadow-xs'
                      : 'bg-white text-[#3B403C] border-[#DFD8C4] hover:border-[#2E7D5B]/60'
                  }`}
                >
                  {tab.shortLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* 選択中タブの3カード */}
        <div className="px-3.5 pt-4 max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {/* タブ要約ヘッド */}
              <div className="bg-white rounded-2xl border border-[#E6E1D3] p-4 mb-4 shadow-2xs">
                <span className="inline-block text-[10.5px] font-extrabold bg-[#EEF5F0] text-[#236247] px-2.5 py-0.5 rounded-full mb-1.5">
                  {activeTab.shortLabel}
                </span>
                <h3 className="text-[17px] font-black text-[#1E221F] leading-snug mb-1">
                  {activeTab.title}
                </h3>
                <p className="text-[12px] font-medium text-[#4C524D] leading-relaxed">
                  {activeTab.summary}
                </p>
              </div>

              {/* 3枚のQ&Aカード */}
              <div className="flex flex-col gap-4">
                {activeTab.cards.map((card, idx) => {
                  const cardKey = `${activeTab.id}-${idx}`;
                  const isOpen = !!openCards[cardKey];

                  return (
                    <article
                      key={cardKey}
                      className="bg-white rounded-3xl border border-[#E6E1D3] shadow-xs overflow-hidden"
                    >
                      <div className="p-4 sm:p-5">
                        {/* ラベル行 */}
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                          <span className="text-[11px] font-extrabold text-[#236247] bg-[#EEF5F0] px-2.5 py-0.5 rounded-full">
                            {card.targetTag}
                          </span>
                          <span className="text-[10.5px] font-extrabold text-[#8A5A00] bg-[#FFF8E1] border border-[#F2DC96] px-2.5 py-0.5 rounded-full">
                            {card.highlightBadge}
                          </span>
                        </div>

                        {/* 市民の率直な疑問文 */}
                        <h4 className="text-[16px] sm:text-[17px] font-black text-[#1E221F] leading-snug mb-2">
                          {card.title}
                        </h4>

                        {/* 1行結論アンサー */}
                        <p className="text-[13px] font-bold text-[#373D38] leading-relaxed mb-3 bg-[#F6F4EC] rounded-xl px-3.5 py-2.5">
                          {card.quickAnswer}
                        </p>

                        {/* キー数値ハイライト */}
                        <div className="flex items-center justify-between gap-2 bg-[#EEF5F0] border border-[#CDE0D4] rounded-xl px-3.5 py-2 mb-1">
                          <span className="text-[11px] font-extrabold text-[#236247]">
                            注目ポイント
                          </span>
                          <span className="text-base sm:text-lg font-mono font-black text-[#1E4735]">
                            {card.highlightNumber}
                          </span>
                        </div>

                        {/* 市民1人あたり換算メモ */}
                        <CitizenMemoNote note={card.citizenNote} />

                        {/* 1枚ずつ大きく表示＋切替できる実資料デッキ */}
                        <div className="mb-3.5">
                          <DocumentDeck
                            docs={card.docs}
                            failedImages={failedImages}
                            onImageError={(src) =>
                              setFailedImages((prev) => ({
                                ...prev,
                                [src]: true,
                              }))
                            }
                            onOpenLightbox={(docIndex) =>
                              setLightbox({
                                docs: card.docs,
                                index: docIndex,
                                linkUrl: card.link.url,
                                linkTitle: card.link.title,
                              })
                            }
                          />
                        </div>

                        {/* 段階的開示トグル */}
                        <button
                          type="button"
                          onClick={() => toggleCard(cardKey)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between bg-[#FAF8F2] hover:bg-[#EFECE2] border border-[#E6E1D3] text-[#262A27] font-extrabold text-[11.5px] px-3.5 py-2.5 rounded-xl transition-colors"
                        >
                          <span>
                            {isOpen
                              ? '▲ 閉じる'
                              : '＋ これまでとの比較・市の説明・議会の論点を見る'}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      </div>

                      {/* 展開エリア */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden border-t border-[#E6E1D3] bg-[#FAF8F2]"
                          >
                            <div className="p-4 space-y-3">
                              {/* 左右比較 */}
                              <div className="grid grid-cols-2 gap-2 items-stretch">
                                <div className="bg-white border border-[#E6E1D3] rounded-xl p-2.5 flex flex-col justify-center">
                                  <span className="text-[10px] font-extrabold text-[#6B706C] mb-0.5">
                                    これまで
                                  </span>
                                  <p className="text-[11.5px] font-bold text-[#4C524D] leading-snug whitespace-pre-line">
                                    {card.vsBefore}
                                  </p>
                                </div>
                                <div className="bg-[#EEF5F0] border border-[#C5DEC9] rounded-xl p-2.5 flex flex-col justify-center">
                                  <span className="text-[10px] font-extrabold text-[#236247] mb-0.5">
                                    いま・今後
                                  </span>
                                  <p className="text-[11.5px] font-black text-[#1E3B2E] leading-snug whitespace-pre-line">
                                    {card.vsNow}
                                  </p>
                                </div>
                              </div>

                              {/* 市の説明 */}
                              <div className="bg-white border border-[#E6E1D3] border-l-4 border-l-[#2E7D5B] rounded-xl p-3">
                                <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-[#236247] mb-1">
                                  <Building2 className="w-3.5 h-3.5" />
                                  <span>市の説明・前進している点</span>
                                </div>
                                <p className="text-[12px] text-[#373D38] leading-relaxed">
                                  {card.proPoint}
                                </p>
                              </div>

                              {/* 議会の論点 */}
                              <div className="bg-white border border-[#E6E1D3] border-l-4 border-l-[#F2B705] rounded-xl p-3">
                                <div className="flex items-center gap-1.5 text-[10.5px] font-extrabold text-[#8A5A00] mb-1">
                                  <Search className="w-3.5 h-3.5" />
                                  <span>議会の論点・課題</span>
                                </div>
                                <p className="text-[12px] text-[#373D38] leading-relaxed">
                                  {card.issuePoint}
                                </p>
                              </div>

                              <Link
                                href={card.link.url}
                                className="flex items-center justify-between bg-[#2E7D5B] hover:bg-[#236247] text-white px-4 py-3 rounded-xl text-xs font-extrabold shadow-xs transition-all active:scale-[0.98]"
                              >
                                <span className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 shrink-0 text-[#FFF0B3]" />
                                  <span>{card.link.title}</span>
                                </span>
                                <ArrowRight className="w-4 h-4 shrink-0 text-[#FFF0B3]" />
                              </Link>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </article>
                  );
                })}
              </div>

              {/* 次のタブ送りボタン */}
              <button
                type="button"
                onClick={() => handleSelectTab(nextTab.id)}
                className="mt-5 w-full flex items-center justify-between bg-[#F2B705] hover:bg-[#E0A800] text-[#1E221F] rounded-2xl px-4 py-3.5 text-xs font-black shadow-xs transition-all active:scale-[0.98]"
              >
                <span>次のテーマを見る：{nextTab.shortLabel}</span>
                <ArrowRight className="w-4 h-4 text-[#1E221F]" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Section 04: さらに詳しく確認する（ライトテーマ統一） */}
      <section className="px-3.5 mt-10 max-w-2xl mx-auto">
        <div className="bg-white border border-[#E6E1D3] rounded-3xl p-5 shadow-xs mb-4">
          <span className="text-[11px] font-extrabold text-[#2E7D5B] block mb-1">
            🔎 さらに詳しく調べる
          </span>
          <h2 className="text-base font-black text-[#1E221F] leading-snug mb-3.5">
            一次資料の事実をもとに、気になる論点を深掘りする
          </h2>

          <div className="flex flex-col gap-2.5">
            <Link
              href="/overview"
              className="flex items-center justify-between bg-[#2E7D5B] hover:bg-[#236247] text-white rounded-xl p-3.5 font-extrabold text-xs transition-all active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 shrink-0 text-[#FFF0B3]" />
                <span>📖 文章でじっくり読む（詳細レポート版）へ</span>
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>

            <Link
              href="/proposals"
              className="flex items-center justify-between bg-[#FFF8E1] hover:bg-[#FFF0C2] text-[#1E221F] border border-[#F2DC96] rounded-xl p-3 font-black text-xs transition-all active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C68900] shrink-0" />
                <span>みんなの「一般質問」アイデアボード</span>
              </span>
              <ArrowRight className="w-4 h-4 text-[#8A5A00] shrink-0" />
            </Link>

            <Link
              href="/budget"
              className="flex items-center justify-between bg-[#FAF8F2] hover:bg-[#EFECE2] border border-[#E6E1D3] text-[#262A27] rounded-xl p-3 font-extrabold text-xs transition-all active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#2E7D5B] shrink-0" />
                <span>市の家計簿（予算・決算・推移グラフ）</span>
              </span>
              <ArrowRight className="w-4 h-4 text-[#6B706C] shrink-0" />
            </Link>

            <Link
              href="/report-cards"
              className="flex items-center justify-between bg-[#FAF8F2] hover:bg-[#EFECE2] border border-[#E6E1D3] text-[#262A27] rounded-xl p-3 font-extrabold text-xs transition-all active:scale-[0.98]"
            >
              <span className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#2E7D5B] shrink-0" />
                <span>議員23人の通信簿（公約進捗・質問実績）</span>
              </span>
              <ArrowRight className="w-4 h-4 text-[#6B706C] shrink-0" />
            </Link>
          </div>
        </div>

        {/* その他の個別課題リンク */}
        <div className="bg-white border border-[#E6E1D3] rounded-2xl p-4 mb-4 shadow-2xs">
          <h3 className="text-[11px] font-extrabold text-[#6B706C] mb-2">
            その他の個別議論・アーカイブ
          </h3>
          <div className="flex flex-col divide-y divide-[#F0ECE1]">
            {data.otherTopics.map((topic) => (
              <Link
                key={topic.url}
                href={topic.url}
                className="py-2.5 flex items-center justify-between gap-2 text-xs font-bold text-[#373D38] hover:text-[#2E7D5B]"
              >
                <span>{topic.title}</span>
                <ChevronRight className="w-4 h-4 text-[#999E9A] shrink-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* アバウト導線 */}
        <Link
          href="/about"
          className="block border border-[#2E7D5B]/40 bg-white hover:bg-[#EEF5F0] text-[#1E221F] rounded-2xl p-4 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10.5px] font-extrabold text-[#2E7D5B] block mb-0.5">
                このサイトについて
              </span>
              <span className="text-sm font-black flex items-center gap-1.5">
                <Info className="w-4 h-4 text-[#2E7D5B] shrink-0" />
                <span>いるまオープン議会とは（制作意義・免責事項）</span>
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#2E7D5B] shrink-0" />
          </div>
        </Link>

        <div className="mt-8 text-center">
          <p className="text-[10.5px] text-[#6B706C] font-bold">
            © open-iruma
          </p>
          <p className="text-[10px] text-[#7D827E] mt-1">
            ※本サイトは市民有志による非公式データベースであり、入間市の公式サイトではありません
          </p>
        </div>
      </section>

      {/* 1枚ずつ大きく見られる全画面ライトボックスモーダル */}
      <DocumentLightboxModal
        lightbox={lightbox}
        onChangeIndex={(newIndex) =>
          setLightbox((prev) => (prev ? { ...prev, index: newIndex } : null))
        }
        onClose={() => setLightbox(null)}
      />
    </main>
  );
}
