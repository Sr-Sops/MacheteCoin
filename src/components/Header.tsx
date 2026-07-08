'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService, Profile } from '@/lib/supabase';
import { Shield, LayoutDashboard, LogOut, LogIn, Menu, X, ArrowRight } from 'lucide-react';

interface HeaderProps {
  twitterUrl?: string;
  telegramUrl?: string;
  discordUrl?: string;
}

export default function Header({ twitterUrl, telegramUrl, discordUrl }: HeaderProps) {
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
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <div style={{ position: 'relative', width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
            <Image 
              src="/logo-oficial.jpg" 
              alt="MacheteCoin logo" 
              fill
              style={{ objectFit: 'cover' }}
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
          <Link href="#lore" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} className="nav-link">Sobre Nosotros</Link>
          <Link href="#tokenomics" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} className="nav-link">Tokenomics</Link>
          <Link href="#comprar" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} className="nav-link">Cómo Comprar</Link>
          <Link href="#roadmap" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500, transition: 'color 0.2s' }} className="nav-link">Roadmap</Link>
        </nav>

        {/* Desktop Action Buttons */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1rem' }} className="md-flex">
          {/* Socials */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginRight: '0.5rem' }}>
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
            {telegramUrl && (
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="social-hover">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7-2.48 2.75-2.7.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.84 1.16-5.2 3.43-.49.34-.94.5-1.34.49-.44-.01-1.3-.25-1.93-.46-.78-.25-1.4-.39-1.35-.83.03-.23.35-.46.96-.71 3.76-1.63 6.27-2.71 7.53-3.23 3.58-1.48 4.32-1.74 4.81-1.75.11 0 .35.03.5.16.13.11.17.26.19.37 0 .07.01.21 0 .33z"/></svg>
              </a>
            )}
          </div>

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
          <Link 
            href="#lore" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Sobre Nosotros
          </Link>
          <Link 
            href="#tokenomics" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Tokenomics
          </Link>
          <Link 
            href="#comprar" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Cómo Comprar
          </Link>
          <Link 
            href="#roadmap" 
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}
          >
            Roadmap
          </Link>

          <hr style={{ borderColor: 'rgba(255,255,255,0.05)', margin: '1rem 0' }} />

          {/* Mobile socials */}
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            {twitterUrl && (
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)' }}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            )}
            {telegramUrl && (
              <a href={telegramUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-gold)' }}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-1-.65-.35-1 .22-1.62.15-.15 2.7-2.48 2.75-2.7.01-.03.01-.14-.06-.2-.07-.06-.17-.04-.25-.02-.11.02-1.84 1.16-5.2 3.43-.49.34-.94.5-1.34.49-.44-.01-1.3-.25-1.93-.46-.78-.25-1.4-.39-1.35-.83.03-.23.35-.46.96-.71 3.76-1.63 6.27-2.71 7.53-3.23 3.58-1.48 4.32-1.74 4.81-1.75.11 0 .35.03.5.16.13.11.17.26.19.37 0 .07.01.21 0 .33z"/></svg>
              </a>
            )}
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
