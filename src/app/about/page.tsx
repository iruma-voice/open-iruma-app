import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white pb-36 font-sans">
      
      {/* 1. Header (Inverted Block) */}
      <section className="bg-black text-white px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto">
          <span className="font-mono text-xs font-black uppercase tracking-widest text-white/70 mb-4 block border-b border-white/30 pb-2">
            [ THE MANIFESTO ]
          </span>
          <h1 className="text-5xl md:text-6xl font-serif font-black tracking-tighter leading-[1.1] mb-8">
            <span className="inline-block whitespace-nowrap">議会のリアルを、</span>
            <br />
            <span className="block text-right whitespace-nowrap mt-2">市民の手に。</span>
          </h1>
          <p className="font-serif font-bold leading-relaxed text-xl md:text-2xl opacity-90 mb-8">
            「いるまオープン議会」は、膨大な議会議論をAIとオープンデータで整理し、誰もが街の未来を判断できる<span className="bg-yellow-300 text-black px-1 mx-1">「武器」</span>を提供するための有志プロジェクトです。
          </p>
          <p className="font-sans font-medium leading-loose text-base md:text-lg opacity-80">
            私たちは、行政や議会の透明性を高め、市民が自らの意志で事実を確認できるプラットフォームを目指しています。
          </p>
        </div>
      </section>

      <div className="px-4 md:px-8 max-w-3xl mx-auto">
        
        {/* 2. The Problem Section (3つの壁) */}
        <section className="pt-20 pb-16 border-t-4 border-black mt-8">
          <div className="mb-16">
            <span className="font-mono text-sm font-black uppercase tracking-widest text-black mb-2 block">
              [ BACKGROUND ]
            </span>
            <h2 className="font-serif font-black leading-none tracking-widest text-black text-4xl md:text-5xl">
              立ちはだかる<br />
              <span className="block ml-8 md:ml-12 text-[1.1em] mt-2">「3つの壁」</span>
            </h2>
            <p className="font-sans font-bold text-lg leading-relaxed text-black mt-6">
              これまで、市民へ正確な情報を届ける上で以下の課題がありました。
            </p>
          </div>

          <div className="flex flex-col gap-16">
            <div className="relative">
              <div className="absolute -top-12 -left-4 text-[7rem] md:text-[9rem] leading-none font-mono font-black text-slate-100 z-0 select-none">
                01
              </div>
              <div className="relative z-10 pt-4">
                <h3 className="font-sans font-bold text-2xl text-black mb-3 border-b-2 border-black inline-block pb-1">作業量の壁</h3>
                <p className="font-sans font-medium text-lg leading-[1.8] text-slate-900">
                  年間数千ページに及ぶ議事録の読解と構造化は、人力では限界でした。
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-12 -left-4 text-[7rem] md:text-[9rem] leading-none font-mono font-black text-slate-100 z-0 select-none">
                02
              </div>
              <div className="relative z-10 pt-4">
                <h3 className="font-sans font-bold text-2xl text-black mb-3 border-b-2 border-black inline-block pb-1">文脈の壁</h3>
                <p className="font-sans font-medium text-lg leading-[1.8] text-slate-900">
                  点在する過去の議事録を遡り、<span className="bg-yellow-300 px-1 font-bold text-black">方針転換のストーリー</span>を追うのは困難でした。
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-12 -left-4 text-[7rem] md:text-[9rem] leading-none font-mono font-black text-slate-100 z-0 select-none">
                03
              </div>
              <div className="relative z-10 pt-4">
                <h3 className="font-sans font-bold text-2xl text-black mb-3 border-b-2 border-black inline-block pb-1">証拠の壁</h3>
                <p className="font-sans font-medium text-lg leading-[1.8] text-slate-900">
                  要約者の解釈だけでなく、市民が自ら<span className="bg-black text-white px-1 font-bold">「一次情報」</span>を確かめる術がありませんでした。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. The Solution Section (情報の「翻訳」と「直結」) */}
        <section className="py-16 border-t-4 border-black">
          <div className="mb-10">
            <span className="font-mono text-sm font-black uppercase tracking-widest text-black mb-2 block">
              [ OUR MISSION ]
            </span>
            <h2 className="font-serif font-black leading-none tracking-widest text-black text-4xl md:text-5xl">
              情報の<br />
              <span className="block ml-8 md:ml-12 mt-2">「翻訳」と「直結」</span>
            </h2>
            <p className="font-sans font-bold text-lg leading-[1.8] text-black mt-8">
              AIを活用し、数年間にわたる議論のバトンを1本の線で繋ぎます。<br/>
              そして、誰かの解釈だけで終わらせず、常に市民自身が事実関係を確認できる<span className="border-b-4 border-black">透明性</span>を実現しました。
            </p>
          </div>
        </section>

        {/* 4. The Experience Section (段階的に深掘りできる4つの構成) */}
        <section className="py-16 border-t-4 border-black">
          <div className="mb-16">
            <span className="font-mono text-sm font-black uppercase tracking-widest text-black mb-2 block">
              [ STRUCTURE ]
            </span>
            <h2 className="font-serif font-black text-4xl md:text-5xl text-black leading-tight tracking-widest">
              段階的に<br />
              <span className="block ml-8 md:ml-12 mt-2">深掘りできる構成</span>
            </h2>
            <p className="font-sans font-bold text-lg leading-[1.8] text-black mt-6">
              読者の関心度に合わせて、浅くから深くへと情報を展開します。
            </p>
          </div>

          <div className="flex flex-col gap-12">
            <div className="flex items-start border-l-4 border-black pl-4">
              <div className="font-mono text-5xl font-black text-black mr-6 leading-none pt-1">01</div>
              <div>
                <h3 className="font-sans font-bold text-xl text-black mb-2 uppercase tracking-widest">要約 / Summary</h3>
                <p className="font-sans font-medium text-base leading-[1.8] text-slate-900">
                  <span className="bg-yellow-300 px-1 font-bold text-black">3分で現状と論点を把握する。</span>素早く要点を知りたい全市民向け。
                </p>
              </div>
            </div>
            <div className="flex items-start border-l-4 border-black pl-4">
              <div className="font-mono text-5xl font-black text-black mr-6 leading-none pt-1">02</div>
              <div>
                <h3 className="font-sans font-bold text-xl text-black mb-2 uppercase tracking-widest">時系列 / Timeline</h3>
                <p className="font-sans font-medium text-base leading-[1.8] text-slate-900">
                  議論の変遷とストーリーを追う。経緯や行政の姿勢を知りたい方向け。
                </p>
              </div>
            </div>
            <div className="flex items-start border-l-4 border-black pl-4">
              <div className="font-mono text-5xl font-black text-black mr-6 leading-none pt-1">03</div>
              <div>
                <h3 className="font-sans font-bold text-xl text-black mb-2 uppercase tracking-widest">深掘り / Deep Dive</h3>
                <p className="font-sans font-medium text-base leading-[1.8] text-slate-900">
                  実態・比較・構造などの詳細を知る。より深く課題を理解したい方向け。
                </p>
              </div>
            </div>
            <div className="flex items-start border-l-4 border-black pl-4">
              <div className="font-mono text-5xl font-black text-black mr-6 leading-none pt-1">04</div>
              <div>
                <h3 className="font-sans font-bold text-xl text-black mb-2 uppercase tracking-widest">今後 / Future</h3>
                <p className="font-sans font-medium text-base leading-[1.8] text-slate-900">
                  今後のスケジュールや未解決の問いを確認する。継続的に動向を注視したい方向け。
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 border-2 border-black p-4 bg-gray-50">
             <p className="font-sans font-bold leading-[1.8] text-slate-900 text-sm">
               ※さらに詳しい一次情報（議事録の生発言など）は<span className="bg-yellow-300 px-1 text-black">「出典資料アーカイブ」</span>として個別に整理し、透明性を確保しています。
             </p>
          </div>
        </section>

      </div>

      {/* 5. Future Section (Inverted Block) */}
      <section className="bg-black text-white px-6 py-16 mt-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-12 border-b-2 border-white/30 pb-6">
            <span className="font-mono text-sm font-black uppercase tracking-widest text-white/70 mb-2 block">
              [ ROADMAP ]
            </span>
            <h2 className="font-serif font-black text-4xl md:text-5xl text-white leading-tight tracking-widest">
              これからの展望と<br/>
              <span className="block ml-8 md:ml-12 mt-2">ロードマップ</span>
            </h2>
          </div>
          
          <div className="flex flex-col gap-10">
            <div>
              <div className="font-mono text-3xl font-black text-yellow-300 mb-2">#01</div>
              <h3 className="font-sans font-bold text-xl text-white mb-3">双方向のファクトチェック</h3>
              <p className="font-sans font-medium text-base leading-[1.8] text-gray-300">
                市民からの感想や専門的なファクトチェックをフォーム経由で受け付け、フィードバックに基づきリアルタイムでアップデートします。
              </p>
            </div>
            <div>
              <div className="font-mono text-3xl font-black text-yellow-300 mb-2">#02</div>
              <h3 className="font-sans font-bold text-xl text-white mb-3">議員・会派名鑑の拡充</h3>
              <p className="font-sans font-medium text-base leading-[1.8] text-gray-300">
                「誰が」「いつ」「何を」発言したかを抽出した発言ログを強化し、市民活動の判断材料となるデータベースを構築します。
              </p>
            </div>
            <div>
              <div className="font-mono text-3xl font-black text-yellow-300 mb-2">#03</div>
              <h3 className="font-sans font-bold text-xl text-white mb-3">地域課題の網羅</h3>
              <p className="font-sans font-medium text-base leading-[1.8] text-gray-300">
                新庁舎、学童、財政といった重要テーマから、身近な地域課題まで、入間市のすべての議論をインデックス化します。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. The Disclaimer */}
      <section className="py-16 px-4 md:px-8 max-w-3xl mx-auto">
        <div className="border-4 border-black p-6 md:p-10 bg-white">
          <h3 className="font-mono text-xl font-black uppercase tracking-widest mb-6 border-b-4 border-black pb-4 inline-block">
            [ DISCLAIMER ]
          </h3>
          <p className="font-sans font-medium leading-[1.8] text-slate-900 text-sm mb-8">
            本サイトは入間市の公式ウェブサイトではありません。市民有志による非公式プロジェクトです。要約や構成には生成AIを活用しています。情報の正確性には細心の注意を払っておりますが、最終的な事実確認は、必ず入間市議会の議事録などをご確認ください。
          </p>
          <a 
            href="https://www3.city.iruma.saitama.jp/voices/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block border-2 border-black px-6 py-4 font-mono text-sm font-black uppercase tracking-widest bg-black text-white hover:bg-white hover:text-black transition-colors"
          >
            入間市議会HP（議事録検索）へ
          </a>
        </div>

        <div className="mt-16 text-center">
          <Link href="/" className="inline-block border-[4px] border-black px-12 py-5 font-mono text-base font-black uppercase tracking-widest bg-white text-black hover:bg-black hover:text-white transition-colors">
            トップへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
