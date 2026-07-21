import React from 'react';
import Link from 'next/link';
import { Award, Target, MessageCircle, ChevronRight, ArrowRight } from 'lucide-react';
import reportData from '../../data/report-cards.json';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '議員の通信簿',
  description: '入間市議会議員22人の公約達成状況や議会での活動データを可視化した通信簿です。',
  openGraph: {
    title: '議員の通信簿 | いるまオープン議会',
    description: '入間市議会議員22人の公約達成状況や議会での活動データを可視化した通信簿です。',
    images: [{ url: '/images/ogp/report-cards-top.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '議員の通信簿 | いるまオープン議会',
    description: '入間市議会議員22人の公約達成状況や議会での活動データを可視化した通信簿です。',
  },
};

export default function ReportCardsPage() {
  const members = reportData.members;

  const getCategoryStyle = (cat: string) => {
    if (cat.includes('教育') || cat.includes('学校') || cat.includes('子育て')) {
      return 'bg-blue-50 text-blue-700 border-blue-100/50';
    }
    if (cat.includes('福祉') || cat.includes('高齢者') || cat.includes('健康') || cat.includes('医療') || cat.includes('ジェンダー') || cat.includes('こども')) {
      return 'bg-orange-50 text-orange-700 border-orange-100/50';
    }
    if (cat.includes('環境') || cat.includes('生活') || cat.includes('ごみ') || cat.includes('自然') || cat.includes('気候')) {
      return 'bg-green-50 text-green-700 border-green-100/50';
    }
    if (cat.includes('都市') || cat.includes('防災') || cat.includes('インフラ') || cat.includes('交通') || cat.includes('まちづくり') || cat.includes('公園') || cat.includes('水道')) {
      return 'bg-amber-50 text-amber-700 border-amber-100/50';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200/50';
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-24">
      {/* Header Area */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 text-white px-5 pt-8 pb-6 rounded-b-[2rem] shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Award className="w-40 h-40 -mr-8 -mt-8" />
        </div>
        <div className="relative z-10">
          <h1 className="text-xl font-extrabold tracking-tight mb-2 flex items-center gap-2">
            市議会議員通信簿
          </h1>
          <p className="text-blue-50 text-[11px] leading-relaxed opacity-95">
            一般質問とは、議員が市の行政全般に対して疑問や方針を問いただす場です。各議員は定例会ごとに、年間最大4回登壇して質問する機会があります。本ページでは各議員の実績や公約の進捗状況を可視化しています。
          </p>
        </div>
      </div>

      {/* Docs Links */}
      <div className="px-4 mt-4 flex flex-col gap-2">
        <Link href="/report-cards/docs/01_評価基準とAIプロンプト" className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
          <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <span className="bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-md text-[10px]">AI</span>
            評価基準とAIプロンプトについて
          </span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>
        <Link href="/report-cards/docs/02_免責事項とフィードバック窓口" className="flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
          <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-md text-[10px]">注意</span>
            免責事項とフィードバック窓口
          </span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>

      {/* List Area */}
      <div className="px-4 mt-6 space-y-4">
        {members.map((member, idx) => {
           // We cap the progress rate at 100 for display safety
           const displayProgress = Math.min(member.progressRate, 100);
           
           return (
             <Link href={`/report-cards/${member.id}`} key={member.id} className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden active:scale-[0.98] transition-transform">
               {/* Header: Name and Progress Number */}
               <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-600 text-lg shadow-inner">
                     {member.name.charAt(0)}
                   </div>
                   <div>
                     <div className="flex items-center gap-2 flex-wrap">
                       <h2 className="text-lg font-bold text-gray-900 leading-tight">{member.name}</h2>
                       {member.faction && (
                         <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded border border-gray-200">{member.faction}</span>
                       )}
                     </div>
                     <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                       <MessageCircle className="w-3 h-3" />
                       <span>年間質問: <span className="font-semibold text-gray-700">{member.questionCount}回</span></span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="text-right">
                    <div className="text-2xl font-black text-blue-600 leading-none">
                      {member.progressRate}<span className="text-sm font-bold">%</span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 font-medium">
                      公約進捗
                    </div>
                 </div>
               </div>

               {/* Progress Bar */}
               <div className="mb-4">
                 <div className="flex justify-between text-[10px] font-medium mb-1">
                   <span className="text-blue-600 flex items-center gap-1">
                     <Target className="w-3 h-3" />
                     {member.manifestoProgressed} / {member.manifestoTotal} 項目進展
                   </span>
                 </div>
                 <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                     style={{ width: `${displayProgress}%` }}
                   />
                 </div>
               </div>

               {/* Categories */}
               {member.categories && member.categories.length > 0 && (
                 <div className="mb-3">
                   <div className="flex flex-wrap gap-1.5">
                     {member.categories.map((cat, i) => (
                       <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${getCategoryStyle(cat)}`}>
                         {cat}
                       </span>
                     ))}
                   </div>
                 </div>
               )}

               {/* Themes preview */}
               {member.themes && member.themes.length > 0 && (
                 <div className="bg-gray-50 rounded-xl p-3 mt-2 border border-gray-100/80">
                   <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">主な質問テーマ</p>
                   <ul className="text-xs text-gray-600 space-y-2 mt-2">
                     {member.themes.flatMap(t => t.split(/\s*\/\s*/)).filter(Boolean).slice(0, 4).map((theme, i) => (
                       <li key={i} className="flex items-start gap-1.5">
                         <span className="text-gray-300 mt-0.5 text-[10px]">■</span>
                         <span className="leading-relaxed">{theme}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
               )}
               
                {/* View Details Hint */}
               <div className="mt-3 flex justify-end items-center text-blue-500 text-[10px] font-bold">
                 <span>詳細・公約リストを見る</span>
                 <ChevronRight className="w-3 h-3 ml-0.5" />
               </div>
             </Link>
           );
        })}
      </div>
    </div>
  );
}
