import { kv } from '@vercel/kv';

async function resetReactions() {
  console.log('🗑️ Upstash (Vercel KV) のリアクションデータをすべて削除しています...\n');
  
  try {
    const reactionKeys = await kv.keys('reaction:*');
    const feedbackKeys = await kv.keys('feedback:*');
    const keys = [...reactionKeys, ...feedbackKeys];
    
    if (keys.length === 0) {
      console.log('削除するデータがありませんでした（すでに空です）。');
      return;
    }

    // Pipelineを利用してキーを一括削除
    const pipeline = kv.pipeline();
    keys.forEach(key => pipeline.del(key));
    await pipeline.exec();
    
    console.log(`✅ 合計 ${keys.length} 件のリアクションデータをデータベースから削除しました！`);
    
  } catch (error) {
    console.error('❌ データの削除に失敗しました。');
    console.error('詳細:', error.message);
  }
}

resetReactions();
