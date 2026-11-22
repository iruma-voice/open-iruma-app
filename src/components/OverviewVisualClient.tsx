'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import IrumaMapHeroBanner from './IrumaMapHeroBanner';
import {
  DocItem,
  DocumentLightboxModal,
  LightboxState,
  SingleDocPreview,
} from './DocumentViewerKit';
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  FileText,
  HelpCircle,
  Info,
  MessageSquare,
  ShieldAlert,
  Users,
  Wallet,
} from 'lucide-react';

interface VisualLpData {
  hero: {
    unofficialNotice: string;
    badge: string;
    titleLead: string;
    titleHighlight: string;
    titleEnd: string;
    subtitle: string;
  };
  empathy: string[];
  macroSummary: {
    title: string;
    lead: string;
    items: {
      label: string;
      value: string;
      note: string;
      tone: string;
    }[];
    doc: DocItem;
  };
  highlights: {
    id: string;
    tag: string;
    badge: string;
    title: string;
    answer: string;
    highlightNumber: string;
    citizenNote: string;
    doc: DocItem;
    links: {
      title: string;
      url: string;
    }[];
  }[];
  moreTopics: {
    id: string;
    tag: string;
    title: string;
    answer: string;
    doc: DocItem;
    link: {
      title: string;
      url: string;
    };
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

const MACRO_VALUE_STYLES: Record<string, string> = {
  emerald: 'text-[#236247]',
  amber: 'text-[#8A5A00]',
  rose: 'text-[#C83E31]',
};

const MAP_TAB_TARGETS: Record<string, { targetId: string; openTopicId?: string }> = {
  'tab-01': { targetId: 'lp-highlight-hall' },
  'tab-02': { targetId: 'lp-highlight-kids' },
  'tab-03': { targetId: 'lp-topic-station', openTopicId: 'lp-topic-station' },
  'tab-04': { targetId: 'lp-highlight-water' },
};

export default function OverviewVisualClient({ data }: { data: VisualLpData }) {
  const [selectedMapTab, setSelectedMapTab] = useState<string>('tab-04');
  const [openTopicIds, setOpenTopicIds] = useState<Record<string, boolean>>({});
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const handleImageError = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }));
  };

  const handleMapSelect = (tabId: string) => {
    setSelectedMapTab(tabId);
    const dest = MAP_TAB_TARGETS[tabId];
    if (!dest) return;

    if (dest.openTopicId) {
      setOpenTopicIds((prev) => ({ ...prev, [dest.openTopicId!]: true }));
    }

    // 展開アニメーション後に確実に位置を合わせる
    setTimeout(() => {
      const el = document.getElementById(dest.targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const toggleTopic = (id: string) => {
    setOpenTopicIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <main className="min-h-screen bg-[#FAF8F2] pb-36 text-[#262A27] font-sans">
      {/* 最上部モード切替スイッチャー（要点まとめLP ⇄ 全論点・全資料版） */}
      <div className="sticky top-0 z-40 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E6E1D3] px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex bg-[#EAE5D7] p-0.5 rounded-full border border-[#DDD6C3] w-full max-w-xl mx-auto">
          <span className="flex-1 text-center py-1.5 px-2 rounded-full bg-[#2E7D5B] text-white text-[11px] font-black shadow-2xs">
            📄 要点まとめ版
          </span>
          <Link
            href="/overview"
            className="flex-1 text-center py-1.5 px-2 rounded-full text-[#4C524D] hover:text-[#1E221F] text-[11px] font-bold transition-colors"
          >
            📖 全論点・全資料版
          </Link>
        </div>
      </div>

      {/* 非公式データベース明示バー */}
      <div className="bg-[#EFECE2] border-b border-[#DFD8C4] px-3.5 py-2">
        <p className="max-w-2xl mx-auto text-center text-[11px] font-extrabold text-[#474C48] flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#2E7D5B] shrink-0" />
          <span>{data.hero.unofficialNotice}</span>
        </p>
      </div>

      {/* Block 1: Attention（ファーストビュー：入間市地図バナー ＋ 短い当事者フック） */}
      <section className="px-3.5 pt-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#E6E1D3] shadow-xs overflow-hidden">
          <IrumaMapHeroBanner
            activeTabId={selectedMapTab}
            onSelectTab={handleMapSelect}
          />

          <div className="p-5 sm:p-6">
            <span className="inline-block text-[10.5px] font-extrabold bg-[#FFF8E1] text-[#8A5A00] border border-[#F2DC96] px-2.5 py-0.5 rounded-full mb-2.5">
              {data.hero.badge}
            </span>

            <h1 className="text-[22px] sm:text-[26px] font-black leading-[1.35] tracking-tight text-[#1E221F] mb-2.5">
              <span className="block">{data.hero.titleLead}</span>
              <span className="inline bg-[#FFF0B3] px-1.5 py-0.5 rounded-md">
                {data.hero.titleHighlight}
              </span>
              <span>{data.hero.titleEnd}</span>
            </h1>

            <p className="text-[13px] text-[#454A46] font-medium leading-relaxed">
              {data.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Block 2: Empathy（忙しい真ん中世代の3つのモヤモヤ） */}
      <section className="px-3.5 pt-5 max-w-2xl mx-auto">
        <div className="bg-white border border-[#E6E1D3] rounded-3xl p-4 sm:p-5 shadow-2xs">
          <p className="text-[11px] font-extrabold text-[#2E7D5B] mb-2.5">
            💬 こんな疑問を感じていませんか？
          </p>
          <ul className="space-y-2">
            {data.empathy.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 bg-[#FAF8F2] border border-[#E6E1D3] rounded-2xl px-3.5 py-2.5 text-[12.5px] font-bold text-[#2E332F] leading-snug"
              >
                <span className="w-5 h-5 rounded-full bg-[#2E7D5B] text-white text-[10.5px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Block 3: Interest（たった1枚の数字パネル ＋ グラフボタン） */}
      <section className="px-3.5 pt-5 max-w-2xl mx-auto">
        <div className="bg-white border border-[#E6E1D3] rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="mb-3.5">
            <span className="text-[11px] font-extrabold text-[#2E7D5B] block mb-0.5">
              💰 まず知っておきたい3つの数字
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#1E221F] mb-1">
              {data.macroSummary.title}
            </h2>
            <p className="text-[12.5px] text-[#4C524D] font-medium leading-relaxed">
              {data.macroSummary.lead}
            </p>
          </div>

          {/* 3行コンパクトサマリー */}
          <div className="flex flex-col gap-2.5 mb-3.5">
            {data.macroSummary.items.map((item) => (
              <div
                key={item.label}
                className="bg-[#FAF8F2] border border-[#E6E1D3] rounded-2xl px-3.5 py-3 flex flex-col gap-0.5"
              >
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold text-[#4C524D]">
                    {item.label}
                  </span>
                  <span
                    className={`text-lg sm:text-xl font-mono font-black ${
                      MACRO_VALUE_STYLES[item.tone] || 'text-[#1E221F]'
                    }`}
                  >
                    {item.value}
                  </span>
                </div>
                <p className="text-[11.5px] font-bold text-[#5C615D]">
                  {item.note}
                </p>
              </div>
            ))}
          </div>

          {/* 1枚だけの最強証拠資料 */}
          <div className="mb-3.5">
            <SingleDocPreview
              doc={data.macroSummary.doc}
              isFailed={!!failedImages[data.macroSummary.doc.image]}
              onImageError={handleImageError}
              onOpenLightbox={() =>
                setLightbox({
                  docs: [data.macroSummary.doc],
                  index: 0,
                  linkUrl: '/budget',
                  linkTitle: '市の予算・決算データへ',
                })
              }
            />
          </div>

          {/* 中間ボタン① */}
          <Link
            href="/budget/trends"
            className="flex items-center justify-between bg-[#EEF5F0] hover:bg-[#E1EDE5] border border-[#C5DEC9] text-[#236247] rounded-xl px-4 py-3 text-xs font-extrabold transition-colors"
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>8年間の予算・貯金・借金推移グラフを見る</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </section>

      {/* Block 4 (前半): Desire — 生活に直撃する厳選3選（常時表示） */}
      <section className="px-3.5 pt-7 max-w-2xl mx-auto">
        <div className="px-1 mb-3.5">
          <span className="text-[11px] font-extrabold text-[#2E7D5B] block mb-0.5">
            📌 暮らしに直撃する3つの変化
          </span>
          <h2 className="text-lg font-black text-[#1E221F] leading-snug">
            まずは押さえたい3大トピック
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {data.highlights.map((card) => (
            <article
              key={card.id}
              id={card.id}
              className="scroll-mt-16 bg-white rounded-3xl border border-[#E6E1D3] shadow-xs p-4 sm:p-5"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
                <span className="text-[11px] font-extrabold text-[#236247] bg-[#EEF5F0] px-2.5 py-0.5 rounded-full">
                  {card.tag}
                </span>
                <span className="text-[10.5px] font-extrabold text-[#8A5A00] bg-[#FFF8E1] border border-[#F2DC96] px-2.5 py-0.5 rounded-full">
                  {card.badge}
                </span>
              </div>

              <h3 className="text-[16px] sm:text-[17px] font-black text-[#1E221F] leading-snug mb-2">
                {card.title}
              </h3>

              <p className="text-[13px] font-bold text-[#373D38] leading-relaxed mb-3 bg-[#F6F4EC] rounded-xl px-3.5 py-2.5">
                {card.answer}
              </p>

              <div className="flex items-center justify-between gap-2 bg-[#EEF5F0] border border-[#CDE0D4] rounded-xl px-3.5 py-2 mb-3">
                <span className="text-[11px] font-extrabold text-[#236247]">
                  ポイント
                </span>
                <span className="text-sm sm:text-base font-mono font-black text-[#1E4735]">
                  {card.highlightNumber}
                </span>
              </div>

              <div className="mb-3 bg-[#FFFBEB] border border-[#EFE1A8] rounded-2xl px-3.5 py-2.5">
                <div className="inline-flex items-center gap-1.5 text-[10.5px] font-extrabold text-[#8A5A00] mb-1">
                  <Wallet className="w-3.5 h-3.5 shrink-0 text-[#C68900]" />
                  <Users className="w-3.5 h-3.5 shrink-0 text-[#C68900]" />
                  <span>暮らしへの影響メモ</span>
                </div>
                <p className="text-[12px] font-bold text-[#3D392B] leading-relaxed">
                  {card.citizenNote}
                </p>
              </div>

              {/* 厳選1枚だけの実資料 */}
              <div className="mb-3">
                <SingleDocPreview
                  doc={card.doc}
                  isFailed={!!failedImages[card.doc.image]}
                  onImageError={handleImageError}
                  onOpenLightbox={() =>
                    setLightbox({
                      docs: [card.doc],
                      index: 0,
                      linkUrl: card.links[0]?.url,
                      linkTitle: card.links[0]?.title,
                    })
                  }
                />
              </div>

              {/* 該当詳細記事ボタン */}
              <div className="flex flex-wrap gap-2">
                {card.links.map((link) => (
                  <Link
                    key={link.url}
                    href={link.url}
                    className="inline-flex items-center gap-1.5 bg-[#FAF8F2] hover:bg-[#EFECE2] border border-[#DFD8C4] text-[#262A27] text-[11.5px] font-extrabold px-3 py-2 rounded-xl transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#2E7D5B]" />
                    <span>{link.title}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#6B706C]" />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Block 4 (後半): 気になるテーマだけ開く1行アコーディオン一覧（9件） */}
      <section className="px-3.5 pt-7 max-w-2xl mx-auto">
        <div className="px-1 mb-3">
          <span className="text-[11px] font-extrabold text-[#2E7D5B] block mb-0.5">
            👆 タップしたテーマだけ実資料が開きます
          </span>
          <h2 className="text-lg font-black text-[#1E221F] leading-snug">
            ほかにも気になるテーマはありますか？
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {data.moreTopics.map((topic) => {
            const isOpen = !!openTopicIds[topic.id];
            return (
              <div
                key={topic.id}
                id={topic.id}
                className="scroll-mt-16 bg-white rounded-2xl border border-[#E6E1D3] shadow-2xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleTopic(topic.id)}
                  aria-expanded={isOpen}
                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-2.5 hover:bg-[#FAF8F2]/60 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <span className="inline-block text-[10px] font-extrabold text-[#236247] bg-[#EEF5F0] px-2 py-0.5 rounded-full mb-1">
                      {topic.tag}
                    </span>
                    <h3 className="text-[13.5px] sm:text-[14px] font-black text-[#1E221F] leading-snug">
                      {topic.title}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#2E7D5B] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-[#EFECE2] bg-[#FAF8F2]/60"
                    >
                      <div className="p-3.5 sm:p-4 space-y-3">
                        <p className="text-[12.5px] font-bold text-[#373D38] leading-relaxed bg-white border border-[#E6E1D3] rounded-xl px-3.5 py-2.5">
                          {topic.answer}
                        </p>

                        <SingleDocPreview
                          doc={topic.doc}
                          isFailed={!!failedImages[topic.doc.image]}
                          onImageError={handleImageError}
                          onOpenLightbox={() =>
                            setLightbox({
                              docs: [topic.doc],
                              index: 0,
                              linkUrl: topic.link.url,
                              linkTitle: topic.link.title,
                            })
                          }
                        />

                        <Link
                          href={topic.link.url}
                          className="flex items-center justify-between bg-[#2E7D5B] hover:bg-[#236247] text-white px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-[#FFF0B3]" />
                            <span>{topic.link.title}</span>
                          </span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* 中間ボタン②（優先先 /overview ＆ 議員チェック） */}
        <div className="mt-5 flex flex-col gap-2.5">
          <Link
            href="/overview"
            className="flex items-center justify-between bg-[#2E7D5B] hover:bg-[#236247] text-white rounded-2xl px-4 py-3.5 text-xs font-black shadow-xs transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 shrink-0 text-[#FFF0B3]" />
              <span>全12論点の詳しい解説と全25枚の開示資料を見る</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          <Link
            href="/report-cards"
            className="flex items-center justify-between bg-white hover:bg-[#FAF8F2] border border-[#DFD8C4] text-[#262A27] rounded-2xl px-4 py-3 text-xs font-extrabold transition-colors"
          >
            <span className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 shrink-0 text-[#2E7D5B]" />
              <span>議員23人の「通信簿」（公約・質問実績）を見る</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#6B706C] shrink-0" />
          </Link>
        </div>
      </section>

      {/* Block 5: 後半FAQ（サイトの中立性・情報源への疑問解消） */}
      <section className="px-3.5 pt-8 max-w-2xl mx-auto">
        <div className="px-1 mb-3">
          <span className="text-[11px] font-extrabold text-[#2E7D5B] block mb-0.5">
            ❔ よくあるご質問
          </span>
          <h2 className="text-base sm:text-lg font-black text-[#1E221F]">
            このページとデータの見方について
          </h2>
        </div>

        <div className="bg-white border border-[#E6E1D3] rounded-3xl divide-y divide-[#EFECE2] overflow-hidden shadow-2xs">
          {data.faqs.map((faq, idx) => {
            const isOpen = !!openFaqIndices[idx];
            return (
              <div key={idx}>
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className="w-full p-4 text-left flex items-center justify-between gap-2.5 hover:bg-[#FAF8F2]/60 transition-colors"
                >
                  <span className="flex items-start gap-2 text-[13px] font-extrabold text-[#1E221F] leading-snug">
                    <HelpCircle className="w-4 h-4 text-[#2E7D5B] shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B706C] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0.5 text-[12.5px] font-medium text-[#454A46] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Block 6: ボトムボタン群（過剰なCTA枠を廃し、シンプルなボタンのみ配置） */}
      <section className="px-3.5 pt-7 max-w-2xl mx-auto">
        <div className="flex flex-col gap-2.5">
          <Link
            href="/overview"
            className="flex items-center justify-between bg-[#2E7D5B] hover:bg-[#236247] text-white rounded-2xl p-4 font-black text-xs shadow-xs transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 shrink-0 text-[#FFF0B3]" />
              <span>📖 全12論点・全25枚の開示資料をじっくり読む</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <Link
              href="/report-cards"
              className="flex items-center justify-between bg-white hover:bg-[#FAF8F2] border border-[#E6E1D3] text-[#262A27] rounded-2xl px-4 py-3 font-extrabold text-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#2E7D5B] shrink-0" />
                <span>議員23人の通信簿</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#6B706C] shrink-0" />
            </Link>

            <Link
              href="/proposals"
              className="flex items-center justify-between bg-[#FFF8E1] hover:bg-[#FFF0C2] border border-[#F2DC96] text-[#1E221F] rounded-2xl px-4 py-3 font-extrabold text-xs transition-colors"
            >
              <span className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#C68900] shrink-0" />
                <span>みんなの一般質問ボード</span>
              </span>
              <ChevronRight className="w-4 h-4 text-[#8A5A00] shrink-0" />
            </Link>
          </div>

          <Link
            href="/about"
            className="flex items-center justify-between bg-white hover:bg-[#EEF5F0] border border-[#E6E1D3] text-[#373D38] rounded-2xl px-4 py-3 font-bold text-xs transition-colors"
          >
            <span className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#2E7D5B] shrink-0" />
              <span>いるまオープン議会とは（制作意義・免責事項）</span>
            </span>
            <ChevronRight className="w-4 h-4 text-[#6B706C] shrink-0" />
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-[10.5px] text-[#6B706C] font-bold">
            © open-iruma
          </p>
          <p className="text-[10px] text-[#7D827E] mt-1">
            ※本サイトは市民有志による非公式データベースであり、入間市の公式サイトではありません
          </p>
        </div>
      </section>

      {/* 全画面ライトボックスモーダル */}
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
