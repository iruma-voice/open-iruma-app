import Link from 'next/link';

export default function BudgetGuidePage() {
  return (
    <main className="min-h-screen bg-[#FAF9F5] pb-[160px] font-sans text-slate-900">
      {/* ヘッダー */}
      <section className="pt-8 pb-4 px-5 sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-dashed border-slate-300">
        <Link href="/budget" className="text-[10px] text-slate-400 hover:text-sky-600 transition-colors mb-1 inline-flex items-center gap-1">
          <span>←</span> 予算・財政の記録に戻る
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Guide // 05</span>
        </div>
        <h1 className="text-base font-extrabold tracking-tight text-slate-900 mt-1">
          予算・財政ページの活用ガイド
        </h1>
      </section>

      <div className="px-5 mt-6 space-y-8">
        
        {/* セクション1：本ページの制作背景と目的 */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 mb-3 border-l-4 border-sky-500 pl-2">本記録帳の制作背景と目的</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-3 text-[11px] leading-relaxed text-slate-700">
            <p>
              本記録帳は、入間市が公開している「財政状況資料集」や「議会だより（議事録）」などの公式データをAIで解析し、フラットな事実（ファクト）として抽出・整理したものです。
            </p>
            <p>
              単なる行政のPRや数字の羅列にならないよう、記事制作のプロセス（AIへのプロンプト）において、<strong>「市民生活への影響（負担増など）」「大型プロジェクトの進捗」「議会での対立点」に焦点を当てるよう厳密にルール化</strong>しています。これにより、市民の皆様が「自分たちの税金がどう使われているか」を客観的かつ俯瞰的にチェックできるプラットフォームを目指しています。
            </p>
          </div>
        </section>

        {/* セクション2：行政の「財政サイクル」 */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 mb-3 border-l-4 border-emerald-500 pl-2">行政の「財政サイクル」と基礎知識</h2>
          <p className="text-[11px] text-slate-600 mb-4">
            市のお金の使い方（予算）は、1年を単位として「計画」「軌道修正」「評価」のサイクルを回しています。本記録帳もこの3つのステップに沿って記事を整理しています。
          </p>
          
          <div className="space-y-3">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
              <h3 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px]">計画</span> 当初予算（とうしょよさん）
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                毎年2〜3月に決まる「来年度の1年間、何にいくら使うか」の基本計画です。新しい施設の建設や、市民サービスの見直しなど、<strong>最も注目すべき重要な予算</strong>です。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
              <h3 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px]">修正</span> 補正予算（ほせいよさん）
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                年度の途中で「予定外の出来事（災害、物価高騰、想定外の修繕など）」が起きた際に行う予算の追加や修正です。年間を通じて複数回（6月、9月、12月など）行われます。
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
              <h3 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[10px]">評価</span> 決算（けっさん）
              </h3>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                1年が終わった後、「計画通りに正しくお金が使われたか」「無駄はなかったか」を答え合わせし、議会が評価（認定）するプロセスです。翌年度の秋ごろに行われます。
              </p>
            </div>
          </div>
        </section>

        {/* セクション3：各ページの活用方法 */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 mb-3 border-l-4 border-violet-500 pl-2">各ページの活用・チェック方法</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 mb-2">🔖 各年度のまとめ記事</h3>
              <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc list-inside">
                <li><strong>負担増のチェック：</strong> 税金、保険料、水道料金など、市民の生活に直結する負担が増えていないかを確認します。</li>
                <li><strong>大型事業のチェック：</strong> 新庁舎や学校給食センターなど、多額の税金が投入されるプロジェクトがいつ、いくらで進んでいるかを把握します。</li>
                <li><strong>対立点のチェック：</strong> 議会でどのような反対意見が出たかを知ることで、市政の課題を多角的に理解できます。</li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <Link href="/budget/trends" className="block group">
                <h3 className="text-xs font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors flex items-center justify-between">
                  <span>📊 推移グラフ（ダッシュボード）</span>
                  <span className="text-[10px] bg-white px-2 py-1 rounded shadow-sm border border-slate-200">ページへ移動 →</span>
                </h3>
              </Link>
              <ul className="text-[11px] text-slate-700 space-y-1.5 list-disc list-inside">
                <li><strong>貯金（基金）の監視：</strong> 市の貯金である「財政調整基金」が急激に減っていないかをチェックします。</li>
                <li><strong>借金（市債）の監視：</strong> 将来の世代へのツケとなる市の借金が増えすぎていないかを確認します。</li>
                <li>長期的なトレンドを見ることで、その年の予算が「健全か・無理をしているか」が分かります。</li>
              </ul>
            </div>
          </div>
        </section>

        {/* セクション4：ステータスの見方 */}
        <section>
          <h2 className="text-sm font-bold text-slate-800 mb-3 border-l-4 border-slate-400 pl-2">ステータスバッジの見方</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-green-100 text-green-700 shrink-0 mt-0.5">決算認定済</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  年度が終了し、使ったお金の計算がすべて終わり、議会による評価（認定）も完了した年度です。
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-100 text-yellow-700 shrink-0 mt-0.5">執行中</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  現在進行形で事業が行われている年度です。年度途中のため、最終的な決算額はまだ確定していません。
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 shrink-0 mt-0.5">計画・予定</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  これから始まる年度、またはまだ予算案が可決されていない段階の年度です。今後、議会の審議等で内容が変更される可能性があります。
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* セクション5：Q&A */}
        <section className="pt-4 border-t border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-lg">💡</span> よくある質問（Q&A）
          </h2>
          
          <div className="space-y-4">
            <details className="group bg-white rounded-xl shadow-sm border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <h3 className="text-xs font-bold text-slate-800 pr-4">Q. 「一般会計」と「特別会計」の違いは何ですか？</h3>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed space-y-2">
                <p>
                  <strong>一般会計</strong>は、福祉、教育、道路の整備など、市が行う基本的なサービスのお金を取り扱う「メインの財布」です。私たちが払う市税の多くはここに入ります。
                </p>
                <p>
                  <strong>特別会計</strong>は、特定の事業（国民健康保険、介護保険、下水道など）を行うための「専用の財布」です。その事業を利用する人が払う保険料や使用料などでやりくりするため、一般会計とは分けて管理されます。
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-sm border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <h3 className="text-xs font-bold text-slate-800 pr-4">Q. 市の「借金」は悪いことですか？</h3>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed space-y-2">
                <p>
                  市が発行する借金（市債）は、必ずしも悪いことではありません。例えば、新しい学校や庁舎を建てた場合、その施設は数十年先まで使われます。今の世代だけで全額を負担するのではなく、将来使う世代にも負担を分かち合ってもらう（世代間の公平性を保つ）ために借金を活用します。
                </p>
                <p>
                  ただし、返済能力を超えた借金や、将来に残らない事業（一時的なイベント等）のための借金は問題です。本サイトの「推移グラフ」で、市債の残高が過剰に増えていないかを確認することが重要です。
                </p>
              </div>
            </details>

            <details className="group bg-white rounded-xl shadow-sm border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer">
                <h3 className="text-xs font-bold text-slate-800 pr-4">Q. 「基金の取り崩し」とは何ですか？</h3>
                <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-[11px] text-slate-600 leading-relaxed space-y-2">
                <p>
                  基金とは「市の貯金」のことです。入間市には、いざという時のための「財政調整基金」や、施設整備のための「公共施設整備基金」などがあります。
                </p>
                <p>
                  税収などが足りず、予算が赤字になりそうな時に、この基金からお金を引き出して穴埋めをすることを「基金の取り崩し」と呼びます。家庭の家計と同じで、貯金を崩し続けると将来の備えがなくなってしまうため、取り崩し額が多すぎないか注意深く見る必要があります。
                </p>
              </div>
            </details>
          </div>
        </section>

      </div>
    </main>
  );
}
