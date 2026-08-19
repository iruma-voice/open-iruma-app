'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Heart, MoreHorizontal, AlertCircle, CheckCircle2, Lightbulb, Send } from 'lucide-react';
import { motion } from 'framer-motion';

type Proposal = {
  id: string;
  content: string;
  category: string;
  likes_count: number;
  reports_count: number;
  status: string;
  created_at: string;
};

const CATEGORIES = ['福祉・子育て', '教育', '都市基盤・交通', '環境', '産業・観光', 'その他'];

export default function ProposalDashboard() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sort, setSort] = useState<'new' | 'popular'>('new');
  
  const [likedProposals, setLikedProposals] = useState<string[]>([]);
  const [reportedProposals, setReportedProposals] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // 初回レンダリング時にローカルストレージから取得
  useEffect(() => {
    try {
      const storedLikes = localStorage.getItem('liked_proposals');
      if (storedLikes) setLikedProposals(JSON.parse(storedLikes));
      
      const storedReports = localStorage.getItem('reported_proposals');
      if (storedReports) setReportedProposals(JSON.parse(storedReports));
    } catch (e) {
      console.error('Failed to parse localStorage', e);
    }
  }, []);

  const fetchProposals = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('sort', sort);
      if (filterCategory) {
        params.append('category', filterCategory);
      }
      
      const res = await fetch(`/api/proposals?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProposals(data);
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setIsLoading(false);
    }
  }, [sort, filterCategory]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  // 他の領域をクリックした際にメニューを閉じる
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.length === 0 || content.length > 200 || !category) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, category }),
      });

      if (res.ok) {
        setContent('');
        setCategory('');
        fetchProposals();
        // 完了時はシンプルにリセット。alertは過剰な場合があるので外すか、Toastが良いですが一旦標準alertで。
        // UX向上のため、今回は状態リセットのみでフォームの下にフィードバックを出すなども検討できますが、
        // 既存挙動を維持しつつスッキリさせます。
      } else {
        const errorData = await res.json();
        alert(`エラー: ${errorData.error || '投稿に失敗しました'}`);
      }
    } catch (error) {
      alert('ネットワークエラーが発生しました。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    if (likedProposals.includes(id)) return;

    // 楽観的UI更新
    const newLiked = [...likedProposals, id];
    setLikedProposals(newLiked);
    localStorage.setItem('liked_proposals', JSON.stringify(newLiked));
    
    setProposals((prev) => 
      prev.map(p => p.id === id ? { ...p, likes_count: p.likes_count + 1 } : p)
    );

    try {
      await fetch(`/api/proposals/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like' }),
      });
    } catch (error) {
      console.error('Failed to like', error);
    }
  };

  const handleReport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (reportedProposals.includes(id)) return;
    
    const confirmReport = window.confirm('この投稿を不適切として報告しますか？');
    if (!confirmReport) return;

    const newReported = [...reportedProposals, id];
    setReportedProposals(newReported);
    localStorage.setItem('reported_proposals', JSON.stringify(newReported));
    setOpenMenuId(null);

    try {
      const res = await fetch(`/api/proposals/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'report' }),
      });
      
      if (res.ok) {
        alert('報告を受け付けました。');
      }
    } catch (error) {
      console.error('Failed to report', error);
    }
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="space-y-8">
      
      {/* ヒーローセクション */}
      <section className="text-center space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          みんなの「一般質問」<br className="sm:hidden"/>アイデアボード
        </h1>
        
        <div className="bg-blue-50/70 p-5 rounded-2xl text-left shadow-sm border border-blue-100 flex items-start space-x-3">
          <div className="bg-blue-100 p-2 rounded-full shrink-0">
            <Lightbulb className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
            「これ、議会で聞いてほしい！」という日々の気づきや課題をシェアしてください。ここに集まった声と「いいね」の数は、議員が市へ質問・提案を行う際の強力なエビデンス（根拠）として活用されます。
            <br/><span className="text-xs text-slate-500 mt-2 inline-block">※すべての投稿が実際の質問として採用されるわけではありませんが、市民の関心度を測る重要なデータとなります。</span>
          </p>
        </div>
      </section>

      {/* 投稿フォーム */}
      <section className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold mb-4 text-slate-800">新しい課題・アイデアを投稿する</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="" disabled>カテゴリを選択してください</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="例：〇〇地区の通学路が暗くて危険。街灯を増やせないか？／保育園の手続きをもっとデジタル化してほしい、など。具体的な課題を教えてください。"
              className="w-full p-3 sm:p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none h-32 transition-colors placeholder:text-slate-400"
              required
              maxLength={200}
            />
            <div className="flex justify-between items-start mt-2">
              <span className="text-xs text-slate-500 flex items-start max-w-[80%]">
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0 mt-0.5" />
                ※特定の個人への誹謗中傷や、市政に無関係な投稿は予告なく非表示となります。
              </span>
              <span className={`text-xs font-medium shrink-0 ${content.length > 200 ? 'text-red-500' : 'text-slate-400'}`}>
                {content.length} / 200
              </span>
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting || content.length === 0 || content.length > 200 || !category}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-full transition-all disabled:bg-slate-300 disabled:text-slate-500 flex justify-center items-center shadow-sm active:scale-[0.98]"
          >
            {isSubmitting ? '送信中...' : (
              <>
                <Send className="w-5 h-5 mr-2" />
                この課題をシェアする
              </>
            )}
          </button>
        </form>
      </section>

      {/* タイムライン */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex bg-slate-200/60 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setSort('new')}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                sort === 'new' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              新着順
            </button>
            <button
              onClick={() => setSort('popular')}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                sort === 'popular' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              注目順
            </button>
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full sm:w-auto p-2 border border-slate-200 rounded-xl bg-white text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 shadow-sm"
          >
            <option value="">すべてのカテゴリ</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-400 font-medium animate-pulse">読み込み中...</div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-16 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
            まだアイデアがありません。<br/>最初の課題をシェアしてみましょう！
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map(proposal => {
              const isLiked = likedProposals.includes(proposal.id);
              const isReported = reportedProposals.includes(proposal.id);
              
              return (
                <div key={proposal.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative">
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center bg-slate-100 text-slate-600 border border-slate-200 text-xs px-2.5 py-1 rounded-full font-semibold">
                      {proposal.category}
                    </span>
                    <div className="relative">
                      <button
                        onClick={(e) => toggleMenu(proposal.id, e)}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-50 transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      {openMenuId === proposal.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg z-10 overflow-hidden">
                          {isReported ? (
                            <div className="px-4 py-3 text-sm text-slate-500 flex items-center bg-slate-50">
                              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
                              報告済み
                            </div>
                          ) : (
                            <button
                              onClick={(e) => handleReport(proposal.id, e)}
                              className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                            >
                              不適切な投稿として報告
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap mb-5">{proposal.content}</p>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-xs font-medium text-slate-400">
                      {new Date(proposal.created_at).toLocaleDateString('ja-JP', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <motion.button
                      whileTap={isLiked ? {} : { scale: 0.85 }}
                      onClick={() => handleLike(proposal.id)}
                      disabled={isLiked}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all font-semibold ${
                        isLiked 
                          ? 'bg-rose-50 text-rose-500 cursor-not-allowed border border-rose-100' 
                          : 'bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-500 border border-transparent'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{proposal.likes_count}</span>
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
