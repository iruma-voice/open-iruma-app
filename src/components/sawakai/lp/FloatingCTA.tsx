'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export default function FloatingCTA() {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  // 最初（FVが見えている間）は非表示にし、少しスクロールしたら表示する
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        scale: isVisible ? 1 : 0.8,
        y: isVisible ? 0 : 20,
        pointerEvents: isVisible ? "auto" : "none" 
      }}
      transition={{ duration: 0.3 }}
      className="fixed bottom-6 right-6 z-50 md:bottom-10 md:right-10"
    >
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Link href="/sawakai/chat">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center justify-center w-16 h-16 bg-emerald-600 text-white rounded-full shadow-[0_8px_30px_rgba(5,150,105,0.4)] border-2 border-white/20 hover:bg-emerald-500 transition-colors"
            aria-label="チャットを開始する"
          >
            <MessageSquare size={28} />
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
