import { kv } from '@vercel/kv';
import fs from 'fs';
import path from 'path';

// --- Data Preparation ---
let idToTitle = {};
try {
  const issuesDataPath = path.join(process.cwd(), 'src/data/issues_data.json');
  const rawData = fs.readFileSync(issuesDataPath, 'utf8');
  const issues = JSON.parse(rawData);
  issues.forEach(issue => {
    idToTitle[issue.id] = issue.title;
  });
} catch (error) {
  console.warn("⚠️ 記事データの読み込みに失敗したため、タイトルが取得できませんでした。", error.message);
}

function getTitle(articleId) {
  const decodedId = decodeURIComponent(articleId);
  return idToTitle[articleId] || idToTitle[decodedId] || decodedId;
}

// --- Fetch from KV ---
async function checkReactions() {
  console.log('🔍 Upstash (Vercel KV) からデータを取得しています...\n');
  
  try {
    // 1. Fetch Attention Keys (reaction:*:attention)
    const attentionKeys = await kv.keys('reaction:*:attention');
    
    // 2. Fetch Feedback Keys (feedback:*:*)
    const feedbackKeys = await kv.keys('feedback:*:*');
    
    if (attentionKeys.length === 0 && feedbackKeys.length === 0) {
      console.log('まだリアクションやフィードバックが一つも登録されていません。');
      return;
    }

    // データの集計用オブジェクト
    const results = {};

    // Attentionの集計
    if (attentionKeys.length > 0) {
      const attentionCounts = await kv.mget(...attentionKeys);
      attentionKeys.forEach((key, index) => {
        const articleId = key.split(':')[1];
        if (!results[articleId]) results[articleId] = { attention: 0, clear: 0, needs_more: 0, alert: 0 };
        results[articleId].attention = attentionCounts[index] || 0;
      });
    }

    // Feedbackの集計
    if (feedbackKeys.length > 0) {
      const feedbackCounts = await kv.mget(...feedbackKeys);
      feedbackKeys.forEach((key, index) => {
        const parts = key.split(':');
        const articleId = parts[1];
        const feedbackType = parts[2]; // clear | needs_more | alert
        
        if (!results[articleId]) results[articleId] = { attention: 0, clear: 0, needs_more: 0, alert: 0 };
        results[articleId][feedbackType] = feedbackCounts[index] || 0;
      });
    }

    // --- Output Formatting ---
    const tableData = Object.keys(results).map(articleId => {
      const data = results[articleId];
      return {
        '記事タイトル': getTitle(articleId),
        '👀注目': data.attention,
        '👍分かりやすい': data.clear,
        '📖もっと知りたい': data.needs_more,
        '⚠️事実と違う': data.alert
      };
    });

    // 注目数で降順ソート
    tableData.sort((a, b) => b['👀注目'] - a['👀注目']);

    console.table(tableData);
    
  } catch (error) {
    console.error('❌ データの取得に失敗しました。');
    console.error('詳細:', error.message);
    console.log('\nヒント: .env.local に正しい KV_REST_API_URL と KV_REST_API_TOKEN が設定されているか確認してください。');
  }
}

checkReactions();
