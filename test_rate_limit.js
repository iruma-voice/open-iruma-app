const url = 'http://localhost:3000/api/proposals';

async function test() {
  console.log('Testing Rate Limits for POST /api/proposals ...');
  for (let i = 1; i <= 7; i++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({ content: `API Rate Limit Test ${i}`, category: 'その他' })
    });
    
    console.log(`Request ${i}: Status ${res.status}`);
    if (res.status === 429) {
      console.log('SUCCESS: Rate limit correctly triggered!');
      const data = await res.json();
      console.log('Error message:', data.error);
    }
  }
}
test();
