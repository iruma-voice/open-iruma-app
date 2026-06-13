import fs from 'fs';
import path from 'path';
import PortalClient from '../components/PortalClient';

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
