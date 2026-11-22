'use client';

interface IrumaMapHeroBannerProps {
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
}

// 情報公開請求地図（doc-1-2-a.jpg）の輪郭線からトレースした正確な入間市シルエット座標（viewBox 420x250 中央配置）
const IRUMA_CITY_SILHOUETTE_PATH =
  'M192.3 21.4 L198.3 22.9 L199.8 26.3 L203.2 55.0 L206.6 65.9 L220.2 66.3 L220.9 59.9 L217.5 56.9 L218.3 52.0 L251.5 43.3 L252.6 50.8 L256.7 55.7 L259.4 71.6 L276.0 73.1 L285.0 70.8 L292.6 83.2 L295.2 97.9 L305.4 118.7 L304.2 127.7 L297.1 127.7 L296.7 130.4 L290.7 133.4 L284.6 134.5 L283.5 136.4 L278.2 136.4 L273.3 140.2 L263.9 140.9 L261.3 143.6 L256.4 143.9 L255.6 145.8 L246.2 145.8 L246.6 152.6 L251.1 159.8 L251.1 162.8 L248.8 166.6 L250.0 179.0 L246.6 180.1 L245.1 191.1 L248.8 197.5 L260.5 199.4 L262.8 205.8 L260.9 218.2 L256.0 217.8 L238.3 219.0 L236.0 216.7 L234.5 208.0 L228.8 205.8 L220.9 205.8 L215.3 202.0 L215.3 199.4 L210.8 195.2 L213.4 189.2 L213.4 179.8 L196.1 179.8 L193.0 174.9 L179.5 175.2 L178.3 171.8 L174.6 170.3 L169.7 170.3 L167.4 173.3 L157.6 173.0 L145.9 178.2 L142.1 173.3 L133.8 171.1 L128.2 162.0 L120.7 136.8 L115.4 129.2 L115.4 118.3 L122.5 113.8 L126.7 108.1 L129.7 107.7 L136.1 99.8 L145.5 100.6 L152.3 108.5 L157.2 108.5 L158.4 97.2 L169.7 97.6 L171.2 95.7 L169.3 48.2 L174.6 42.9 L181.0 42.2 L179.8 27.8 L184.7 27.1 L185.1 23.3 Z';

interface MapSpot {
  tabId: string;
  num: string;
  title: string;
  sub: string;
  pinX: number;
  pinY: number;
  boxX: number;
  boxY: number;
  lineStartX: number;
  lineStartY: number;
}

// 4つのテーマに対応する入間市内の主要現場ピンと重ならない四隅吹き出し座標
const MAP_SPOTS: MapSpot[] = [
  {
    tabId: 'tab-01',
    num: '①',
    title: '庁舎と行革',
    sub: '新庁舎・4分館',
    pinX: 251,
    pinY: 80,
    boxX: 298,
    boxY: 38,
    lineStartX: 298,
    lineStartY: 59,
  },
  {
    tabId: 'tab-02',
    num: '②',
    title: '教育と子育て',
    sub: '西武中・学童',
    pinX: 190,
    pinY: 62,
    boxX: 6,
    boxY: 38,
    lineStartX: 122,
    lineStartY: 59,
  },
  {
    tabId: 'tab-03',
    num: '③',
    title: '駅前と稼ぐ力',
    sub: '茶の輪・駅南口',
    pinX: 155,
    pinY: 132,
    boxX: 6,
    boxY: 168,
    lineStartX: 122,
    lineStartY: 184,
  },
  {
    tabId: 'tab-04',
    num: '④',
    title: '水道代と暮らし',
    sub: '水道改定・防犯',
    pinX: 276,
    pinY: 104,
    boxX: 298,
    boxY: 168,
    lineStartX: 298,
    lineStartY: 184,
  },
];

