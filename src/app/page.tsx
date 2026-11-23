import fs from 'fs';
import path from 'path';
import PortalClient from '../components/PortalClient';
import { Megaphone, Info, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const dataPath = path.join(process.cwd(), 'src/data/top_page_data.json');
  let data = null;
  try {
    data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    return <main className="p-4"><p>データが見つかりません。同期スクリプトを実行してください。</p></main>;
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-36">
      {/* ヒーローセクション（左：サイトタイトル、右：移設したアバウト導線） */}
      <section className="pt-5 pb-3 px-4 sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between gap-2 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <h1 className="text-base font-extrabold tracking-tight text-gray-900 truncate">地域課題と議論（入間市）</h1>
        <Link
          href="/about"
          className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-colors active:scale-95"
        >
          <Info className="w-3.5 h-3.5 text-slate-600" />
          <span>このサイトについて</span>
        </Link>
      </section>

      {/* 📊 新設LP（1枚でわかる入間市のいま）への誘導バナー */}
      <div className="px-4 mt-5">
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-md border border-slate-800 relative overflow-hidden">
          <Link href="/overview/visual" className="block group outline-none active:scale-[0.99] transition-transform">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="inline-block font-mono text-[10px] font-black tracking-wider bg-amber-300 text-slate-950 px-2 py-0.5 rounded">
                NEW // まずは要点と開示資料から（推奨）
              </span>
              <ArrowRight className="w-4 h-4 text-amber-300 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
            <h2 className="text-[16px] font-black leading-snug text-white mb-1.5">
              1枚でわかる入間市のいま（納税者向け・市政の現状レポート）
            </h2>
            <p className="text-[12px] text-slate-300 leading-relaxed mb-3">
              情報公開請求の一次資料（引用）と数字をもとに、いまの黒字と10年後の課題、暮らしに直結する主要議論をわかりやすく整理しました。
            </p>
          </Link>
          <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2 text-[11px]">
            <Link
              href="/overview/visual"
              className="font-extrabold text-amber-300 hover:underline flex items-center gap-1"
            >
              <span>📄 要点まとめ版を見る</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/overview"
              className="font-bold text-slate-300 hover:text-white flex items-center gap-1"
            >
              <span>📖 全論点・全資料版を読む</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 📢 更新履歴・お知らせ */}
      <div className="px-4 mt-6">
        <section className="bg-white border border-gray-300 border-l-[4px] border-l-gray-900 p-4 sm:p-5 rounded-sm relative">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-gray-900" strokeWidth={2} />
              <h2 className="font-bold text-gray-900 tracking-tight text-lg">更新履歴・お知らせ</h2>
            </div>
            <Link href="/news" className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest border-b border-transparent hover:border-gray-900">
              View All
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {/* 2026.11.23 最新更新 */}
            <div className="flex flex-col gap-1 pb-3 border-b border-gray-100">
              <time className="text-sm font-medium text-gray-500">2026.11.23</time>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                新着記事：
                <Link className="text-blue-700 hover:text-blue-900 font-bold underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/d875f86c2442">行政評価・いるまドック</Link>、
                <Link className="text-blue-700 hover:text-blue-900 font-bold underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/49e50b7d021b">情報収集アーカイブ（全36会議・一次資料）</Link>
                <br />
                詳細は<Link className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors font-bold" href="/news/update-2026-11-23">こちら</Link>。
              </p>
            </div>

            {/* 2026.11.21 前回更新 */}
            <div className="flex flex-col gap-1">
              <time className="text-sm font-medium text-gray-500">2026.11.21</time>
              <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
                令和8年9月定例会の内容を全12テーマに反映：
                <Link className="text-blue-700 hover:text-blue-900 font-bold underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/14cfec1930f9">新庁舎建て替え</Link>、
                <Link className="text-blue-700 hover:text-blue-900 font-bold underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/918b74e27810">西武中建て替え</Link>、
                <Link className="text-blue-700 hover:text-blue-900 font-bold underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/2d86710d46ca">第7次総合計画</Link>、
                <Link className="text-blue-700 hover:text-blue-900 font-bold underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/037b5ba67b5e">財政の逼迫</Link> ほか全12テーマを更新。
                <br />
                詳細は<Link className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors font-bold" href="/news/update-2026-11-21">こちら</Link>。
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* インタラクティブなポータルUI */}
      <PortalClient data={data} />
      
      {/* サイトの使い方・フィードバック */}
      <div className="px-4 mt-12 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-4 text-center border-b pb-2 tracking-wider">市民の声・フィードバック</h3>
          <p className="text-[11px] text-gray-500 mb-4 text-center leading-relaxed">
            ご意見やファクトチェックはここから送信できます。市民の声がこのデータベースを育てます。
          </p>
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <iframe 
              src="https://tally.so/embed/5BEQPP?alignLeft=1&transparentBackground=1&dynamicHeight=1&page_title=モバイルトップページ" 
              width="100%" 
              height="350" 
              frameBorder="0" 
              className="w-full bg-gray-50"
              title="フィードバック"
            ></iframe>
          </div>
        </div>
      </div>

      {/* フッター移設に伴う「このサイトについて（アバウト）」案内リンク */}
      <div className="px-4 mt-4">
        <Link
          href="/about"
          className="flex items-center justify-between bg-white border border-slate-200 hover:border-slate-400 rounded-xl px-4 py-3 shadow-2xs transition-all active:scale-[0.98]"
        >
          <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Info className="w-4 h-4 text-slate-500 shrink-0" />
            <span>いるまオープン議会とは（マニフェスト・制作方針・免責事項）</span>
          </span>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
        </Link>
      </div>

      <div className="mt-8 px-5 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© open-iruma</p>
        <p className="text-[9px] text-gray-300 mt-1">※本サイトは市民有志による非公式データベースです</p>
      </div>
    </main>
  );
}
