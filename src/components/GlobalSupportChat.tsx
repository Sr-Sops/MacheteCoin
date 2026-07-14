'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MacheteService, Profile, supabaseClient } from '@/lib/supabase';
import SupportChatWidget from './SupportChatWidget';

export default function GlobalSupportChat() {
  const [user, setUser] = useState<Profile | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const loadUser = async () => {
      const u = await MacheteService.getCurrentUser();
      if (u) {
        setUser(u);
      } else {
        setUser(null);
      }
    };
    
    loadUser();

    // Listen for auth state changes if using real Supabase
    let authListener: any = null;
    if (supabaseClient) {
      const { data } = supabaseClient.auth.onAuthStateChange(() => {
        loadUser();
      });
      authListener = data.subscription;
    }

    // Listen for local storage changes (for mock DB)
    const handleStorageChange = () => loadUser();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (authListener) authListener.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return <SupportChatWidget user={user} />;
}
