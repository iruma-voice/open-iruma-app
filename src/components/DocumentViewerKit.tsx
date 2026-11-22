'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

export interface DocItem {
  image: string;
  shortTitle: string;
  title: string;
  source: string;
  note: string;
  orientation: 'landscape' | 'portrait' | string;
}

export interface LightboxState {
  docs: DocItem[];
  index: number;
  linkUrl?: string;
  linkTitle?: string;
}

const ZOOM_LEVELS = [1, 1.8, 2.6] as const;
type ZoomLevel = (typeof ZOOM_LEVELS)[number];

// 単一資料フレームの共通描画ヘルパー（DocumentDeck / SingleDocPreview 共通）
function DocumentImageSurface({
  doc,
  isFailed,
  compact,
  onImageError,
  onOpen,
}: {
  doc: DocItem;
  isFailed: boolean;
  compact?: boolean;
  onImageError: (src: string) => void;
  onOpen: () => void;
}) {
  if (isFailed) return null;

  const isPortrait = doc.orientation === 'portrait';

  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full text-left block group"
    >
      <div
        className={`relative w-full rounded-xl overflow-hidden border border-[#CFC7B2] bg-white ${
          isPortrait
            ? compact
              ? 'aspect-[16/9]'
              : 'aspect-[16/10]'
            : 'aspect-video'
        }`}
      >
        <img
          src={doc.image}
          alt={doc.title}
          className={
            isPortrait
              ? 'w-full h-full object-cover object-top group-hover:scale-[1.01] transition-transform duration-200'
              : 'w-full h-full object-contain bg-white group-hover:scale-[1.01] transition-transform duration-200'
          }
          onError={() => onImageError(doc.image)}
        />

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

      <div className="mt-2 min-w-0">
        <p className="text-[12px] font-extrabold text-[#1E221F] leading-snug mb-0.5">
          {doc.title}
        </p>
        <p className="text-[10.5px] font-medium text-[#5C615D] leading-snug">
          {doc.source}
        </p>
      </div>
    </button>
  );
}

// /overview（全論点・全資料版）向け：複数資料を1枚ずつ切り替えて見られるデッキ
export function DocumentDeck({
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
  const hasMultiple = docs.length > 1;

  if (failedImages[activeDoc.image]) return null;

  return (
    <div className="bg-[#FAF8F2] border border-[#DDD6C3] rounded-2xl p-3">
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

      <DocumentImageSurface
        doc={activeDoc}
        isFailed={!!failedImages[activeDoc.image]}
        onImageError={onImageError}
        onOpen={() => onOpenLightbox(safeIndex)}
      />
    </div>
  );
}

// /overview/visual（LP）向け：厳選1枚だけをスッキリ表示する資料カード
export function SingleDocPreview({
  doc,
  isFailed,
  onImageError,
  onOpenLightbox,
}: {
  doc: DocItem;
  isFailed: boolean;
  onImageError: (src: string) => void;
  onOpenLightbox: () => void;
}) {
  if (!doc || isFailed) return null;

  return (
    <div className="bg-[#FAF8F2] border border-[#DDD6C3] rounded-2xl p-3">
      <div className="mb-2">
        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-[#236247] bg-[#E3F0E7] px-2.5 py-0.5 rounded-full">
          📄 開示資料（引用）
        </span>
      </div>
      <DocumentImageSurface
        doc={doc}
        isFailed={isFailed}
        compact
        onImageError={onImageError}
        onOpen={onOpenLightbox}
      />
    </div>
  );
}

// 全画面ライトボックスモーダル（PortalでBottomNavより最前面描画・中央表示・3段階ズーム対応）
export function DocumentLightboxModal({
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

  const cycleZoom = () => {
    setZoomIndex((prev) => (prev + 1) % ZOOM_LEVELS.length);
  };

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
      {/* 上部バー */}
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

      {/* 中央画像ステージ */}
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

      {/* 下部コントロール＆解説ドロワー */}
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
