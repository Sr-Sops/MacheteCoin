'use client';

import { MetaMaskProvider as Provider } from '@metamask/sdk-react';
import { ReactNode } from 'react';

export default function MetaMaskProvider({ children }: { children: ReactNode }) {
  return (
    <Provider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: "MacheteCoin",
          url: typeof window !== "undefined" ? window.location.href : "https://machetecoin.com",
        },
      }}
    >
      {children}
    </Provider>
  );
}
