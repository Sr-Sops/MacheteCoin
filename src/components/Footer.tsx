'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LineChart } from 'lucide-react';

interface FooterProps {
  twitterUrl?: string;
  telegramUrl?: string;
  discordUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  tiktokUrl?: string;
  youtubeUrl?: string;
  poocoinUrl?: string;
}

export default function Footer({ twitterUrl, telegramUrl, discordUrl, instagramUrl, facebookUrl, tiktokUrl, youtubeUrl, poocoinUrl }: FooterProps) {
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
              <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                <Image 
                  src="/logo-oficial.png" 
                  alt="MacheteCoin Logo" 
                  fill
                  style={{ objectFit: 'contain' }}
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

          {/* Legal Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ color: 'var(--color-gold)', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <Link href="/terms" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }} className="footer-link">Términos y Condiciones</Link>
              <Link href="/privacy" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'color 0.2s' }} className="footer-link">Política de Privacidad</Link>
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
              {discordUrl && (
                <a href={discordUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </a>
              )}
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v7.02c-.01 1.65-.56 3.29-1.57 4.56-1.14 1.43-2.83 2.31-4.66 2.48-1.89.17-3.83-.24-5.34-1.34-1.46-1.07-2.45-2.71-2.69-4.51-.25-1.81.16-3.69 1.15-5.21 1.05-1.6 2.75-2.63 4.63-2.82v4.11c-.4.04-.8.15-1.17.34-.69.35-1.23.95-1.45 1.69-.2.66-.14 1.4.15 2.01.27.56.76 1.01 1.34 1.18.66.19 1.39.11 1.99-.21.65-.35 1.11-.97 1.25-1.69.06-.32.09-.65.09-.98V.02z"/></svg>
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                  <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
              )}
              {poocoinUrl && (
                <a href={poocoinUrl} title="PooCoin" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                  <LineChart size={24} />
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
            <strong>DESCARGO DE RESPONSABILIDAD:</strong> MacheteCoin (<span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.15em', verticalAlign: 'middle', marginTop: '-0.1em' }}><Image src="/logo-oficial.png" alt="$" width={14} height={14} style={{ width: '1em', height: '1em' }} /> MacheteCoin</span>) es una moneda meme con fines de entretenimiento únicamente y no representa ningún tipo de consejo de inversión ni expectativa de ganancias financieras. Las criptomonedas y especialmente las memecoins conllevan un riesgo extremadamente alto. No arriesgues capital que no estés dispuesto a perder en su totalidad. El contrato y el código se proporcionan &quot;tal cual&quot; sin garantías.
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
            grid-template-columns: 2fr 1fr 1fr 1fr !important;
          }
        }
        .footer-link:hover {
          color: var(--color-gold) !important;
        }
      `}</style>
    </footer>
  );
}

