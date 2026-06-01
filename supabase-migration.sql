-- Eliminar columnas full_name y email de la tabla participants
ALTER TABLE public.participants DROP COLUMN IF EXISTS full_name;
ALTER TABLE public.participants DROP COLUMN IF EXISTS email;

-- Agregar columna sede si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'participants' AND column_name = 'sede'
    ) THEN
        ALTER TABLE public.participants ADD COLUMN sede text;
    END IF;
END $$;
