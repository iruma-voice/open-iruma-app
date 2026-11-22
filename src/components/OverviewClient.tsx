'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import IrumaTimelinePanoramaBanner from './IrumaTimelinePanoramaBanner';
import {
  DocItem,
  DocumentDeck,
  DocumentLightboxModal,
  LightboxState,
} from './DocumentViewerKit';
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  HeartHandshake,
  Info,
  MapPin,
  MessageSquare,
  ShieldAlert,
  Zap,
} from 'lucide-react';

// 入間市・狭山茶グリーン × アイボリー × マスタードの全面ライトテーマ定義
const METRIC_ACCENT_STYLES: Record<string, string> = {
  emerald: 'text-[#236247]',
  rose: 'text-[#C83E31]',
  amber: 'text-[#8A5A00]',
};

interface OverviewData {
  hero: {
    unofficialNotice: string;
    badge: string;
    titleLine1: string;
    titleHighlight: string;
    titleLine2: string;
    subtitle: string;
    updatedAt: string;
  };
  empathy: {
    number: string;
    tag: string;
    title: string;
    body: string;
  }[];
  financialShock: {
    sectionTag: string;
    sectionTitle: string;
    lead: string;
    metrics: {
      label: string;
      value: string;
      accent: string;
      subValue: string;
      description: string;
    }[];
    docs: DocItem[];
    ctas: {
      label: string;
      url: string;
      type: string;
    }[];
  };
  agendas: {
    id: string;
    number: string;
    code: string;
    shortLabel: string;
    color: string;
    title: string;
    question: string;
    conclusion: string;
    items: {
      topic: string;
      before: string;
      after: string;
      badge: string;
      detail: string;
      docs: DocItem[];
    }[];
    links: {
      title: string;
      sub: string;
      url: string;
      readTime: string;
    }[];
  }[];
  otherTopics: {
    title: string;
    url: string;
  }[];
}

