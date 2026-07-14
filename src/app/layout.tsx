import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://machete-coin.vercel.app'),
  title: "MacheteCoin - La Memecoin Más Afilada de la Jungla Cripto",
  description: "Únete al carpincho de MacheteCoin y ábrete paso en el mercado cripto. 0% de impuestos, liquidez quemada y pura diversión descentralizada.",
  keywords: ["MacheteCoin", "Meme coin", "Polygon", "Crypto", "Carpincho", "Jungle", "Blockchain", "DEX"],
  authors: [{ name: "MacheteCoin Team" }],
  openGraph: {
    title: "MacheteCoin - La Memecoin Más Afilada",
    description: "Corta la maleza cripto con el carpincho de MacheteCoin. 0% Impuestos.",
    images: [{ url: "/logo-pagina.png", width: 800, height: 800, alt: "MacheteCoin Banner" }],
  },
};

import GlobalSupportChat from '@/components/GlobalSupportChat';
import Ticker from '@/components/Ticker';
import MetaMaskProvider from '@/components/MetaMaskProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body>
        <MetaMaskProvider>
          {children}
          <Ticker />
          <GlobalSupportChat />
        </MetaMaskProvider>
      </body>
    </html>
  );
}
