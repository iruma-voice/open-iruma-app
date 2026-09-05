'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, Bell, Info, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortalClient({ data }: { data: any }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // 全アイテムをフラットな配列に展開
  const allItems = data.categories.flatMap((cat: any) => 
    cat.items.map((item: any) => ({ ...item, categoryTitle: cat.title }))
  );

  // カテゴリ名のみのリスト
  const categories = data.categories.map((cat: any) => cat.title);

  // フィルタリング処理
  const filteredItems = allItems.filter((item: any) => {
    // カテゴリフィルター
    if (activeCategory !== 'all' && item.categoryTitle !== activeCategory) return false;
    
    return true;
  });

  // 全件表示（一時的な仕様変更）
  const displayItems = filteredItems;

  // バッジのレンダリング
  const renderBadge = (type: string) => {
    switch (type) {
      case 'important':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded"><AlertTriangle className="w-3 h-3"/> 重要</span>;
      case 'warning':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded"><Bell className="w-3 h-3"/> 注目</span>;
      case 'tip':
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded"><Info className="w-3 h-3"/> 情報</span>;
    }
  };

  return (
    <div className="w-full">

      {/* カテゴリ・カルーセル（横スクロール） */}
      <div className="mt-6 px-4">
        <div 
          className="flex overflow-x-auto gap-2.5 pb-4 -mx-4 px-4 snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Hide scrollbar for webkit via inline styles is hard, so relying on standard CSS above */}
          <style dangerouslySetInnerHTML={{__html: `::-webkit-scrollbar { display: none; }`}} />
          <button 
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 snap-start px-5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 active:scale-[0.96] shadow-sm border ${activeCategory === 'all' ? 'bg-slate-900 text-white border-transparent' : 'bg-white/80 backdrop-blur-md text-slate-600 border-slate-200/60'}`}
          >
            すべて
          </button>
          {categories.map((cat: string, i: number) => (
            <button 
              key={i}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 snap-start px-5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 active:scale-[0.96] shadow-sm border ${activeCategory === cat ? 'bg-slate-900 text-white border-transparent' : 'bg-white/80 backdrop-blur-md text-slate-600 border-slate-200/60'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ▼ 追加：モヤモヤ茶話会 イベントバナー ▼ */}
      <div className="px-4 mt-8">
        <Link href="/sawakai" className="block group">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-800 p-6 text-white shadow-md transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
            {/* 背景の装飾 */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 space-y-3">
                <span className="inline-block rounded-full bg-emerald-100/20 px-3 py-1 text-xs font-semibold tracking-wider text-emerald-50 backdrop-blur-sm">
                  🗓 2026年9月18日(金) 開催
                </span>
                <h2 className="text-2xl font-bold tracking-tight">いるまモヤモヤ茶話会</h2>
                <p className="text-sm font-medium text-emerald-100">狭山茶シーシャ × 市政ダイアローグ</p>
                
                <ul className="text-sm text-emerald-50/90 space-y-1 mt-2">
                  <li>✓ 事前にスマホのAIでモヤモヤを整理</li>
                  <li>✓ 当日はお店またはオンラインでゆるく対話</li>
                  <li>✓ 「正解」を出さず、違いを楽しむフラットな場</li>
                </ul>
              </div>
              
              <div className="mt-4 md:mt-0 flex shrink-0 items-center">
                <span className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-900 transition-colors group-hover:bg-emerald-50">
                  詳細を見て参加する
                  <ChevronRight className="h-4 w-4 stroke-2" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>
      {/* ▲ 追加終了 ▲ */}

      {/* 注目の地域課題リスト */}
      <div className="px-4 mt-8">
        <h2 className="text-base font-extrabold text-gray-900 mb-4 flex items-center tracking-tight">
          注目の課題ピックアップ <span className="ml-2 text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{displayItems.length}件</span>
        </h2>
        
        {displayItems.length > 0 ? (
          <div className="flex flex-col gap-4">
            <AnimatePresence mode="popLayout">
              {displayItems.map((item: any, i: number) => (
                <motion.div
                  key={item.url || item.title}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Link href={item.url || '#'} className="block group outline-none">
                    <article className="bg-white rounded-[1.5rem] p-5 border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] transition-all duration-300 active:scale-[0.98] relative overflow-hidden flex items-center justify-between">
                      <div className="flex-1 pr-4 min-w-0">
                        <div className="mb-2.5 flex items-center gap-2">
                          {renderBadge(item.type)}
                          <span className="text-[10px] text-slate-400 font-medium truncate">{item.categoryTitle.replace(/^[^\s]+\s/, '')}</span>
                        </div>
                        <h4 className="text-[16px] font-bold text-slate-900 mb-1.5 leading-snug group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors ml-2 bg-slate-50 p-2.5 rounded-full group-active:bg-slate-100">
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-12 text-center bg-white rounded-xl border border-gray-100 border-dashed">
            <p className="text-gray-400 font-medium text-sm">該当する課題が見つかりません</p>
          </div>
        )}


      </div>
    </div>
  );
}
