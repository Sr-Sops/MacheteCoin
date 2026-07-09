'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService } from '@/lib/supabase';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, UserPlus, Loader2, Info } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    MacheteService.init();
    setIsMock(MacheteService.isMock());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username || !password) return;

    setError('');
    setLoading(true);

    try {
      const res = await MacheteService.signUp(email, username, password);
      if (res.success) {
        // Successful signup, redirect to dashboard
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(res.error || 'Ocurrió un error al registrarse.');
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
        background: 'radial-gradient(circle, rgba(0, 255, 102, 0.04) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      <div className="glass-panel glass-panel-green" style={{
        maxWidth: '420px',
        width: '100%',
        padding: '2.5rem 2rem',
        border: '1px solid rgba(0, 255, 102, 0.15)',
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
          <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-green-neon)' }}>
            <Image src="/logo-oficial.jpg" alt="Logo" fill style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }} className="gold-text-gradient">Registro de Usuario</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Únete a la manada y asegura tus $MACHETE
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

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Username Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="username" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Nombre de Usuario
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
              <User size={18} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                id="username"
                required
                placeholder="ej. CarpinchoPro"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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

          {/* Email Input */}
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

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Contraseña
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
              <Lock size={18} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                id="password"
                required
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  width: '100%',
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
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
                Registrando cuenta...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Unirse y Activar Cuenta
              </>
            )}
          </button>

        </form>

        <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" style={{ color: 'var(--color-green-neon)', fontWeight: 600, textDecoration: 'none' }} className="nav-link">
            Inicia sesión aquí
          </Link>
        </div>

      </div>
    </main>
  );
}