export default function OverviewClient({ data }: { data: OverviewData }) {
  const [activeAgendaId, setActiveAgendaId] = useState<string>(
    data.agendas[0]?.id || 'agenda-01'
  );
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  const handleImageError = (src: string) => {
    setFailedImages((prev) => ({ ...prev, [src]: true }));
  };

  // スクロール位置に応じて固定タブのアクティブ項目を同期する
  useEffect(() => {
    const elements = data.agendas
      .map((a) => document.getElementById(a.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveAgendaId(visible[0].target.id);
        }
      },
      { rootMargin: '-135px 0px -50% 0px', threshold: 0.05 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [data.agendas]);

  const scrollToSection = (id: string) => {
    setActiveAgendaId(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F2] pb-36 text-[#262A27] font-sans">
      {/* 最上部モード切替スイッチャー（要点まとめLP ⇄ 全論点・全資料版） */}
      <div className="sticky top-0 z-40 bg-[#FAF8F2]/95 backdrop-blur-md border-b border-[#E6E1D3] px-3 py-2 flex items-center justify-between gap-2">
        <div className="flex bg-[#EAE5D7] p-0.5 rounded-full border border-[#DDD6C3] w-full max-w-xl mx-auto">
          <Link
            href="/overview/visual"
            className="flex-1 text-center py-1.5 px-2 rounded-full text-[#4C524D] hover:text-[#1E221F] text-[11px] font-bold transition-colors"
          >
            📄 要点まとめ版
          </Link>
          <span className="flex-1 text-center py-1.5 px-2 rounded-full bg-[#2E7D5B] text-white text-[11px] font-black shadow-2xs">
            📖 全論点・全資料版
          </span>
        </div>
      </div>

      {/* 非公式データベース明示バー（入間市公式サイトとの誤認防止） */}
      <div className="bg-[#EFECE2] border-b border-[#DFD8C4] px-3.5 py-2">
        <p className="max-w-2xl mx-auto text-center text-[11px] font-extrabold text-[#474C48] flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-[#2E7D5B] shrink-0" />
          <span>{data.hero.unofficialNotice}</span>
        </p>
      </div>

      {/* Section 01: First View（10年見取り図×入間市街並みバナー ＋ 詳細版イントロ） */}
      <section className="px-3.5 pt-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl border border-[#E6E1D3] shadow-xs overflow-hidden">
          <IrumaTimelinePanoramaBanner onJumpToSection={scrollToSection} />

          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-2 flex-wrap mb-2.5">
              <span className="inline-flex items-center gap-1 text-[10.5px] font-extrabold bg-[#FFF8E1] text-[#8A5A00] border border-[#F2DC96] px-2.5 py-0.5 rounded-full">
                <MapPin className="w-3 h-3" />
                {data.hero.badge}
              </span>
              <Link
                href="/about"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-[#4C524D] hover:text-[#2E7D5B] transition-colors"
              >
                <Info className="w-3.5 h-3.5" />
                <span>このサイトとは</span>
              </Link>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-[22px] sm:text-[26px] font-black leading-[1.35] tracking-tight text-[#1E221F] mb-2.5"
            >
              <span className="block">{data.hero.titleLine1}</span>
              <span className="inline bg-[#FFF0B3] px-1.5 py-0.5 rounded-md">
                {data.hero.titleHighlight}
              </span>
              <span>{data.hero.titleLine2}</span>
            </motion.h1>

            <p className="text-[13px] leading-relaxed text-[#454A46] font-medium mb-3.5">
              {data.hero.subtitle}
            </p>

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#666B67]">
              <Clock className="w-3.5 h-3.5 text-[#2E7D5B] shrink-0" />
              <span>情報公開請求資料25ページ分収録 ｜ {data.hero.updatedAt}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 02: Empathy（市民の声・3つの疑問） */}
      <section className="px-3.5 pt-6 max-w-2xl mx-auto">
        <div className="mb-3.5 px-1">
          <span className="text-[11px] font-extrabold text-[#2E7D5B] block mb-0.5">
            💬 市民の実感・疑問から読む
          </span>
          <h2 className="text-lg font-black text-[#1E221F] leading-snug">
            こんな「モヤモヤ」を感じていませんか？
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {data.empathy.map((card, idx) => (
            <motion.div
              key={card.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white border border-[#E6E1D3] border-l-4 border-l-[#2E7D5B] rounded-2xl p-4 shadow-2xs"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-[11px] font-black bg-[#2E7D5B] text-white px-2 py-0.5 rounded-full">
                  {card.number}
                </span>
                <span className="text-[10.5px] font-extrabold text-[#236247] bg-[#EEF5F0] px-2.5 py-0.5 rounded-full">
                  {card.tag}
                </span>
              </div>
              <h3 className="text-[15px] font-black text-[#1E221F] mb-1">
                {card.title}
              </h3>
              <p className="text-[12.5px] text-[#4C524D] font-medium leading-relaxed">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Section 03: Financial Reality（数字でみる入間市の家計簿 ＋ 家計資料2枚デッキ） */}
      <section
        id="financial-reality"
        className="scroll-mt-36 px-3.5 pt-6 max-w-2xl mx-auto"
      >
        <div className="bg-white border border-[#E6E1D3] rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="mb-4 border-b border-[#EFECE2] pb-3.5">
            <span className="text-[11px] font-extrabold text-[#2E7D5B] block mb-0.5">
              💰 {data.financialShock.sectionTag}
            </span>
            <h2 className="text-base sm:text-lg font-black leading-snug text-[#1E221F] mb-1.5">
              {data.financialShock.sectionTitle}
            </h2>
            <p className="text-[12.5px] text-[#4C524D] font-medium leading-relaxed">
              {data.financialShock.lead}
            </p>
          </div>

          <div className="flex flex-col gap-3.5 mb-4">
            {data.financialShock.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F2] border border-[#E6E1D3] rounded-2xl p-4"
              >
                <div className="text-[11.5px] font-extrabold text-[#3B403C] mb-1">
                  {metric.label}
                </div>
                <div className="flex items-baseline gap-2 flex-wrap mb-2">
                  <span
                    className={`text-2xl sm:text-3xl font-mono font-black tracking-tight ${
                      METRIC_ACCENT_STYLES[metric.accent] || 'text-[#1E221F]'
                    }`}
                  >
                    {metric.value}
                  </span>
                  <span className="text-[11px] font-bold text-[#4C524D] bg-white border border-[#E6E1D3] px-2.5 py-0.5 rounded-full">
                    {metric.subValue}
                  </span>
                </div>
                <p className="text-[12px] text-[#373D38] font-medium leading-relaxed">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>

          {/* 家計計器盤の一次資料（1枚ずつ切替・拡大対応） */}
          <div className="mb-4">
            <DocumentDeck
              docs={data.financialShock.docs}
              failedImages={failedImages}
              onImageError={handleImageError}
              onOpenLightbox={(index) =>
                setLightbox({
                  docs: data.financialShock.docs,
                  index,
                  linkUrl: '/budget',
                  linkTitle: '市の予算・決算データへ',
                })
              }
            />
          </div>

          <div className="flex flex-col gap-2.5">
            {data.financialShock.ctas.map((cta) => (
              <Link
                key={cta.url}
                href={cta.url}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-extrabold transition-all active:scale-[0.98] ${
                  cta.type === 'chart'
                    ? 'bg-[#2E7D5B] text-white hover:bg-[#236247]'
                    : 'bg-[#FAF8F2] text-[#262A27] border border-[#DDD6C3] hover:bg-[#EFECE2]'
                }`}
              >
                <span className="flex items-center gap-2">
                  {cta.type === 'chart' ? (
                    <BarChart3 className="w-4 h-4 shrink-0" />
                  ) : (
                    <FileText className="w-4 h-4 shrink-0 text-[#2E7D5B]" />
                  )}
                  <span>{cta.label}</span>
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* やさしい導入ブリッジ */}
      <section className="px-3.5 pt-5 max-w-2xl mx-auto">
        <div className="bg-[#EEF5F0] border border-[#CDE0D4] rounded-2xl p-3.5 flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-[#2E7D5B] text-white flex items-center justify-center shrink-0 mt-0.5">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <p className="text-[12px] font-bold text-[#234737] leading-relaxed">
            下の4つのタブから気になるテーマへジャンプして、議事録と開示資料（タップ拡大対応・全25ページ）に基づく両面ファクトをじっくりお読みいただけます。
          </p>
        </div>
      </section>

      {/* Sticky Agenda Bar（4テーマ固定ナビ） */}
      <nav
        aria-label="市政の現状ナビゲーション"
        className="sticky top-[48px] z-30 bg-[#FAF8F2]/95 backdrop-blur-md border-y border-[#E6E1D3] py-2.5 px-3.5 mt-5"
      >
        <div className="max-w-2xl mx-auto grid grid-cols-2 gap-2">
          {data.agendas.map((agenda) => {
            const isActive = activeAgendaId === agenda.id;
            return (
              <button
                key={agenda.id}
                type="button"
                onClick={() => scrollToSection(agenda.id)}
                className={`py-2 px-3 rounded-xl text-[12px] font-extrabold border text-left transition-all active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#2E7D5B] text-white border-[#2E7D5B] shadow-xs'
                    : 'bg-white text-[#3B403C] border-[#DFD8C4] hover:border-[#2E7D5B]/60'
                }`}
              >
                {agenda.shortLabel}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Section 04: The 4 Detailed Agendas（縦スクロール詳細レポート ＋ 各論点実資料デッキ） */}
      <section className="px-3.5 pt-5 max-w-2xl mx-auto space-y-6">
        {data.agendas.map((agenda) => (
          <article
            key={agenda.id}
            id={agenda.id}
            className="scroll-mt-36 bg-white rounded-3xl border border-[#E6E1D3] border-t-4 border-t-[#2E7D5B] shadow-xs overflow-hidden"
          >
            {/* アジェンダヘッダー */}
            <div className="p-5 border-b border-[#EFECE2]">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-[10.5px] font-black bg-[#2E7D5B] text-white px-2.5 py-0.5 rounded-full">
                  {agenda.shortLabel}
                </span>
                <span className="text-[11px] font-extrabold text-[#236247]">
                  {agenda.code}
                </span>
              </div>
              <h2 className="text-[18px] sm:text-[19px] font-black text-[#1E221F] leading-snug mb-3">
                {agenda.title}
              </h2>

              <div className="border-l-4 border-l-[#2E7D5B] bg-[#FAF8F2] border border-[#E6E1D3] px-3.5 py-2.5 rounded-r-xl mb-3">
                <div className="text-[10.5px] font-extrabold text-[#236247] mb-0.5">
                  💬 市民としての問い
                </div>
                <p className="text-[12.5px] font-bold text-[#262A27] leading-relaxed">
                  {agenda.question}
                </p>
              </div>

              <div className="bg-[#FFFBEB] border border-[#EFE1A8] rounded-2xl px-3.5 py-2.5">
                <div className="flex items-center gap-1 text-[10.5px] font-extrabold text-[#8A5A00] mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-[#C68900]" />
                  <span>現在の結論（両面ファクト要約）</span>
                </div>
                <p className="text-[12.5px] font-bold text-[#3D392B] leading-relaxed">
                  {agenda.conclusion}
                </p>
              </div>
            </div>

            {/* Before -> After 数字対比 ＋ 詳細解説 ＋ 一次資料デッキ */}
            <div className="p-5 space-y-7">
              {agenda.items.map((item, idx) => {
                const relatedLink = agenda.links[idx] || agenda.links[0];
                return (
                  <div
                    key={idx}
                    className={
                      idx > 0
                        ? 'pt-6 border-t border-dashed border-[#DFD8C4]'
                        : ''
                    }
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap mb-2.5">
                      <h3 className="text-[15.5px] font-black text-[#1E221F] leading-snug">
                        {item.topic}
                      </h3>
                      <span className="flex-shrink-0 text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#FFF8E1] text-[#8A5A00] border border-[#F2DC96]">
                        {item.badge}
                      </span>
                    </div>

                    <div className="rounded-2xl border border-[#DFD8C4] overflow-hidden mb-3">
                      <div className="bg-[#FAF8F2] px-3.5 py-2.5 border-b border-[#E6E1D3]">
                        <span className="block text-[10px] font-extrabold text-[#6B706C] mb-0.5">
                          これまで・当初見込み
                        </span>
                        <span className="text-xs font-bold text-[#4C524D]">
                          {item.before}
                        </span>
                      </div>
                      <div className="bg-[#EEF5F0] px-3.5 py-2.5">
                        <span className="block text-[10px] font-extrabold text-[#236247] mb-0.5">
                          最新の事実・議会の論点
                        </span>
                        <span className="text-[13px] font-black text-[#1E3B2E]">
                          {item.after}
                        </span>
                      </div>
                    </div>

                    <p className="text-[13px] text-[#373D38] leading-[1.75] font-medium mb-3.5">
                      {item.detail}
                    </p>

                    {/* 各トピックの開示請求資料デッキ（全25ページ網羅） */}
                    {item.docs && item.docs.length > 0 && (
                      <DocumentDeck
                        docs={item.docs}
                        failedImages={failedImages}
                        onImageError={handleImageError}
                        onOpenLightbox={(docIndex) =>
                          setLightbox({
                            docs: item.docs,
                            index: docIndex,
                            linkUrl: relatedLink?.url,
                            linkTitle: relatedLink?.title,
                          })
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* マイクロCTA群：気になった詳細記事へ */}
            <div className="bg-[#FAF8F2] px-5 py-4 border-t border-[#E6E1D3]">
              <p className="text-[11px] font-extrabold text-[#236247] mb-2.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>気になったテーマの詳細記事・一次資料を見る</span>
              </p>
              <div className="flex flex-col gap-2">
                {agenda.links.map((link) => (
                  <Link
                    key={link.url}
                    href={link.url}
                    className="group flex items-center justify-between bg-white border border-[#DFD8C4] hover:border-[#2E7D5B] rounded-xl px-3.5 py-2.5 shadow-2xs transition-all active:scale-[0.98]"
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[13px] font-extrabold text-[#1E221F] group-hover:text-[#2E7D5B] transition-colors truncate">
                          {link.title}
                        </span>
                        <span className="flex-shrink-0 text-[9.5px] font-bold bg-[#EEF5F0] text-[#236247] px-2 py-0.5 rounded-full">
                          ⏱ {link.readTime}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5C615D] leading-snug">
                        {link.sub}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#8C918D] group-hover:text-[#2E7D5B] shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Section 05: さらに詳しく調べる */}
      <section className="px-3.5 mt-10 max-w-2xl mx-auto">
        <div className="flex flex-col gap-2.5 mb-5">
          <Link
            href="/overview/visual"
            className="flex items-center justify-between bg-[#2E7D5B] hover:bg-[#236247] text-white rounded-2xl p-4 font-black text-xs transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 shrink-0 text-[#FFF0B3]" />
              <span>📄 要点まとめ版へ戻る</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>

          <Link
            href="/proposals"
            className="flex items-center justify-between bg-[#FFF8E1] hover:bg-[#FFF0C2] text-[#1E221F] border border-[#F2DC96] rounded-2xl p-3.5 font-black text-xs transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#C68900] shrink-0" />
              <span>みんなの「一般質問」アイデアボード</span>
            </span>
            <ArrowRight className="w-4 h-4 text-[#8A5A00] shrink-0" />
          </Link>

          <Link
            href="/budget"
            className="flex items-center justify-between bg-white hover:bg-[#FAF8F2] border border-[#E6E1D3] text-[#262A27] rounded-2xl p-3.5 font-extrabold text-xs transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#2E7D5B] shrink-0" />
              <span>市の家計簿（予算・決算・推移グラフ）を見る</span>
            </span>
            <ArrowRight className="w-4 h-4 text-[#6B706C] shrink-0" />
          </Link>

          <Link
            href="/report-cards"
            className="flex items-center justify-between bg-white hover:bg-[#FAF8F2] border border-[#E6E1D3] text-[#262A27] rounded-2xl p-3.5 font-extrabold text-xs transition-all active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#2E7D5B] shrink-0" />
              <span>市議会議員23人の「通信簿」（公約・質問実績）</span>
            </span>
            <ArrowRight className="w-4 h-4 text-[#6B706C] shrink-0" />
          </Link>
        </div>

        {/* その他の個別議論リンク */}
        <div className="bg-white border border-[#E6E1D3] rounded-2xl p-4 mb-4 shadow-2xs">
          <h3 className="text-[11px] font-extrabold text-[#6B706C] mb-2">
            その他の個別議論・アーカイブ
          </h3>
          <div className="flex flex-col divide-y divide-[#F0ECE1]">
            {data.otherTopics.map((topic) => (
              <Link
                key={topic.url}
                href={topic.url}
                className="py-2.5 flex items-center justify-between gap-2 text-xs font-bold text-[#373D38] hover:text-[#2E7D5B] transition-colors"
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
