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
  email?: string;
  avatar_url: string | null;
  wallet_address: string | null;
  machete_balance: number;
  role: 'user' | 'admin';
  first_name?: string;
  last_name?: string;
  phone?: string;
  phone_verified?: boolean;
  birth_date?: string;
  document_id?: string;
  kyc_status?: 'pending' | 'approved' | 'rejected';
  kyc_document_type?: string;
  kyc_document_url?: string | null;
  two_fa_enabled?: boolean;
  two_fa_secret?: string | null;
  recovery_words?: string | null;
  terms_accepted?: boolean;
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

export interface SupportChat {
  id: string;
  user_id: string;
  status: 'open' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface SupportMessage {
  id: string;
  chat_id: string;
  sender_id: string;
  message: string;
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

  // Migración automática: Si la base de datos simulada local está en Solana, la actualizamos a Polygon
  const cachedSettings = localStorage.getItem(MOCK_STORAGE_KEYS.SETTINGS);
  if (cachedSettings) {
    try {
      const parsed = JSON.parse(cachedSettings);
      if (parsed.blockchain_network === 'Solana') {
        localStorage.removeItem(MOCK_STORAGE_KEYS.SETTINGS);
        localStorage.removeItem(MOCK_STORAGE_KEYS.ROADMAP);
      }
    } catch (e) {}
  }

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
  signUp: async (params: {
    email: string;
    username: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    phoneVerified?: boolean;
    birthDate?: string;
    documentId?: string;
    role?: 'user' | 'admin';
    kycStatus?: 'pending' | 'approved' | 'rejected';
    kycDocumentType?: string;
    kycDocumentUrl?: string;
    avatarUrl?: string;
    twoFaEnabled?: boolean;
    twoFaSecret?: string;
    recoveryWords?: string;
  }) => {
    const { 
      email, username, password, firstName, lastName, phone, phoneVerified, 
      birthDate, documentId, role, kycStatus, kycDocumentType, kycDocumentUrl,
      avatarUrl, twoFaEnabled, twoFaSecret, recoveryWords 
    } = params;
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password: password || 'machete-default-pass-change-me',
          options: {
            data: { 
              username,
              first_name: firstName,
              last_name: lastName,
              phone,
              phone_verified: phoneVerified || false,
              birth_date: birthDate,
              document_id: documentId,
              role: role || 'user',
              kyc_status: kycStatus || 'pending',
              kyc_document_type: kycDocumentType || 'DNI',
              kyc_document_url: kycDocumentUrl || null,
              avatar_url: avatarUrl || null,
              two_fa_enabled: twoFaEnabled || false,
              two_fa_secret: twoFaSecret || null,
              recovery_words: recoveryWords || null,
              terms_accepted: true
            },
          },
        });
        if (error) {
          console.error("Supabase signUp raw error object:", error);
          console.error("Supabase signUp raw error JSON:", JSON.stringify(error));
          return { success: false, error: error.message || JSON.stringify(error) || 'Error de registro' };
        }
        return { success: true, user: data.user };
      } catch (err: any) {
        console.error("SignUp exception:", err);
        return { success: false, error: err?.message || String(err) };
      }
    } else {
      // Mock SignUp
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      if (profiles.some((p) => p.username.toLowerCase() === username.toLowerCase())) {
        return { success: false, error: 'El nombre de usuario ya está registrado.' };
      }
      
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@machetecoin.com';
      const isFirstAdmin = email.toLowerCase() === adminEmail.toLowerCase() || role === 'admin';
      const newProfile: Profile = {
        id: Math.random().toString(36).substr(2, 9),
        username,
        avatar_url: avatarUrl || null,
        wallet_address: null,
        machete_balance: isFirstAdmin ? 10000000.00 : 0.00,
        role: isFirstAdmin ? 'admin' : 'user',
        first_name: firstName || '',
        last_name: lastName || '',
        phone: phone || '',
        phone_verified: phoneVerified || false,
        birth_date: birthDate || '',
        document_id: documentId || '',
        kyc_status: isFirstAdmin ? 'approved' : (kycStatus || 'pending'),
        kyc_document_type: kycDocumentType || 'DNI',
        kyc_document_url: kycDocumentUrl || null,
        two_fa_enabled: twoFaEnabled || false,
        two_fa_secret: twoFaSecret || null,
        recovery_words: recoveryWords || null,
        terms_accepted: true,
        created_at: new Date().toISOString(),
      };

      profiles.push(newProfile);
      setLocalStorageItem(MOCK_STORAGE_KEYS.PROFILES, profiles);
      setLocalStorageItem(MOCK_STORAGE_KEYS.SESSION, newProfile);
      return { success: true, user: newProfile };
    }
  },

  signIn: async (loginInput: string, password?: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      try {
        let resolvedEmail = loginInput;
        
        // If loginInput doesn't contain '@', it's a username or phone
        if (!loginInput.includes('@')) {
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('email')
            .or(`username.eq."${loginInput}",phone.eq."${loginInput}"`)
            .maybeSingle();
            
          if (profile && profile.email) {
            resolvedEmail = profile.email;
          } else {
            // Check if it looks like a phone and try directly
            const isPhone = /^[+\d\s-]+$/.test(loginInput);
            if (isPhone) {
              const { data, error } = await supabaseClient.auth.signInWithPassword({
                phone: loginInput,
                password: password || 'machete-default-pass-change-me',
              });
              if (error) return { success: false, error: error.message };
              return { success: true, user: data.user };
            }
            return { success: false, error: 'No se encontró ningún usuario o teléfono asociado.' };
          }
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: resolvedEmail,
          password: password || 'machete-default-pass-change-me',
        });
        if (error) {
          // console.error removed to avoid Next.js dev server red overlay on invalid login
          return { success: false, error: error.message || 'Error de inicio de sesión' };
        }
        return { success: true, user: data.user };
      } catch (err: any) {
        console.error("SignIn exception:", err);
        return { success: false, error: err?.message || String(err) };
      }
    } else {
      // Mock SignIn
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'sops_raptor@hotmail.es';
      const isFirstAdmin = loginInput.toLowerCase() === adminEmail.toLowerCase();
      let user = profiles.find((p) => 
        (isFirstAdmin && p.role === 'admin') || 
        p.username.toLowerCase() === loginInput.toLowerCase() ||
        p.email?.toLowerCase() === loginInput.toLowerCase() ||
        p.phone === loginInput
      );
      
      if (!user) {
        const username = isFirstAdmin ? 'MacheteAdmin' : loginInput.split('@')[0];
        const newProfile: Profile = {
          id: Math.random().toString(36).substr(2, 9),
          username,
          email: loginInput.includes('@') ? loginInput : `${loginInput}@mock.com`,
          avatar_url: null,
          wallet_address: null,
          machete_balance: isFirstAdmin ? 10000000 : 0.00,
          role: isFirstAdmin ? 'admin' : 'user',
          first_name: isFirstAdmin ? 'Admin' : '',
          last_name: isFirstAdmin ? 'Machete' : '',
          phone: '',
          phone_verified: false,
          birth_date: '',
          document_id: '',
          kyc_status: isFirstAdmin ? 'approved' : 'pending',
          kyc_document_type: 'DNI',
          kyc_document_url: null,
          two_fa_enabled: false,
          terms_accepted: true,
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

      let { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error || !data) return null;

      // CLIENT-SIDE AUTO-PROMOTION FOR ADMIN EMAIL
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'sops_raptor@hotmail.es';
      if (user.email && user.email.toLowerCase() === adminEmail.toLowerCase() && data.role !== 'admin') {
        console.log("Auto-promoting user to admin role client-side...");
        const { error: updateError } = await supabaseClient
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', user.id);
        
        if (!updateError) {
          data.role = 'admin';
        } else {
          console.error("Auto-promotion failed:", updateError);
        }
      }

      return data as Profile;
    } else {
      const session = getLocalStorageItem<Profile | null>(MOCK_STORAGE_KEYS.SESSION, null);
      if (session) {
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'sops_raptor@hotmail.es';
        const isFirstAdmin = session.username.toLowerCase() === 'macheteadmin' || session.username.toLowerCase() === adminEmail.split('@')[0].toLowerCase();
        if (isFirstAdmin && session.role !== 'admin') {
          session.role = 'admin';
          setLocalStorageItem(MOCK_STORAGE_KEYS.SESSION, session);
        }
      }
      return session;
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

  updateProfile: async (userId: string, data: Partial<Profile>, currentPassword?: string, newPassword?: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      try {
        // If password is being updated, we need to handle auth update
        if (currentPassword && newPassword) {
          // Supabase Auth allows updating password:
          const { error: authError } = await supabaseClient.auth.updateUser({
            password: newPassword
          });
          if (authError) return { success: false, error: authError.message };
        }

        // If email is being updated, handle auth email update
        if (data.email) {
          const { error: authError } = await supabaseClient.auth.updateUser({
            email: data.email
          });
          if (authError) return { success: false, error: authError.message };
        }

        // Update rest of profile in profiles table
        const { error } = await supabaseClient
          .from('profiles')
          .update(data)
          .eq('id', userId);
        
        if (error) return { success: false, error: error.message };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || String(err) };
      }
    } else {
      // Mock update
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      const idx = profiles.findIndex((p) => p.id === userId);
      if (idx !== -1) {
        profiles[idx] = { ...profiles[idx], ...data };
        setLocalStorageItem(MOCK_STORAGE_KEYS.PROFILES, profiles);
        
        const session = getLocalStorageItem<Profile | null>(MOCK_STORAGE_KEYS.SESSION, null);
        if (session && session.id === userId) {
          setLocalStorageItem(MOCK_STORAGE_KEYS.SESSION, { ...session, ...data });
        }
        return { success: true };
      }
      return { success: false, error: 'Usuario no encontrado' };
    }
  },

  deleteAccount: async (userId: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      try {
        // Deleting the public profile first
        const { error: profileError } = await supabaseClient
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        // Signed out immediately
        await supabaseClient.auth.signOut();
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || String(err) };
      }
    } else {
      // Mock Delete Account
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      const updated = profiles.filter((p) => p.id !== userId);
      setLocalStorageItem(MOCK_STORAGE_KEYS.PROFILES, updated);
      setLocalStorageItem(MOCK_STORAGE_KEYS.SESSION, null);
      return { success: true };
    }
  },

  promoteUserByEmail: async (email: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      try {
        // Call the RPC promote_user_by_email securely
        const { data, error } = await supabaseClient.rpc('promote_user_by_email', {
          target_email: email
        });
        
        if (error) return { success: false, error: error.message };
        if (data === false) return { success: false, error: 'No se encontró ningún usuario con ese correo electrónico registrado.' };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || String(err) };
      }
    } else {
      // Mock Promote
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      const idx = profiles.findIndex((p) => p.email?.toLowerCase() === email.toLowerCase());
      if (idx !== -1) {
        profiles[idx].role = 'admin';
        setLocalStorageItem(MOCK_STORAGE_KEYS.PROFILES, profiles);
        return { success: true };
      }
      return { success: false, error: 'No se encontró ningún usuario con ese correo electrónico registrado.' };
    }
  },

  sendSmsOtp: async (phone: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      try {
        const { error } = await supabaseClient.auth.signInWithOtp({
          phone
        });
        if (error) return { error: error.message };
        return {};
      } catch (err: any) {
        return { error: err?.message || String(err) };
      }
    }
    return {};
  },

  verifySmsOtp: async (phone: string, token: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.auth.verifyOtp({
          phone,
          token,
          type: 'sms'
        });
        if (error) return false;
        return !!data.user || !!data.session;
      } catch (err: any) {
        return false;
      }
    }
    return true;
  },

  checkUserTwoFaEnabled: async (loginInput: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      try {
        const { data } = await supabaseClient
          .from('profiles')
          .select('two_fa_enabled')
          .or(`username.eq."${loginInput}",phone.eq."${loginInput}",email.eq."${loginInput}"`)
          .maybeSingle();
        return !!data?.two_fa_enabled;
      } catch (err) {
        return false;
      }
    } else {
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      const user = profiles.find((p) => 
        p.username.toLowerCase() === loginInput.toLowerCase() ||
        p.email?.toLowerCase() === loginInput.toLowerCase() ||
        p.phone === loginInput
      );
      return !!user?.two_fa_enabled;
    }
  },

  checkDuplicateField: async (field: 'email' | 'username' | 'phone', value: string) => {
    MacheteService.init();
    if (!value) return false;
    if (isRealSupabaseConfigured() && supabaseClient) {
      try {
        let query = supabaseClient.from('profiles').select('id');
        if (field === 'email') {
          query = query.eq('email', value);
        } else if (field === 'username') {
          query = query.eq('username', value);
        } else if (field === 'phone') {
          query = query.eq('phone', value);
        }
        const { data } = await query.maybeSingle();
        return !!data;
      } catch (err) {
        return false;
      }
    } else {
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      if (field === 'email') {
        return profiles.some((p) => p.email?.toLowerCase() === value.toLowerCase());
      } else if (field === 'username') {
        return profiles.some((p) => p.username.toLowerCase() === value.toLowerCase());
      } else if (field === 'phone') {
        return profiles.some((p) => p.phone === value);
      }
      return false;
    }
  },

  resetPasswordByRecovery: async (target: string, words: string, newPass: string) => {
    MacheteService.init();
    if (isRealSupabaseConfigured() && supabaseClient) {
      try {
        const { data, error } = await supabaseClient.rpc('reset_password_by_recovery_words', {
          target_email: target,
          input_words: words,
          new_password: newPass
        });
        if (error) return { success: false, error: error.message };
        if (data === false) return { success: false, error: 'Los datos introducidos o la frase semilla no son correctos.' };
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err?.message || String(err) };
      }
    } else {
      // Mock reset password
      const profiles = getLocalStorageItem<Profile[]>(MOCK_STORAGE_KEYS.PROFILES, []);
      const idx = profiles.findIndex((p) => 
        p.email?.toLowerCase() === target.toLowerCase() || 
        p.username.toLowerCase() === target.toLowerCase()
      );
      if (idx !== -1) {
        const p = profiles[idx];
        if (p.recovery_words && p.recovery_words.trim().toLowerCase() === words.trim().toLowerCase()) {
          return { success: true };
        }
      }
      return { success: false, error: 'La frase semilla de 12 palabras es incorrecta o el usuario no existe.' };
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
