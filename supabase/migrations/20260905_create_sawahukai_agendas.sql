-- 20260905_create_sawahukai_agendas.sql
-- いるまモヤモヤ茶話会用 アジェンダテーブルの作成

CREATE TABLE IF NOT EXISTS public.sawahukai_agendas (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamptz DEFAULT now(),
    title text NOT NULL,
    moyamoya text NOT NULL,
    core_wish text NOT NULL,
    talk_theme text NOT NULL,
    session_id text,
    status text DEFAULT 'published'
);

-- RLS（Row Level Security）の有効化
ALTER TABLE public.sawahukai_agendas ENABLE ROW LEVEL SECURITY;

-- 匿名ユーザー(anon)からのINSERTを許可
CREATE POLICY "Allow anonymous inserts" ON public.sawahukai_agendas
    FOR INSERT 
    TO anon
    WITH CHECK (true);

-- 匿名ユーザー(anon)からのSELECTを、statusが'published'のもののみ許可
CREATE POLICY "Allow public read for published agendas" ON public.sawahukai_agendas
    FOR SELECT
    TO anon
    USING (status = 'published');

-- 管理者(Service Role)からのUPDATE / DELETEを許可
CREATE POLICY "Allow service role all operations" ON public.sawahukai_agendas
    FOR ALL
    TO service_role
    USING (true);
