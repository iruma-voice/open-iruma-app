import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default function BudgetPage() {
  const dataPath = path.join(process.cwd(), 'src/data/budget_data.json');
  let budgets: any[] = [];
  try {
    budgets = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (e) {
    // データがない場合のフォールバック
  }

  // 1. 年度ごとにグループ化するためのロジック
  // タイトルから「令和X年度」等の文字列を抽出する
  const extractYear = (title: string) => {
    const match = title.match(/(令和\d+年度|平成\d+年度|20\d{2}年度)/);
    return match ? match[1] : 'その他';
  };

  const groupedBudgets: Record<string, any> = {};

  budgets.forEach((b: any) => {
    const year = extractYear(b.title);
    if (!groupedBudgets[year]) {
      groupedBudgets[year] = {
        year,
        summary: null,
        initial: null,
        initialArchive: null,
        supplementary: null,
        supplementaryArchive: null,
        settlement: null,
        settlementArchive: null,
        others: []
      };
    }

    const isArchive = b.tags.includes('archive/情報収集') || b.title.includes('情報収集');
    const isSettlement = b.title.includes('決算');
    const isSupplementary = b.title.includes('補正');
    const isSummary = b.title.includes('財政まとめ') || b.title.includes('財政のまとめ');
    
    // 当初予算の判定（まとめ記事・補正・決算が含まれないこと）
    const isInitial = (!isSummary && !isSettlement && !isSupplementary && (b.tags.includes('budget/まとめ') || b.title.includes('当初予算') || b.title.includes('予算')));

    if (isSummary) {
      groupedBudgets[year].summary = b;
    } else if (isSettlement) {
      if (isArchive) groupedBudgets[year].settlementArchive = b;
      else groupedBudgets[year].settlement = b;
    } else if (isSupplementary) {
      if (isArchive) groupedBudgets[year].supplementaryArchive = b;
      else groupedBudgets[year].supplementary = b;
    } else if (isInitial) {
      if (isArchive) groupedBudgets[year].initialArchive = b;
      else groupedBudgets[year].initial = b;
    } else {
      groupedBudgets[year].others.push(b);
    }
  });

  // 年度で降順ソート
  const sortedYears = Object.keys(groupedBudgets).sort((a, b) => {
    const getNum = (str: string) => {
      const match = str.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    };
    return getNum(b) - getNum(a);
  });

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

      {/* 説明文 */}
      <div className="px-5 mt-6 mb-6">
        <div className="border-l-2 border-slate-400 pl-3.5 py-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            行政の財政サイクル（計画・軌道修正・評価）と、市民生活への影響や負担増、議会での対立点について、市民の視点からフラットに整理した記録帳です。
          </p>
        </div>
      </div>

      {sortedYears.length > 0 ? (
        sortedYears.map((year) => {
          const group = groupedBudgets[year];
          if (year === 'その他' && group.others.length === 0) return null;

          // 令和6年度 -> FY2024 等の変換
          const getFY = (y: string) => {
            const match = y.match(/令和(\d+)年度/);
            if (match) return `FY${2018 + parseInt(match[1], 10)}`;
            return 'FY-XX';
          };
          const fyStr = getFY(year);

          // プレースホルダー用の年号計算
          const nextYearNum = parseInt(year.match(/\d+/)?.[0] || '0') + 1;

          // ステータスバッジの判定
          const isCompleted = !!group.settlement;
          const statusBadge = isCompleted 
            ? <span className="ml-auto bg-white border border-slate-300 text-slate-500 font-bold px-2 py-0.5 rounded-full text-[9px] shadow-sm flex items-center gap-1"><span>⚪️</span> 決算認定済</span>
            : <span className="ml-auto bg-white border border-emerald-200 text-emerald-700 font-bold px-2 py-0.5 rounded-full text-[9px] shadow-sm flex items-center gap-1"><span>🟢</span> 執行中</span>;

          return (
            <div key={year} className="px-5 mt-8 mb-12">
              <h2 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>■</span> {fyStr} // {year} 財政レポート
                {statusBadge}
              </h2>

              {/* 1年間のまとめ（メインカード） */}
              {group.summary ? (
                <Link className="block group outline-none mb-6" href={`/budget/${group.summary.id}`}>
                  <article className="border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                      <span className="text-white font-bold text-sm">1年間の財政まとめ（総括）</span>
                      <span className="text-slate-300 text-[9px] font-mono border border-slate-600 px-2 py-0.5 rounded-full">ANNUAL REPORT</span>
                    </div>
                    <div className="p-4.5">
                      <h3 className="text-[15px] font-extrabold text-slate-900 leading-snug mb-2">{group.summary.title}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                        {group.summary.content.replace(/[#*`>]/g, '').replace(/\[!.*?\]/g, '').replace(/\[|\]/g, '').slice(0, 150)}...
                      </p>
                      <div className="mt-4 flex items-center text-blue-600 text-xs font-bold gap-1">
                        <span>記事を読む</span>
                        <span>→</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ) : null}

              {/* プロセス（サブタイムライン） */}
              <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 mb-5 border-b border-dashed border-slate-300 pb-2 flex items-center gap-2">
                  <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-sm font-mono">PROCESS</span>
                  詳細な財政プロセス
                </h3>
                
                <div className="relative flex flex-col gap-0 pl-2">
                  {/* タイムラインの縦線 */}
                  <div className="absolute left-[4px] top-3 bottom-3 w-[2px] bg-slate-200 z-0"></div>

                  {/* --- 1. 当初予算 --- */}
                  {group.initial && (
                    <div className="relative z-10 mb-6 flex gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1.5 shrink-0 shadow-sm border border-white"></div>
                      <div className="flex-1">
                        <Link className="block group outline-none" href={`/budget/${group.initial.id}`}>
                          <article className="border border-slate-200 rounded-md p-3.5 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-amber-600 font-bold text-[10px] tracking-wider">01 当初予算（計画）</span>
                            </div>
                            <h4 className="text-[13px] font-bold text-slate-900 leading-snug">{group.initial.title}</h4>
                          </article>
                        </Link>
                        {group.initialArchive && (
                          <Link href={`/budget/${group.initialArchive.id}`} className="flex items-center gap-1.5 mt-2 ml-1 text-[10px] text-slate-500 hover:text-blue-600 transition-colors">
                            <span>↳ 📂 情報収集アーカイブ</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}

                  {/* --- 2. 補正予算 --- */}
                  {group.supplementary ? (
                    <div className="relative z-10 mb-6 flex gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-400 mt-1.5 shrink-0 shadow-sm border border-white"></div>
                      <div className="flex-1">
                        <Link className="block group outline-none" href={`/budget/${group.supplementary.id}`}>
                          <article className="border border-slate-200 rounded-md p-3.5 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-sky-600 font-bold text-[10px] tracking-wider">02 補正予算（軌道修正）</span>
                            </div>
                            <h4 className="text-[13px] font-bold text-slate-900 leading-snug">{group.supplementary.title}</h4>
                          </article>
                        </Link>
                        {group.supplementaryArchive && (
                          <Link href={`/budget/${group.supplementaryArchive.id}`} className="flex items-center gap-1.5 mt-2 ml-1 text-[10px] text-slate-500 hover:text-blue-600 transition-colors">
                            <span>↳ 📂 情報収集アーカイブ</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    // 補正予算のプレースホルダー
                    group.initial && (
                      <div className="relative z-10 mb-6 flex gap-4 opacity-50">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mt-1.5 shrink-0 border border-white"></div>
                        <div className="flex-1">
                          <div className="border border-dashed border-slate-300 rounded-md p-3 bg-slate-50/50 flex items-center">
                            <span className="text-[10px] text-slate-400">02 補正予算 [期中の記録待ち]</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* --- 3. 決算 --- */}
                  {group.settlement ? (
                    <div className="relative z-10 flex gap-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0 shadow-sm border border-white"></div>
                      <div className="flex-1">
                        <Link className="block group outline-none" href={`/budget/${group.settlement.id}`}>
                          <article className="border border-slate-200 rounded-md p-3.5 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-emerald-700 font-bold text-[10px] tracking-wider">03 決算（評価）</span>
                            </div>
                            <h4 className="text-[13px] font-bold text-slate-900 leading-snug">{group.settlement.title}</h4>
                          </article>
                        </Link>
                        {group.settlementArchive && (
                          <Link href={`/budget/${group.settlementArchive.id}`} className="flex items-center gap-1.5 mt-2 ml-1 text-[10px] text-slate-500 hover:text-blue-600 transition-colors">
                            <span>↳ 📂 情報収集アーカイブ</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    // 決算のプレースホルダー
                    group.initial && (
                      <div className="relative z-10 flex gap-4 opacity-50">
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300 mt-1.5 shrink-0 border border-white"></div>
                        <div className="flex-1">
                          <div className="border border-dashed border-slate-300 rounded-md p-3 bg-slate-50/50 flex items-center">
                            <span className="text-[10px] text-slate-400">03 決算 [令和{nextYearNum}年秋 議会認定予定]</span>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="px-5 mt-8">
          <div className="py-12 text-center bg-white border border-dashed border-slate-300 rounded-none">
            <p className="text-slate-400 font-mono text-xs">NO DATA RECORDED</p>
          </div>
        </div>
      )}
    </main>
  );
}
