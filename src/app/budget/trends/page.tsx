'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, LineChart, Line, ComposedChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell, ReferenceLine
} from 'recharts';
import trendsData from '../../../data/budget_trends.json';

// --- カラーパレット（既存の財政ページに合わせたslate/amber/sky/emerald系） ---
const COLORS = {
  primary: '#475569',      // slate-600
  amber: '#d97706',        // amber-600
  sky: '#0284c7',          // sky-600
  emerald: '#059669',      // emerald-600
  rose: '#e11d48',         // rose-600
  violet: '#7c3aed',       // violet-600
  slate300: '#cbd5e1',     // slate-300
  slate100: '#f1f5f9',     // slate-100
  projection: '#93c5fd',   // blue-300（見込み用）
  confirmed: '#475569',    // slate-600（確定用）
  // 目的別歳出用
  welfare: '#ef4444',      // 民生費：赤
  general: '#64748b',      // 総務費：グレー
  education: '#0ea5e9',    // 教育費：スカイブルー
  civilWorks: '#f59e0b',   // 土木費：アンバー
  health: '#10b981',       // 衛生費：エメラルド
  debtService: '#8b5cf6',  // 公債費：バイオレット
  others: '#cbd5e1',       // その他：ライトグレー
};

// --- データ前処理 ---
type YearData = typeof trendsData.years[number];

// 当初予算推移グラフ用データ
const budgetChartData = trendsData.years
  .filter((y: YearData) => !y.isReferenceOnly && y.initialBudget !== null)
  .map((y: YearData) => ({
    name: y.fiscalYear,
    displayLabel: y.displayLabel,
    当初予算: y.initialBudget,
    前年度比: y.yoyChange ?? null,
    isProjection: y.isProjection,
  }));

// 目的別歳出推移グラフ用データ
// H30〜R06は決算、令和7〜8年度（2025〜2026年度）は当初予算のデータが含まれている
const expenditureChartData = trendsData.years
  .filter((y: YearData) => y.expenditureByPurpose !== null && !y.isReferenceOnly)
  .map((y: YearData) => {
    const e = y.expenditureByPurpose!;
    return {
      name: y.fiscalYear,
      displayLabel: y.displayLabel,
      民生費: e.welfare,
      総務費: e.general,
      教育費: e.education,
      土木費: e.civilWorks,
      衛生費: e.health,
      公債費: e.debtService,
      その他: e.others,
    };
  });

// 基金残高推移グラフ用データ
const fundChartData = trendsData.years
  .filter((y: YearData) => y.funds !== null)
  .map((y: YearData) => ({
    name: y.fiscalYear,
    displayLabel: y.displayLabel,
    財政調整基金: y.funds!.financialAdjustmentFund,
    その他特定目的基金: y.funds!.otherSpecificFunds,
    合計: y.funds!.financialAdjustmentFund + y.funds!.otherSpecificFunds,
  }));

// 財政指標推移グラフ用データ
const indicatorChartData = trendsData.years
  .filter((y: YearData) => y.indicators !== null)
  .map((y: YearData) => ({
    name: y.fiscalYear,
    displayLabel: y.displayLabel,
    実質収支比率: y.indicators!.realBalanceRatio,
    実質単年度収支比率: y.indicators!.singleYearBalanceRatio,
    基金残高比率: y.indicators!.reserveFundRatio,
  }));

// --- カスタムツールチップ ---
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-bold text-slate-800 mb-1.5 border-b border-slate-100 pb-1">{payload[0]?.payload?.displayLabel || label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex justify-between gap-4 py-0.5">
          <span className="text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }}></span>
            {entry.name}
          </span>
          <span className="font-bold text-slate-900">
            {typeof entry.value === 'number' ? entry.value.toLocaleString() : '—'}
            {entry.name === '前年度比' ? '%' : entry.name.includes('比率') ? '%' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}

// --- セクションラッパー ---
function ChartSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <h2 className="text-sm font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-[10px] text-slate-500 mb-4 leading-relaxed">{subtitle}</p>
      {children}
    </section>
  );
}

