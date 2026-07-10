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
              marginTop: '-3rem',
            }}>
              <Image 
                src="/logo-transparente.png" 
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
          </div>

        </div>

        {/* Features Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem', marginTop: '4rem' }} className="about-features">
              
              <div className="feature-card" style={{ 
                padding: '1.75rem', 
                borderRadius: '20px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1.25rem', 
                alignItems: 'flex-start',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                background: 'linear-gradient(145deg, rgba(239, 68, 68, 0.03) 0%, rgba(10, 15, 12, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.25)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.15)' }}>
                  <ShieldAlert size={24} style={{ color: '#ef4444' }} />
                </div>
                <div style={{ zIndex: 1 }}>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.02em' }}>Anti-Maleza</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Contrato renunciado y liquidez bloqueada para siempre. Sin trucos, sin puertas traseras.</p>
                </div>
              </div>

              <div className="feature-card" style={{ 
                padding: '1.75rem', 
                borderRadius: '20px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1.25rem', 
                alignItems: 'flex-start',
                border: '1px solid rgba(255, 199, 0, 0.15)',
                background: 'linear-gradient(145deg, rgba(255, 199, 0, 0.03) 0%, rgba(10, 15, 12, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(255, 199, 0, 0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                <div style={{ background: 'rgba(255, 199, 0, 0.1)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(255, 199, 0, 0.25)', boxShadow: '0 4px 15px rgba(255, 199, 0, 0.15)' }}>
                  <Compass size={24} style={{ color: 'var(--color-gold)' }} />
                </div>
                <div style={{ zIndex: 1 }}>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.02em' }}>El Sendero</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Guiado 100% por la comunidad de poseedores de Machete. El carpincho obedece al pueblo.</p>
                </div>
              </div>

              <div className="feature-card" style={{ 
                padding: '1.75rem', 
                borderRadius: '20px', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1.25rem', 
                alignItems: 'flex-start',
                border: '1px solid rgba(0, 255, 102, 0.15)',
                background: 'linear-gradient(145deg, rgba(0, 255, 102, 0.03) 0%, rgba(10, 15, 12, 0.8) 100%)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                height: '100%',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(0, 255, 102, 0.1) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
                <div style={{ background: 'rgba(0, 255, 102, 0.1)', padding: '0.75rem', borderRadius: '12px', border: '1px solid rgba(0, 255, 102, 0.25)', boxShadow: '0 4px 15px rgba(0, 255, 102, 0.15)' }}>
                  <Sparkles size={24} style={{ color: 'var(--color-green-neon)' }} />
                </div>
                <div style={{ zIndex: 1 }}>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.02em' }}>Diversión Cortante</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>Memes afilados diarios, eventos de comunidad e integraciones de mini-juegos próximamente.</p>
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
