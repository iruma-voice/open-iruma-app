'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const BUBBLES = [
  { text: '駅前が暗くて少し怖い', top: '15%', left: '10%', speed: 1.5, delay: 0 },
  { text: '仕事帰りにホッとできる居場所がない', top: '30%', right: '5%', speed: 0.8, delay: 0.2 },
  { text: '公園の遊具が古くて心配', top: '60%', left: '5%', speed: 1.2, delay: 0.4 },
  { text: '手続きが複雑でよくわからない', top: '75%', right: '15%', speed: 1.8, delay: 0.1 },
  { text: '同世代とのつながりが欲しい', top: '85%', left: '20%', speed: 1.1, delay: 0.3 },
];

export default function ProblemSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={containerRef} className="relative py-32 bg-stone-50 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center space-y-8 bg-white/70 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-white/60 relative z-10"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight tracking-tight">
            会議室での「正しい議論」に、<br className="hidden md:block" />
            息苦しさを感じていませんか？
          </h2>
          <p className="text-lg md:text-xl text-gray-700 font-medium max-w-2xl mx-auto leading-relaxed">
            生活の中でふと感じる「モヤモヤ」は、とても個人的で、言葉にしづらいもの。<br/>
            でも、それこそが街を変える一番の原動力になります。
          </p>
        </motion.div>

      </div>

      {/* パララックス効果のあるGlassmorphismの吹き出し */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {BUBBLES.map((bubble, index) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const y = useTransform(scrollYProgress, [0, 1], [100 * bubble.speed, -100 * bubble.speed]);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const opacity = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0, 0.3, 0]);

          return (
            <motion.div
              key={index}
              style={{ y, opacity, top: bubble.top, left: bubble.left, right: bubble.right }}
              className="absolute max-w-[200px] md:max-w-[280px]"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: bubble.delay }}
                className="bg-white/30 backdrop-blur-sm border border-white/40 shadow-sm rounded-2xl px-5 py-4 text-gray-600 text-sm md:text-base font-medium leading-snug"
              >
                {bubble.text}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
