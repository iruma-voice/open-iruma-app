'use client';

import { motion } from 'framer-motion';

import { ReactNode } from 'react';

const RULES: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 stroke-emerald-600 fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
        {/* 湯気の立つマグカップ */}
        <path d="M 6 10 v 6 a 4 4 0 0 0 4 4 h 4 a 4 4 0 0 0 4 -4 v -6 z" />
        <path d="M 18 11 h 1 a 2 2 0 0 0 2 -2 v -1 a 2 2 0 0 0 -2 -2 h -1" />
        <path d="M 8 4 v 3" />
        <path d="M 12 3 v 4" />
        <path d="M 16 4 v 3" />
      </svg>
    ),
    title: '手ぶらで、ふらっとどうぞ',
    desc: '（オンラインならパジャマ参加OK）'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 stroke-emerald-600 fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
        {/* ネームバッジ（IDカード）と右上のバツ印 */}
        <rect x="5" y="8" width="12" height="13" rx="2" />
        <circle cx="11" cy="13" r="2" />
        <path d="M 8 18 c 0 -1 1.5 -2 3 -2 s 3 1 3 2" />
        {/* 首紐 */}
        <path d="M 8 8 l 3 -5 l 3 5" />
        {/* バツ印 */}
        <path d="M 18 4 l 4 4 m 0 -4 l -4 4" className="stroke-stone-400 stroke-2" />
      </svg>
    ),
    title: '肩書きは置いていきましょう',
    desc: '（フラットな関係）'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-10 h-10 stroke-emerald-600 fill-none stroke-[1.5]" strokeLinecap="round" strokeLinejoin="round">
        {/* 重なり合う2つの円（ベン図） */}
        <circle cx="9" cy="12" r="6" />
        <circle cx="15" cy="12" r="6" />
        {/* 重なり部分を少し塗りつぶして表現 */}
        <path d="M 12 6.8 A 6 6 0 0 0 12 17.2 A 6 6 0 0 0 12 6.8 Z" className="fill-emerald-100" />
      </svg>
    ),
    title: '違いを楽しんでください',
    desc: '（共感を探す）'
  }
];

export default function RulesSection() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-32 bg-stone-50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
            3つの安心ルール
          </h2>
          <p className="text-gray-500 font-medium">参加のハードルは、極限まで下げてあります。</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8"
        >
          {RULES.map((rule, idx) => (
            <motion.div key={idx} variants={item} className="flex flex-col items-center">
              <div className="text-5xl mb-6 bg-white w-24 h-24 rounded-full flex items-center justify-center shadow-sm border border-stone-100">
                {rule.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{rule.title}</h3>
              <p className="text-emerald-700 font-medium">{rule.desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
