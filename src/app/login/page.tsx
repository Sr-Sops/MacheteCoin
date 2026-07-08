'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService } from '@/lib/supabase';
import { ArrowLeft, Mail, LogIn, Loader2, Info } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@machetecoin.com';

  useEffect(() => {
    // Detect mock state
    MacheteService.init();
    setIsMock(MacheteService.isMock());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError('');
    setLoading(true);

    try {
      const res = await MacheteService.signIn(email);
      if (res.success) {
        // Successful login
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(res.error || 'Ocurrió un error al iniciar sesión.');
      }
    } catch (err: any) {
      setError(err?.message || 'Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '450px',
        height: '450px',
        background: 'radial-gradient(circle, rgba(255, 199, 0, 0.05) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      <div className="glass-panel" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '2.5rem 2rem',
        border: '1px solid rgba(255, 199, 0, 0.2)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.75rem',
      }}>
        {/* Back Link */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          alignSelf: 'flex-start',
        }} className="nav-link">
          <ArrowLeft size={16} />
          Volver a Inicio
        </Link>

        {/* Branding header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
            <Image src="/logo-oficial.jpg" alt="Logo" fill style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }} className="gold-text-gradient">Iniciar Sesión</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Accede a tu cuenta de MacheteCoin
            </p>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
            padding: '0.75rem',
            color: '#f87171',
            fontSize: '0.85rem',
            lineHeight: 1.4,
          }}>
            {error}
          </div>
        )}

        {/* Helper Box (local mock mode) */}
        {isMock && (
          <div style={{
            background: 'rgba(255, 199, 0, 0.05)',
            border: '1px solid rgba(255, 199, 0, 0.15)',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.8rem',
            color: 'var(--text-primary)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-start',
          }}>
            <Info size={16} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <strong>Modo Simulado:</strong> Puedes entrar con cualquier email. 
              Usa <span style={{ color: 'var(--color-gold)', fontWeight: 'bold' }}>{adminEmail}</span> para probar el <strong>Panel de Administrador</strong>.
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Correo Electrónico
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              gap: '0.75rem',
            }}>
              <Mail size={18} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                id="email"
                required
                placeholder="ejemplo@machetecoin.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-gold" 
            style={{ width: '100%', marginTop: '0.5rem', gap: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin-logo" />
                Cargando cuenta...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Ingresar a la Selva
              </>
            )}
          </button>

        </form>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          ¿No tienes una cuenta?{' '}
          <Link href="/register" style={{ color: 'var(--color-gold)', fontWeight: 600, textDecoration: 'none' }} className="nav-link">
            Regístrate aquí
          </Link>
        </div>

      </div>
    </main>
  );
}
