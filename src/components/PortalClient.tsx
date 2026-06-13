'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, AlertTriangle, Bell, Info, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortalClient({ data }: { data: any }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');

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
    
    // ステータス（議論中・解決済）フィルター
    if (activeStatus === 'ongoing') {
      // important と warning を「議論中」とする
      if (item.type !== 'important' && item.type !== 'warning') return false;
    } else if (activeStatus === 'resolved') {
      // tip と info を「解決済」とする
      if (item.type !== 'tip' && item.type !== 'info') return false;
    }
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

      {/* セグメントコントロール（議論状況の切り替え） */}
      <div className="px-4 mt-2">
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl backdrop-blur-sm">
          <button 
            onClick={() => setActiveStatus('all')}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-200 active:scale-[0.98] ${activeStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            すべて
          </button>
          <button 
            onClick={() => setActiveStatus('ongoing')}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-200 active:scale-[0.98] ${activeStatus === 'ongoing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            🔥 議論中
          </button>
          <button 
            onClick={() => setActiveStatus('resolved')}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-xl transition-all duration-200 active:scale-[0.98] ${activeStatus === 'resolved' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            ✅ 解決済
          </button>
        </div>
      </div>

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

        {/* 課題一覧への導線 */}
        <div className="mt-8">
          <Link href="/issues" className="flex items-center justify-center w-full bg-blue-50/70 hover:bg-blue-100/80 text-blue-700 font-bold py-4 rounded-2xl transition-all active:scale-[0.98]">
            <FileText className="w-5 h-5 mr-2" />
            すべての課題を一覧で見る
          </Link>
        </div>
      </div>
    </div>
  );
}
