import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function BudgetPage() {
  const dataPath = path.join(process.cwd(), 'src/data/budget_data.json');
  let budgets = [];
  try {
    budgets = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    // データがない場合のフォールバック
  }

  // 「まとめ」と「情報収集（アーカイブ）」を分類
  const summaryBudgets = budgets.filter((b: any) => 
    b.tags.includes('budget/まとめ') || !b.title.includes('情報収集')
  );

  const archiveBudgets = budgets.filter((b: any) => 
    b.tags.includes('archive/情報収集') || b.title.includes('情報収集')
  );

  return (
    <main className="min-h-screen bg-[#FAF9F5] pb-[160px] font-sans text-slate-900">
      {/* 帳簿ヘッダー（ミシン目の区切り） */}
      <section className="pt-8 pb-4 px-5 sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-dashed border-slate-300 flex flex-col items-start">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Ledger // 05</span>
        </div>
        <h1 className="text-base font-extrabold tracking-tight text-slate-900 mt-1">
          予算・財政の記録
        </h1>
      </section>

      {/* 説明文（ファイリングされた帳簿のメタファー） */}
      <div className="px-5 mt-6 mb-6">
        <div className="border-l-2 border-slate-400 pl-3.5 py-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            入間市の予算規模、市の財政状況（市債・基金の推移）、大型事業の集中による影響、そして議会での主な対立点について、市民の視点からフラットに整理した記録帳です。
          </p>
        </div>
      </div>

      {/* 予算のまとめ（インデックスカード・スタイル） */}
      <div className="px-5 mt-8">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>■</span> SECTION 01 // 予算の解説とまとめ
        </h2>
        {summaryBudgets.length > 0 ? (
          <div className="flex flex-col gap-3">
            {summaryBudgets.map((item: any) => (
              <Link key={item.id} href={`/budget/${item.id}`} className="block group outline-none">
                <article className="border border-slate-300 rounded-none p-4.5 bg-white hover:bg-slate-50 transition-colors duration-200 flex items-center justify-between">
                  <div className="flex-1 pr-4 min-w-0">
                    {/* スタンプ・捺印風のバッジ */}
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <span className="bg-amber-400 text-black font-mono font-bold text-[9px] px-2 py-0.5 rounded-none tracking-wider">
                        2024年度
                      </span>
                      <span className="border border-slate-900 font-mono text-[9px] px-1.5 py-0.5 text-slate-800">
                        一般会計
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 mb-1 leading-snug group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 text-slate-400 font-mono text-[10px] ml-2 group-hover:text-blue-600 transition-colors">
                    ▶
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white border border-dashed border-slate-300 rounded-none">
            <p className="text-slate-400 font-mono text-xs">NO DATA RECORDED</p>
          </div>
        )}
      </div>

      {/* 資料アーカイブ（帳簿の1行スタイル） */}
      <div className="px-5 mt-10">
        <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          <span>■</span> SECTION 02 // 一次情報・情報収集アーカイブ
        </h2>
        {archiveBudgets.length > 0 ? (
          <div className="flex flex-col border-t border-slate-300">
            {archiveBudgets.map((item: any) => (
              <Link key={item.id} href={`/budget/${item.id}`} className="block group outline-none">
                <article className="border-b border-l border-r border-slate-300 rounded-none p-3.5 bg-white hover:bg-slate-50 transition-colors duration-200 flex items-center justify-between">
                  <div className="flex-1 pr-4 min-w-0">
                    <h3 className="text-xs font-bold text-slate-700 leading-snug group-hover:text-blue-600 transition-colors truncate">
                      {item.title}
                    </h3>
                    <div className="text-[9px] font-mono text-slate-400 mt-1 flex items-center gap-1">
                      <span>DOC // 議事録・生発言のアーカイブ</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-slate-400 font-mono text-[10px] ml-2 group-hover:text-blue-600 transition-colors">
                    ▶
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-white border border-dashed border-slate-300 rounded-none">
            <p className="text-slate-400 font-mono text-xs">NO DATA RECORDED</p>
          </div>
        )}
      </div>
    </main>
  );
}
