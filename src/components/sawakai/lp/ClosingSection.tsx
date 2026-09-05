'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ClosingSection() {
  const ref = useRef(null);
  
  // 背景色をスクロールに応じて白(stone-50)から深い緑へトランジションさせる
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "center center"]
  });
  
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["#fafaf9", "#065f46"] // stone-50 to emerald-800
  );

  return (
    <motion.section 
      ref={ref}
      style={{ backgroundColor }}
      className="py-32 transition-colors duration-100 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            入間市をもっと面白く、<br className="hidden md:block" />
            もっと居心地のいい街にするための、<br className="hidden md:block" />
            小さな実験。
          </h2>
          <p className="text-xl text-emerald-100 font-medium">
            よろしければ、この企みの「共犯者」になっていただけませんか？
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 w-full max-w-sm mx-auto"
        >
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Link href="/sawakai/chat" className="block w-full">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="group relative flex items-center justify-center w-full bg-white text-emerald-800 font-bold text-lg py-5 px-8 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:bg-emerald-50 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center">
                  💬 AIとモヤモヤを整理する
                  <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5" size={20} />
                </span>
                <div className="absolute inset-0 bg-emerald-100/50 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </motion.button>
            </Link>
          </motion.div>
          <p className="text-xs text-emerald-100/80 mt-4 font-medium">
            ※ログイン不要・完全匿名でご利用いただけます
          </p>
        </motion.div>

        {/* 開発ストーリーへのリンク（CTAの下部・サムネイル付き） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 w-full max-w-lg mx-auto"
        >
          <a
            href="https://note.com/iruma_/n/n1b81e6a1ad46"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center p-3 md:p-4 bg-white/10 backdrop-blur-md border border-emerald-500/30 rounded-2xl hover:bg-white/20 transition-all text-left group"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-emerald-900/50 rounded-xl overflow-hidden relative mr-4 border border-emerald-500/20 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/image_00a4f2.jpg" 
                alt="note thumbnail" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="flex flex-col flex-grow">
              <span className="text-[10px] md:text-xs font-bold text-emerald-300 mb-1 flex items-center tracking-wider">
                DEVELOPER STORY
              </span>
              <span className="text-white font-medium text-sm leading-snug mb-1">
                開催に至った背景・主催者の想い (note)
              </span>
              <span className="text-emerald-100/60 text-[10px] md:text-xs line-clamp-2">
                狭山茶×シーシャの茶話会で街のモヤモヤをAIに翻訳させる。新しい対話の場を作りたい話。
              </span>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-300 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-2 md:ml-4 flex-shrink-0" />
          </a>
        </motion.div>

      </div>
      
      {/* 発光する背景装飾 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[80vw] h-[80vw] max-w-2xl max-h-2xl rounded-full bg-emerald-400/20 blur-[100px]" />
      </div>
    </motion.section>
  );
}
