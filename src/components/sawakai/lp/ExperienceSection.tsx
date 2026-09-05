'use client';

import { motion } from 'framer-motion';

export default function ExperienceSection() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <section className="py-32 bg-white relative">
      <div className="max-w-5xl mx-auto px-6">
        
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            あなたの声が、形になるまで
          </h2>
          <p className="text-lg text-gray-500 mt-6 font-medium">
            3つのステップで、個人のモヤモヤを公共のアジェンダへ翻訳します。
          </p>
        </motion.div>

        <div className="space-y-20 md:space-y-24">
          
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            {/* 左側: SVGアニメーション */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <div className="flex justify-center items-center bg-transparent w-full max-w-[320px] aspect-square">
                <svg viewBox="0 0 200 200" className="w-40 h-40 overflow-visible">
                  {/* キャラクター */}
                  <circle cx="50" cy="130" r="18" fill="none" stroke="#10b981" strokeWidth="4" />
                  <rect x="25" y="152" width="50" height="48" rx="20" fill="none" stroke="#10b981" strokeWidth="4" />
                  
                  {/* スマホ */}
                  <rect x="130" y="110" width="40" height="70" rx="6" fill="none" stroke="#a8a29e" strokeWidth="4" />
                  <circle cx="150" cy="170" r="2" fill="#a8a29e" />

                  {/* 電波 */}
                  <motion.path
                    d="M 120 130 Q 110 145 120 160"
                    fill="none"
                    stroke="#a8a29e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 1.5], x: [0, -5, -10] }}
                    transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 1] }}
                  />
                  <motion.path
                    d="M 110 120 Q 95 145 110 170"
                    fill="none"
                    stroke="#a8a29e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.1, 1.3], x: [0, -5, -10] }}
                    transition={{ duration: 3, repeat: Infinity, times: [0, 0.5, 1], delay: 0.2 }}
                  />

                  {/* モヤモヤ */}
                  <motion.path
                    d="M 35 80 C 25 70, 35 50, 50 55 C 65 50, 75 70, 65 80 C 70 95, 45 95, 35 80 Z"
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    animate={{ 
                      scale: [1, 1, 0.2, 0],
                      x: [0, 0, 80, 100],
                      y: [0, 0, 40, 50],
                      opacity: [1, 1, 0.5, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, times: [0, 0.4, 0.7, 1] }}
                  />

                  {/* 関心事カード */}
                  <motion.rect
                    x="135" y="70" width="30" height="24" rx="3"
                    fill="#fff" stroke="#10b981" strokeWidth="3"
                    animate={{ 
                      y: [20, 0, 0, 20],
                      opacity: [0, 1, 1, 0],
                      scale: [0.5, 1, 1, 0.5]
                    }}
                    transition={{ duration: 4, repeat: Infinity, times: [0.6, 0.7, 0.9, 1] }}
                  />
                  <motion.line x1="140" y1="78" x2="160" y2="78" stroke="#10b981" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, times: [0.6, 0.7, 0.9, 1] }} />
                  <motion.line x1="140" y1="86" x2="155" y2="86" stroke="#10b981" strokeWidth="2" strokeLinecap="round" animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 4, repeat: Infinity, times: [0.6, 0.7, 0.9, 1] }} />
                </svg>
              </div>
            </motion.div>
            
            {/* 右側: テキスト */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="w-full md:w-1/2 space-y-6"
            >
              <div className="text-emerald-600 font-bold tracking-widest text-sm">STEP 1</div>
              <h3 className="text-3xl font-extrabold text-gray-900 leading-tight">
                【事前】AIとの対話<br/>
                <span className="text-2xl text-gray-500 font-bold">あなたの声を言葉にする</span>
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                いきなり人と話す必要はありません。まずは専用のAIに愚痴をこぼしてください。あなたの声がスッキリまとまった「関心事カード」に変換されます。
              </p>
            </motion.div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 md:gap-20">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <div className="flex justify-center items-center bg-transparent w-full max-w-[320px] aspect-square">
                <svg viewBox="0 0 200 200" className="w-40 h-40 overflow-visible">
                  
                  {/* 背景の同心円（繋がり） */}
                  <circle cx="100" cy="130" r="25" fill="none" stroke="#d6d3d1" strokeWidth="1.5" strokeDasharray="4 6" />
                  <circle cx="100" cy="130" r="45" fill="none" stroke="#d6d3d1" strokeWidth="1.5" strokeDasharray="4 6" />
                  {/* 放物線 (軌道) */}
                  <path d="M 115 140 Q 100 60 70 120" fill="none" stroke="#d6d3d1" strokeWidth="1.5" strokeDasharray="4 6" />

                  {/* キャラL (リアル参加者) */}
                  <circle cx="40" cy="130" r="18" fill="none" stroke="#10b981" strokeWidth="4" />
                  <rect x="15" y="152" width="50" height="48" rx="20" fill="none" stroke="#10b981" strokeWidth="4" />
                  {/* カップ L */}
                  <path d="M 65 145 L 65 160 A 5 5 0 0 0 75 160 L 75 145 Z" fill="none" stroke="#10b981" strokeWidth="3" strokeLinejoin="round" />
                  {/* 揺れる湯気 L */}
                  {[67, 70, 73].map((x, i) => (
                    <motion.path
                      key={`l-${i}`} d={`M ${x} 140 Q ${x - 3} 135 ${x} 130 T ${x} 120`}
                      fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round"
                      style={{ transformOrigin: `${x}px 140px` }}
                      animate={{ y: [0, -5, -10, -5, 0], scaleY: [1, 1.3, 1.5, 1.3, 1], opacity: [0.3, 1, 1, 0.8, 0.3] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
                    />
                  ))}

                  {/* キャラR (オンライン参加者) */}
                  <circle cx="160" cy="130" r="18" fill="none" stroke="#3b82f6" strokeWidth="4" />
                  <rect x="135" y="152" width="50" height="48" rx="20" fill="none" stroke="#3b82f6" strokeWidth="4" />
                  {/* カップ R (お茶を持つように変更) */}
                  <path d="M 125 145 L 125 160 A 5 5 0 0 0 135 160 L 135 145 Z" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinejoin="round" />
                  {/* 揺れる湯気 R */}
                  {[127, 130, 133].map((x, i) => (
                    <motion.path
                      key={`r-${i}`} d={`M ${x} 140 Q ${x - 3} 135 ${x} 130 T ${x} 120`}
                      fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round"
                      style={{ transformOrigin: `${x}px 140px` }}
                      animate={{ y: [0, -3, -8, -3, 0], scaleY: [1, 1.2, 1.4, 1.2, 1], opacity: [0.3, 0.8, 1, 0.8, 0.3] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 + i * 0.2 }}
                    />
                  ))}

                  {/* ===== アニメーション ===== */}
                  
                  {/* 1. 波紋 (0秒〜2秒で広がる) */}
                  <motion.circle cx="120" cy="150" r="5" fill="none" stroke="#3b82f6" strokeWidth="2"
                    animate={{ 
                      r: [5, 60, 60, 5, 5], 
                      opacity: [0.8, 0, 0, 0, 0] 
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeOut", times: [0, 0.3, 0.31, 0.99, 1] }}
                  />
                  <motion.circle cx="120" cy="150" r="5" fill="none" stroke="#3b82f6" strokeWidth="1.5"
                    animate={{ 
                      r: [5, 40, 40, 5, 5], 
                      opacity: [0.6, 0, 0, 0, 0] 
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeOut", times: [0, 0.3, 0.31, 0.99, 1], delay: 0.3 }}
                  />

                  {/* 2. 吹き出しのキャッチボール (2秒〜4秒で飛ぶ) */}
                  <motion.g
                    animate={{
                      x: [115, 115, 110, 95, 80, 70, 70],
                      y: [140, 140, 90, 75, 90, 120, 120],
                      scale: [0, 0, 1.2, 1.5, 1.2, 0.5, 0],
                      opacity: [0, 0, 1, 1, 0.8, 0, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", times: [0, 0.3, 0.4, 0.6, 0.7, 0.8, 1] }}
                  >
                    <path d="M -10 -15 h 20 a 5 5 0 0 1 5 5 v 10 a 5 5 0 0 1 -5 5 h -5 l -5 5 l -2 -5 h -8 a 5 5 0 0 1 -5 -5 v -10 a 5 5 0 0 1 5 -5 z" fill="#3b82f6" />
                  </motion.g>

                </svg>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="w-full md:w-1/2 space-y-6"
            >
              <div className="text-emerald-600 font-bold tracking-widest text-sm">STEP 2</div>
              <h3 className="text-3xl font-extrabold text-gray-900 leading-tight">
                【当日】交差する茶話会<br/>
                <span className="text-2xl text-gray-500 font-bold">2つの参加スタイル</span>
              </h3>
              
              <div className="space-y-6">
                <div className="bg-stone-50 p-6 rounded-2xl">
                  <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center">
                    <span className="mr-2">☕</span> リアル参加 (お店でチルする)
                  </h4>
                  <p className="text-gray-500 leading-relaxed">
                    スマホを置いて、お茶とシーシャの煙を味わいましょう。集まったカードを元に、ファシリテーターがゆるやかに話題を振ります。「論破」や「正解」は禁止。ただ黙って人の話を聞いているだけでも、立派な参加です。
                  </p>
                </div>
                
                <div className="bg-stone-50 p-6 rounded-2xl">
                  <h4 className="font-bold text-gray-900 text-lg mb-2 flex items-center">
                    <span className="mr-2">📱</span> オンライン参加 (どこからでも熱気を)
                  </h4>
                  <p className="text-gray-500 leading-relaxed">
                    お店に行けなくても、あなたの声は会場に届いています。当日の様子はLINEオープンチャットで随時実況。ラジオ感覚で聞き流すのも、コメントで飛び入り参加するのも自由です。
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <div className="flex justify-center items-center bg-transparent w-full max-w-[320px] aspect-square">
                <svg viewBox="0 0 200 200" className="w-40 h-40 overflow-visible">
                  
                  {/* パズルピースのグループ（前半で集まり、後半で消える） */}
                  <motion.g
                    animate={{ opacity: [1, 1, 1, 0, 0, 1] }}
                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.5, 0.55, 0.95, 1] }}
                  >
                    {/* ピース1 (左上) */}
                    <motion.g
                      animate={{ x: [-40, 0, 0], y: [-40, 0, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 1] }}
                    >
                      <rect x="78" y="78" width="20" height="20" rx="4" fill="none" stroke="#9ca3af" strokeWidth="2" />
                      <path d="M 83 84 h 10 a 2 2 0 0 1 2 2 v 4 a 2 2 0 0 1 -2 2 h -2 l -2 3 l -1 -3 h -5 a 2 2 0 0 1 -2 -2 v -4 a 2 2 0 0 1 2 -2 z" fill="#9ca3af" />
                    </motion.g>

                    {/* ピース2 (右上) */}
                    <motion.g
                      animate={{ x: [50, 0, 0], y: [-30, 0, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 1] }}
                    >
                      <rect x="102" y="78" width="20" height="20" rx="4" fill="none" stroke="#9ca3af" strokeWidth="2" />
                      <path d="M 107 84 h 10 a 2 2 0 0 1 2 2 v 4 a 2 2 0 0 1 -2 2 h -2 l -2 3 l -1 -3 h -5 a 2 2 0 0 1 -2 -2 v -4 a 2 2 0 0 1 2 -2 z" fill="#9ca3af" />
                    </motion.g>

                    {/* ピース3 (左下) */}
                    <motion.g
                      animate={{ x: [-50, 0, 0], y: [40, 0, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 1] }}
                    >
                      <rect x="78" y="102" width="20" height="20" rx="4" fill="none" stroke="#9ca3af" strokeWidth="2" />
                      <path d="M 83 108 h 10 a 2 2 0 0 1 2 2 v 4 a 2 2 0 0 1 -2 2 h -2 l -2 3 l -1 -3 h -5 a 2 2 0 0 1 -2 -2 v -4 a 2 2 0 0 1 2 -2 z" fill="#9ca3af" />
                    </motion.g>

                    {/* ピース4 (右下) */}
                    <motion.g
                      animate={{ x: [40, 0, 0], y: [50, 0, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.3, 1] }}
                    >
                      <rect x="102" y="102" width="20" height="20" rx="4" fill="none" stroke="#9ca3af" strokeWidth="2" />
                      <path d="M 107 108 h 10 a 2 2 0 0 1 2 2 v 4 a 2 2 0 0 1 -2 2 h -2 l -2 3 l -1 -3 h -5 a 2 2 0 0 1 -2 -2 v -4 a 2 2 0 0 1 2 -2 z" fill="#9ca3af" />
                    </motion.g>
                  </motion.g>

                  {/* 文書アイコン（合体後に現れる） */}
                  <motion.g
                    style={{ transformOrigin: "100px 100px" }}
                    animate={{ 
                      scale: [0, 0, 0, 1.1, 1, 1, 0], 
                      opacity: [0, 0, 0, 1, 1, 1, 0] 
                    }}
                    transition={{ duration: 6, repeat: Infinity, times: [0, 0.5, 0.55, 0.6, 0.7, 0.9, 0.95] }}
                  >
                    {/* ドキュメントの枠 */}
                    <rect x="75" y="65" width="50" height="70" rx="6" fill="none" stroke="#10b981" strokeWidth="4" />
                    {/* 上部の折り目っぽく */}
                    <path d="M 105 65 L 125 85 L 125 65 Z" fill="#10b981" />
                    {/* テキスト行 */}
                    <line x1="85" y1="90" x2="115" y2="90" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                    <line x1="85" y1="105" x2="115" y2="105" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                    <line x1="85" y1="120" x2="105" y2="120" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
                    
                    {/* キラキラ光るエフェクト */}
                    <motion.path 
                      d="M 60 50 L 65 60 L 75 65 L 65 70 L 60 80 L 55 70 L 45 65 L 55 60 Z" 
                      fill="#f59e0b"
                      animate={{ scale: [0, 0, 0, 0, 1, 0.5, 0], opacity: [0, 0, 0, 0, 1, 0.8, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.6, 0.65, 0.7, 0.75, 0.85, 0.9] }}
                    />
                    <motion.path 
                      d="M 140 110 L 143 117 L 150 120 L 143 123 L 140 130 L 137 123 L 130 120 L 137 117 Z" 
                      fill="#10b981"
                      animate={{ scale: [0, 0, 0, 0, 0, 1, 0], opacity: [0, 0, 0, 0, 0, 1, 0] }}
                      transition={{ duration: 6, repeat: Infinity, times: [0, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95] }}
                    />
                  </motion.g>

                </svg>
              </div>
            </motion.div>
            
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUp}
              className="w-full md:w-1/2 space-y-6"
            >
              <div className="text-emerald-600 font-bold tracking-widest text-sm">STEP 3</div>
              <h3 className="text-3xl font-extrabold text-gray-900 leading-tight">
                【後日】<br/>
                街のカタチへの結晶化
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                対話の記録はAIによって図解マップに整理され、「こんな街になってほしい」という共通の願い（データ）として市へ還元されます。
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
