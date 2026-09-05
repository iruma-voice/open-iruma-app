'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // パララックス効果
  const yText = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section 
      ref={ref}
      className="relative min-h-[90vh] flex flex-col items-center justify-center bg-white overflow-hidden"
    >
      {/* 背景のBlob（ぼやけた円）エフェクト */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, -30, 0], y: [0, -50, 30, 0], scale: [1, 1.2, 0.9, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] md:w-[40vw] md:h-[40vw] rounded-full bg-emerald-100/70 md:bg-emerald-100/50 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -40, 50, 0], y: [0, 40, -30, 0], scale: [1, 0.8, 1.15, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] md:w-[50vw] md:h-[50vw] rounded-full bg-teal-100/60 md:bg-teal-100/40 blur-3xl"
        />
      </div>

      <motion.div 
        style={{ y: yText, opacity: opacityText }}
        className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-7xl font-extrabold text-gray-900 tracking-wide leading-[1.3] md:leading-[1.1]">
            <span className="inline-block">日常の「モヤモヤ」を、</span><br className="hidden md:block"/>
            <span className="inline-block">公共のアジェンダへ。</span>
          </h1>
          <p className="text-xl md:text-2xl text-emerald-700 font-medium tracking-wide mt-4">
            狭山茶シーシャ × 市政ダイアローグ
          </p>
        </motion.div>

        {/* FV内のCTAボタン */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="mt-12 w-full max-w-sm"
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Link href="/sawakai/chat" className="block w-full">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center justify-center w-full bg-emerald-700 text-white font-bold text-lg py-5 px-8 rounded-full shadow-2xl hover:bg-emerald-800 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  💬 AIとモヤモヤを整理する
                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5" size={20} />
                </span>
                {/* ホバー時の背景エフェクト */}
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </motion.button>
            </Link>
          </motion.div>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            ※ログイン不要・完全匿名でご利用いただけます
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
