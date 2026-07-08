-- Database Schema for MacheteCoin
-- Paste this script into the Supabase SQL Editor to set up your tables.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (User Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    avatar_url TEXT,
    wallet_address TEXT,
    machete_balance NUMERIC(20, 2) DEFAULT 0.00,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Coin Settings Table (Editable via Admin Panel)
CREATE TABLE IF NOT EXISTS public.coin_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1), -- Single row configuration
    contract_address TEXT DEFAULT 'MachETeX1234567890123456789012345678901234',
    blockchain_network TEXT DEFAULT 'Solana',
    total_supply TEXT DEFAULT '1,000,000,000',
    tax_buy NUMERIC(5, 2) DEFAULT 0.00,
    tax_sell NUMERIC(5, 2) DEFAULT 0.00,
    twitter_url TEXT DEFAULT 'https://x.com/MacheteCoin',
    telegram_url TEXT DEFAULT 'https://t.me/MacheteCoin',
    discord_url TEXT DEFAULT 'https://discord.gg/MacheteCoin',
    dexscreener_url TEXT DEFAULT 'https://dexscreener.com/',
    raydium_url TEXT DEFAULT 'https://raydium.io/',
    swap_rate NUMERIC(20, 2) DEFAULT 1000000.00, -- 1 SOL/USDT = 1,000,000 $MACHETE
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for Coin Settings
ALTER TABLE public.coin_settings ENABLE ROW LEVEL SECURITY;

-- Coin Settings Policies
CREATE POLICY "Coin settings are viewable by everyone" 
ON public.coin_settings FOR SELECT USING (true);

CREATE POLICY "Only admins can update coin settings" 
ON public.coin_settings FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Insert default configurations if not exists
INSERT INTO public.coin_settings (id) 
VALUES (1) 
ON CONFLICT (id) DO NOTHING;

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
CREATE POLICY "Roadmap is viewable by everyone" 
ON public.roadmap_phases FOR SELECT USING (true);

CREATE POLICY "Only admins can modify roadmap" 
ON public.roadmap_phases FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Insert default roadmap phases
INSERT INTO public.roadmap_phases (phase_number, title, description, status, items) VALUES
(1, 'Fase 1: La Forja del Machete', 'Desarrollo del concepto, diseño visual, creación del contrato y lanzamiento del sitio web oficial.', 'in_progress', ARRAY['Diseño del logo oficial', 'Desarrollo de la landing page', 'Lanzamiento del contrato inteligente (Solana)', 'Apertura de redes sociales (Telegram, Twitter)']),
(2, 'Fase 2: Cortando la Maleza', 'Campañas de marketing viral, listados de comunidades y swaps descentralizados iniciales.', 'pending', ARRAY['Auditoría del contrato', 'Listado en Raydium DEX', 'Campaña de marketing con influencers de memes', '10,000 Holders activos']),
(3, 'Fase 3: Dominación de la Selva', 'Listado en exchanges centralizados (CEX), lanzamiento del juego web/móvil Machete, y dominación global de memes.', 'pending', ARRAY['Listados en CoinGecko y CoinMarketCap', 'Lanzamiento de la aplicación móvil MacheteCoin', 'Integración del sistema de staking', 'CEX listings principales (Binance/Bybit)'])
ON CONFLICT (phase_number) DO NOTHING;

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
CREATE POLICY "Users can view their own swaps" 
ON public.swaps FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own swaps" 
ON public.swaps FOR INSERT WITH CHECK (auth.uid() = user_id);

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
  INSERT INTO public.profiles (id, username, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    CASE 
      WHEN new.email = 'admin@machetecoin.com' THEN 'admin' -- Default admin credentials helper
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
