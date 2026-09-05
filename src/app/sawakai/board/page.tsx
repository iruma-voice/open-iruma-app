import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { AgendaCard, AgendaData } from '@/components/sawakai/AgendaCard';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';

// Next.jsのキャッシュを無効化（常に最新のデータを表示）
export const revalidate = 0;

export default async function BoardPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  
  if (!supabaseUrl || !supabaseKey) {
    return <div className="p-8 text-center text-red-500">データベース設定が不足しています</div>;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data: agendas, error } = await supabase
    .from('sawahukai_agendas')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching agendas:', error);
    return <div className="p-8 text-center text-red-500">アジェンダの取得に失敗しました</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-emerald-700 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/sawakai" className="flex items-center text-emerald-100 hover:text-white transition-colors">
            <ArrowLeft size={20} className="mr-1" />
            <span className="font-medium">戻る</span>
          </Link>
          <h1 className="font-bold text-lg">みんなのアジェンダ</h1>
          <div className="w-16"></div> {/* レイアウトバランス用 */}
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">いるまモヤモヤ茶話会</h2>
          <p className="text-gray-600">
            市民のみなさんから寄せられた「モヤモヤ」と、そこから生まれた「問いかけ」の一覧です。
          </p>
        </div>

        {agendas && agendas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agendas.map((agenda) => (
              <AgendaCard
                key={agenda.id}
                agenda={{
                  title: agenda.title,
                  moyamoya: agenda.moyamoya,
                  core_wish: agenda.core_wish,
                  talk_theme: agenda.talk_theme,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">まだアジェンダがありません</h3>
            <p className="text-gray-500 mb-6">
              AIファシリテーターと会話して、最初のアジェンダを投稿してみましょう！
            </p>
            <Link 
              href="/sawakai/chat" 
              className="inline-flex items-center justify-center bg-emerald-600 text-white font-bold py-3 px-6 rounded-full shadow hover:bg-emerald-700 transition-colors"
            >
              チャットをはじめる
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
