import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const alt = 'いるまモヤモヤ茶話会';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#FAFAF9',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 背景の装飾：右側のぼんやりした緑のグラデーションオーブ */}
        <div
          style={{
            position: 'absolute',
            right: '-10%',
            top: '-20%',
            width: '800px',
            height: '800px',
            background: 'radial-gradient(circle, #34D399 0%, #A7F3D0 40%, rgba(167, 243, 208, 0) 70%)',
            opacity: 0.5,
            filter: 'blur(80px)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '20%',
            bottom: '-30%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, #059669 0%, #34D399 40%, rgba(52, 211, 153, 0) 70%)',
            opacity: 0.3,
            filter: 'blur(100px)',
            borderRadius: '50%',
          }}
        />

        {/* 左側：テキスト領域 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '80px',
            width: '65%',
            height: '100%',
            zIndex: 10,
          }}
        >
          {/* 日時・場所バッジ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  color: '#059669',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontSize: 20,
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                }}
              >
                🗓 2026年9月18日(金)
              </div>
            </div>
            <div style={{ display: 'flex' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#FFFFFF',
                  color: '#059669',
                  padding: '12px 24px',
                  borderRadius: '999px',
                  fontSize: 20,
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                }}
              >
                📍 カフェ＆バー レガシー(映画館1F) ＆ オンライン
              </div>
            </div>
          </div>

          {/* メインコピー */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 52,
              fontWeight: 800,
              color: '#064E3B',
              lineHeight: 1.3,
              marginBottom: '24px',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            <span>スマホで愚痴って、</span>
            <span>お茶とシーシャで語り合う。</span>
          </div>

          {/* イベント名 */}
          <div
            style={{
              display: 'flex',
              fontSize: 26,
              fontWeight: 'bold',
              color: '#064E3B',
              marginBottom: '40px',
              opacity: 0.9,
            }}
          >
            いるまモヤモヤ茶話会 ｜ 狭山茶シーシャ × 市政ダイアローグ
          </div>

          {/* 体験プロセス */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 22,
              color: '#4B5563',
              fontWeight: 'bold',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981' }}>✓</span> 事前：AIチャットでモヤモヤをカード化
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981' }}>✓</span> 当日：お茶と煙を囲んでゆるやかに意見交換
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#10B981' }}>✓</span> 後日：みんなの声が「街の提案マップ」に
            </div>
          </div>
        </div>

        {/* 右側：ビジュアルアクセント (すりガラスのカードとアイコン) */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: '80px',
            top: '150px',
            width: '320px',
            height: '320px',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: '40px',
            border: '2px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)',
            transform: 'rotate(5deg)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}
        >
          {/* アイコンコンテナ */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transform: 'rotate(-5deg)',
            }}
          >
            {/* 吹き出しアイコン */}
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '-20px', marginLeft: '60px' }}>
              <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
            </svg>
            {/* ティーカップアイコン */}
            <svg width="140" height="140" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
              <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
              <line x1="6" x2="6" y1="2" y2="4" />
              <line x1="10" x2="10" y1="2" y2="4" />
              <line x1="14" x2="14" y1="2" y2="4" />
            </svg>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
