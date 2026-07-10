'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldAlert, Compass, Sparkles, Swords } from 'lucide-react';

export default function About() {
  return (
    <section id="lore" style={{ padding: '6rem 0', position: 'relative' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="gold-text-gradient">
            La Historia de MacheteCoin
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Descubre el origen del arma secreta que está despejando el bosque de las finanzas descentralizadas.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '4rem',
          alignItems: 'center',
        }} className="about-grid">
          
          {/* Left: Mascot Image Grid */}
          <div style={{ display: 'flex', justifyContent: 'center' }} className="about-left">
            <div style={{
              position: 'relative',
              width: '100%',
              maxWidth: '400px',
              aspectRatio: '1',
              filter: 'drop-shadow(0 20px 40px rgba(255, 199, 0, 0.2))',
              animation: 'float-slow 6s ease-in-out infinite',
            }}>
              <Image 
                src="/logo-pagina.png" 
                alt="MacheteCoin Logotipo" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Right: Lore Text & Bullet points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="about-right">
            <div>
              <h3 style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800 }}>
                <Swords style={{ color: 'var(--color-gold)' }} size={28} />
                Forjado en el Fuego del Blockchain
              </h3>
              <p style={{ fontSize: '1.05rem', marginBottom: '1.25rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                En una selva criptográfica plagada de maleza espesa, estafas rápidas (&quot;rug pulls&quot;) y tokens sin valor, nuestro intrépido carpincho protector decidió que era hora de actuar. Cansado de ver a la comunidad perder en el bosque sombrío, subió a la pirámide maya más alta y forjó una herramienta indestructible de puro metal cripto: **El Machete**.
              </p>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                **MacheteCoin** no es solo otro meme; es un movimiento para abrir un sendero despejado, honesto y lleno de risas en el mercado DeFi. Con nuestro machete en alto, cortamos las tarifas abusivas y las promesas vacías para forjar un refugio seguro y próspero para los amantes de las meme coins.
              </p>
            </div>

            {/* Features Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }} className="about-features">
              
              <div className="glass-panel feature-card" style={{ 
                padding: '1.5rem', 
                borderRadius: '16px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem', 
                alignItems: 'flex-start',
                border: '1px solid rgba(255, 199, 0, 0.08)',
                background: 'rgba(255,255,255,0.01)',
                transition: 'all 0.3s ease',
                height: '100%'
              }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <ShieldAlert size={22} style={{ color: '#ef4444' }} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.4rem', fontWeight: 700 }}>Anti-Maleza</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>Contrato renunciado y liquidez bloqueada para siempre. Sin trucos, sin puertas traseras.</p>
                </div>
              </div>

              <div className="glass-panel feature-card" style={{ 
                padding: '1.5rem', 
                borderRadius: '16px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem', 
                alignItems: 'flex-start',
                border: '1px solid rgba(255, 199, 0, 0.08)',
                background: 'rgba(255,255,255,0.01)',
                transition: 'all 0.3s ease',
                height: '100%'
              }}>
                <div style={{ background: 'rgba(255, 199, 0, 0.08)', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(255, 199, 0, 0.2)' }}>
                  <Compass size={22} style={{ color: 'var(--color-gold)' }} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.4rem', fontWeight: 700 }}>El Sendero</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>Guiado 100% por la comunidad de poseedores de Machete. El carpincho obedece al pueblo.</p>
                </div>
              </div>

              <div className="glass-panel feature-card" style={{ 
                padding: '1.5rem', 
                borderRadius: '16px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem', 
                alignItems: 'flex-start',
                border: '1px solid rgba(255, 199, 0, 0.08)',
                background: 'rgba(255,255,255,0.01)',
                transition: 'all 0.3s ease',
                height: '100%'
              }}>
                <div style={{ background: 'rgba(0, 255, 102, 0.08)', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(0, 255, 102, 0.2)' }}>
                  <Sparkles size={22} style={{ color: 'var(--color-green-neon)' }} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', marginBottom: '0.4rem', fontWeight: 700 }}>Diversión Cortante</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>Memes afilados diarios, eventos de comunidad e integraciones de mini-juegos próximamente.</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      <style jsx global>{`
        .about-grid {
          grid-template-columns: 1fr !important;
        }
        .about-features {
          grid-template-columns: 1fr !important;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 199, 0, 0.35) !important;
          background: rgba(255, 255, 255, 0.02) !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @media (min-width: 992px) {
          .about-grid {
            grid-template-columns: 0.95fr 1.05fr !important;
          }
          .about-features {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
