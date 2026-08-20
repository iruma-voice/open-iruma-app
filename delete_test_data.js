const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)="?(.*?)"?$/);
  if (match) {
    env[match[1]] = match[2];
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Deleting test proposals...');
  
  // We match the content exactly or loosely to ensure we get both
  const { data, error } = await supabase
    .from('proposals')
    .delete()
    .in('content', [
      'あなたの声はこのように反映されます。', 
      'テスト送信\n',
      'テスト送信'
    ])
    .select();
    
  if (error) {
    console.error('Error deleting data:', error);
  } else {
    console.log('Deleted items:', data);
    console.log(`Successfully deleted ${data.length} items.`);
  }
}

run();
