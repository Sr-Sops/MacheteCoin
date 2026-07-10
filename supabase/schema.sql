-- Database Schema for MacheteCoin
-- Paste this script into the Supabase SQL Editor to set up your tables.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (User Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    avatar_url TEXT,
    wallet_address TEXT,
    machete_balance NUMERIC(20, 2) DEFAULT 0.00,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    phone_verified BOOLEAN DEFAULT FALSE,
    birth_date DATE,
    document_id TEXT DEFAULT '',
    kyc_status TEXT DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'approved', 'rejected')),
    kyc_document_type TEXT DEFAULT 'DNI',
    kyc_document_url TEXT,
    two_fa_enabled BOOLEAN DEFAULT FALSE,
    two_fa_secret TEXT,
    recovery_words TEXT,
    terms_accepted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Asegurar que las columnas existen si la tabla profiles ya fue creada previamente
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS machete_balance NUMERIC(20, 2) DEFAULT 0.00;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS document_id TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_status TEXT DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_document_type TEXT DEFAULT 'DNI';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS kyc_document_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS two_fa_enabled BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS two_fa_secret TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS recovery_words TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Agregar constraint de roles si no existe
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'admin'));
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'profiles_kyc_status_check'
    ) THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_kyc_status_check CHECK (kyc_status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Coin Settings Table (Editable via Admin Panel)
CREATE TABLE IF NOT EXISTS public.coin_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Single row configuration
    contract_address TEXT DEFAULT '0x0000000000000000000000000000000000000000',
    blockchain_network TEXT DEFAULT 'Polygon',
    total_supply TEXT DEFAULT '1,000,000,000',
    tax_buy NUMERIC(5, 2) DEFAULT 0.00,
    tax_sell NUMERIC(5, 2) DEFAULT 0.00,
    twitter_url TEXT DEFAULT 'https://x.com/MacheteCoin',
    telegram_url TEXT DEFAULT 'https://t.me/MacheteCoin',
    discord_url TEXT DEFAULT 'https://discord.gg/MacheteCoin',
    dexscreener_url TEXT DEFAULT 'https://dexscreener.com/',
    raydium_url TEXT DEFAULT 'https://quickswap.exchange/',
    swap_rate NUMERIC(20, 2) DEFAULT 1000000.00, -- 1 SOL/USDT = 1,000,000 $MACHETE
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Coin Settings
ALTER TABLE public.coin_settings ENABLE ROW LEVEL SECURITY;

-- Coin Settings Policies
DROP POLICY IF EXISTS "Coin settings are viewable by everyone" ON public.coin_settings;
CREATE POLICY "Coin settings are viewable by everyone" 
ON public.coin_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can update coin settings" ON public.coin_settings;
CREATE POLICY "Only admins can update coin settings" 
ON public.coin_settings FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Insert default configurations if not exists or update if exists to force migration to Polygon
INSERT INTO public.coin_settings (id, blockchain_network, contract_address, raydium_url) 
VALUES (1, 'Polygon', '0x0000000000000000000000000000000000000000', 'https://quickswap.exchange/') 
ON CONFLICT (id) DO UPDATE 
SET blockchain_network = EXCLUDED.blockchain_network,
    contract_address = EXCLUDED.contract_address,
    raydium_url = EXCLUDED.raydium_url;

-- 3. Roadmap Phases Table
CREATE TABLE IF NOT EXISTS public.roadmap_phases (
    id SERIAL PRIMARY KEY,
    phase_number INT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
    items TEXT[] DEFAULT '{}'::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Roadmap
ALTER TABLE public.roadmap_phases ENABLE ROW LEVEL SECURITY;

-- Roadmap Policies
DROP POLICY IF EXISTS "Roadmap is viewable by everyone" ON public.roadmap_phases;
CREATE POLICY "Roadmap is viewable by everyone" 
ON public.roadmap_phases FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admins can modify roadmap" ON public.roadmap_phases;
CREATE POLICY "Only admins can modify roadmap" 
ON public.roadmap_phases FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Insert default roadmap phases
INSERT INTO public.roadmap_phases (phase_number, title, description, status, items) VALUES
(1, 'Fase 1: La Forja del Machete', 'Desarrollo del concepto, diseño visual, creación del contrato y lanzamiento del sitio web oficial.', 'completed', ARRAY['Diseño del logo oficial', 'Desarrollo de la landing page', 'Lanzamiento del contrato inteligente (Polygon)', 'Apertura de redes sociales (Telegram, Twitter)']),
(2, 'Fase 2: Cortando la Maleza', 'Campañas de marketing viral, listados de comunidades y swaps descentralizados iniciales.', 'in_progress', ARRAY['Auditoría del contrato', 'Listado en QuickSwap DEX', 'Campaña de marketing con influencers de memes', '10,000 Holders activos']),
(3, 'Fase 3: Dominación de la Selva', 'Listado en exchanges centralizados (CEX), lanzamiento del juego web/móvil Machete, y dominación global de memes.', 'pending', ARRAY['Listados en CoinGecko y CoinMarketCap', 'Lanzamiento de la aplicación móvil MacheteCoin', 'Integración del sistema de staking', 'CEX listings principales (Binance/Bybit)'])
ON CONFLICT (phase_number) DO NOTHING;

-- Forzar la actualización del estado de las fases a su valor inicial correcto
UPDATE public.roadmap_phases SET status = 'completed' WHERE phase_number = 1;
UPDATE public.roadmap_phases SET status = 'in_progress' WHERE phase_number = 2;
UPDATE public.roadmap_phases SET status = 'pending' WHERE phase_number = 3;

-- 4. Swaps Table (Transaction History)
CREATE TABLE IF NOT EXISTS public.swaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    from_token TEXT NOT NULL,
    from_amount NUMERIC(20, 8) NOT NULL,
    to_amount NUMERIC(20, 2) NOT NULL,
    tx_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Swaps
ALTER TABLE public.swaps ENABLE ROW LEVEL SECURITY;

-- Swaps Policies
DROP POLICY IF EXISTS "Users can view their own swaps" ON public.swaps;
CREATE POLICY "Users can view their own swaps" 
ON public.swaps FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own swaps" ON public.swaps;
CREATE POLICY "Users can insert their own swaps" 
ON public.swaps FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all swaps" ON public.swaps;
CREATE POLICY "Admins can view all swaps" 
ON public.swaps FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- 5. Auto-trigger to create Profile on User Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    username, 
    email,
    avatar_url, 
    role,
    first_name,
    last_name,
    phone,
    phone_verified,
    birth_date,
    document_id,
    kyc_status,
    kyc_document_type,
    kyc_document_url,
    two_fa_enabled,
    two_fa_secret,
    recovery_words,
    terms_accepted
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 
      CASE 
        WHEN new.email IN ('sops1o6@gmail.com', 'sops_raptor@hotmail.es') THEN 'admin'
        ELSE 'user'
      END
    ),
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE((new.raw_user_meta_data->>'phone_verified')::boolean, false),
    NULLIF(new.raw_user_meta_data->>'birth_date', '')::date,
    COALESCE(new.raw_user_meta_data->>'document_id', ''),
    COALESCE(new.raw_user_meta_data->>'kyc_status', 'pending'),
    COALESCE(new.raw_user_meta_data->>'kyc_document_type', 'DNI'),
    new.raw_user_meta_data->>'kyc_document_url',
    COALESCE((new.raw_user_meta_data->>'two_fa_enabled')::boolean, false),
    new.raw_user_meta_data->>'two_fa_secret',
    new.raw_user_meta_data->>'recovery_words',
    COALESCE((new.raw_user_meta_data->>'terms_accepted')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Promover al correo del administrador real a rol 'admin' de forma inmediata si ya existe
UPDATE public.profiles 
SET role = 'admin' 
WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email = 'sops1o6@gmail.com'
);

-- ==========================================
-- SCRIPT DE CREACIÓN AUTOMÁTICA DEL ADMINISTRADOR
-- ==========================================
-- Habilitar pgcrypto para encriptación de contraseña (bcrypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insertar el usuario administrador ya confirmado en auth.users
-- Email: sops1o6@gmail.com
-- Contraseña: Machete@Coin26BS (encriptada con bcrypt)
-- Nombre de usuario: sopsdev
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  is_sso_user
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'd3b07384-d113-41e8-a83d-e4c13a0c5f21', -- UUID fijo para el administrador
  'authenticated',
  'authenticated',
  'sops1o6@gmail.com',
  crypt('Machete@Coin26BS', gen_salt('bf', 10)), -- Genera hash bcrypt compatible con Supabase Auth
  NOW(), -- Confirmación de email
  '{"provider":"email","providers":["email"]}',
  '{"username":"sopsdev"}',
  NOW(),
  NOW(),
  false
)
ON CONFLICT (id) DO NOTHING;

-- Asegurar la existencia del perfil administrador en public.profiles con rol admin y saldo inicial
INSERT INTO public.profiles (id, username, role, machete_balance)
VALUES (
  'd3b07384-d113-41e8-a83d-e4c13a0c5f21', 
  'sopsdev', 
  'admin', 
  1000000.0
)
ON CONFLICT (id) DO UPDATE
SET role = 'admin',
    username = 'sopsdev';

-- 6. RPC to promote another user to admin safely by email
CREATE OR REPLACE FUNCTION public.promote_user_by_email(target_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  caller_role TEXT;
  target_uid UUID;
BEGIN
  -- Check if the caller is an admin
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  IF caller_role IS NULL OR caller_role != 'admin' THEN
    RAISE EXCEPTION 'Not authorized. Only administrators can promote users.';
  END IF;

  -- Find target user UID in auth.users
  SELECT id INTO target_uid FROM auth.users WHERE email = target_email;
  IF target_uid IS NULL THEN
    RETURN FALSE; -- User not found
  END IF;

  -- Update the profile role to admin
  UPDATE public.profiles SET role = 'admin' WHERE id = target_uid;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RPC to reset password by recovery seed words
CREATE OR REPLACE FUNCTION public.reset_password_by_recovery_words(
  target_email TEXT,
  input_words TEXT,
  new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  stored_words TEXT;
  target_uid UUID;
BEGIN
  -- Find stored words
  SELECT id, recovery_words INTO target_uid, stored_words 
  FROM public.profiles 
  WHERE email = target_email OR username = target_email;
  
  IF target_uid IS NULL OR stored_words IS NULL OR LOWER(TRIM(stored_words)) != LOWER(TRIM(input_words)) THEN
    RETURN FALSE;
  END IF;

  -- Update auth.users encrypted password
  UPDATE auth.users 
  SET encrypted_password = crypt(new_password, gen_salt('bf', 10)) 
  WHERE id = target_uid;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
