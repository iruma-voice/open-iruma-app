import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteAllAgendas() {
  console.log('Deleting all test agendas from sawahukai_agendas table...');
  
  const { data, error } = await supabase
    .from('sawahukai_agendas')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    console.error('Error deleting agendas:', error);
  } else {
    console.log('Successfully deleted all test agendas.');
  }
}

deleteAllAgendas();
