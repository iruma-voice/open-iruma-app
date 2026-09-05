'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';
import { AgendaCard, AgendaData } from '@/components/sawakai/AgendaCard';
import { createClient } from '@supabase/supabase-js';

// Supabase クライアント初期化 (環境変数は適宜設定されている前提)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Dify のセッションID
  const [conversationId, setConversationId] = useState<string | null>(null);
  // ユーザー(ブラウザ)の一意なID
  const [sessionId, setSessionId] = useState<string>('');
  
  // アジェンダデータ (JSONが正常にパースされたらセット)
  const [agendaData, setAgendaData] = useState<AgendaData | null>(null);
  // 送信ステータス
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  // 意図せぬ自動送信を防ぐための送信ボタン有効化フラグ
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初回マウント時にセッションIDを発行・取得し、初期メッセージを表示
  useEffect(() => {
    let sid = sessionStorage.getItem('sawakai_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      sessionStorage.setItem('sawakai_session_id', sid);
    }
    setSessionId(sid);

    setMessages([
      {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'こんにちは。AIファシリテーターです。\n日々の生活の中で、最近ちょっと気になったことや、「モヤモヤ」していることはありますか？どんな小さなことでも構いません。',
      },
    ]);
  }, []);

  // メッセージ追加時に自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // アジェンダ画面切り替え時の自動送信防止ディレイ
  useEffect(() => {
    if (agendaData) {
      setIsReadyToSubmit(false);
      const timer = setTimeout(() => {
        setIsReadyToSubmit(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [agendaData]);

  // マークダウンの ```json ``` 等を取り除いて純粋なJSON文字列にする
  const sanitizeJsonString = (str: string) => {
    const jsonRegex = /```(?:json)?\s*([\s\S]*?)\s*```/;
    const match = str.match(jsonRegex);
    return match ? match[1] : str;
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/sawakai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userMessage.content,
          conversation_id: conversationId,
          user: sessionId,
        }),
      });

      if (!res.ok) {
        let errorDetails = 'API request failed';
        try {
          const errorData = await res.json();
          errorDetails = errorData.error || errorDetails;
        } catch {
          // JSONパースできない場合はステータスコードを返す
          errorDetails = `Status: ${res.status}`;
        }
        throw new Error(errorDetails);
      }

      const data = await res.json();
      
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      const answerText = data.answer || '';
      const sanitized = sanitizeJsonString(answerText);

      try {
        // JSONパースを試みる
        const parsed = JSON.parse(sanitized);
        
        // 必須キーの存在チェック
        if (
          parsed['カードのタイトル'] &&
          parsed['いまのモヤモヤ'] &&
          parsed['本当のねがい'] &&
          parsed['みんなへの問いかけ']
        ) {
          // 成功時: アジェンダ画面へ移行
          setAgendaData({
            title: parsed['カードのタイトル'],
            moyamoya: parsed['いまのモヤモヤ'],
            core_wish: parsed['本当のねがい'],
            talk_theme: parsed['みんなへの問いかけ']
          });
          setIsLoading(false);
          return;
        } else {
          // キーが足りない場合は通常メッセージとして扱う
          throw new Error('Missing required JSON keys');
        }
      } catch (e) {
        // パースエラー等: フォールバック処理 (通常のチャットテキストとして表示)
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: answerText },
        ]);
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      // 通信エラー時
      const errorMsg = error.message || '不明なエラー';
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: `ごめんなさい、通信エラーが発生しました。（詳細: ${errorMsg}）\nもう一度送信してみてください。` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAgenda = async () => {
    if (!agendaData) return;
    setSubmitStatus('submitting');

    try {
      const { error } = await supabase
        .from('sawahukai_agendas')
        .insert({
          title: agendaData.title,
          moyamoya: agendaData.moyamoya,
          core_wish: agendaData.core_wish,
          talk_theme: agendaData.talk_theme,
          session_id: sessionId,
          status: 'published'
        });

      if (error) throw error;
      setSubmitStatus('success');
    } catch (error) {
      console.error('Insert error:', error);
      alert('送信に失敗しました。時間をおいて再試行してください。');
      setSubmitStatus('idle');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:max-w-md md:mx-auto md:border-x md:border-gray-200 md:shadow-xl relative overflow-hidden">
      
      {/* 画面切り替えのアニメーション管理 */}
      <AnimatePresence mode="wait">
        {!agendaData ? (
          // ====================
          // チャットUI
          // ====================
          <motion.div
            key="chat-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col h-screen"
          >
            {/* ヘッダー */}
            <header className="bg-emerald-600 text-white p-4 shadow-md z-10">
              <h1 className="text-center font-bold">モヤモヤ深掘りチャット</h1>
            </header>

            {/* メッセージエリア */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.role === 'user'
                        ? 'bg-emerald-500 text-white rounded-tr-sm'
                        : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-sm whitespace-pre-wrap'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white shadow-sm border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <Loader2 className="animate-spin text-emerald-500" size={20} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* 入力エリア */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
                placeholder="メッセージを入力..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 disabled:bg-gray-400 hover:bg-emerald-700 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        ) : submitStatus === 'success' ? (
          // ====================
          // サンクス画面 (投稿完了)
          // ====================
          <motion.div
            key="thanks-view"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col h-screen items-center justify-center p-6 bg-emerald-50"
          >
            <CheckCircle2 className="text-emerald-500 w-20 h-20 mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">投稿完了！</h2>
            <p className="text-center text-gray-600 mb-8 leading-relaxed">
              あなたのアジェンダが共有されました。<br/>
              当日の茶話会（またはオンライン）で<br/>さらに議論を深めましょう。
            </p>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 w-full text-center">
              <h3 className="font-bold text-gray-800 mb-4">オープンチャットに参加する</h3>
              <p className="text-sm text-gray-600 mb-6">
                当日の案内や、他の方のアジェンダなどをオープンチャットで共有します。ぜひご参加ください。
              </p>
              <a
                href="https://line.me/ti/g2/..." // TODO: 本番用URLに差し替え
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full bg-[#06C755] text-white font-bold py-3 px-4 rounded-xl shadow hover:opacity-90 transition-opacity"
              >
                LINEで参加する
              </a>
            </div>
            
            <a href="/sawakai/board" className="mt-8 text-emerald-600 font-medium hover:underline">
              みんなのアジェンダを見る
            </a>
          </motion.div>
        ) : (
          // ====================
          // アジェンダプレビュー画面
          // ====================
          <motion.div
            key="preview-view"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col h-screen bg-gray-50 overflow-y-auto"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">アジェンダの確認</h2>
              <p className="text-gray-600 text-sm mb-6">
                対話を通して、以下のようなアジェンダが生成されました。この内容で投稿しますか？
              </p>
              
              <AgendaCard agenda={agendaData} className="mb-8" />
              
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleSubmitAgenda}
                  disabled={submitStatus === 'submitting' || !isReadyToSubmit}
                  className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-emerald-700 transition-colors flex items-center justify-center disabled:opacity-70"
                >
                  {submitStatus === 'submitting' ? (
                    <><Loader2 className="animate-spin mr-2" size={20} /> 送信中...</>
                  ) : !isReadyToSubmit ? (
                    '準備中...'
                  ) : (
                    'この内容で投稿する'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setAgendaData(null)}
                  disabled={submitStatus === 'submitting'}
                  className="w-full bg-white text-gray-600 font-bold py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  チャットに戻ってやり直す
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
