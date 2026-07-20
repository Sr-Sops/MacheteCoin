'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Copy, Check, ExternalLink, MessageCircle, TrendingUp } from 'lucide-react';

interface HeroProps {
  contractAddress: string;
  blockchainNetwork: string;
  telegramUrl?: string;
  discordUrl?: string;
  raydiumUrl?: string;
}

export default function Hero({ contractAddress, blockchainNetwork, telegramUrl, discordUrl, raydiumUrl }: HeroProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    // 01/08/2026 at 0:00
    const targetDate = new Date('2026-08-01T00:00:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const isAddressPlaceholder = contractAddress.startsWith('0x0000000000');

  const renderTimeUnit = (value: number, label: string) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      background: 'linear-gradient(145deg, rgba(20,20,20,0.8) 0%, rgba(5,10,7,0.9) 100%)',
      border: '1px solid rgba(255, 199, 0, 0.3)',
      borderRadius: '8px',
      padding: '0.6rem 0.8rem',
      minWidth: '65px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.5), inset 0 0 10px rgba(255,199,0,0.05)'
    }}>
      <span style={{
        fontSize: '1.6rem',
        fontWeight: 800,
        color: 'var(--color-gold)',
        textShadow: '0 0 8px rgba(255, 199, 0, 0.4)',
        fontFamily: 'monospace',
        lineHeight: 1
      }}>
        {value.toString().padStart(2, '0')}
      </span>
      <span style={{
        fontSize: '0.6rem',
        fontWeight: 700,
        color: 'var(--text-secondary)',
        marginTop: '6px',
        letterSpacing: '0.1em'
      }}>
        {label}
      </span>
    </div>
  );

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
            Despeja tu camino financiero con <strong style={{ color: 'var(--color-gold)', display: 'inline-flex', alignItems: 'center', gap: '0.15em', verticalAlign: 'bottom' }}><Image src="/logo-oficial.png" alt="$" width={20} height={20} style={{ width: '1.1em', height: '1.1em' }} /> MacheteCoin</strong>. 0% de impuestos, liquidez quemada y la fuerza del carpincho más afilado de la red <span style={{ color: 'var(--color-gold)', fontWeight: 600 }}>{blockchainNetwork}</span>.
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
                maxWidth: '600px',
                width: '100%',
                margin: '0.5rem auto',
                boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
              }}>
                {isAddressPlaceholder ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', padding: '0.25rem 0' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.2rem' }}>
                      DIRECCIÓN DEL CONTRATO:
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-green-neon)', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                      REVELÁNDOSE EN EL LANZAMIENTO 🚀
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                      CUENTA ATRÁS DEL LANZAMIENTO
                    </span>
                    {mounted ? (
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                        {renderTimeUnit(timeLeft.days, 'DÍAS')}
                        {renderTimeUnit(timeLeft.hours, 'HRS')}
                        {renderTimeUnit(timeLeft.minutes, 'MIN')}
                        {renderTimeUnit(timeLeft.seconds, 'SEG')}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', opacity: 0 }}>
                        {renderTimeUnit(0, 'DÍAS')}
                        {renderTimeUnit(0, 'HRS')}
                        {renderTimeUnit(0, 'MIN')}
                        {renderTimeUnit(0, 'SEG')}
                      </div>
                    )}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '400px', margin: '0 auto' }} className="hero-buttons">
            <a href={raydiumUrl || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: '1.05rem', padding: '1rem 2rem', width: '100%', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                Comprar <Image src="/logo-oficial.png" alt="$" width={20} height={20} style={{ width: '1em', height: '1em' }} /> MacheteCoin
              </div>
              <ExternalLink size={18} />
            </a>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', width: '100%' }} className="social-buttons-container">
              {telegramUrl && (
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="btn btn-green" style={{ fontSize: '1.05rem', padding: '1rem 2rem', flex: 1, textAlign: 'center', justifyContent: 'center' }}>
                  Telegram
                  <MessageCircle size={18} />
                </a>
              )}
              {discordUrl && (
                <a href={discordUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '1.05rem', padding: '1rem 2rem', flex: 1, textAlign: 'center', justifyContent: 'center', background: '#5865F2', color: 'white', border: 'none' }}>
                  Discord
                  <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style={{ marginLeft: '0.5rem' }}><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
                </a>
              )}
            </div>
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
              src="/logoMC-1024.png" 
              alt="MacheteCoin Carpincho con Machete" 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
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
            align-items: stretch !important;
          }
          .social-buttons-container {
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

