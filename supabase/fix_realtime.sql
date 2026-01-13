-- ═══════════════════════════════════════════════════════════════
-- 执行白虎 - Fix Realtime
-- Execute este script DEPOIS do schema.sql
-- ═══════════════════════════════════════════════════════════════

-- REPLICA IDENTITY (obrigatório para UPDATE/DELETE realtime)
ALTER TABLE public.tokens REPLICA IDENTITY FULL;
ALTER TABLE public.system_status REPLICA IDENTITY FULL;
ALTER TABLE public.trades REPLICA IDENTITY FULL;
ALTER TABLE public.positions REPLICA IDENTITY FULL;

-- Adicionar ao realtime (ignora se já existir)
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tokens;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.system_status;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.trades;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.positions;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

-- RLS (Row Level Security)
ALTER TABLE public.tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;

-- Políticas de leitura pública
DROP POLICY IF EXISTS "public_read_tokens" ON public.tokens;
DROP POLICY IF EXISTS "public_read_status" ON public.system_status;
DROP POLICY IF EXISTS "public_read_trades" ON public.trades;
DROP POLICY IF EXISTS "public_read_positions" ON public.positions;

CREATE POLICY "public_read_tokens" ON public.tokens FOR SELECT USING (true);
CREATE POLICY "public_read_status" ON public.system_status FOR SELECT USING (true);
CREATE POLICY "public_read_trades" ON public.trades FOR SELECT USING (true);
CREATE POLICY "public_read_positions" ON public.positions FOR SELECT USING (true);

-- Políticas de escrita (para service role)
DROP POLICY IF EXISTS "service_write_tokens" ON public.tokens;
DROP POLICY IF EXISTS "service_write_status" ON public.system_status;
DROP POLICY IF EXISTS "service_write_trades" ON public.trades;
DROP POLICY IF EXISTS "service_write_positions" ON public.positions;

CREATE POLICY "service_write_tokens" ON public.tokens FOR ALL USING (true);
CREATE POLICY "service_write_status" ON public.system_status FOR ALL USING (true);
CREATE POLICY "service_write_trades" ON public.trades FOR ALL USING (true);
CREATE POLICY "service_write_positions" ON public.positions FOR ALL USING (true);

-- Verificar
SELECT 'Realtime configurado com sucesso!' as status;
