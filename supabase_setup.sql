CREATE TABLE IF NOT EXISTS public.waitlist (
    id TEXT PRIMARY KEY,
    count BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.waitlist (id, count, updated_at)
VALUES ('esper_global', 0, NOW())
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on waitlist"
ON public.waitlist
FOR SELECT
TO anon, authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.increment_waitlist_counter()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_count BIGINT;
BEGIN
    UPDATE public.waitlist
    SET 
        count = count + 1,
        updated_at = NOW()
    WHERE id = 'esper_global'
    RETURNING count INTO new_count;
    
    IF new_count IS NULL THEN
        INSERT INTO public.waitlist (id, count, updated_at)
        VALUES ('esper_global', 1, NOW())
        RETURNING count INTO new_count;
    END IF;

    RETURN new_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_waitlist_counter() TO anon, authenticated;

ALTER PUBLICATION supabase_realtime ADD TABLE public.waitlist;
