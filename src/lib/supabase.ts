import { createBrowserClient } from '@supabase/ssr';

// Check if credentials are placeholders or default values
const isRealSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return (
    url &&
    key &&
    !url.includes('your-supabase-project-url') &&
    !key.includes('your-anon-key')
  );
};

// Create real Supabase Browser Client if configured
export const supabaseClient = isRealSupabaseConfigured()
  ? createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  : null;

// Standard types
export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  wallet_address: string | null;
  machete_balance: number;
  role: 'user' | 'admin';
  created_at: string;
}

export interface CoinSettings {
  id: number;
  contract_address: string;
  blockchain_network: string;
  total_supply: string;
  tax_buy: number;
  tax_sell: number;
  twitter_url: string;
  telegram_url: string;
  discord_url: string;
  dexscreener_url: string;
  raydium_url: string;
  swap_rate: number;
  updated_at: string;
}

export interface RoadmapPhase {
  id: number;
  phase_number: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  items: string[];
  created_at: string;
}

export interface SwapTx {
  id: string;
  user_id: string;
  from_token: string;
  from_amount: number;
  to_amount: number;
  tx_hash: string;
  created_at: string;
}

// ----------------------------------------------------
// LOCAL STORAGE MOCK CLIENT
// ----------------------------------------------------
const MOCK_STORAGE_KEYS = {
  SETTINGS: 'machete_coin_settings',
  PROFILES: 'machete_profiles',
  ROADMAP: 'machete_roadmap',
  SWAPS: 'machete_swaps',
  SESSION: 'machete_session',
};

// Initialize Mock Database
const initMockDB = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(MOCK_STORAGE_KEYS.SETTINGS)) {
    const defaultSettings: CoinSettings = {
      id: 1,
      contract_address: '0x0000000000000000000000000000000000000000',
      blockchain_network: 'Polygon',
      total_supply: '1,000,000,000',
      tax_buy: 0.0,
      tax_sell: 0.0,
      twitter_url: 'https://x.com/MacheteCoin',
      telegram_url: 'https://t.me/MacheteCoin',
      discord_url: 'https://discord.gg/MacheteCoin',
      dexscreener_url: 'https://dexscreener.com/',
      raydium_url: 'https://quickswap.exchange/',
      swap_rate: 1000000.0,
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(MOCK_STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
  }

  if (!localStorage.getItem(MOCK_STORAGE_KEYS.ROADMAP)) {
    const defaultRoadmap: RoadmapPhase[] = [
      {
        id: 1,
        phase_number: 1,
        title: 'Fase 1: La Forja del Machete',
        description: 'Desarrollo del concepto, diseño visual, creación del contrato y lanzamiento del sitio web oficial.',
        status: 'completed',
        items: [
          'Diseño del logo oficial',
          'Desarrollo de la landing page',
          'Lanzamiento del contrato inteligente (Polygon)',
          'Apertura de redes sociales (Telegram, Twitter)',
        ],
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        phase_number: 2,
        title: 'Fase 2: Cortando la Maleza',
        description: 'Campañas de marketing viral, listados de comunidades y swaps descentralizados iniciales.',
        status: 'in_progress',
        items: [
          'Auditoría del contrato',
          'Listado en QuickSwap DEX',
          'Campaña de marketing con influencers de memes',
          '10,000 Holders activos',
        ],
        created_at: new Date().toISOString(),
      },
      {
        id: 3,
        phase_number: 3,
        title: 'Fase 3: Dominación de la Selva',
        description: 'Listado en exchanges centralizados (CEX), lanzamiento del juego web/móvil Machete, y dominación global de memes.',
        status: 'pending',
        items: [
          'Listados en CoinGecko y CoinMarketCap',
          'Lanzamiento de la aplicación móvil MacheteCoin',
          'Integración del sistema de staking',
          'CEX listings principales (Binance/Bybit)',
        ],
        created_at: new Date().toISOString(),
      },
    ];
    localStorage.setItem(MOCK_STORAGE_KEYS.ROADMAP, JSON.stringify(defaultRoadmap));
  }

  if (!localStorage.getItem(MOCK_STORAGE_KEYS.PROFILES)) {
    localStorage.setItem(MOCK_STORAGE_KEYS.PROFILES, JSON.stringify([]));
  }

  if (!localStorage.getItem(MOCK_STORAGE_KEYS.SWAPS)) {
    localStorage.setItem(MOCK_STORAGE_KEYS.SWAPS, JSON.stringify([]));
  }
};

// Safe getter for LocalStorage
const getLocalStorageItem = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : fallback;
};

