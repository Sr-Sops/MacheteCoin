'use client';

import React, { ReactNode } from 'react';
import { createAppKit } from '@reown/appkit/react';
import { polygon, polygonAmoy } from '@reown/appkit/networks';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || '';

if (!projectId) {
  console.warn('REOWN PROJECT ID is missing');
}

const metadata = {
  name: 'MacheteCoin',
  description: 'La Memecoin Más Afilada de la Jungla Cripto',
  url: 'https://machete-coin.vercel.app', // origin must match your domain & subdomain
  icons: ['https://machete-coin.vercel.app/logo-pagina.png']
};

const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  networks: [polygon, polygonAmoy],
  projectId
});

createAppKit({
  adapters: [wagmiAdapter],
  networks: [polygon, polygonAmoy],
  projectId,
  metadata,
  features: {
    analytics: true
  },
  themeVariables: {
    '--w3m-accent': '#22c55e', // Machete green
  }
});

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
