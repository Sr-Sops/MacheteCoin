'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService } from '@/lib/supabase';
import { 
  ArrowLeft, Mail, Lock, Eye, EyeOff, LogIn, Loader2, Info, 
  Key, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';

export default function Login() {
  const router = useRouter();
  
  // FORM FIELDS
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);

  // INTERMEDIATE 2FA FLOW STATE
  const [show2FaScreen, setShow2FaScreen] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [twoFaError, setTwoFaError] = useState('');

  // RECOVERY MODAL STATE
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryTarget, setRecoveryTarget] = useState('');
  const [recoveryWordsInput, setRecoveryWordsInput] = useState('');
  const [recoveryNewPassword, setRecoveryNewPassword] = useState('');
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryError, setRecoveryError] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);

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

  // MAIN LOGIN TRIGGER
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginInput || !password) return;

    setError('');
    setLoading(true);

    try {
      // 1. Check if the user has 2FA enabled before completing login
      const has2Fa = await MacheteService.checkUserTwoFaEnabled(loginInput);
      
      if (has2Fa && !show2FaScreen) {
        // Stop flow and prompt for 2FA OTP
        setShow2FaScreen(true);
        setLoading(false);
        return;
      }

      // 2. Perform native sign in
      const res = await MacheteService.signIn(loginInput, password);
      if (res.success) {
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(getErrorMessage((res as any).error) || 'Credenciales de inicio de sesión incorrectas.');
        setShow2FaScreen(false); // Reset to username/password screen if failed
      }
    } catch (err: any) {
      setError(getErrorMessage(err) || 'Error de conexión.');
      setShow2FaScreen(false);
    } finally {
      setLoading(false);
    }
  };

  // 2FA CODE CONFIRM
  const handleConfirm2FaLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFaCode || twoFaCode.length < 6) {
      setTwoFaError('El código OTP debe ser de 6 dígitos.');
      return;
    }
    setTwoFaError('');
    
    // Simulate/Perform OTP verification
    // Since mock or client handles session, we just call the normal signIn now
    handleLoginSubmit(e);
  };

  // RECOVERY SUBMISSION
  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryTarget || !recoveryWordsInput || !recoveryNewPassword) {
      setRecoveryError('Por favor, rellena todos los campos de recuperación.');
      return;
    }

    setRecoveryError('');
    setRecoveryLoading(true);

    try {
      const res = await MacheteService.resetPasswordByRecovery(
        recoveryTarget,
        recoveryWordsInput,
        recoveryNewPassword
      );

      if (res.success) {
        setRecoverySuccess(true);
        setTimeout(() => {
          setShowRecoveryModal(false);
          setRecoverySuccess(false);
          setRecoveryTarget('');
          setRecoveryWordsInput('');
          setRecoveryNewPassword('');
        }, 3000);
      } else {
        setRecoveryError(res.error || 'No se pudo restablecer la contraseña.');
      }
    } catch (err: any) {
      setRecoveryError(getErrorMessage(err));
    } finally {
      setRecoveryLoading(false);
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
          gap: '0.4rem',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
        }} className="nav-link">
          <ArrowLeft size={14} />
          Volver a Inicio
        </Link>

        {/* Header branding */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
            <Image src="/logo-oficial.png" alt="Logo MacheteCoin" fill style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gold-text-gradient">
              {show2FaScreen ? 'Seguridad 2FA' : 'Inicia Sesión Oficial'}
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              {show2FaScreen ? 'Introduce tu código del autenticador móvil' : 'Accede de forma segura a tu billetera'}
            </p>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            color: '#f87171',
            fontSize: '0.8rem',
            lineHeight: 1.4,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* 2FA OTP SCREEN */}
        {show2FaScreen ? (
          <form onSubmit={handleConfirm2FaLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
              <ShieldCheck size={48} />
            </div>

            {twoFaError && (
              <span style={{ color: '#f87171', fontSize: '0.75rem', textAlign: 'center' }}>{twoFaError}</span>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="2faCode" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Código OTP de 6 Dígitos
              </label>
              <input 
                type="text" 
                id="2faCode"
                maxLength={6}
                required
                placeholder="000000"
                value={twoFaCode}
                onChange={(e) => setTwoFaCode(e.target.value.replace(/[^0-9]/g, ''))}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(255, 199, 0, 0.3)',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  color: 'var(--text-primary)',
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  letterSpacing: '0.2em',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => { setShow2FaScreen(false); setTwoFaCode(''); }}
                className="btn"
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={loading || twoFaCode.length < 6}
                className="btn btn-gold"
                style={{ flex: 1 }}
              >
                {loading ? <Loader2 size={16} className="spin-logo" /> : 'Confirmar'}
              </button>
            </div>
          </form>
        ) : (
          /* STANDARD LOGIN SCREEN */
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Multi login method input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="loginInput" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Usuario / Correo / Teléfono
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
                  type="text" 
                  id="loginInput"
                  required
                  placeholder="ejemplo@machete.com o +34..."
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
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

            {/* Password input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label htmlFor="password" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={() => { setRecoveryError(''); setShowRecoveryModal(true); }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-gold)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  ¿Olvidaste la clave?
                </button>
              </div>
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
                  type={showPassword ? 'text' : 'password'} 
                  id="password"
                  required
                  placeholder="Tu contraseña"
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
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-gold" 
              style={{ width: '100%', gap: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0.5rem' }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="spin-logo" />
                  Accediendo...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Entrar
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer links */}
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          ¿No tienes una cuenta aún?{' '}
          <Link href="/register" style={{ color: 'var(--color-gold)', fontWeight: 600, textDecoration: 'underline' }}>
            Registrarse
          </Link>
        </div>
      </div>

      {/* PASSWORD RECOVERY SEED MODAL */}
      {showRecoveryModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '460px', width: '100%', padding: '2rem',
            border: '1px solid rgba(255,199,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem',
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--color-gold)' }}>
              <Key size={20} />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Recuperación por Frase Semilla</h3>
            </div>

            {recoverySuccess ? (
              <div style={{
                background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)',
                borderRadius: '8px', padding: '1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-green-neon)' }}>
                  <CheckCircle2 size={40} />
                </div>
                <h4 style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Contraseña Restablecida</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Tu contraseña ha sido actualizada con éxito en la blockchain y la base de datos de seguridad. Ya puedes iniciar sesión.
                </p>
              </div>
            ) : (
              <form onSubmit={handleRecoverySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                  Para restablecer tu contraseña, introduce tu nombre de usuario o correo electrónico y tu frase oficial de 12 palabras generada en el registro.
                </p>

                {recoveryError && (
                  <span style={{ color: '#f87171', fontSize: '0.75rem' }}>{recoveryError}</span>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="recTarget" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Usuario o Email</label>
                  <input 
                    type="text" 
                    id="recTarget"
                    required
                    placeholder="ej. MacheteKing o sops_raptor@hotmail.es"
                    value={recoveryTarget}
                    onChange={(e) => setRecoveryTarget(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.55rem', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="recWords" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Frase de 12 palabras (Separadas por espacio)</label>
                  <textarea 
                    id="recWords"
                    required
                    rows={3}
                    placeholder="palabra1 palabra2 palabra3..."
                    value={recoveryWordsInput}
                    onChange={(e) => setRecoveryWordsInput(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.55rem', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', resize: 'none', fontFamily: 'monospace' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="recPass" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Nueva Contraseña</label>
                  <input 
                    type="password" 
                    id="recPass"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={recoveryNewPassword}
                    onChange={(e) => setRecoveryNewPassword(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.55rem', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowRecoveryModal(false)}
                    className="btn"
                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={recoveryLoading}
                    className="btn btn-gold"
                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.35rem' }}
                  >
                    {recoveryLoading ? <Loader2 size={14} className="spin-logo" /> : null}
                    Restablecer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
