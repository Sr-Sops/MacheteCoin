import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MacheteCoin ($MACHETE) - La Memecoin Más Afilada de la Jungla Cripto",
  description: "Únete al carpincho de MacheteCoin y ábrete paso en el mercado cripto. 0% de impuestos, liquidez quemada y pura diversión descentralizada.",
  keywords: ["MacheteCoin", "Meme coin", "Solana", "Crypto", "Carpincho", "Jungle", "Blockchain", "DEX"],
  authors: [{ name: "MacheteCoin Team" }],
  openGraph: {
    title: "MacheteCoin ($MACHETE) - La Memecoin Más Afilada",
    description: "Corta la maleza cripto con el carpincho de MacheteCoin. 0% Impuestos.",
    images: [{ url: "/logo-pagina.jpg", width: 800, height: 800, alt: "MacheteCoin Banner" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/logo-oficial.jpg" sizes="any" />
      </head>
      <body>{children}</body>
    </html>
  );
}
