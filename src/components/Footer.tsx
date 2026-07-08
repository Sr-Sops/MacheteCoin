'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  twitterUrl?: string;
  telegramUrl?: string;
  discordUrl?: string;
}

export default function Footer({ twitterUrl, telegramUrl, discordUrl }: FooterProps) {
  return (
    <footer style={{
      background: '#040806',
      borderTop: '1px solid rgba(255, 199, 0, 0.1)',
      padding: '4rem 0 2rem 0',
      position: 'relative',
    }}>
      <div className="container">
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '3rem',
          marginBottom: '3rem',
        }} className="footer-grid">
          
          {/* Brand Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid var(--color-gold)' }}>
                <Image 
                  src="/logo-oficial.jpg" 
                  alt="MacheteCoin Logo" 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <span style={{ 
                fontFamily: 'var(--font-title)', 
                fontWeight: 700, 
                fontSize: '1.2rem', 
                color: 'var(--text-primary)'
              }}>
                MacheteCoin
              </span>
            </div>
            
            <p style={{ fontSize: '0.9rem', maxWidth: '320px' }}>
              La memecoin oficial del carpincho con machete. Cortando comisiones y despejando el camino criptográfico con humor y comunidad.
            </p>
          </div>

          {/* Useful Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Navegación</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link href="#lore" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }} className="footer-link">Sobre Nosotros</Link>
              <Link href="#tokenomics" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }} className="footer-link">Tokenomics</Link>
              <Link href="#comprar" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }} className="footer-link">Cómo Comprar</Link>
              <Link href="#roadmap" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }} className="footer-link">Roadmap</Link>
            </div>
          </div>

          {/* Social Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Redes Sociales</h4>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {twitterUrl && (
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              )}
              {telegramUrl && (
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7-2.48 2.75-2.7.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.84 1.16-5.2 3.43-.49.34-.94.5-1.34.49-.44-.01-1.3-.25-1.93-.46-.78-.25-1.4-.39-1.35-.83.03-.23.35-.46.96-.71 3.76-1.63 6.27-2.71 7.53-3.23 3.58-1.48 4.32-1.74 4.81-1.75.11 0 .35.03.5.16.13.11.17.26.19.37 0 .07.01.21 0 .33z"/></svg>
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Disclaimer Area */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '2rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}>
          <p style={{ lineHeight: 1.6, maxWidth: '900px', margin: '0 auto' }}>
            <strong>DESCARGO DE RESPONSABILIDAD:</strong> MacheteCoin ($MACHETE) es una moneda meme con fines de entretenimiento únicamente y no representa ningún tipo de consejo de inversión ni expectativa de ganancias financieras. Las criptomonedas y especialmente las memecoins conllevan un riesgo extremadamente alto. No arriesgues capital que no estés dispuesto a perder en su totalidad. El contrato y el código se proporcionan &quot;tal cual&quot; sin garantías.
          </p>
          
          <p style={{ marginTop: '0.5rem' }}>
            &copy; {new Date().getFullYear()} MacheteCoin. Todos los derechos reservados.
          </p>
        </div>

      </div>

      <style jsx global>{`
        .footer-grid {
          grid-template-columns: 1fr !important;
        }
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr !important;
          }
        }
        .footer-link:hover {
          color: var(--color-gold) !important;
        }
      `}</style>
    </footer>
  );
}
