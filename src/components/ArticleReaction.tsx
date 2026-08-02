'use client';

import { useState, useEffect } from 'react';
import { ThumbsUp, BookOpen, AlertTriangle, Eye } from 'lucide-react';

interface ArticleReactionProps {
  articleId: string;
}

export default function ArticleReaction({ articleId }: ArticleReactionProps) {
  const [attentionCount, setAttentionCount] = useState<number>(0);
  const [hasReactedAttention, setHasReactedAttention] = useState<boolean>(false);
  const [feedbackSent, setFeedbackSent] = useState<boolean>(false);

  useEffect(() => {
    // 1. Fetch current attention count
    fetch(`/api/reaction?article_id=${articleId}`)
      .then(res => res.json())
      .then(data => {
        if (typeof data.count === 'number') {
          setAttentionCount(data.count);
        }
      })
      .catch(console.error);
      
    // 2. Check local storage for previous reactions
    const attentionReacted = localStorage.getItem(`attention_${articleId}`);
    if (attentionReacted) setHasReactedAttention(true);

    const feedback = localStorage.getItem(`feedback_${articleId}`);
    if (feedback) setFeedbackSent(true);
  }, [articleId]);

  const handleAttention = async () => {
    if (hasReactedAttention) return;

    // Optimistic UI
    setAttentionCount(prev => prev + 1);
    setHasReactedAttention(true);
    localStorage.setItem(`attention_${articleId}`, 'true');

    // API Call to KV
    fetch('/api/reaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ article_id: articleId }),
    }).catch(console.error);

    // GA4 Event
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'click_attention', {
        article_id: articleId,
      });
    }
  };

  const handleFeedback = (feedbackType: 'clear' | 'needs_more' | 'alert') => {
    if (feedbackSent) return;

    setFeedbackSent(true);
    localStorage.setItem(`feedback_${articleId}`, feedbackType);

    // API Call to KV for Feedback
    fetch('/api/reaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        article_id: articleId,
        type: 'feedback',
        feedback_type: feedbackType
      }),
    }).catch(console.error);

    // GA4 Event only
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'click_feedback', {
        article_id: articleId,
        feedback_type: feedbackType
      });
    }
  };

  return (
    <div className="mt-12 mb-8 pt-8 border-t border-slate-200">
      
      {/* 1. Main CTA (関心の可視化) */}
      <div className="flex flex-col items-center mb-12">
        <p className="text-sm font-medium text-slate-500 mb-4">
          {attentionCount > 0 ? `現在、${attentionCount}人の市民がこの課題に注目しています` : 'この課題に注目しますか？'}
        </p>
        <button
          onClick={handleAttention}
          disabled={hasReactedAttention}
          className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 w-full sm:w-auto min-w-[280px] ${
            hasReactedAttention
              ? 'bg-slate-100 text-slate-400 cursor-default border border-slate-200'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-[0_8px_16px_-6px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_20px_-8px_rgba(37,99,235,0.6)]'
          }`}
        >
          <Eye className={`w-6 h-6 ${hasReactedAttention ? 'text-slate-400' : 'text-blue-100 group-hover:text-white'}`} />
          <span>{hasReactedAttention ? '注目しています' : '今後の議論に注目したい'}</span>
        </button>
      </div>

      {/* 2. Micro Feedback (記事品質の評価) */}
      <div className="bg-slate-50 rounded-2xl p-6 sm:p-8">
        <h3 className="text-center font-bold text-slate-700 mb-6">この記事は参考になりましたか？</h3>
        
        {feedbackSent ? (
          <div className="text-center py-4 px-6 bg-green-50 text-green-700 rounded-xl border border-green-100">
            <p className="font-medium">フィードバックありがとうございます。</p>
            <p className="text-sm mt-1 opacity-80">いただいたご意見は今後の情報発信に活用させていただきます。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleFeedback('clear')}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <ThumbsUp className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
              <span className="text-sm font-medium text-slate-600 group-hover:text-blue-700">分かりやすい</span>
            </button>
            <button
              onClick={() => handleFeedback('needs_more')}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition-colors group"
            >
              <BookOpen className="w-6 h-6 text-slate-400 group-hover:text-orange-500" />
              <span className="text-sm font-medium text-slate-600 group-hover:text-orange-700">もっと詳しく知りたい</span>
            </button>
            <button
              onClick={() => handleFeedback('alert')}
              className="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 transition-colors group"
            >
              <AlertTriangle className="w-6 h-6 text-slate-400 group-hover:text-red-500" />
              <span className="text-sm font-medium text-slate-600 group-hover:text-red-700">事実と違う点がある</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
