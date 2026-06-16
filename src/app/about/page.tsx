'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Database, Cpu, Search, FileText, BarChart3, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const { scrollYProgress } = useScroll();

  // Dark to Light background transition
  // We transition from bg-gray-900 (dark) to bg-white around 15-25% scroll
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.25],
    ['#111827', '#111827', '#ffffff']
  );

  const textColor = useTransform(
    scrollYProgress,
    [0, 0.15, 0.25],
    ['#ffffff', '#ffffff', '#111827']
  );

  return (
    <motion.main 
      style={{ backgroundColor, color: textColor }} 
      className="min-h-screen transition-colors duration-500 overflow-hidden"
    >
      {/* 1. Hero Section */}
      <section className="relative h-[100dvh] flex flex-col items-center justify-center px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            議会のリアルを、<br className="md:hidden" />市民の手に。
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            「いるまオープン議会」は、膨大な議会議論をAIとオープンデータで整理し、
            誰もが街の未来を判断できる「武器」を提供するための有志プロジェクトです。
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-32 flex flex-col items-center"
        >
          <span className="text-sm text-gray-500 mb-3 tracking-widest uppercase font-semibold">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="w-6 h-6 text-gray-500" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. The Problem Section (3つの壁) */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">立ちはだかる「3つの壁」</h2>
          <p className="text-gray-500 dark:text-gray-400">これまで、市民へ正確な情報を届ける上で以下の課題がありました。</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "作業量の壁", desc: "年間数千ページに及ぶ議事録の読解と構造化は、人力では限界でした。", icon: Database },
            { title: "文脈の壁", desc: "点在する過去の議事録を遡り、方針転換のストーリーを追うのは困難でした。", icon: Search },
            { title: "証拠の壁", desc: "要約者の解釈だけでなく、市民が自ら「一次情報」を確かめる術がありませんでした。", icon: FileText },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 shrink-0 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-4">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. The Solution Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-16 shadow-xl border border-gray-200 dark:border-gray-800 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              情報の「翻訳」と<br className="md:hidden" />「直結」
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              AIを活用し、数年間にわたる議論のバトンを1本の線で繋ぎます。<br className="hidden md:block" />
              そして、誰かの解釈だけで終わらせず、常に市民自身が事実関係を確認できる透明性を実現しました。
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl w-full md:w-64">
                <Database className="w-10 h-10 text-gray-400 mb-3" />
                <span className="font-bold text-gray-700 dark:text-gray-300">膨大な生データ<br/>(公式議事録)</span>
              </div>
              
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="rotate-90 md:rotate-0"
              >
                <ArrowRight className="w-8 h-8 text-blue-500" />
              </motion.div>

              <div className="flex flex-col items-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl w-full md:w-64 border border-blue-100 dark:border-blue-800/50">
                <Cpu className="w-10 h-10 text-blue-600 mb-3" />
                <span className="font-bold text-blue-800 dark:text-blue-300">AIによる文脈可視化<br/>と構造化</span>
              </div>

              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
                className="rotate-90 md:rotate-0"
              >
                <ArrowRight className="w-8 h-8 text-blue-500" />
              </motion.div>

              <div className="flex flex-col items-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl w-full md:w-64 border border-green-100 dark:border-green-800/50">
                <BarChart3 className="w-10 h-10 text-green-600 mb-3" />
                <span className="font-bold text-green-800 dark:text-green-300">スマホで読める<br/>多層的な記事</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. The Experience Section */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
            段階的に深掘りできる<br />4つの構成
          </h2>
          <p className="text-gray-600 dark:text-gray-400">読者の関心度に合わせて、浅くから深くへと情報を展開します。</p>
        </div>

        <div className="space-y-6">
          {[
            { step: "01", title: "要約", desc: "3分で現状と論点を把握する。素早く要点を知りたい全市民向け。", color: "bg-blue-50 text-blue-600 border-blue-200" },
            { step: "02", title: "時系列", desc: "議論の変遷とストーリーを追う。経緯や行政の姿勢を知りたい方向け。", color: "bg-indigo-50 text-indigo-600 border-indigo-200" },
            { step: "03", title: "深掘り", desc: "実態・比較・構造などの詳細を知る。より深く課題を理解したい方向け。", color: "bg-purple-50 text-purple-600 border-purple-200" },
            { step: "04", title: "今後", desc: "今後のスケジュールや未解決の問いを確認する。継続的に動向を注視したい方向け。", color: "bg-emerald-50 text-emerald-600 border-emerald-200" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className={`flex items-start p-6 md:p-8 rounded-2xl border ${item.color.split(' ')[2]} ${item.color.split(' ')[0]} dark:bg-gray-800 dark:border-gray-700`}
            >
              <div className={`text-2xl font-black mr-6 ${item.color.split(' ')[1]} dark:text-white opacity-80`}>
                {item.step}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl text-center">
           <p className="text-sm text-gray-600 dark:text-gray-400">
             ※さらに詳しい一次情報（議事録の生発言など）は「出典資料アーカイブ」として個別に整理し、透明性を確保しています。
           </p>
        </div>
      </section>

      {/* 5. Future & CTA Section */}
      <section className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-10 text-center text-gray-900 dark:text-white">今後の展望とロードマップ</h2>
          <div className="space-y-8 mb-16 text-gray-700 dark:text-gray-300">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">1</div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">双方向のファクトチェック</h4>
                <p>市民からの感想や専門的なファクトチェックをフォーム経由で受け付け、フィードバックに基づきリアルタイムでアップデートします。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">2</div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">議員・会派名鑑の拡充</h4>
                <p>「誰が」「いつ」「何を」発言したかを抽出した発言ログを強化し、市民活動の判断材料となるデータベースを構築します。</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">3</div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">地域課題の網羅</h4>
                <p>新庁舎、学童、財政といった重要テーマから、身近な地域課題まで、入間市のすべての議論をインデックス化します。</p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 rounded-r-xl mb-12 shadow-sm">
            <h3 className="font-bold text-yellow-800 dark:text-yellow-500 mb-2">【免責事項】</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed mb-4">
              本サイトは入間市の公式ウェブサイトではありません。市民有志による非公式プロジェクトです。要約や構成には生成AIを活用しています。情報の正確性には細心の注意を払っておりますが、最終的な事実確認は、必ず入間市議会の議事録などをご確認ください。
            </p>
            <a 
              href="https://www3.city.iruma.saitama.jp/voices/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm shadow"
            >
              入間市議会HP（議事録検索）へ
            </a>
          </div>

          <div className="text-center pb-10">
            <Link href="/" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95 shadow-lg">
              課題一覧を見てみる
            </Link>
          </div>
        </div>
      </section>
    </motion.main>
  );
}
