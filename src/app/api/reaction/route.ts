import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { article_id, type = 'attention', feedback_type } = body;
    
    if (!article_id) {
      return NextResponse.json({ error: 'Missing article_id' }, { status: 400 });
    }
    
    let key = `reaction:${article_id}:attention`;
    if (type === 'feedback' && feedback_type) {
      key = `feedback:${article_id}:${feedback_type}`;
    }
    
    const newCount = await kv.incr(key);
    
    return NextResponse.json({ count: newCount });
  } catch (error) {
    console.error('Error in reaction API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const article_id = searchParams.get('article_id');

  if (!article_id) {
    return NextResponse.json({ error: 'Missing article_id' }, { status: 400 });
  }

  try {
    const key = `reaction:${article_id}:attention`;
    const count = await kv.get<number>(key) || 0;
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching reaction count:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
