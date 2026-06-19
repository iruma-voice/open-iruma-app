import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { ChevronRight, Landmark, FileText, Calendar } from 'lucide-react';

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
    <main className="min-h-screen bg-gray-50 pb-[160px]">
      {/* ヒーローヘッダー */}
      <section className="pt-6 pb-4 px-5 sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-white/40 flex items-center justify-center shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)]">
        <h1 className="text-lg font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
          <Landmark className="w-5 h-5 text-blue-600" />
          予算・財政
        </h1>
      </section>

      {/* 説明文 */}
      <div className="px-5 mt-6 mb-4">
        <p className="text-xs text-gray-500 leading-relaxed">
          入間市の予算編成や市の家計簿（財政指標）、大型事業の集中による影響、そして議会での審議プロセスをフラットにわかりやすく整理しています。
        </p>
      </div>

      {/* 予算のまとめセクション */}
      <div className="px-4 mt-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-1.5">
          <Landmark className="w-3.5 h-3.5 text-blue-500" />
          予算のまとめ・解説
        </h2>
        {summaryBudgets.length > 0 ? (
          <div className="flex flex-col gap-3">
            {summaryBudgets.map((item: any) => (
              <Link key={item.id} href={`/budget/${item.id}`} className="block group outline-none">
                <article className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-[0.98] flex items-center justify-between">
                  <div className="flex-1 pr-4 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                        <Calendar className="w-3 h-3"/> 2024年度
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">一般会計</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1 leading-snug group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  <div className="flex-shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors bg-slate-50 p-2.5 rounded-full">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
            <p className="text-gray-400 font-medium text-xs">データがありません。同期スクリプトを実行してください。</p>
          </div>
        )}
      </div>

      {/* 資料アーカイブセクション */}
      <div className="px-4 mt-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-gray-400" />
          一次資料・情報収集アーカイブ
        </h2>
        {archiveBudgets.length > 0 ? (
          <div className="flex flex-col gap-3">
            {archiveBudgets.map((item: any) => (
              <Link key={item.id} href={`/budget/${item.id}`} className="block group outline-none">
                <article className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_24px_-4px_rgba(0,0,0,0.06)] transition-all duration-300 active:scale-[0.98] flex items-center justify-between">
                  <div className="flex-1 pr-4 min-w-0">
                    <h3 className="text-xs font-bold text-slate-700 leading-snug group-hover:text-blue-600 transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <span>一次情報（議事録抜粋・生発言など）</span>
                    </p>
                  </div>
                  <div className="flex-shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors bg-slate-50 p-2 rounded-full">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center bg-white rounded-2xl border border-gray-100 border-dashed">
            <p className="text-gray-400 font-medium text-xs">データがありません。</p>
          </div>
        )}
      </div>
    </main>
  );
}
