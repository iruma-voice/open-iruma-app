'use client';

interface IrumaTimelinePanoramaBannerProps {
  onJumpToSection: (sectionId: string) => void;
}

interface TimelineStop {
  id: string;
  targetSection: string;
  yearLabel: string;
  headline: string;
  subline: string;
  x: number;
  cx: number;
  nodeY: number;
  headerBg: string;
  headerText: string;
  headlineColor: string;
  sublineColor: string;
  cardBorder: string;
}

const TIMELINE_STOPS: TimelineStop[] = [
  {
    id: 'stop-2026',
    targetSection: 'agenda-04',
    yearLabel: '2026 いま',
    headline: '水道+35%・学童',
    subline: '足元黒字・貯金39億円',
    x: 8,
    cx: 73,
    nodeY: 98,
    headerBg: '#2E7D5B',
    headerText: '#FFFFFF',
    headlineColor: '#1E221F',
    sublineColor: '#236247',
    cardBorder: '#B9D6C4',
  },
  {
    id: 'stop-2029',
    targetSection: 'agenda-01',
    yearLabel: '〜2029 集中期',
    headline: '建て替え 約255億円',
    subline: '4分館の一斉廃止へ',
    x: 145,
    cx: 210,
    nodeY: 103,
    headerBg: '#F2B705',
    headerText: '#1E221F',
    headlineColor: '#1E221F',
    sublineColor: '#8A5A00',
    cardBorder: '#EBD17C',
  },
  {
    id: 'stop-2036',
    targetSection: 'financial-reality',
    yearLabel: '2036 10年後',
    headline: '年 -89.6億円 試算',
    subline: '人口 約13万人へ減少',
    x: 282,
    cx: 347,
    nodeY: 112,
    headerBg: '#C83E31',
    headerText: '#FFFFFF',
    headlineColor: '#B32D22',
    sublineColor: '#5C615D',
    cardBorder: '#EBB8B2',
  },
];

