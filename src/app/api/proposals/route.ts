import { NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '../../../lib/supabase';
import { kv } from '@vercel/kv';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get('sort') || 'new'; // 'new' | 'popular'
  const category = searchParams.get('category');

  // Supabase から取得
  let query = supabase
    .from('proposals')
    .select('*')
    .eq('status', 'published');

  if (category) {
    query = query.eq('category', category);
  }

  if (sort === 'popular') {
    query = query.order('likes_count', { ascending: false }).order('created_at', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Failed to fetch proposals' }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `rate_limit_post_proposal_${ip}`;
    
    // レートリミット (1時間に5件)
    const currentCount = await kv.incr(rateLimitKey);
    if (currentCount === 1) {
      // 1時間の有効期限を設定 (秒単位)
      await kv.expire(rateLimitKey, 3600);
    }
    
    if (currentCount > 5) {
      return NextResponse.json({ error: 'Too Many Requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { content, category } = body;

    // バリデーション
    if (!content || typeof content !== 'string' || content.length < 1 || content.length > 200) {
      return NextResponse.json({ error: 'Content must be between 1 and 200 characters.' }, { status: 400 });
    }
    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json({ error: 'Category is required.' }, { status: 400 });
    }

    // supabaseAdminを使用して書き込み
    const { data, error } = await supabaseAdmin
      .from('proposals')
      .insert([{ content, category }])
      .select()
      .single();

    if (error) {
      console.error('Error inserting proposal:', error);
      return NextResponse.json({ error: 'Failed to create proposal' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in POST /api/proposals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