// --- メインコンポーネント ---
export default function BudgetTrendsPage() {
  const [activeTab, setActiveTab] = useState<'budget' | 'expenditure' | 'fund' | 'indicator'>('budget');

  return (
    <main className="min-h-screen bg-[#FAF9F5] pb-[160px] font-sans text-slate-900">
      {/* ヘッダー */}
      <section className="pt-8 pb-4 px-5 sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-dashed border-slate-300">
        <Link href="/budget" className="text-[10px] text-slate-400 hover:text-blue-600 transition-colors mb-1 inline-flex items-center gap-1">
          <span>←</span> 予算・財政の記録に戻る
        </Link>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-bold">Trends // 05</span>
        </div>
        <h1 className="text-base font-extrabold tracking-tight text-slate-900 mt-1">
          当初予算の推移（令和元年度〜令和8年度）
        </h1>
      </section>

      {/* 説明文 */}
      <div className="px-5 mt-6 mb-4">
        <div className="border-l-2 border-slate-400 pl-3.5 py-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            入間市の一般会計当初予算は、令和元年度の421億円から令和8年度の564億円へと <strong className="text-slate-900">8年間で約143億円（+34%）増加</strong> しました。その推移を複数のグラフで可視化しています。
          </p>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="px-5 mb-6">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1 overflow-x-auto">
          {([
            { key: 'budget', label: '予算額' },
            { key: 'expenditure', label: '歳出構成' },
            { key: 'fund', label: '基金残高' },
            { key: 'indicator', label: '財政指標' },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 text-[11px] font-bold py-2 px-3 rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* グラフエリア */}
      <div className="px-5 space-y-6">
        {/* 1. 当初予算額の推移 */}
        {activeTab === 'budget' && (
          <ChartSection
            title="📊 当初予算額の推移"
            subtitle="棒グラフ: 当初予算額（億円）　折れ線: 前年度比（%）。薄い色の棒は決算未了の見込み値です。"
          >
            <div className="mb-3 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-[9px] text-slate-500">
                <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: COLORS.confirmed }}></span> 確定
              </span>
              <span className="flex items-center gap-1 text-[9px] text-slate-500">
                <span className="w-3 h-2 rounded-sm inline-block" style={{ backgroundColor: COLORS.projection }}></span> 見込み
              </span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={budgetChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#64748b' }} domain={[350, 600]} label={{ value: '億円', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8' } }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#64748b' }} domain={[-2, 10]} label={{ value: '%', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: '#94a3b8' } }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="当初予算" radius={[4, 4, 0, 0]} barSize={28}>
                  {budgetChartData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isProjection ? COLORS.projection : COLORS.confirmed}
                      opacity={entry.isProjection ? 0.8 : 1}
                    />
                  ))}
                </Bar>
                <Line yAxisId="right" type="monotone" dataKey="前年度比" stroke={COLORS.amber} strokeWidth={2} dot={{ r: 3, fill: COLORS.amber }} connectNulls />
              </ComposedChart>
            </ResponsiveContainer>

            {/* 補足テーブル */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-[10px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-1.5 px-2 text-slate-500 font-bold">年度</th>
                    <th className="text-right py-1.5 px-2 text-slate-500 font-bold">当初予算</th>
                    <th className="text-right py-1.5 px-2 text-slate-500 font-bold">前年度比</th>
                    <th className="text-right py-1.5 px-2 text-slate-500 font-bold">ステータス</th>
                  </tr>
                </thead>
                <tbody>
                  {budgetChartData.map((d: any, i: number) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-1.5 px-2 text-slate-700 font-medium">{d.displayLabel}</td>
                      <td className="py-1.5 px-2 text-right text-slate-900 font-bold">{d.当初予算?.toFixed(1)}億円</td>
                      <td className="py-1.5 px-2 text-right text-slate-600">{d.前年度比 !== null ? `+${d.前年度比}%` : '—'}</td>
                      <td className="py-1.5 px-2 text-right">
                        {d.isProjection
                          ? <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-[9px] font-bold">見込み</span>
                          : <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-bold">確定</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartSection>
        )}

        {/* 2. 歳出の目的別構成の推移 */}
        {activeTab === 'expenditure' && (
          <ChartSection
            title="📊 歳出の目的別構成の推移"
            subtitle="民生費（福祉）、総務費（管理）、教育費、衛生費（保健環境）、土木費（道路公園）、公債費（借金返済）、その他の内訳推移です。"
          >
            <div className="mb-3 flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1 text-[9px] text-slate-500">
                令和6年度（2024年度）までは決算額、令和7年度（2025年度）以降は当初予算額に基づいています。
              </span>
            </div>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={expenditureChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: '億円', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8' } }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="民生費" stackId="a" fill={COLORS.welfare} />
                <Bar dataKey="総務費" stackId="a" fill={COLORS.general} />
                <Bar dataKey="教育費" stackId="a" fill={COLORS.education} />
                <Bar dataKey="衛生費" stackId="a" fill={COLORS.health} />
                <Bar dataKey="土木費" stackId="a" fill={COLORS.civilWorks} />
                <Bar dataKey="公債費" stackId="a" fill={COLORS.debtService} />
                <Bar dataKey="その他" stackId="a" fill={COLORS.others} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            {/* 注釈 */}
            <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-[10px] text-slate-600 leading-relaxed">
                <strong>📖 目的別歳出のポイント</strong><br />
                最も大きな割合を占めるのは、高齢者福祉や子育て支援などを含む「民生費」で、全体で一貫して増加傾向にあります。
                令和2年度（2020年度）はコロナ特別定額給付金を含むため「その他」（災害復旧費や予備費などの分類に含まれるその他経費）が大幅に増加しています。
                また、令和7年度以降は「当初予算」ベースであるため、決算で変動しやすい最終支出とは多少構成が異なる場合があります。
              </p>
            </div>
          </ChartSection>
        )}

        {/* 3. 基金残高の推移 */}
        {activeTab === 'fund' && (
          <ChartSection
            title="📊 基金残高（市の貯金）の推移"
            subtitle="財政調整基金とその他特定目的基金（公共施設整備基金等）の残高推移です。単位は百万円。"
          >
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={fundChartData} margin={{ top: 10, right: 10, left: -5, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} label={{ value: '百万円', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8' } }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="財政調整基金" fill={COLORS.emerald} radius={[4, 4, 0, 0]} barSize={22} />
                <Bar dataKey="その他特定目的基金" fill={COLORS.sky} radius={[4, 4, 0, 0]} barSize={22} />
                <Line type="monotone" dataKey="合計" stroke={COLORS.primary} strokeWidth={2} dot={{ r: 3, fill: COLORS.primary }} />
              </ComposedChart>
            </ResponsiveContainer>

            {/* 読み解きポイント */}
            <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
              <p className="text-[10px] text-emerald-800 leading-relaxed">
                <strong>📖 読み解きポイント</strong><br />
                令和3年度（2021年度）にコロナ交付金等の余剰により基金残高が急増しましたが、令和4年度（2022年度）以降は大型事業への支出や補填のため減少傾向に転じています。令和6年度（2024年度）時点で財政調整基金は約35億円で、市の目標値（25億円）は上回っているものの、ピーク時（約41億円）からは約15%減少しています。
              </p>
            </div>
          </ChartSection>
        )}

        {/* 4. 財政健全度指標の推移 */}
        {activeTab === 'indicator' && (
          <ChartSection
            title="📊 財政健全度指標の推移"
            subtitle="実質収支比率（黒字幅）、実質単年度収支比率（単年の黒字/赤字幅）、財政調整基金残高比率（貯金の厚み）の推移です。"
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={indicatorChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[-5, 20]} label={{ value: '%', angle: -90, position: 'insideLeft', style: { fontSize: 10, fill: '#94a3b8' } }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <ReferenceLine y={0} stroke="#94a3b8" strokeDasharray="3 3" />
                <Line type="monotone" dataKey="実質収支比率" stroke={COLORS.emerald} strokeWidth={2} dot={{ r: 4, fill: COLORS.emerald }} />
                <Line type="monotone" dataKey="実質単年度収支比率" stroke={COLORS.rose} strokeWidth={2} dot={{ r: 4, fill: COLORS.rose }} />
                <Line type="monotone" dataKey="基金残高比率" stroke={COLORS.sky} strokeWidth={2} dot={{ r: 4, fill: COLORS.sky }} />
              </LineChart>
            </ResponsiveContainer>

            {/* 用語解説 */}
            <div className="mt-4 space-y-2">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-[10px] text-slate-700 leading-relaxed">
                  <strong className="text-emerald-700">● 実質収支比率</strong>：歳入から歳出を引いた「黒字額」の割合。3〜5%程度が健全とされます。
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-[10px] text-slate-700 leading-relaxed">
                  <strong className="text-rose-700">● 実質単年度収支比率</strong>：その年だけの実質的な黒字/赤字。マイナスは「単年度では赤字だった」ことを意味します。
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-[10px] text-slate-700 leading-relaxed">
                  <strong className="text-sky-700">● 財政調整基金残高比率</strong>：標準財政規模に対する貯金の割合。高いほど余裕があります。
                </p>
              </div>
            </div>
          </ChartSection>
        )}
      </div>
    </main>
  );
}
