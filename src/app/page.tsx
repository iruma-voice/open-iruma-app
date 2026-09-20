import fs from 'fs';
import path from 'path';
import PortalClient from '../components/PortalClient';
import { Megaphone } from 'lucide-react';
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
      {/* ヒーローセクション（ミニマル化） */}
      <section className="pt-6 pb-3 px-5 sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/40 flex items-center justify-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <h1 className="text-lg font-extrabold tracking-tight text-gray-900">地域課題と議論（入間市）</h1>
      </section>

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
          <div className="flex flex-col gap-1 sm:gap-2">
            <time className="text-sm font-medium text-gray-500">2026.09.20</time>
            <p className="text-gray-800 leading-relaxed text-sm sm:text-base">
              以下の記事を更新しました（
              <Link className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/14cfec1930f9">新庁舎</Link>、
              <Link className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/918b74e27810">西武中</Link>、
              <Link className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/c412ed17c087">水道</Link>、
              <Link className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/0991ba104335">給食</Link>、
              <Link className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/01aebbf78e03">茶畑</Link>、
              <Link className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors" href="/issues/2d86710d46ca">総合計画</Link>
              ）：6月議会の議論内容を元にアップデートしました。詳細は<Link className="text-blue-700 hover:text-blue-900 underline underline-offset-4 decoration-blue-200 hover:decoration-blue-700 transition-colors font-bold" href="/news">こちら</Link>。
            </p>
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

      <div className="mt-8 px-5 text-center">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">© open-iruma</p>
        <p className="text-[9px] text-gray-300 mt-1">※本サイトは市民有志による非公式データベースです</p>
      </div>
    </main>
  );
}
