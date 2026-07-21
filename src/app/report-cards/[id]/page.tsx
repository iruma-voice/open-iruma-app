import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Target, CheckCircle2, Circle, Clock, MessageSquare } from 'lucide-react';
import ExpandableImage from '../../../components/ExpandableImage';
import fs from 'fs';
import path from 'path';
import reportData from '../../../data/report-cards.json';
import { Metadata } from 'next';
import { extractDescription } from '../../../lib/metadata';

// Next.js static params generation
export function generateStaticParams() {
  return reportData.members.map((member) => ({
    id: member.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const member = reportData.members.find((m) => m.id === resolvedParams.id);
  
  if (!member) return {};

  const description = `${member.name}議員（会派：${member.faction}）の通信簿。公約の達成状況と議会での一般質問の傾向をデータから可視化します。`;

  const dynamicImagePath = path.join(process.cwd(), 'public', 'images', 'ogp', `report-card-${resolvedParams.id}.png`);
  const imageUrl = fs.existsSync(dynamicImagePath) ? `/images/ogp/report-card-${resolvedParams.id}.png` : '/images/ogp-default.png';

  return {
    title: `${member.name}議員の通信簿`,
    description,
    openGraph: {
      title: `${member.name}議員の通信簿 | いるまオープン議会`,
      description,
      type: 'article',
      images: [{ url: imageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${member.name}議員の通信簿`,
      description,
    },
  };
}

async function getMemberData(id: string) {
  const membersDir = path.join(process.cwd(), 'src/data/members');
  if (!fs.existsSync(membersDir)) return null;

  const filePath = path.join(membersDir, `${id}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  
  console.log(`[DEBUG] Member data not found for id=${id}.`);
  return null;
}

export default async function MemberReportCardPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const member = await getMemberData(params.id);
  
  if (!member) {
    return <div className="p-8 text-center">データが見つかりませんでした。</div>;
  }

  const displayProgress = Math.min(member.progressRate, 100);

  return (
    <div className="w-full bg-gray-50 min-h-screen pb-24 font-sans text-gray-800">
      
      {/* Header Profile */}
      <div className="bg-white px-5 pt-8 pb-6 shadow-sm rounded-b-3xl relative z-10">
        <Link href="/report-cards" className="inline-flex items-center gap-1 text-sm text-blue-600 font-bold mb-4 bg-blue-50 px-3 py-1.5 rounded-full active:scale-95 transition-transform">
          <ArrowLeft className="w-4 h-4" />
          一覧へ戻る
        </Link>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center font-bold text-blue-700 text-2xl shadow-inner border-4 border-white">
            {member.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 leading-tight">{member.name}</h1>
            {member.faction && (
              <span className="inline-block mt-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md border border-gray-200 font-semibold">
                {member.faction}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mt-6 space-y-6">
        
        {/* Manifesto Image */}
        {member.manifestoImage && (
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <span className="bg-blue-100 text-blue-600 p-1 rounded-md"><Target className="w-4 h-4" /></span>
                選挙公報・公約
              </h2>
              <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full font-medium">
                🔍 タップして拡大
              </span>
            </div>
            <ExpandableImage src={member.manifestoImage} alt={`${member.name} 選挙公報`} />
          </section>
        )}

        {/* Manifesto Checklist */}
        {member.checklist && member.checklist.length > 0 && (
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-end mb-4">
               <h2 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                 <span className="bg-green-100 text-green-600 p-1 rounded-md"><CheckCircle2 className="w-4 h-4" /></span>
                 公約進捗チェックリスト
               </h2>
               <div className="text-right">
                  <span className="text-2xl font-black text-blue-600 leading-none">{member.progressRate}<span className="text-sm">%</span></span>
               </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-5">
              <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                <span>{member.manifestoProgressed} / {member.manifestoTotal} 項目が進展</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                  style={{ width: `${displayProgress}%` }}
                />
              </div>
            </div>

            <ul className="space-y-3">
              {member.checklist.map((item: any, idx: number) => (
                <li key={idx} className={`flex items-start gap-2.5 p-3 rounded-xl border ${item.completed ? 'bg-green-50/50 border-green-100 text-green-900' : 'bg-gray-50 border-gray-100 text-slate-600'}`}>
                  <div className="mt-0.5 shrink-0">
                    {item.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm leading-snug font-medium`}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Timeline */}
        {member.timeline && member.timeline.length > 0 && (
          <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-900 mb-5 flex items-center gap-1.5">
              <span className="bg-orange-100 text-orange-600 p-1 rounded-md"><Clock className="w-4 h-4" /></span>
              過去の一般質問履歴（タイムライン）
            </h2>
            
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pb-4">
              {member.timeline.map((session: any, idx: number) => (
                <div key={idx} className="relative pl-6">
                  {/* Dot */}
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-orange-400" />
                  
                  <div className="mb-1">
                    <span className="text-[10px] font-black tracking-wider text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
                      {session.session}
                    </span>
                  </div>
                  
                  <h3 className="text-[13px] font-bold text-gray-900 leading-snug mt-2 mb-3">
                    {session.theme}
                  </h3>
                  
                  <div className="space-y-3">
                    {session.background && (
                      <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 leading-relaxed border border-gray-100">
                        <span className="font-bold text-gray-800 block mb-1 text-[10px]">課題の背景</span>
                        {session.background}
                      </div>
                    )}
                    {session.proposal && (
                      <div className="bg-blue-50/50 rounded-lg p-3 text-xs text-blue-900 leading-relaxed border border-blue-100/50">
                        <span className="font-bold text-blue-700 block mb-1 text-[10px]">議員の主張・提案</span>
                        {session.proposal}
                      </div>
                    )}
                    {session.response && (
                      <div className="bg-emerald-50 rounded-lg p-3 text-xs text-gray-800 leading-relaxed border border-emerald-100">
                        <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1 text-[11px]">
                          💬 市側の回答・結果
                        </span>
                        {session.response}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
