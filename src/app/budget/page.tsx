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
    
    // 当初予算の判定（補正・決算が含まれず、まとめ記事であること）
    const isInitial = (!isSettlement && !isSupplementary && (b.tags.includes('budget/まとめ') || b.title.includes('当初予算') || b.title.includes('予算')));

    if (isSettlement) {
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

      {/* 説明文（ファイリングされた帳簿のメタファー） */}
      <div className="px-5 mt-6 mb-6">
        <div className="border-l-2 border-slate-400 pl-3.5 py-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            入間市の予算規模、市の財政状況（市債・基金の推移）、大型事業の集中による影響、そして議会での主な対立点について、市民の視点からフラットに整理した記録帳です。
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

          return (
            <div key={year} className="px-5 mt-8 mb-12">
              <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span>■</span> {fyStr} // {year} 予算トラッカー
              </h2>

              <div className="relative flex flex-col gap-0">
                {/* タイムラインの縦線 */}
                <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-slate-200 z-0"></div>

                {/* --- 1. 当初予算 --- */}
                {group.initial && (
                  <div className="relative z-10 mb-5">
                    <Link className="block group outline-none" href={`/budget/${group.initial.id}`}>
                      <article className="border-2 border-slate-400 rounded-none p-4.5 bg-white shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-amber-400 text-black font-mono font-bold text-[9px] px-2 py-0.5 rounded-none tracking-wider">
                            当初予算
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">{group.initial.title}</h3>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">過去最大の予算規模と、議会での主な論点</p>
                      </article>
                    </Link>
                    {group.initialArchive && (
                      <Link href={`/budget/${group.initialArchive.id}`} className="flex items-center gap-2 mt-1.5 ml-4 text-[10px] font-mono text-slate-500 hover:text-blue-600 transition-colors">
                        <span>↳ 📂 議事録・情報収集アーカイブを開く</span>
                      </Link>
                    )}
                  </div>
                )}

                {/* --- 2. 補正予算 --- */}
                {group.supplementary ? (
                  <div className="relative z-10 mb-5 ml-6">
                    <Link className="block group outline-none" href={`/budget/${group.supplementary.id}`}>
                      <article className="border border-slate-300 border-l-4 border-l-amber-400 p-3 bg-white/60 hover:bg-white transition-all shadow-sm">
                        <h3 className="text-xs font-bold text-slate-800">{group.supplementary.title}</h3>
                        <p className="text-[9px] text-slate-500 mt-1 line-clamp-1">期中の追加事業・減額の記録</p>
                      </article>
                    </Link>
                    {group.supplementaryArchive && (
                      <Link href={`/budget/${group.supplementaryArchive.id}`} className="flex items-center gap-2 mt-1.5 ml-2 text-[9px] font-mono text-slate-400 hover:text-blue-600 transition-colors">
                        <span>↳ 📂 情報収集アーカイブを開く</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  // 補正予算のプレースホルダー
                  group.initial && (
                    <div className="relative z-10 mb-5 ml-6 opacity-50">
                      <div className="border border-dashed border-slate-300 p-3 bg-slate-50/50 flex items-center justify-center">
                        <span className="text-[9px] font-mono text-slate-400">[ 期中の補正予算 記録待ち ]</span>
                      </div>
                    </div>
                  )
                )}

                {/* --- 3. 決算 --- */}
                {group.settlement ? (
                  <div className="relative z-10 mt-2">
                    <Link className="block group outline-none" href={`/budget/${group.settlement.id}`}>
                      <article className="border-2 border-slate-800 rounded-none p-4.5 bg-slate-50 hover:bg-white transition-all shadow-sm">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <span className="bg-slate-800 text-white font-mono font-bold text-[9px] px-2 py-0.5 tracking-wider">決算・通信簿</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">{group.settlement.title}</h3>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">当初計画の達成度と、未執行の課題</p>
                      </article>
                    </Link>
                    {group.settlementArchive && (
                      <Link href={`/budget/${group.settlementArchive.id}`} className="flex items-center gap-2 mt-1.5 ml-4 text-[10px] font-mono text-slate-500 hover:text-blue-600 transition-colors">
                        <span>↳ 📂 情報収集アーカイブを開く</span>
                      </Link>
                    )}
                  </div>
                ) : (
                  // 決算のプレースホルダー
                  group.initial && (
                    <div className="relative z-10 mt-2 opacity-50">
                      <div className="border-2 border-dashed border-slate-300 p-4.5 bg-slate-50 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-slate-400">[ 令和{nextYearNum}年秋 議会認定予定 ]</span>
                      </div>
                    </div>
                  )
                )}
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
