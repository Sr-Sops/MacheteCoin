'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService, Profile } from '@/lib/supabase';
import { Shield, LayoutDashboard, LogOut, LogIn, Menu, X, ArrowRight } from 'lucide-react';
import LanguageTranslator from './LanguageTranslator';

interface HeaderProps {
  twitterUrl?: string;
  telegramUrl?: string;
  discordUrl?: string;
  instagramUrl?: string;
}

export default function Header({ twitterUrl, telegramUrl, discordUrl, instagramUrl }: HeaderProps) {
  const [user, setUser] = useState<Profile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Fetch session
    const loadSession = async () => {
      const u = await MacheteService.getCurrentUser();
      setUser(u);
    };
    loadSession();

    // Scroll listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await MacheteService.signOut();
    setUser(null);
    window.location.reload();
  };

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 100,
      padding: scrolled ? '0.75rem 0' : '1.25rem 0',
      background: scrolled ? 'rgba(5, 10, 7, 0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255, 199, 0, 0.15)' : '1px solid transparent',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
      transition: 'all 0.3s ease-in-out',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', textDecoration: 'none' }}>
          <div style={{ position: 'relative', width: '40px', height: '40px' }}>
            <Image
              src="/logoMC-1024.png"
              alt="MacheteCoin logo"
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>
          <span style={{
            fontFamily: 'var(--font-title)',
            fontWeight: 700,
            fontSize: '1.25rem',
            background: 'linear-gradient(135deg, #fff 30%, var(--color-gold) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            MacheteCoin
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="md-flex">
          {/* Links removed as per user request */}
        </nav>

        {/* Desktop Action Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="md-flex">
          {/* Socials */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginRight: '0.5rem' }}>
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            )}
            {telegramUrl && (
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7-2.48 2.75-2.7.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.84 1.16-5.2 3.43-.49.34-.94.5-1.34.49-.44-.01-1.3-.25-1.93-.46-.78-.25-1.4-.39-1.35-.83.03-.23.35-.46.96-.71 3.76-1.63 6.27-2.71 7.53-3.23 3.58-1.48 4.32-1.74 4.81-1.75.11 0 .35.03.5.16.13.11.17.26.19.37 0 .07.01.21 0 .33z" /></svg>
              </a>
            )}
            {discordUrl && (
              <a href={discordUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            )}
          </div>

          <LanguageTranslator />

          {/* User Session Area */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {user.role === 'admin' && (
                <Link href="/admin" className="btn btn-glass" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.25rem' }}>
                  <Shield size={14} style={{ color: 'var(--color-gold)' }} />
                  Admin
                </Link>
              )}
              <Link href="/dashboard" className="btn btn-green" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', gap: '0.25rem' }}>
                <LayoutDashboard size={14} />
                Mi Cuenta
              </Link>
              <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem', background: 'transparent', color: '#f87171' }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-gold" style={{ padding: '0.55rem 1.25rem', fontSize: '0.9rem', gap: '0.25rem' }}>
              <LogIn size={15} />
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'flex', background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
          className="md-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          width: '100%',
          height: 'calc(100vh - 60px)',
          background: 'rgba(5, 10, 7, 0.98)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 199, 0, 0.1)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          zIndex: 99,
        }}>
          {/* Mobile socials */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)' }}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
            )}
            {telegramUrl && (
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)' }}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7-2.48 2.75-2.7.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.84 1.16-5.2 3.43-.49.34-.94.5-1.34.49-.44-.01-1.3-.25-1.93-.46-.78-.25-1.4-.39-1.35-.83.03-.23.35-.46.96-.71 3.76-1.63 6.27-2.71 7.53-3.23 3.58-1.48 4.32-1.74 4.81-1.75.11 0 .35.03.5.16.13.11.17.26.19.37 0 .07.01.21 0 .33z" /></svg>
              </a>
            )}
            {discordUrl && (
              <a href={discordUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)' }}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"/></svg>
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)' }}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <LanguageTranslator />
          </div>

          {/* Mobile Auth Area */}
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto' }}>
              {user.role === 'admin' && (
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="btn btn-glass" style={{ gap: '0.5rem' }}>
                  <Shield size={16} style={{ color: 'var(--color-gold)' }} />
                  Panel Administrador
                </Link>
              )}
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-green" style={{ gap: '0.5rem' }}>
                <LayoutDashboard size={16} />
                Mi Panel de Cuentas
              </Link>
              <button onClick={handleLogout} className="btn" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <LogOut size={16} style={{ marginRight: '0.25rem' }} />
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-gold" style={{ marginTop: 'auto', gap: '0.5rem' }}>
              <LogIn size={18} />
              Iniciar Sesión
            </Link>
          )}
        </div>
      )}

      {/* Tailwind breakpoint helpers implemented in CSS */}
      <style jsx global>{`
        .md-flex {
          display: none !important;
        }
        @media (min-width: 768px) {
          .md-flex {
            display: flex !important;
          }
          .md-none {
            display: none !important;
          }
        }
        .nav-link:hover {
          color: var(--color-gold) !important;
          text-shadow: 0 0 8px rgba(255, 199, 0, 0.4);
        }
        .social-hover:hover {
          color: var(--color-gold) !important;
          transform: scale(1.1);
        }
      `}</style>
    </header>
  );
}
