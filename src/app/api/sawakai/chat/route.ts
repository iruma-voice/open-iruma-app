import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Vercel Serverless Functions のタイムアウトを60秒に延長 (Pro以上のプランで有効)
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, conversation_id, user } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // IPアドレスの取得 (Vercel環境では x-forwarded-for ヘッダーを利用)
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    
    // レートリミット設定 (デフォルト10回/分、環境変数で上書き可能)
    // RATE_LIMIT_MAX が設定されている場合はそれを優先
    const rateLimitMax = process.env.RATE_LIMIT_MAX ? parseInt(process.env.RATE_LIMIT_MAX, 10) : 10;
    
    // KVを使用した簡易レートリミット
    const rateLimitKey = `rate_limit_sawakai_${ip}`;
    const currentUsage = await kv.get<number>(rateLimitKey) || 0;
    
    if (currentUsage >= rateLimitMax) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    // カウントアップ（有効期限1分）
    await kv.set(rateLimitKey, currentUsage + 1, { ex: 60 });

    // Dify API設定の確認
    const difyApiKey = process.env.DIFY_API_KEY;
    const difyApiUrl = process.env.DIFY_API_URL || 'https://api.dify.ai/v1';

    if (!difyApiKey) {
      console.error('DIFY_API_KEY is not set');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // Dify APIへのリクエスト
    const difyResponse = await fetch(`${difyApiUrl}/chat-messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${difyApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: query,
        response_mode: 'blocking',
        conversation_id: conversation_id || '',
        user: user || 'anonymous',
      }),
    });

    if (!difyResponse.ok) {
      const errorText = await difyResponse.text();
      console.error('Dify API Error:', errorText);
      return NextResponse.json({ error: `Dify API Error: ${errorText}` }, { status: difyResponse.status });
    }

    const difyData = await difyResponse.json();
    return NextResponse.json(difyData);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
