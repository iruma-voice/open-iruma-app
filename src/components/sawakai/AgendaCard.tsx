import React from 'react';

export interface AgendaData {
  title: string;
  moyamoya: string;
  core_wish: string;
  talk_theme: string;
}

interface AgendaCardProps {
  agenda: AgendaData;
  className?: string;
}

export function AgendaCard({ agenda, className = '' }: AgendaCardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden ${className}`}>
      {/* ヘッダー部分：タイトル */}
      <div className="bg-emerald-600 px-5 py-4">
        <h3 className="text-white font-bold text-lg leading-tight">
          {agenda.title}
        </h3>
      </div>
      
      {/* ボディ部分 */}
      <div className="p-5 space-y-4">
        {/* モヤモヤ */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">いまのモヤモヤ</span>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed">
            {agenda.moyamoya}
          </p>
        </div>

        {/* 本当のねがい */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">本当のねがい</span>
          </div>
          <p className="text-gray-800 text-sm leading-relaxed">
            {agenda.core_wish}
          </p>
        </div>

        {/* 問いかけ */}
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-orange-600 font-bold text-sm">💡 みんなへの問いかけ</span>
          </div>
          <p className="text-gray-900 font-medium">
            {agenda.talk_theme}
          </p>
        </div>
      </div>
    </div>
  );
}
