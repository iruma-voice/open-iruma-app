'use client';

import { motion, Variants } from 'framer-motion';
import { MapPin, Calendar, Smartphone, ExternalLink } from 'lucide-react';

export default function EventInfoSection() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-24 bg-stone-50 relative overflow-hidden">
      {/* 装飾用背景パターン */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="inline-block bg-emerald-100 text-emerald-800 font-bold px-4 py-1.5 rounded-full text-sm tracking-widest mb-4">
            EVENT INFO
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            開催概要
          </h2>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-stone-200/50 border border-stone-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 日時情報 */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="flex items-start">
                <div className="bg-emerald-50 p-3 rounded-2xl mr-4 text-emerald-600">
                  <Calendar size={28} />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 font-bold tracking-widest mb-1">日時</h3>
                  <p className="text-2xl font-extrabold text-gray-900">
                    2026年9月18日<span className="text-xl ml-1">(金)</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-emerald-50 p-3 rounded-2xl mr-4 text-emerald-600">
                  <Smartphone size={28} />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 font-bold tracking-widest mb-1">参加方法</h3>
                  <p className="text-lg font-bold text-gray-900">
                    レガシー ＆ スマホで匿名参加
                  </p>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    現地での参加はもちろん、オープンチャットを通じてどこからでも匿名でご参加いただけます。
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 場所情報 */}
            <motion.div variants={fadeUp} className="space-y-6">
              <div className="flex items-start">
                <div className="bg-emerald-50 p-3 rounded-2xl mr-4 text-emerald-600 shrink-0">
                  <MapPin size={28} />
                </div>
                <div>
                  <h3 className="text-sm text-gray-500 font-bold tracking-widest mb-1">会場</h3>
                  <p className="text-xl font-extrabold text-gray-900 mb-2">
                    カフェ＆バー レガシー<br/>
                    <span className="text-sm font-medium text-gray-500">（映画館1階）</span>
                  </p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    〒358-0003<br/>
                    埼玉県入間市豊岡1-11-1<br/>
                    ユナイテッド・シネマ入間 1F
                  </p>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=埼玉県入間市豊岡1-11-1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-800 transition-colors"
                  >
                    Google Mapsで見る
                    <ExternalLink size={16} className="ml-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
