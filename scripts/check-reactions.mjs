import { kv } from '@vercel/kv';

async function checkReactions() {
  console.log('🔍 Upstash (Vercel KV) から現在のリアクション総数を取得しています...\n');
  
  try {
    // reaction: で始まるすべてのキーを取得
    const keys = await kv.keys('reaction:*:attention');
    
    if (keys.length === 0) {
      console.log('まだリアクション（👀注目）が一つも登録されていません。');
      return;
    }

    // すべてのキーの値を一括取得
    const values = await kv.mget(...keys);
    
    // 表示用のデータに整形
    const results = keys.map((key, index) => {
      // キー名（例: reaction:shinchosha:attention）から記事IDを抽出
      const articleId = key.split(':')[1];
      return {
        '記事ID (Issue)': decodeURIComponent(articleId),
        '👀 注目数': Number(values[index]) || 0
      };
    });

    // 注目数が多い順に並び替え
    results.sort((a, b) => b['👀 注目数'] - a['👀 注目数']);

    // ターミナルに表形式で出力
    console.table(results);
    
  } catch (error) {
    console.error('❌ データの取得に失敗しました。');
    console.error('環境変数 (.env.local) が正しく読み込まれていない可能性があります。');
    console.error('詳細:', error.message);
  }
}

checkReactions();
