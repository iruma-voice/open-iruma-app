import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// 読み取り用クライアント (RLSに従う)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 書き込み用/RPC用クライアント (Service Role Key を使用し、RLSをバイパスする)
// ⚠️ このクライアントは絶対にクライアントサイド（ブラウザ）へエクスポートしないでください。
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
