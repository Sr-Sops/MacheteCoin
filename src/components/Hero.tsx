'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, ExternalLink, MessageCircle, TrendingUp } from 'lucide-react';

interface HeroProps {
  contractAddress: string;
  blockchainNetwork: string;
  telegramUrl?: string;
  raydiumUrl?: string;
}

export default function Hero({ contractAddress, blockchainNetwork, telegramUrl, raydiumUrl }: HeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section style={{
      position: 'relative',
      padding: '4rem 0 6rem 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* Background glow effects */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(14, 94, 53, 0.25) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      <div className="container hero-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '3rem',
        alignItems: 'center',
      }}>
        
        {/* Left Column: Headline and Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', textAlign: 'center' }} className="hero-left">
          <div style={{ display: 'inline-flex', alignSelf: 'center', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 199, 0, 0.1)', border: '1px solid rgba(255, 199, 0, 0.2)', padding: '0.4rem 1rem', borderRadius: '50px' }} className="hero-badge">
            <TrendingUp size={14} style={{ color: 'var(--color-gold)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Lanzamiento Oficial
            </span>
          </div>

          <h1 style={{ fontSize: '2.75rem', lineHeight: 1.15 }} className="hero-title">
            ¡La Memecoin Que <span className="gold-text-gradient">Corta La Maleza</span> Del Mercado!
          </h1>

          <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Despeja tu camino financiero con <strong style={{ color: 'var(--color-gold)' }}>$MACHETE</strong>. 0% de impuestos, liquidez quemada y la fuerza del carpincho más afilado de la red <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{blockchainNetwork}</span>.
          </p>

          {/* Contract Address Panel */}
          {(() => {
            const isAddressPlaceholder = 
              !contractAddress || 
              contractAddress.startsWith('MachETe') || 
              contractAddress === '0x0000000000000000000000000000000000000000';
            
            return (
              <div style={{
                background: 'rgba(8, 17, 12, 0.85)',
                border: '1px solid rgba(255, 199, 0, 0.2)',
                borderRadius: '14px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                maxWidth: '520px',
                width: '100%',
                margin: '0.5rem auto',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              }}>
                {isAddressPlaceholder ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.25rem 0' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                      DIRECCIÓN DEL CONTRATO:
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-green-neon)', fontWeight: 700, letterSpacing: '0.05em' }}>
                      REVELÁNDOSE EN EL LANZAMIENTO 🚀
                    </span>
                  </div>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden', marginRight: '1rem', width: '100%' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.05em' }}>DIRECCIÓN DEL CONTRATO:</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%', textAlign: 'left' }}>
                        {contractAddress}
                      </span>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="btn"
                      style={{
                        background: copied ? 'var(--color-green-neon)' : 'rgba(255, 255, 255, 0.05)',
                        color: copied ? '#050a07' : 'var(--color-gold)',
                        padding: '0.5rem 1rem',
                        fontSize: '0.8rem',
                        borderRadius: '8px',
                        minWidth: '95px',
                        border: copied ? 'none' : '1px solid rgba(255, 199, 0, 0.3)',
                      }}
                    >
                      {copied ? (
                        <>
                          <Check size={13} style={{ marginRight: '0.25rem' }} />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy size={13} style={{ marginRight: '0.25rem' }} />
                          Copiar
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            );
          })()}

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }} className="hero-buttons">
            <a href={raydiumUrl || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: '1.05rem', padding: '1rem 2rem' }}>
              Comprar $MACHETE
              <ExternalLink size={18} />
            </a>
            {telegramUrl && (
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-green" style={{ fontSize: '1.05rem', padding: '1rem 2rem' }}>
                Unirse al Telegram
                <MessageCircle size={18} />
              </a>
            )}
          </div>
        </div>

        {/* Right Column: Floating Mascot Mascot */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }} className="hero-right-col">
          {/* Decorative glows */}
          <div style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            background: 'radial-gradient(circle, rgba(255, 199, 0, 0.2) 0%, transparent 60%)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />
          
          <div className="pulse-mascot mascot-frame" style={{
            position: 'relative',
            width: '320px',
            height: '320px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '5px solid var(--color-gold)',
            boxShadow: '0 0 40px rgba(255, 199, 0, 0.35), inset 0 0 20px rgba(0,0,0,0.8)',
            zIndex: 2,
          }}>
            <Image 
              src="/logo-pagina.jpg" 
              alt="MacheteCoin Carpincho con Machete" 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
        </div>

      </div>

      {/* Ticker at the bottom of Hero */}
      <div className="ticker-wrap" style={{ marginTop: '5rem' }}>
        <div className="ticker">
          {Array.from({ length: 4 }).map((_, i) => (
            <React.Fragment key={i}>
              <div className="ticker-item">SUMINISTRO MÁXIMO: <span>1,000,000,000</span></div>
              <div className="ticker-item">DIRECCIÓN: <span>{blockchainNetwork}</span></div>
              <div className="ticker-item">COMPRA TAX: <span>0%</span></div>
              <div className="ticker-item">VENTA TAX: <span>0%</span></div>
              <div className="ticker-item">LIQUIDEZ: <span>QUEMADA 🔥</span></div>
              <div className="ticker-item">SLIPPAGE: <span>0.1%</span></div>
              <div className="ticker-item">CONTRATO: <span>RENUNCIADO 🗡️</span></div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .hero-grid {
          grid-template-columns: 1fr !important;
        }
        @media (min-width: 992px) {
          .hero-grid {
            grid-template-columns: 1.2fr 0.8fr !important;
            text-align: left !important;
          }
          .hero-left {
            text-align: left !important;
          }
          .hero-badge {
            align-self: flex-start !important;
          }
          .hero-title {
            font-size: 3.75rem !important;
          }
          .hero-buttons {
            flex-direction: row !important;
            justify-content: flex-start !important;
          }
          .mascot-frame {
            width: 400px !important;
            height: 400px !important;
          }
        }
      `}</style>
    </section>
  );
}
