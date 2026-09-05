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
          background: 'linear-gradient(to right, #F9FAFB, #ECFDF5)',
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
        {/* 左側：テキスト領域 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '100px',
            width: '60%',
            height: '100%',
            zIndex: 10,
          }}
        >
          {/* 日時・場所バッジ */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '40px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#D1FAE5',
                color: '#065F46',
                padding: '12px 24px',
                borderRadius: '999px',
                fontSize: 22,
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
            >
              🗓 2026年9月18日(金)
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#D1FAE5',
                color: '#065F46',
                padding: '12px 24px',
                borderRadius: '999px',
                fontSize: 22,
                fontWeight: 'bold',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              }}
            >
              📍 入間市内店舗 ＆ オンライン
            </div>
          </div>

          {/* メインコピー */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 64,
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: 1.2,
              marginBottom: '32px',
              letterSpacing: '-0.02em',
            }}
          >
            <span>日常の「モヤモヤ」を、</span>
            <span>公共のアジェンダへ。</span>
          </div>

          {/* イベント名 */}
          <div
            style={{
              display: 'flex',
              fontSize: 36,
              fontWeight: 'bold',
              color: '#334155',
              marginBottom: '32px',
            }}
          >
            いるまモヤモヤ茶話会
          </div>

          {/* サブタイトル・特徴 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 24,
              color: '#334155',
              gap: '12px',
            }}
          >
            <span style={{ fontWeight: 'bold' }}>狭山茶シーシャ × 市政ダイアローグ</span>
            <span style={{ color: '#64748B' }}>#スマホから匿名参加 #結論を出さない対話</span>
          </div>
        </div>

        {/* 右側：ビジュアル領域 (スマホのモックアップ) */}
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            right: '-40px',
            top: '80px',
            width: '450px',
            height: '900px',
            backgroundColor: '#ffffff',
            borderRadius: '48px',
            border: '12px solid #E2E8F0',
            boxShadow: '-20px 20px 60px rgba(0, 0, 0, 0.1)',
            transform: 'rotate(-5deg)',
            flexDirection: 'column',
            padding: '32px 24px',
            gap: '24px',
          }}
        >
          {/* スマホ画面内の抽象的なUI表現 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
            
            {/* チャットバブル（相手） */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-start' }}>
              <div style={{ width: '60%', height: '80px', backgroundColor: '#F1F5F9', borderRadius: '24px 24px 24px 8px' }} />
            </div>

            {/* チャットバブル（自分・緑） */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '70%', height: '100px', backgroundColor: '#10B981', borderRadius: '24px 24px 8px 24px', opacity: 0.9 }} />
            </div>

            {/* AI関心事カード */}
            <div style={{ display: 'flex', width: '100%', justifyContent: 'center', marginTop: '16px' }}>
              <div style={{ 
                width: '90%', 
                height: '160px', 
                backgroundColor: '#ffffff', 
                borderRadius: '24px',
                border: '2px solid #E2E8F0',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                gap: '16px'
              }}>
                <div style={{ width: '40%', height: '24px', backgroundColor: '#CBD5E1', borderRadius: '8px' }} />
                <div style={{ width: '100%', height: '12px', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
                <div style={{ width: '80%', height: '12px', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
                <div style={{ width: '90%', height: '12px', backgroundColor: '#F1F5F9', borderRadius: '4px' }} />
              </div>
            </div>

          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