const setLocalStorageItem = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

// ----------------------------------------------------
// UNIFIED DATA SERVICE (Real Supabase or Mock Storage)
// ----------------------------------------------------
export const MacheteService = {
  isMock: () => !isRealSupabaseConfigured(),

  init: () => {
    if (!isRealSupabaseConfigured()) {
      initMockDB();
    }
  },

  // 1. Auth Methods
  signUp: async (email: string, username: string, password?: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password: password || 'machete-default-pass-change-me',
        options: {
          data: { username },
        },
      });
      if (error) return { success: false, error: error.message };
      return { success: true, user: data.user };
    } else {
      // Mock SignUp
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      if (profiles.some((p) => p.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, error: 'El nombre de usuario ya está registrado.' };
      }
      
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@machetecoin.com';
      const isFirstAdmin = email.toLowerCase() === adminEmail.toLowerCase();
      const newProfile: Profile = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        avatar_url: null,
        wallet_address: null,
        machete_balance: 0.00,
        role: isFirstAdmin ? 'admin' : 'user',
        created_at: new Date().toISOString(),
      };

      profiles.push(newProfile);
      setLocalStorageItem(MOCK_STORAGE_KEYS.PROFILES, profiles);
      setLocalStorageItem(MOCK_STORAGE_KEYS.SESSION, newProfile);
      return { success: true, user: newProfile };
    }
  },

  signIn: async (email: string, password?: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      // Direct sign in link or mock credentials
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password: password || 'machete-default-pass-change-me',
      });
      if (error) return { success: false, error: error.message };
      return { success: true, user: data.user };
    } else {
      // Mock SignIn
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@machetecoin.com';
      const isFirstAdmin = email.toLowerCase() === adminEmail.toLowerCase();
      let user = profiles.find((p) => (isFirstAdmin && p.role === 'admin') || p.username.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        // Auto-create user for testing convenience if mock database is empty
        const username = isFirstAdmin ? 'MacheteAdmin' : email.split('@')[0];
        const newProfile: Profile = {
          id: Math.random().toString(36).substr(2, 9),
          username,
          avatar_url: null,
          wallet_address: null,
          machete_balance: isFirstAdmin ? 10000000 : 0.00,
          role: isFirstAdmin ? 'admin' : 'user',
          created_at: new Date().toISOString(),
        };
        profiles.push(newProfile);
        setLocalStorageItem(MOCK_STORAGE_KEYS.PROFILES, profiles);
        user = newProfile;
      }

      setLocalStorageItem(MOCK_STORAGE_KEYS.SESSION, user);
      return { success: true, user };
    }
  },

  signOut: async () => {
    if (isRealSupabaseConfigured() && supabaseClient) {
      await supabaseClient.auth.signOut();
    } else {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(MOCK_STORAGE_KEYS.SESSION);
      }
    }
    return { success: true };
  },

  getCurrentUser: async (): Promise<Profile | null> => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error || !data) return null;
      return data as Profile;
    } else {
      return getLocalStorageItem<Profile | null>(MOCK_STORAGE_KEYS.SESSION, null);
    }
  },

  // 2. Profile Methods
  updateWallet: async (userId: string, walletAddress: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      const { error } = await supabaseClient
        .from('profiles')
        .update({ wallet_address: walletAddress })
        .eq('id', userId);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      const idx = profiles.findIndex((p) => p.id === userId);
      if (idx !== -1) {
        profiles[idx].wallet_address = walletAddress;
        setLocalStorageItem(MOCK_STORAGE_KEYS.PROFILES, profiles);
        
        const session = getLocalStorageItem<Profile | null>(MOCK_STORAGE_KEYS.SESSION, null);
        if (session && session.id === userId) {
          session.wallet_address = walletAddress;
          setLocalStorageItem(MOCK_STORAGE_KEYS.SESSION, session);
        }
        return { success: true };
      }
      return { success: false, error: 'Usuario no encontrado' };
    }
  },

  // 3. Coin Settings Methods
  getCoinSettings: async (): Promise<CoinSettings> => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('coin_settings')
        .select('*')
        .eq('id', 1)
        .single();
      if (error || !data) {
        return getLocalStorageItem<CoinSettings>(MOCK_STORAGE_KEYS.SETTINGS, {} as CoinSettings);
      }
      return data as CoinSettings;
    } else {
      return getLocalStorageItem<CoinSettings>(MOCK_STORAGE_KEYS.SETTINGS, {} as CoinSettings);
    }
  },

  updateCoinSettings: async (settings: Partial<CoinSettings>) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      const { error } = await supabaseClient
        .from('coin_settings')
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq('id', 1);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      const current = getLocalStorageItem<CoinSettings>(MOCK_STORAGE_KEYS.SETTINGS, {} as CoinSettings);
      const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
      setLocalStorageItem(MOCK_STORAGE_KEYS.SETTINGS, updated);
      return { success: true };
    }
  },

  // 4. Roadmap Methods
  getRoadmap: async (): Promise<RoadmapPhase[]> => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('roadmap_phases')
        .select('*')
        .order('phase_number', { ascending: true });
      if (error || !data) {
        return getLocalStorageItem<RoadmapPhase[]>(MOCK_STORAGE_KEYS.ROADMAP, []);
      }
      return data as RoadmapPhase[];
    } else {
      return getLocalStorageItem<RoadmapPhase[]>(MOCK_STORAGE_KEYS.ROADMAP, []);
    }
  },

  updateRoadmapPhase: async (id: number, phase: Partial<RoadmapPhase>) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      const { error } = await supabaseClient
        .from('roadmap_phases')
        .update(phase)
        .eq('id', id);
      if (error) return { success: false, error: error.message };
      return { success: true };
    } else {
      const roadmap = getLocalStorageItem<RoadmapPhase[]>(MOCK_STORAGE_KEYS.ROADMAP, []);
      const idx = roadmap.findIndex((p) => p.id === id);
      if (idx !== -1) {
        roadmap[idx] = { ...roadmap[idx], ...phase };
        setLocalStorageItem(MOCK_STORAGE_KEYS.ROADMAP, roadmap);
        return { success: true };
      }
      return { success: false, error: 'Fase no encontrada' };
    }
  },

  // 5. Swap/Transactions Methods
  executeSwap: async (userId: string, fromToken: string, fromAmount: number, toAmount: number) => {
    MacheteService.init();
    const txHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    if (isRealSupabaseConfigured() && supabaseClient) {
      // First insert swap transaction
      const { error: txError } = await supabaseClient
        .from('swaps')
        .insert({
          user_id: userId,
          from_token: fromToken,
          from_amount: fromAmount,
          to_amount: toAmount,
          tx_hash: txHash,
        });

      if (txError) return { success: false, error: txError.message };

      // Then update user balance (requires fetching balance, but typically direct updates are done. 
      // For security, RPC functions or increments in DB are safer, here we do a fetch-and-update since RLS allows it)
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('machete_balance')
        .eq('id', userId)
        .single();
      
      const currentBalance = Number(profile?.machete_balance || 0);
      const { error: balError } = await supabaseClient
        .from('profiles')
        .update({ machete_balance: currentBalance + toAmount })
        .eq('id', userId);

      if (balError) return { success: false, error: balError.message };
      return { success: true, txHash };
    } else {
      // Mock Swap
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      const idx = profiles.findIndex((p) => p.id === userId);
      if (idx !== -1) {
        profiles[idx].machete_balance = Number(profiles[idx].machete_balance || 0) + toAmount;
        setLocalStorageItem(MOCK_STORAGE_KEYS.PROFILES, profiles);

        // Record swap
        const swaps = getLocalStorageItem<SwapTx[]>(MOCK_STORAGE_KEYS.SWAPS, []);
        const newSwap: SwapTx = {
          id: Math.random().toString(36).substr(2, 9),
          user_id: userId,
          from_token: fromToken,
          from_amount: fromAmount,
          to_amount: toAmount,
          tx_hash: txHash,
          created_at: new Date().toISOString(),
        };
        swaps.push(newSwap);
        setLocalStorageItem(MOCK_STORAGE_KEYS.SWAPS, swaps);

        // Update current session
        const session = getLocalStorageItem<Profile | null>(MOCK_STORAGE_KEYS.SESSION, null);
        if (session && session.id === userId) {
          session.machete_balance = profiles[idx].machete_balance;
          setLocalStorageItem(MOCK_STORAGE_KEYS.SESSION, session);
        }

        return { success: true, txHash };
      }
      return { success: false, error: 'Usuario no encontrado' };
    }
  },

  getUserSwaps: async (userId: string): Promise<SwapTx[]> => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      const { data, error } = await supabaseClient
        .from('swaps')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error || !data) return [];
      return data as SwapTx[];
    } else {
      const swaps = getLocalStorageItem<SwapTx[]>(MOCK_STORAGE_KEYS.SWAPS, []);
      return swaps.filter((s) => s.user_id === userId).reverse();
    }
  },
};
