'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, FileText, Save, AlertCircle } from 'lucide-react';

type DisclosureItem = {
  period: string;
  periodInt: number;
  title: string;
  matchedFiles: string[];
  categoryKey: string;
  verified?: boolean;
  memo?: string;
};

const CATEGORIES = {
  "city-hall": "【特集1】市庁舎建替え・公共施設再編",
  "energy-decarbonization": "【特集2】地域新電力＆脱炭素・公用EV",
  "promotion-culture": "【特集3】パーパス策定＆プロモーション・観光・文化",
  "governance-politics": "【特集4】市長公約検証＆政治資金・公務日程・ガバナンス",
  "urban-infrastructure": "【分野1】都市開発・インフラ・交通",
  "welfare-education": "【分野2】福祉・教育",
  "economy-industry": "【分野3】産業・経済・農業",
  "admin-finance": "【分野4】行財政・デジタル・SDGs",
  "disaster-crisis": "【分野5】防災・危機管理・基地",
  "sports-health": "【分野6】スポーツ・健康",
  "audit-contract": "【分野7】監査・公共工事・契約",
  "hr-operations": "【分野8】人事・行政運営・議会",
  "uncategorized": "【分野9】その他・未分類"
};

export default function DisclosureReviewPage() {
  const [data, setData] = useState<DisclosureItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/disclosures/mapping')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('保存中...');
    try {
      const res = await fetch('/api/disclosures/mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setSaveStatus('保存完了！');
        setTimeout(() => setSaveStatus(null), 3000);
      } else {
        setSaveStatus('エラーが発生しました');
      }
    } catch (err) {
      console.error(err);
      setSaveStatus('通信エラー');
    }
    setIsSaving(false);
  };

  const updateCurrentItem = (updates: Partial<DisclosureItem>) => {
    const newData = [...data];
    newData[selectedIndex] = { ...newData[selectedIndex], ...updates };
    setData(newData);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">データを読み込んでいます...</div>;
  }

  const currentItem = data[selectedIndex];

  return (
    <div className="fixed inset-0 w-screen h-screen z-[100] bg-slate-50 flex overflow-hidden text-sm">
      
      {/* Sidebar List (Left) - Made narrower (w-1/4) so right side is wider */}
      <div className="w-[30%] min-w-[300px] border-r bg-white flex flex-col h-full shadow-sm z-10">
        <div className="p-4 border-b bg-slate-100 flex justify-between items-center shrink-0">
          <h1 className="font-bold text-base text-slate-800">マッピング確認</h1>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded shadow-sm disabled:opacity-50 transition-colors text-xs font-medium"
          >
            <Save size={14} />
            保存
          </button>
        </div>
        {saveStatus && (
          <div className="bg-blue-50 text-blue-700 px-4 py-2 text-xs text-center border-b font-medium">
            {saveStatus}
          </div>
        )}
        
        <div className="overflow-y-auto flex-1 p-2 space-y-1">
          {data.map((item, idx) => {
            const hasMatches = item.matchedFiles.length > 0;
            return (
              <div 
                key={idx}
                onClick={() => setSelectedIndex(idx)}
                className={`p-3 rounded cursor-pointer border ${idx === selectedIndex ? 'bg-blue-50 border-blue-200 shadow-sm' : 'hover:bg-slate-50 border-transparent'} flex items-start gap-3 transition-colors`}
              >
                <div className="mt-1 shrink-0">
                  {item.verified ? (
                    <CheckCircle2 className="text-green-500" size={16} />
                  ) : (
                    <Circle className="text-slate-300" size={16} />
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex gap-2 items-center mb-1">
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">{item.period}</span>
                    {!hasMatches && <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium border border-amber-200">未紐付</span>}
                    {item.memo && <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-medium border border-purple-200">メモ有</span>}
                  </div>
                  <div className="truncate text-slate-800 font-medium text-xs leading-relaxed">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-1">
                    {CATEGORIES[item.categoryKey as keyof typeof CATEGORIES] || '未分類'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Content (Right) - Takes remaining space */}
      <div className="flex-1 flex flex-col h-full bg-white overflow-y-auto">
        {currentItem ? (
          <div className="flex flex-col h-full w-full">
            
            {/* Top Editing Area (Compact) */}
            <div className="bg-slate-50 border-b p-4 shadow-sm shrink-0">
              <div className="max-w-5xl mx-auto space-y-4">
                
                <div className="flex items-start gap-3">
                  <span className="bg-slate-200 text-slate-700 px-2 py-1 rounded text-xs font-mono font-medium shrink-0 mt-1">
                    {currentItem.period}
                  </span>
                  <h2 className="text-lg font-bold text-slate-900 leading-snug">
                    {currentItem.title}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">カテゴリ (手動変更)</label>
                    <select 
                      value={currentItem.categoryKey}
                      onChange={(e) => updateCurrentItem({ categoryKey: e.target.value })}
                      className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-slate-700 bg-white py-1.5 text-xs"
                    >
                      {Object.entries(CATEGORIES).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">備考・メモ</label>
                    <input 
                      type="text"
                      value={currentItem.memo || ''}
                      onChange={(e) => updateCurrentItem({ memo: e.target.value })}
                      placeholder="除外理由や確認事項などを入力..."
                      className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-slate-700 bg-white py-1.5 text-xs"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ステータス</label>
                    <label className="flex items-center gap-2 cursor-pointer py-1.5 px-3 border border-slate-300 rounded-md hover:bg-slate-100 transition-colors bg-white">
                      <input 
                        type="checkbox"
                        checked={currentItem.verified || false}
                        onChange={(e) => updateCurrentItem({ verified: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-slate-300"
                      />
                      <span className="font-bold select-none text-slate-700 text-xs">目視確認・修正完了</span>
                    </label>
                  </div>
                </div>

              </div>
            </div>

            {/* PDFs Display Area - Maximized */}
            <div className="flex-1 bg-slate-200 p-4 overflow-y-auto">
              <div className="max-w-5xl mx-auto h-full flex flex-col space-y-3">
                <div className="flex justify-between items-center shrink-0">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <FileText size={16} className="text-blue-600" />
                    紐付けられたPDF ({currentItem.matchedFiles.length}件)
                  </h3>
                </div>
                
                {currentItem.matchedFiles.length === 0 ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-md flex items-start gap-3 shadow-sm">
                    <AlertCircle className="shrink-0 mt-0.5 text-amber-600" size={18} />
                    <div>
                      <p className="font-bold text-sm">紐付くPDFが見つかりませんでした。</p>
                      <p className="text-xs mt-1 opacity-80">
                        開示不存在であったか、ファイル名の表記揺れでマッチしていない可能性があります。
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col space-y-4">
                    {currentItem.matchedFiles.map((file, fIdx) => {
                      const filename = file.split('\\').pop() || file.split('/').pop() || file;
                      const pdfUrl = `/api/disclosures/pdf?path=${encodeURIComponent(file)}`;
                      
                      return (
                        <div key={fIdx} className="border rounded-lg overflow-hidden bg-white shadow-md flex flex-col flex-1 min-h-[600px]">
                          <div className="bg-slate-800 px-4 py-2 flex justify-between items-center shrink-0">
                            <span className="font-medium text-slate-200 break-all text-xs flex items-center gap-2">
                              <FileText size={14} className="text-slate-400" />
                              {filename}
                            </span>
                            <a href={pdfUrl} target="_blank" rel="noreferrer" className="text-[10px] text-white hover:text-blue-200 flex items-center gap-1 font-bold bg-slate-700 px-2 py-1 rounded shadow-sm border border-slate-600 transition-colors">
                              別タブで開く
                            </a>
                          </div>
                          <iframe 
                            src={pdfUrl} 
                            className="w-full flex-1 border-none bg-slate-100"
                            title={filename}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400 font-medium">
            左のリストから項目を選択してください
          </div>
        )}
      </div>
    </div>
  );
}
