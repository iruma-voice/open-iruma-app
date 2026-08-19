import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../../lib/supabase';
import { kv } from '@vercel/kv';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimitKey = `rate_limit_action_proposal_${ip}`;
    
    // レートリミット (1分間に10回)
    const currentCount = await kv.incr(rateLimitKey);
    if (currentCount === 1) {
      // 1分間の有効期限を設定 (60秒)
      await kv.expire(rateLimitKey, 60);
    }
    
    if (currentCount > 10) {
      return NextResponse.json({ error: 'Too Many Requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { action } = body;

    if (action !== 'like' && action !== 'report') {
      return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
    }

    let rpcName = '';
    if (action === 'like') {
      rpcName = 'increment_like';
    } else if (action === 'report') {
      rpcName = 'increment_report';
    }

    // supabaseAdmin を使用してRPCを呼び出す (RLSをバイパス)
    const { error } = await supabaseAdmin.rpc(rpcName, { proposal_id: id });

    if (error) {
      console.error(`Error performing action ${action} on proposal ${id}:`, error);
      return NextResponse.json({ error: 'Failed to perform action' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in POST /api/proposals/[id]/action:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
