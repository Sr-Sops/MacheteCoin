'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Wallet, Landmark, Shuffle, CheckCircle, ArrowRight } from 'lucide-react';

interface HowToBuyProps {
  contractAddress: string;
  blockchainNetwork: string;
  raydiumUrl?: string;
}

export default function HowToBuy({ contractAddress, blockchainNetwork, raydiumUrl }: HowToBuyProps) {
  const [activeStep, setActiveStep] = useState(0);

  const isAddressPlaceholder = 
    !contractAddress || 
    contractAddress.startsWith('MachETe') || 
    contractAddress === '0x0000000000000000000000000000000000000000';

  const steps = [
    {
      title: 'Crear una Billetera',
      icon: <Wallet size={24} />,
      desc: `Descarga una billetera compatible con la red ${blockchainNetwork}. Para Polygon, recomendamos MetaMask, Rabby o Coinbase Wallet de forma gratuita en tu App Store o como extensión de navegador.`,
    },
    {
      title: 'Conseguir Criptomonedas',
      icon: <Landmark size={24} />,
      desc: `Compra MATIC o POL y envíalo a tu dirección de billetera recién creada. Puedes comprar cripto directamente dentro de la billetera o retirarlo desde exchanges como Binance, Coinbase, etc.`,
    },
    {
      title: 'Ir a un Exchange (DEX)',
      icon: <Shuffle size={24} />,
      desc: `Entra en QuickSwap.exchange o Uniswap utilizando el navegador integrado de tu billetera o conectando la extensión de navegador en tu ordenador. Conecta tu billetera haciendo clic en 'Connect Wallet'.`,
    },
    {
      title: <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2em' }}>Intercambiar por <Image src="/logo-oficial.png" alt="$" width={16} height={16} style={{ width: '1em', height: '1em' }} /> MacheteCoin</span>,
      icon: <CheckCircle size={24} />,
      desc: isAddressPlaceholder
        ? `Pega nuestra dirección de contrato oficial en el selector de tokens (se revelará aquí en esta sección al momento del lanzamiento). Ingresa la cantidad de MATIC o USDC que deseas intercambiar y presiona 'Swap'.`
        : `Pega nuestra dirección de contrato oficial en el selector de tokens. Asegúrate de revisar que coincida exactamente con: ${contractAddress}. Ingresa la cantidad de MATIC o USDC que deseas intercambiar y presiona 'Swap'.`,
    },
  ];

  return (
    <section id="comprar" style={{ padding: '6rem 0' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="gold-text-gradient">
            Cómo Comprar <Image src="/logo-oficial.png" alt="$" width={32} height={32} style={{ width: '1em', height: '1em', verticalAlign: 'middle', marginTop: '-0.1em' }} /> MacheteCoin
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Sigue estos 4 sencillos pasos para asegurar tus tokens en la red oficial de {blockchainNetwork}.
          </p>
        </div>

        {/* Dynamic Layout: Horizontal steps selector for desktop + details panel */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          alignItems: 'start',
        }} className="buy-main-grid">
          
          {/* Left Column: Interactive Steps List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className="glass-panel"
                  style={{
                    background: isActive ? 'rgba(255, 199, 0, 0.08)' : 'var(--bg-jungle-card)',
                    border: isActive ? '2px solid var(--color-gold)' : '1px solid var(--border-glass)',
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    width: '100%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    borderRadius: '16px',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {/* Step Number Circle */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: isActive ? 'var(--color-gold)' : 'rgba(255,255,255,0.05)',
                    color: isActive ? '#050a07' : 'var(--text-secondary)',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    fontFamily: 'var(--font-title)',
                    transition: 'all 0.25s ease',
                  }}>
                    {idx + 1}
                  </div>
                  
                  <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'var(--font-title)',
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      color: isActive ? 'var(--color-gold)' : 'var(--text-primary)',
                      transition: 'all 0.25s ease',
                    }}>
                      {step.title}
                    </span>
                    <div style={{ color: isActive ? 'var(--color-gold)' : 'var(--text-secondary)' }}>
                      {step.icon}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Step Details Viewer */}
          <div className="glass-panel" style={{
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.5rem',
            border: '1px solid rgba(255, 199, 0, 0.2)',
            position: 'relative',
          }}>
            {/* Background absolute step indicator */}
            <div style={{
              position: 'absolute',
              top: '1.5rem',
              right: '2rem',
              fontSize: '6rem',
              fontWeight: 800,
              fontFamily: 'var(--font-title)',
              color: 'rgba(255, 199, 0, 0.03)',
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
            }}>
              0{activeStep + 1}
            </div>

            <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: 'rgba(255, 199, 0, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--color-gold)' }}>
              {steps[activeStep].icon}
            </div>

            <h3 style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>
              Paso {activeStep + 1}: {steps[activeStep].title}
            </h3>

            <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
              {steps[activeStep].desc}
            </p>

            {activeStep === 3 && (
              <div style={{ marginTop: '1rem' }}>
                <a href={raydiumUrl || '#'} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ gap: '0.5rem' }}>
                  Ir a Intercambiar Ahora
                  <ArrowRight size={16} />
                </a>
              </div>
            )}
          </div>

        </div>

      </div>

      <style jsx global>{`
        .buy-main-grid {
          grid-template-columns: 1fr !important;
        }
        @media (min-width: 992px) {
          .buy-main-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}

