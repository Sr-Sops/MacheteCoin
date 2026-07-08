'use client';

import React from 'react';
import { Flame, Ban, ShieldCheck, PieChart } from 'lucide-react';

interface TokenomicsProps {
  totalSupply: string;
  taxBuy: number;
  taxSell: number;
}

export default function Tokenomics({ totalSupply, taxBuy, taxSell }: TokenomicsProps) {
  const allocations = [
    { name: 'Fondo de Liquidez (Raydium LP)', percentage: 60, color: 'var(--color-gold)', desc: 'Bloqueado y quemado permanentemente para asegurar la estabilidad.' },
    { name: 'Comunidad y Airdrops', percentage: 20, color: 'var(--color-green-neon)', desc: 'Reservado para distribuir a los miembros activos del ecosistema.' },
    { name: 'Marketing y Expansión', percentage: 10, color: '#bcc6cc', desc: 'Campañas de viralidad y publicidad para conquistar la jungla.' },
    { name: 'Ecosistema y CEX Listings', percentage: 10, color: '#0e5e35', desc: 'Reservado para futuros listados en exchanges centralizados.' },
  ];

  return (
    <section id="tokenomics" style={{ padding: '6rem 0', background: 'rgba(8, 17, 12, 0.35)' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="gold-text-gradient">
            Machete-nomics
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Estructura de tokens limpia y afilada, diseñada para proteger a los holders y potenciar el crecimiento.
          </p>
        </div>

        {/* 3 Pillars Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
          marginBottom: '4rem',
        }} className="tokenomics-pillars">
          
          <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255, 199, 0, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--color-gold)' }}>
              <Flame size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>Liquidez Quemada</h3>
            <p style={{ fontSize: '0.9rem' }}>El 100% de los tokens LP de Raydium fueron enviados a la dirección de quemado. Nadie puede retirar la liquidez. Rug-pull imposible.</p>
          </div>

          <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(0, 255, 102, 0.1)', padding: '1rem', borderRadius: '50%', color: 'var(--color-green-neon)' }}>
              <Ban size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>0% Impuestos</h3>
            <p style={{ fontSize: '0.9rem' }}>Sin impuestos de compra y sin impuestos de venta ({taxBuy}% Buy / {taxSell}% Sell). Lo que compras es exactamente lo que recibes en tu billetera.</p>
          </div>

          <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(188, 198, 204, 0.1)', padding: '1rem', borderRadius: '50%', color: '#bcc6cc' }}>
              <ShieldCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>Contrato Renunciado</h3>
            <p style={{ fontSize: '0.9rem' }}>La propiedad del contrato inteligente ha sido revocada de forma permanente. Ningún código puede ser modificado ni manipulado.</p>
          </div>

        </div>

        {/* Dynamic Distribution Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          alignItems: 'center',
        }} className="tokenomics-main-grid">
          
          {/* Left Column: Big Metrics & Circular Chart Placeholder */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SUMINISTRO TOTAL</span>
              <h3 style={{ fontSize: '3rem', color: 'var(--color-gold)', fontFamily: 'var(--font-title)', marginTop: '0.25rem' }}>{totalSupply}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Fijado de forma inmutable en el contrato inteligente</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <PieChart size={20} style={{ color: 'var(--color-gold)' }} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Distribución Equitativa y Transparente</span>
            </div>
          </div>

          {/* Right Column: Allocation Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>Distribución de Tokens</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {allocations.map((alloc, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{alloc.name}</span>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: alloc.color }}>{alloc.percentage}%</span>
                  </div>
                  {/* Progress Bar Container */}
                  <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '50px', overflow: 'hidden' }}>
                    <div style={{ width: `${alloc.percentage}%`, height: '100%', background: alloc.color, borderRadius: '50px' }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{alloc.desc}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style jsx global>{`
        .tokenomics-pillars {
          grid-template-columns: 1fr !important;
        }
        .tokenomics-main-grid {
          grid-template-columns: 1fr !important;
        }
        @media (min-width: 768px) {
          .tokenomics-pillars {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
        }
        @media (min-width: 992px) {
          .tokenomics-main-grid {
            grid-template-columns: 0.9fr 1.1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
