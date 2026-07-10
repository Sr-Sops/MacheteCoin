'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService } from '@/lib/supabase';
import { ArrowLeft, ShieldCheck, Mail, Lock, User, Loader2, Check } from 'lucide-react';

export default function AdminSetup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);

  // PRE-FILLED ADMIN CREDENTIALS FOR COMFORTABLE REGISTRATION
  const [email, setEmail] = useState('sops_raptor@hotmail.es');
  const [username, setUsername] = useState('sopsdev');
  const [password, setPassword] = useState('Machete@Coin26BS');
  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('Machete');
  const [phone, setPhone] = useState('+34 600000000');
  const [birthDate, setBirthDate] = useState('1990-01-01');

  useEffect(() => {
    MacheteService.init();
    setIsMock(MacheteService.isMock());
  }, []);

  const getErrorMessage = (err: any): string => {
    if (!err) return '';
    if (typeof err === 'string') return err;
    if (typeof err === 'object') {
      const msg = err.message || err.error_description || err.error;
      if (msg) return typeof msg === 'string' ? msg : JSON.stringify(msg);
      if (err.statusText) return err.statusText;
      if (err.status) return `Error ${err.status}`;
      const str = JSON.stringify(err);
      if (str && str !== '{}') return str;
    }
    return String(err);
  };

  const handleRegisterAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username || !password) {
      setError('Por favor, rellena todos los campos.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Direct registration as admin with approved KYC status
      const res = await MacheteService.signUp({
        email,
        username,
        password,
        firstName,
        lastName,
        phone,
        birthDate,
        documentId: 'ADMIN-PASS',
        role: 'admin',
        kycStatus: 'approved',
        kycDocumentUrl: '/storage/kyc/admin-auto-approved.png',
      });

      console.log("Supabase URL client-side:", process.env.NEXT_PUBLIC_SUPABASE_URL);
      console.log("MacheteService.signUp response object:", res);
      console.log("MacheteService.signUp response JSON:", JSON.stringify(res));

      if (res.success) {
        // Successful signup, redirect directly to admin panel!
        router.push('/admin');
        router.refresh();
      } else {
        const errMsg = getErrorMessage((res as any).error);
        console.error("SignUp failed with error:", (res as any).error, "Parsed message:", errMsg);
        console.error("SignUp failed with error JSON:", JSON.stringify((res as any).error));
        setError(errMsg || 'Ocurrió un error al registrar el Administrador.');
      }
    } catch (err: any) {
      setError(getErrorMessage(err) || 'Error de conexión.');
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
        background: 'radial-gradient(circle, rgba(255, 199, 0, 0.04) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      <div className="glass-panel" style={{
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem 2rem',
        border: '1px solid rgba(255, 199, 0, 0.3)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        {/* Back navigation */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
        }} className="nav-link">
          <ArrowLeft size={14} />
          Volver a Inicio
        </Link>

        {/* Branding header */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2.5px solid var(--color-gold)', boxShadow: '0 0 15px rgba(255,199,0,0.2)' }}>
            <Image src="/logo-oficial.png" alt="Logo" fill style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }} className="gold-text-gradient">
              <ShieldCheck size={22} style={{ color: 'var(--color-gold)' }} />
              Admin Setup Especial
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Enlace de registro rápido para el Administrador Oficial
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
            fontSize: '0.8rem',
            lineHeight: 1.4,
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegisterAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Email Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="email" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Correo Electrónico del Administrador
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '0.7rem 1rem',
              gap: '0.75rem',
            }}>
              <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Username Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="username" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Nombre de Usuario
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '0.7rem 1rem',
              gap: '0.75rem',
            }}>
              <User size={16} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label htmlFor="password" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
              Contraseña de Acceso
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.25)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '8px',
              padding: '0.7rem 1rem',
              gap: '0.75rem',
            }}>
              <Lock size={16} style={{ color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.9rem',
                  width: '100%',
                }}
              />
            </div>
          </div>

          {/* Confirm Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn btn-gold" 
            style={{ width: '100%', marginTop: '0.5rem', gap: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin-logo" />
                Registrando Administrador...
              </>
            ) : (
              <>
                <Check size={18} />
                Registrar y Activar Admin
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
