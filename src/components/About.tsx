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
            <div className="glass-panel" style={{
              padding: '1rem',
              borderRadius: '24px',
              border: '2px solid rgba(255, 199, 0, 0.15)',
              position: 'relative',
              width: '100%',
              maxWidth: '450px',
              aspectRatio: '1',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            }}>
              <Image 
                src="/logo-pagina.jpg" 
                alt="Carpincho Machetero en la Jungla" 
                fill
                style={{ objectFit: 'cover', borderRadius: '14px' }}
              />
            </div>
          </div>

          {/* Right: Lore Text & Bullet points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="about-right">
            <div>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Swords style={{ color: 'var(--color-gold)' }} />
                Forjado en el Fuego del Blockchain
              </h3>
              <p style={{ fontSize: '1.05rem', marginBottom: '1.25rem' }}>
                En una selva criptográfica plagada de maleza espesa, estafas rápidas (&quot;rug pulls&quot;) y tokens sin valor, nuestro intrépido carpincho protector decidió que era hora de actuar. Cansado de ver a la comunidad perder en el bosque sombrío, subió a la pirámide maya más alta y forjó una herramienta indestructible de puro metal cripto: **El Machete**.
              </p>
              <p style={{ fontSize: '1.05rem' }}>
                **MacheteCoin** no es solo otro meme; es un movimiento para abrir un sendero despejado, honesto y lleno de risas en el mercado DeFi. Con nuestro machete en alto, cortamos las tarifas abusivas y las promesas vacías para forjar un refugio seguro y próspero para los amantes de las meme coins.
              </p>
            </div>

            {/* Features Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="about-features">
              
              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <ShieldAlert size={20} style={{ color: '#ef4444' }} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.25rem' }}>Anti-Maleza (Anti-Scam)</h4>
                  <p style={{ fontSize: '0.85rem' }}>Contrato renunciado y liquidez bloqueada para siempre. Sin trucos, sin puertas traseras.</p>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(255, 199, 0, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255, 199, 0, 0.2)' }}>
                  <Compass size={20} style={{ color: 'var(--color-gold)' }} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.25rem' }}>El Sendero Comunitario</h4>
                  <p style={{ fontSize: '0.85rem' }}>Guiado 100% por la comunidad de poseedores de Machete. El carpincho obedece al pueblo.</p>
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(0, 255, 102, 0.1)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(0, 255, 102, 0.2)' }}>
                  <Sparkles size={20} style={{ color: 'var(--color-green-neon)' }} />
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.25rem' }}>Diversión Cortante</h4>
                  <p style={{ fontSize: '0.85rem' }}>Memes afilados diarios, eventos de comunidad e integraciones de mini-juegos próximamente.</p>
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
        @media (min-width: 992px) {
          .about-grid {
            grid-template-columns: 0.9fr 1.1fr !important;
          }
          .about-features {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