// /overview（文章詳細版）専用トップバナー：10年見取り図タイムライン × 入間市の街並みフラット2D線画パノラマ
export default function IrumaTimelinePanoramaBanner({
  onJumpToSection,
}: IrumaTimelinePanoramaBannerProps) {
  return (
    <div className="bg-[#FAF7EE] border-b border-[#E6E1D3] select-none">
      <div className="relative pt-2">
        <svg
          viewBox="0 0 420 250"
          className="w-full h-auto block"
          role="img"
          aria-label="入間市 これから10年の見取り図と入間市の街並みイラスト"
        >
          <defs>
            {/* 方眼ドット背景 */}
            <pattern
              id="timelineDots"
              x="0"
              y="0"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="0.7" fill="#D5CEBA" opacity="0.55" />
            </pattern>
            {/* 上部カード用のクリップ角丸 */}
            <clipPath id="cardClip0">
              <rect x="8" y="34" width="130" height="53" rx="9" />
            </clipPath>
            <clipPath id="cardClip1">
              <rect x="145" y="34" width="130" height="53" rx="9" />
            </clipPath>
            <clipPath id="cardClip2">
              <rect x="282" y="34" width="130" height="53" rx="9" />
            </clipPath>
          </defs>

          {/* 背景空 */}
          <rect x="0" y="0" width="420" height="250" fill="url(#timelineDots)" />

          {/* 上部タイトルバー（見取り図ラベル ＋ 人口推移バッジ） */}
          <g transform="translate(8, 8)">
            <rect
              x="0"
              y="0"
              width="174"
              height="19"
              rx="9.5"
              fill="#FFFFFF"
              stroke="#D8D1BC"
              strokeWidth="1"
            />
            <circle cx="11" cy="9.5" r="3.2" fill="#2E7D5B" />
            <text
              x="19"
              y="13"
              fill="#236247"
              fontSize="9.2"
              fontWeight="800"
            >
              入間市 これから10年の見取り図
            </text>
          </g>

          <g transform="translate(274, 8)">
            <rect
              x="0"
              y="0"
              width="138"
              height="19"
              rx="9.5"
              fill="#FFF8E1"
              stroke="#EBD794"
              strokeWidth="1"
            />
            <text
              x="69"
              y="12.8"
              textAnchor="middle"
              fill="#8A5A00"
              fontSize="8.6"
              fontWeight="800"
            >
              推計人口 約14万 → 約13万人
            </text>
          </g>

          {/* フラットな雲・太陽・鳥（街並みの遠景アクセント） */}
          <g stroke="#2F3E36" strokeWidth="1.2" fill="none" strokeLinecap="round">
            {/* 左上遠景の鳥 */}
            <path d="M52 126 Q55 123 58 126 Q61 123 64 126" opacity="0.5" />
            <path d="M68 120 Q70 118 72 120 Q74 118 76 120" opacity="0.4" />
            {/* 右奥の太陽 */}
            <circle cx="384" cy="134" r="7.5" fill="#FFF0B3" stroke="#D9A300" strokeWidth="1.2" />
            {/* フラット線画の雲 */}
            <path
              d="M272 138 L314 138 C317 138 318 133 314 132 C314 128 308 126 305 129 C303 123 292 123 290 129 C286 128 282 131 283 134 C279 134 277 138 280 138 Z"
              fill="#FFFFFF"
              stroke="#97A89F"
              strokeWidth="1.1"
            />
          </g>

          {/* 10年タイムライン曲線（左の現在から右の10年後へ緩やかに低下） */}
          <path
            d="M46 98 L73 98 C135 98, 160 103, 210 103 C260 103, 295 112, 347 112 L374 114"
            fill="none"
            stroke="#596A60"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="3.5 2.5"
          />
          <path
            d="M369 110 L376 114.2 L369 118"
            fill="none"
            stroke="#C83E31"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 3つのタイムライン節目カード（タップで詳細セクションへ） */}
          {TIMELINE_STOPS.map((stop, idx) => (
            <g
              key={stop.id}
              role="button"
              tabIndex={0}
              aria-label={`${stop.yearLabel}：${stop.headline} の解説へ移動`}
              onClick={() => onJumpToSection(stop.targetSection)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onJumpToSection(stop.targetSection);
                }
              }}
              className="cursor-pointer group"
            >
              {/* カードからタイムライン曲線への縦線＋ノード点 */}
              <line
                x1={stop.cx}
                y1="87"
                x2={stop.cx}
                y2={stop.nodeY}
                stroke={stop.headerBg}
                strokeWidth="1.6"
              />
              <circle
                cx={stop.cx}
                cy={stop.nodeY}
                r="4"
                fill={stop.headerBg}
                stroke="#FFFFFF"
                strokeWidth="1.4"
              />

              {/* カード本体 */}
              <g clipPath={`url(#cardClip${idx})`}>
                <rect
                  x={stop.x}
                  y="34"
                  width="130"
                  height="53"
                  fill="#FFFFFF"
                />
                <rect
                  x={stop.x}
                  y="34"
                  width="130"
                  height="17"
                  fill={stop.headerBg}
                />
              </g>
              <rect
                x={stop.x}
                y="34"
                width="130"
                height="53"
                rx="9"
                fill="none"
                stroke={stop.cardBorder}
                strokeWidth="1.2"
              />
              <text
                x={stop.cx}
                y="45.5"
                textAnchor="middle"
                fill={stop.headerText}
                fontSize="8.8"
                fontWeight="900"
              >
                {stop.yearLabel}
              </text>
              <text
                x={stop.cx}
                y="64.5"
                textAnchor="middle"
                fill={stop.headlineColor}
                fontSize="9.8"
                fontWeight="900"
              >
                {stop.headline}
              </text>
              <text
                x={stop.cx}
                y="78.5"
                textAnchor="middle"
                fill={stop.sublineColor}
                fontSize="8.2"
                fontWeight="700"
              >
                {stop.subline}
              </text>
            </g>
          ))}

          {/* === 下段：PoliPoli風 入間市の街並みフラット2D線画パノラマ === */}
          <g>
            {/* 遠景の山並み（奥多摩・飯能方面） */}
            <path
              d="M0 198 Q48 164 102 180 Q158 158 214 182 Q284 166 346 184 Q388 176 420 186 L420 226 L0 226 Z"
              fill="#E5EFE9"
              stroke="#97B5A5"
              strokeWidth="1.1"
            />

            {/* 遠景の富士山（金子の茶畑から望む富士） */}
            <g>
              <path
                d="M142 188 L174 143 Q182 145 190 143 L222 188 Z"
                fill="#CBE2D6"
                stroke="#2F3E36"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              {/* 富士山頂の雪冠 */}
              <path
                d="M167 153 L174 143 Q182 145 190 143 L197 153 L190 156 L185 152 L179 157 L173 152 Z"
                fill="#FFFFFF"
                stroke="#2F3E36"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </g>

            {/* 左景：狭山茶畑（金子丘陵の緩やかな茶畑の丘） */}
            <g>
              <path
                d="M0 190 Q54 162 124 186 Q152 195 170 222 L0 222 Z"
                fill="#87C3A3"
                stroke="#2F3E36"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M0 202 Q48 184 114 202 Q138 209 152 222 L0 222 Z"
                fill="#5BA782"
                stroke="#2F3E36"
                strokeWidth="1.3"
              />
              {/* 茶畑の畝ライン */}
              <g stroke="#2F3E36" strokeWidth="1" opacity="0.42" fill="none">
                <path d="M10 194 Q52 178 104 193" />
                <path d="M8 209 Q48 195 100 209" />
                <path d="M6 216 Q46 205 94 217" />
              </g>
              {/* 茶畑横の小さなベンチ/テラス記号 */}
              <path
                d="M28 181 L44 181 M32 181 L32 186 M40 181 L40 186"
                stroke="#2F3E36"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </g>

            {/* 中景：ジョンソンタウンの白い平屋 ＆ 学校・入間市駅前の街並み（すべて均一線幅のフラット2D） */}
            <g stroke="#2F3E36" strokeWidth="1.4" strokeLinejoin="round">
              {/* ジョンソンタウンの白い平屋（左：三角切妻屋根＋カバードポーチ） */}
              <g>
                <rect x="134" y="196" width="46" height="26" fill="#FFFFFF" />
                <polygon points="131,196 157,181 183,196" fill="#2E7D5B" />
                {/* ポーチの柱 */}
                <line x1="142" y1="196" x2="142" y2="222" />
                <line x1="172" y1="196" x2="172" y2="222" />
                {/* 窓とドア */}
                <rect x="147" y="203" width="8" height="10" fill="#FFF0B3" />
                <rect x="160" y="204" width="8" height="18" fill="#E6E1D3" />
              </g>

              {/* 小さな白い平屋（2軒目） */}
              <g>
                <rect x="184" y="200" width="36" height="22" fill="#FFFDF7" />
                <polygon points="181,200 202,188 223,200" fill="#5F9EA0" />
                <rect x="190" y="206" width="9" height="8" fill="#D8ECE0" />
                <rect x="204" y="206" width="8" height="16" fill="#F2B705" />
              </g>

              {/* 学校・公共施設（時計塔付き・校舎） */}
              <g>
                <rect x="228" y="184" width="66" height="38" fill="#FFFFFF" />
                <rect x="226" y="180" width="70" height="5" fill="#2E7D5B" />
                {/* 中央の時計 */}
                <rect x="255" y="170" width="12" height="10" fill="#FFFFFF" />
                <circle cx="261" cy="175" r="3" fill="#FFF8E1" strokeWidth="1.1" />
                {/* 整然と並んだ教室の窓 */}
                <g fill="#D8ECE0" strokeWidth="1.1">
                  <rect x="234" y="190" width="9" height="8" />
                  <rect x="247" y="190" width="9" height="8" />
                  <rect x="266" y="190" width="9" height="8" />
                  <rect x="279" y="190" width="9" height="8" />
                  <rect x="234" y="203" width="9" height="8" />
                  <rect x="247" y="203" width="9" height="8" />
                  <rect x="266" y="203" width="9" height="8" />
                  <rect x="279" y="203" width="9" height="8" />
                </g>
                <rect x="257" y="206" width="8" height="16" fill="#E6E1D3" />
              </g>

              {/* 駅前エリアの商業・住宅棟 */}
              <g>
                <rect x="300" y="174" width="38" height="48" fill="#FAF8F2" />
                <rect x="300" y="174" width="38" height="7" fill="#F2B705" />
                <g fill="#FFFFFF" strokeWidth="1.1">
                  <rect x="306" y="187" width="10" height="8" />
                  <rect x="322" y="187" width="10" height="8" />
                  <rect x="306" y="200" width="10" height="8" />
                  <rect x="322" y="200" width="10" height="8" />
                </g>
              </g>

              {/* 右端の集合住宅・店舗 */}
              <g>
                <rect x="342" y="188" width="44" height="34" fill="#FFFFFF" />
                <polygon points="340,188 364,174 388,188" fill="#3B8D68" />
                <rect x="350" y="195" width="10" height="9" fill="#FFF0B3" />
                <rect x="366" y="195" width="10" height="9" fill="#D8ECE0" />
                <rect x="358" y="209" width="10" height="13" fill="#E6E1D3" />
              </g>

              {/* フラットな丸い街路樹 */}
              <g>
                <line x1="126" y1="208" x2="126" y2="222" strokeWidth="1.5" />
                <circle cx="126" cy="204" r="7" fill="#5BA782" />
                <line x1="224" y1="210" x2="224" y2="222" strokeWidth="1.4" />
                <circle cx="224" cy="207" r="5.5" fill="#87C3A3" />
                <line x1="297" y1="208" x2="297" y2="222" strokeWidth="1.4" />
                <circle cx="297" cy="205" r="6" fill="#5BA782" />
                <line x1="398" y1="204" x2="398" y2="222" strokeWidth="1.5" />
                <circle cx="398" cy="199" r="8" fill="#87C3A3" />
              </g>
            </g>

            {/* 地面と線路（手前のベース帯） */}
            <rect x="0" y="222" width="420" height="28" fill="#EFECE2" />
            <line
              x1="0"
              y1="222"
              x2="420"
              y2="222"
              stroke="#2F3E36"
              strokeWidth="1.6"
            />

            {/* 西武線の線路レール＆枕木 */}
            <line
              x1="0"
              y1="242"
              x2="420"
              y2="242"
              stroke="#596A60"
              strokeWidth="1.8"
            />
            <line
              x1="0"
              y1="245"
              x2="420"
              y2="245"
              stroke="#97A89F"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />

            {/* 手前を走る西武線イメージの黄色い電車（3両編成・フラット2D） */}
            <g transform="translate(86, 223)" stroke="#2F3E36" strokeWidth="1.3">
              {/* 1両目（左・先頭車） */}
              <path
                d="M6 2 L54 2 L54 16 L2 16 L2 6 Q2 2 6 2 Z"
                fill="#F2B705"
                strokeLinejoin="round"
              />
              <rect x="6" y="5" width="7" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <rect x="17" y="5" width="9" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <rect x="30" y="5" width="9" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <rect x="43" y="5" width="7" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <circle cx="12" cy="17.5" r="1.8" fill="#2F3E36" />
              <circle cx="44" cy="17.5" r="1.8" fill="#2F3E36" />

              {/* 連結器1 */}
              <line x1="54" y1="11" x2="58" y2="11" strokeWidth="1.8" />

              {/* 2両目（中間車） */}
              <rect x="58" y="2" width="52" height="14" rx="1.5" fill="#F2B705" />
              <rect x="63" y="5" width="9" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <rect x="76" y="5" width="9" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <rect x="89" y="5" width="9" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <rect x="102" y="5" width="4" height="6" rx="0.5" fill="#E8F4F8" strokeWidth="1" />
              <circle cx="68" cy="17.5" r="1.8" fill="#2F3E36" />
              <circle cx="100" cy="17.5" r="1.8" fill="#2F3E36" />

              {/* 連結器2 */}
              <line x1="110" y1="11" x2="114" y2="11" strokeWidth="1.8" />

              {/* 3両目（右・先頭車） */}
              <path
                d="M114 2 L162 2 Q166 2 166 6 L166 16 L114 16 Z"
                fill="#F2B705"
                strokeLinejoin="round"
              />
              <rect x="118" y="5" width="7" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <rect x="129" y="5" width="9" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <rect x="142" y="5" width="9" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <rect x="155" y="5" width="7" height="6" rx="1" fill="#E8F4F8" strokeWidth="1" />
              <circle cx="124" cy="17.5" r="1.8" fill="#2F3E36" />
              <circle cx="156" cy="17.5" r="1.8" fill="#2F3E36" />
            </g>
          </g>
        </svg>
      </div>

      {/* 下部案内帯 */}
      <div className="bg-[#EEF5F0] border-t border-[#D4E6D9] px-4 py-1.5 flex items-center justify-between gap-2 text-[10.5px] font-bold text-[#236247]">
        <span>📖 10年の見取り図 × 入間市の街並み（カードをタップで該当箇所へ）</span>
      </div>
    </div>
  );
}