// 入間市のシルエット地図 × 4つの現場ピン（タップで各タブへジャンプ）
export default function IrumaMapHeroBanner({
  activeTabId,
  onSelectTab,
}: IrumaMapHeroBannerProps) {
  return (
    <div className="bg-[#F5F2E6] border-b border-[#E6E1D3] select-none">
      {/* SVG地図エリア */}
      <div className="relative px-2 pt-2.5 pb-1">
        <svg
          viewBox="0 0 420 250"
          className="w-full h-auto block"
          role="img"
          aria-label="入間市の地形シルエットと4つの主要論点マップ"
        >
          <defs>
            {/* 調査ノート風の微細な方眼ドット */}
            <pattern
              id="irumaMapDots"
              x="0"
              y="0"
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="0.8" fill="#C9C2AC" opacity="0.65" />
            </pattern>
          </defs>

          {/* 背景パターン */}
          <rect x="0" y="0" width="420" height="250" fill="url(#irumaMapDots)" />

          {/* 左上タイトルタグ */}
          <g transform="translate(8, 8)">
            <rect
              x="0"
              y="0"
              width="160"
              height="20"
              rx="10"
              fill="#FFFFFF"
              stroke="#D8D1BC"
              strokeWidth="1"
            />
            <circle cx="12" cy="10" r="3.5" fill="#2E7D5B" />
            <text
              x="20"
              y="13.5"
              fill="#236247"
              fontSize="9.5"
              fontWeight="800"
            >
              いま議論中の4つの現場マップ
            </text>
          </g>

          {/* 右上控えめな方位記号 */}
          <g transform="translate(398, 18)" opacity="0.65">
            <text
              x="0"
              y="-5"
              textAnchor="middle"
              fill="#4B6658"
              fontSize="8"
              fontWeight="800"
            >
              N
            </text>
            <path
              d="M0 -3 L0 10 M-3 1 L0 -3 L3 1"
              stroke="#4B6658"
              strokeWidth="1.3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* 地図本体グループ（上部ラベルと重ならないよう8px下方配置） */}
          <g transform="translate(0, 8)">
            {/* 入間市地形のソフトシャドウ */}
            <path
              d={IRUMA_CITY_SILHOUETTE_PATH}
              transform="translate(2, 3)"
              fill="#D4CDB8"
              opacity="0.45"
            />

            {/* 入間市シルエット本体 */}
            <path
              d={IRUMA_CITY_SILHOUETTE_PATH}
              fill="#D8ECE0"
              stroke="#2E7D5B"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* 金子・西部の狭山茶畑イメージ（淡い畝ライン） */}
            <g stroke="#2E7D5B" strokeWidth="1.2" opacity="0.22">
              <line x1="138" y1="136" x2="174" y2="124" />
              <line x1="141" y1="143" x2="177" y2="131" />
              <line x1="144" y1="150" x2="180" y2="138" />
              <line x1="147" y1="157" x2="183" y2="145" />
            </g>

            {/* 入間川イメージライン（北西〜北東の縁沿い） */}
            <path
              d="M174 44 Q198 62 222 62 Q245 55 278 69"
              fill="none"
              stroke="#7AB8CC"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.7"
            />

            {/* 西武池袋線イメージライン（仏子〜入間市〜武蔵藤沢） */}
            <path
              d="M206 58 L244 89 L284 127"
              fill="none"
              stroke="#6B706C"
              strokeWidth="1.3"
              strokeDasharray="3 2.5"
              opacity="0.7"
            />
            <circle cx="244" cy="89" r="2.5" fill="#FFFFFF" stroke="#474C48" strokeWidth="1.2" />

            {/* 市内の主要エリア名（ピンと重ならない位置に控えめ配置） */}
            <text x="187" y="36" textAnchor="middle" fill="#3D5E4D" fontSize="7.5" fontWeight="700">
              西武
            </text>
            <text x="232" y="108" textAnchor="middle" fill="#3D5E4D" fontSize="7.2" fontWeight="700">
              入間市駅周辺
            </text>
            <text x="155" y="158" textAnchor="middle" fill="#3D5E4D" fontSize="7.5" fontWeight="700">
              金子
            </text>
            <text x="226" y="178" textAnchor="middle" fill="#3D5E4D" fontSize="7.5" fontWeight="700">
              宮寺・二本木
            </text>
            <text x="276" y="129" textAnchor="middle" fill="#3D5E4D" fontSize="7.5" fontWeight="700">
              藤沢
            </text>

            {/* 茶畑テラス(③)と駅南口留保地を緩やかに結ぶ点線補助 */}
            <path
              d="M159 130 Q204 114 242 91"
              fill="none"
              stroke="#B8860B"
              strokeWidth="1"
              strokeDasharray="2 2"
              opacity="0.45"
            />
          </g>

          {/* 4つの現場ピン ＋ タップ可能な四隅ラベルボックス */}
          {MAP_SPOTS.map((spot) => {
            const isActive = activeTabId === spot.tabId;
            const adjPinY = spot.pinY + 8;

            return (
              <g
                key={spot.tabId}
                role="button"
                tabIndex={0}
                aria-label={`${spot.num} ${spot.title}（${spot.sub}）を表示`}
                onClick={() => onSelectTab(spot.tabId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectTab(spot.tabId);
                  }
                }}
                className="cursor-pointer group"
              >
                {/* 引き出し線 */}
                <line
                  x1={spot.lineStartX}
                  y1={spot.lineStartY}
                  x2={spot.pinX}
                  y2={adjPinY}
                  stroke={isActive ? '#2E7D5B' : '#9AA39C'}
                  strokeWidth={isActive ? 1.8 : 1.2}
                  strokeDasharray={isActive ? undefined : '2.5 2'}
                />

                {/* ラベル吹き出しボックス */}
                <rect
                  x={spot.boxX}
                  y={spot.boxY}
                  width="116"
                  height="40"
                  rx="10"
                  fill={isActive ? '#2E7D5B' : '#FFFFFF'}
                  stroke={isActive ? '#1D523B' : '#CFC7B2'}
                  strokeWidth={isActive ? 1.6 : 1.2}
                />
                <text
                  x={spot.boxX + 9}
                  y={spot.boxY + 17}
                  fill={isActive ? '#FFFFFF' : '#1E221F'}
                  fontSize="10.5"
                  fontWeight="900"
                >
                  {spot.num} {spot.title}
                </text>
                <text
                  x={spot.boxX + 9}
                  y={spot.boxY + 31}
                  fill={isActive ? '#FFF0B3' : '#5C615D'}
                  fontSize="8.8"
                  fontWeight="700"
                >
                  {spot.sub}
                </text>

                {/* 地図上の丸ピン */}
                {isActive && (
                  <circle
                    cx={spot.pinX}
                    cy={adjPinY}
                    r="11.5"
                    fill="#F2B705"
                    opacity="0.35"
                  />
                )}
                <circle
                  cx={spot.pinX}
                  cy={adjPinY}
                  r="8"
                  fill={isActive ? '#F2B705' : '#2E7D5B'}
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                />
                <text
                  x={spot.pinX}
                  y={adjPinY + 3.4}
                  textAnchor="middle"
                  fill={isActive ? '#1E221F' : '#FFFFFF'}
                  fontSize="9.5"
                  fontWeight="900"
                >
                  {spot.tabId.replace('tab-0', '')}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* 下部案内帯 */}
      <div className="bg-[#EEF5F0] border-t border-[#D4E6D9] px-4 py-1.5 flex items-center justify-between gap-2 text-[10.5px] font-bold text-[#236247]">
        <span>📍 入間市エリア別マップ（ピンや枠をタップで論点へ）</span>
        <span className="text-[9.5px] text-[#4C6B5B] shrink-0">※略図</span>
      </div>
    </div>
  );
}
