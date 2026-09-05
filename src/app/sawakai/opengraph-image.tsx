import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

export const runtime = 'nodejs'; // fsモジュールを使用するためnodejsランタイムを指定

// Image metadata
export const alt = 'いるまモヤモヤ茶話会';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  // 背景画像を読み込んでBase64文字列に変換
  const imagePath = join(process.cwd(), 'public', 'image_0f1a81.png');
  const imageBuffer = readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString('base64');
  const imageSrc = `data:image/png;base64,${imageBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          fontFamily: 'sans-serif', // Next.js OG (Satori) のデフォルトのフォントフォールバックを使用
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '80px',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: '#a89461',
              color: '#ffffff',
              padding: '6px 20px',
              borderRadius: '30px',
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: '0.05em',
              marginBottom: '20px',
            }}
          >
            愚痴でOK
          </div>
          
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              fontSize: 88,
              color: '#4a5a4e',
              margin: 0,
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
            }}
          >
            <span>いるまモヤモヤ</span>
            <span>茶話会</span>
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: 28,
              color: '#555555',
              margin: 0,
              fontWeight: 500,
              letterSpacing: '0.05em',
            }}
          >
            9.18 Fri ｜ レガシー ＆ スマホで匿名参加
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
