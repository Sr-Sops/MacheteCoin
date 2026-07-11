'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MacheteService, CoinSettings, RoadmapPhase } from '@/lib/supabase';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import SwapWidget from '@/components/SwapWidget';
import Tokenomics from '@/components/Tokenomics';
import HowToBuy from '@/components/HowToBuy';
import Roadmap from '@/components/Roadmap';
import Footer from '@/components/Footer';
import { Loader2, Coins } from 'lucide-react';

export default function Home() {
  const [settings, setSettings] = useState<CoinSettings | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Initialize DB (mock if needed)
        MacheteService.init();

        const s = await MacheteService.getCoinSettings();
        const r = await MacheteService.getRoadmap();
        setSettings(s);
        setRoadmap(r);
      } catch (err) {
        console.error('Error loading MacheteCoin data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: '#050a07',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
      }}>
        <Loader2 className="spin-logo" size={48} style={{ color: 'var(--color-gold)' }} />
        <span style={{ fontFamily: 'var(--font-title)', color: 'var(--text-secondary)', fontSize: '1rem', letterSpacing: '0.05em' }}>
          AFILANDO EL MACHETE...
        </span>
      </div>
    );
  }

  // Safe fallback if settings failed to load
  const activeSettings = settings || {
    id: 1,
    contract_address: '0x0000000000000000000000000000000000000000',
    blockchain_network: 'Polygon',
    total_supply: '1,000,000,000',
    tax_buy: 0.0,
    tax_sell: 0.0,
    twitter_url: 'https://x.com/MacheteCoin',
    telegram_url: 'https://t.me/MacheteCoin',
    discord_url: 'https://discord.gg/MacheteCoin',
    instagram_url: 'https://instagram.com/MacheteCoin',
    dexscreener_url: 'https://dexscreener.com/',
    raydium_url: 'https://quickswap.exchange/',
    swap_rate: 1000000.0,
    swap_rate_usdt: 2500000.0,
    updated_at: new Date().toISOString(),
  };

  return (
    <>
      {/* Header */}
      <Header 
        twitterUrl={activeSettings.twitter_url} 
        telegramUrl={activeSettings.telegram_url} 
        discordUrl={activeSettings.discord_url} 
        instagramUrl={activeSettings.instagram_url}
      />

      {/* Hero Section */}
      <Hero 
        contractAddress={activeSettings.contract_address} 
        blockchainNetwork={activeSettings.blockchain_network}
        telegramUrl={activeSettings.telegram_url}
        discordUrl={activeSettings.discord_url}
        raydiumUrl={activeSettings.raydium_url}
      />

      {/* Lore/About Section */}
      <About />

      {/* Interactive Swap Section */}
      <section style={{
        padding: '6rem 0',
        position: 'relative',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(14, 94, 53, 0.15) 50%, transparent 100%)',
      }}>
        <div className="container swap-section-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '4rem',
          alignItems: 'center',
        }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center' }} className="swap-section-left">
            <div style={{ display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '0.5rem', background: 'rgba(0, 255, 102, 0.1)', border: '1px solid rgba(0, 255, 102, 0.2)', padding: '0.4rem 1rem', borderRadius: '50px' }} className="swap-section-badge">
              <Coins size={14} style={{ color: 'var(--color-green-neon)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-green-neon)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Simulador Integrado
              </span>
            </div>
            
            <h2 style={{ fontSize: '2.5rem' }} className="gold-text-gradient">
              Prueba el Swap en Testnet
            </h2>
            
            <p style={{ fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
              Crea tu cuenta de usuario de forma 100% gratuita y segura, y utiliza nuestro simulador de intercambio para adquirir tus primeros tokens de prueba de **<span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15em', verticalAlign: 'middle', marginTop: '-0.1em' }}><Image src="/logo-oficial.png" alt="$" width={14} height={14} style={{ width: '1em', height: '1em' }} />MACHETE</span>**. Observa cómo se actualiza tu saldo instantáneamente en tu Panel de Control de manera segura.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <SwapWidget settings={activeSettings} />
          </div>

        </div>
      </section>

      {/* Tokenomics Section */}
      <Tokenomics 
        totalSupply={activeSettings.total_supply} 
        taxBuy={activeSettings.tax_buy} 
        taxSell={activeSettings.tax_sell} 
      />

      {/* How to Buy Section */}
      <HowToBuy 
        contractAddress={activeSettings.contract_address} 
        blockchainNetwork={activeSettings.blockchain_network}
        raydiumUrl={activeSettings.raydium_url}
      />

      {/* Roadmap Section */}
      <Roadmap phases={roadmap} />

      {/* Footer */}
      <Footer 
        twitterUrl={activeSettings.twitter_url} 
        telegramUrl={activeSettings.telegram_url} 
        discordUrl={activeSettings.discord_url} 
        instagramUrl={activeSettings.instagram_url}
      />

      <style jsx global>{`
        .swap-section-grid {
          grid-template-columns: 1fr !important;
        }
        @media (min-width: 992px) {
          .swap-section-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
            text-align: left !important;
          }
          .swap-section-left {
            text-align: left !important;
          }
          .swap-section-badge {
            align-self: flex-start !important;
          }
        }
      `}</style>
    </>
  );
}
