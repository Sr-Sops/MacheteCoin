'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService } from '@/lib/supabase';
import { 
  ArrowLeft, Mail, Lock, Eye, EyeOff, UserPlus, Loader2, CheckCircle2, 
  User, ShieldCheck, Calendar, Phone, FileText, Upload, RefreshCw, Check
} from 'lucide-react';

export default function Register() {
  const router = useRouter();
  
  // URL Setup Check
  const [isAdminSetup, setIsAdminSetup] = useState(false);
  const [isMock, setIsMock] = useState(false);
  
  // Active Step (1: Credentials, 2: Personal Profile, 3: KYC Identity)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // STEP 1 FIELDS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // STEP 2 FIELDS
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneCode, setPhoneCode] = useState('+34');
  const [phoneNum, setPhoneNum] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  // STEP 3 FIELDS (KYC)
  const [documentType, setDocumentType] = useState('DNI');
  const [documentId, setDocumentId] = useState('');
  const [fileNameFront, setFileNameFront] = useState('');
  const [fileNameBack, setFileNameBack] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    MacheteService.init();
    setIsMock(MacheteService.isMock());
    
    // Check url search query
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('setup') === 'admin' || searchParams.get('role') === 'admin') {
        setIsAdminSetup(true);
      }
    }
  }, []);

  const calculateAge = (dateStr: string) => {
    if (!dateStr) return 0;
    const today = new Date();
    const birth = new Date(dateStr);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

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

  // STEP NAVIGATION & VALIDATIONS
  const handleNextStep = () => {
    setError('');
    
    if (step === 1) {
      if (!email || !password) {
        setError('Por favor, rellena todos los campos.');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (!termsAccepted) {
        setError('Debes aceptar los Términos y Condiciones.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!username || !firstName || !lastName || !phoneNum || !birthDate) {
        setError('Por favor, rellena todos los datos personales.');
        return;
      }
      const age = calculateAge(birthDate);
      if (age < 18) {
        setError('Debes ser mayor de 18 años para abrir una cuenta oficial.');
        return;
      }
      
      // If it is admin setup, skip KYC step and submit immediately
      if (isAdminSetup) {
        handleFinalSubmit();
      } else {
        setStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (side === 'front') {
        setFileNameFront(file.name);
      } else {
        setFileNameBack(file.name);
      }
    }
  };

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    // If real KYC flow, simulate biometric verification scanning first
    if (!isAdminSetup) {
      setScanning(true);
      setScanProgress(10);
      
      // Beautiful simulation intervals
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 15;
        });
      }, 300);

      // Wait 2.2 seconds for biometric KYC simulation to complete
      await new Promise((resolve) => setTimeout(resolve, 2200));
      setScanning(false);
    }

    try {
      const res = await MacheteService.signUp({
        email,
        username,
        password,
        firstName,
        lastName,
        phone: `${phoneCode} ${phoneNum}`,
        birthDate,
        documentId,
        role: isAdminSetup ? 'admin' : 'user',
        kycStatus: isAdminSetup ? 'approved' : 'pending',
        kycDocumentUrl: fileNameFront ? `/storage/kyc/${fileNameFront}` : undefined,
      });

      if (res.success) {
        // Redirect to dashboard or login
        router.push('/dashboard');
        router.refresh();
      } else {
        setError(getErrorMessage((res as any).error) || 'Ocurrió un error al registrarse.');
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
        background: 'radial-gradient(circle, rgba(0, 255, 102, 0.04) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      <div className="glass-panel glass-panel-green" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '2.25rem 2rem',
        border: '1px solid rgba(0, 255, 102, 0.15)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>
        {/* Header Back & Logo Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            textDecoration: 'none',
          }} className="nav-link">
            <ArrowLeft size={14} />
            Volver
          </Link>
          <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid var(--color-green-neon)' }}>
            <Image src="/logo-oficial.png" alt="Logo" fill style={{ objectFit: 'cover' }} />
          </div>
        </div>

        {/* Admin Setup Alert */}
        {isAdminSetup && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(255, 199, 0, 0.15) 0%, rgba(255, 199, 0, 0.02) 100%)',
            borderLeft: '4px solid var(--color-gold)',
            borderRadius: '4px',
            padding: '0.75rem 1rem',
            color: 'var(--color-gold)',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <ShieldCheck size={20} />
            <div>
              <p style={{ fontWeight: 700 }}>Modo Admin Especial Detectado</p>
              <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Esta cuenta obtendrá rango de Administrador directo.</p>
            </div>
          </div>
        )}

        {/* Step Indicator Progress Bar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <span>Paso {step} de {isAdminSetup ? 2 : 3}</span>
            <span style={{ fontWeight: 600, color: 'var(--color-green-neon)' }}>
              {step === 1 && 'Credenciales'}
              {step === 2 && 'Perfil de Datos'}
              {step === 3 && 'Verificación de DNI (KYC)'}
            </span>
          </div>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${(step / (isAdminSetup ? 2 : 3)) * 100}%`,
              background: 'linear-gradient(90deg, var(--color-green-neon) 0%, #00ffcc 100%)',
              transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
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

        {/* STEP 1: CREDENTIALS */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Correo Electrónico
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
                  placeholder="ejemplo@machetecoin.com"
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="password" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Contraseña
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

            {/* Terms Acceptance */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginTop: '0.25rem' }}>
              <input 
                type="checkbox" 
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                style={{
                  marginTop: '0.2rem',
                  accentColor: 'var(--color-green-neon)',
                  cursor: 'pointer',
                  width: '16px',
                  height: '16px',
                }}
              />
              <label htmlFor="terms" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4, cursor: 'pointer' }}>
                Confirmo que he leído y acepto los <Link href="/terms" target="_blank" style={{ color: 'var(--color-green-neon)', textDecoration: 'underline' }}>Términos de Servicio</Link>, las <Link href="/privacy" target="_blank" style={{ color: 'var(--color-green-neon)', textDecoration: 'underline' }}>Políticas de Privacidad</Link> y certifico que todos los datos declarados a continuación son originales de mi país.
              </label>
            </div>

            <button 
              type="button" 
              onClick={handleNextStep}
              className="btn btn-gold" 
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              Continuar al Paso 2
            </button>
          </div>
        )}

        {/* STEP 2: PERSONAL PROFILE DATA */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Username Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="username" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Nombre de Usuario (Apodo público)
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
                  placeholder="ej. MacheteKing"
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

            {/* First Name & Last Name Row */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <label htmlFor="firstName" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  Nombre
                </label>
                <input 
                  type="text" 
                  id="firstName"
                  required
                  placeholder="ej. Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    padding: '0.7rem 1rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    width: '100%',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <label htmlFor="lastName" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                  Apellidos
                </label>
                <input 
                  type="text" 
                  id="lastName"
                  required
                  placeholder="ej. Pérez Gómez"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    padding: '0.7rem 1rem',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Mobile Phone Field */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="phone" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Teléfono Móvil
              </label>
              <div style={{
                display: 'flex',
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <select 
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: 'none',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                    color: 'var(--text-primary)',
                    fontSize: '0.85rem',
                    padding: '0 0.75rem',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="+34" style={{ background: '#080F0C' }}>🇪🇸 +34</option>
                  <option value="+1" style={{ background: '#080F0C' }}>🇺🇸 +1</option>
                  <option value="+52" style={{ background: '#080F0C' }}>🇲🇽 +52</option>
                  <option value="+54" style={{ background: '#080F0C' }}>🇦🇷 +54</option>
                  <option value="+57" style={{ background: '#080F0C' }}>🇨🇴 +57</option>
                  <option value="+56" style={{ background: '#080F0C' }}>🇨🇱 +56</option>
                  <option value="+51" style={{ background: '#080F0C' }}>🇵🇪 +51</option>
                </select>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem 0 0.75rem', color: 'var(--text-secondary)' }}>
                  <Phone size={16} />
                </div>
                <input 
                  type="tel" 
                  required
                  placeholder="654 321 098"
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value.replace(/[^0-9]/g, ''))}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    padding: '0.7rem 0.5rem',
                    width: '100%',
                  }}
                />
              </div>
            </div>

            {/* Date of Birth Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="birthDate" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Fecha de Nacimiento (Debe ser mayor de 18 años)
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
                <Calendar size={16} style={{ color: 'var(--text-secondary)' }} />
                <input 
                  type="date" 
                  id="birthDate"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    width: '100%',
                    cursor: 'pointer',
                  }}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={handlePrevStep}
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Atrás
              </button>
              <button 
                type="button" 
                onClick={handleNextStep}
                disabled={loading}
                className="btn btn-gold" 
                style={{ flex: 1 }}
              >
                {isAdminSetup ? (loading ? 'Creando...' : 'Crear Admin') : 'Paso 3: KYC'}
              </button>
            </div>

          </div>
        )}

        {/* STEP 3: KYC DOCUMENT VALIDATION */}
        {step === 3 && !isAdminSetup && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Biometric Verification Scanning Interface */}
            {scanning ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1rem',
                background: 'rgba(0, 255, 102, 0.02)',
                border: '2px dashed var(--color-green-neon)',
                borderRadius: '12px',
                position: 'relative',
                overflow: 'hidden',
                gap: '1.25rem',
              }}>
                {/* Glowing Laser Scan bar animation */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  height: '4px',
                  background: 'var(--color-green-neon)',
                  boxShadow: '0 0 15px var(--color-green-neon), 0 0 5px var(--color-green-neon)',
                  animation: 'scannerLaser 1.5s infinite linear',
                  zIndex: 5,
                }} />
                
                <RefreshCw size={44} className="spin-logo" style={{ color: 'var(--color-green-neon)' }} />
                
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ fontWeight: 700, color: 'var(--color-green-neon)', fontSize: '1rem', marginBottom: '0.25rem' }}>
                    Escaneando Identidad... {scanProgress}%
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Verificando hologramas oficiales y validez del documento
                  </p>
                </div>

                <style jsx global>{`
                  @keyframes scannerLaser {
                    0% { top: 0%; }
                    50% { top: 100%; }
                    100% { top: 0%; }
                  }
                `}</style>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="documentType" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    Tipo de Documento Oficial
                  </label>
                  <select
                    id="documentType"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    style={{
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      padding: '0.7rem 1rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    <option value="DNI" style={{ background: '#080F0C' }}>DNI (Documento Nacional de Identidad)</option>
                    <option value="NIE" style={{ background: '#080F0C' }}>NIE (Número de Identidad de Extranjero)</option>
                    <option value="Pasaporte" style={{ background: '#080F0C' }}>Pasaporte Oficial</option>
                    <option value="Otro" style={{ background: '#080F0C' }}>Otro ID de Gobierno</option>
                  </select>
                </div>

                {/* Document ID Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label htmlFor="documentId" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    Número del Documento ({documentType})
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
                    <FileText size={16} style={{ color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      id="documentId"
                      required
                      placeholder="ej. 12345678Z"
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value.toUpperCase())}
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

                {/* Upload Section - Front Side */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    Foto de DNI / Documento (Cara Frontal / Anverso)
                  </span>
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px dashed rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '1.25rem 1rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    gap: '0.5rem',
                  }}>
                    {fileNameFront ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-green-neon)' }}>
                        <CheckCircle2 size={20} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{fileNameFront}</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Haz clic para subir o arrastra la foto frontal
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                          PNG, JPG o PDF hasta 5MB
                        </span>
                      </>
                    )}
                    <input 
                      type="file" 
                      required
                      accept="image/*,.pdf" 
                      onChange={(e) => handleFileChange(e, 'front')} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>

                {/* Upload Section - Back Side */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    Foto de DNI / Documento (Cara Trasera / Reverso)
                  </span>
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px dashed rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '1.25rem 1rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    gap: '0.5rem',
                  }}>
                    {fileNameBack ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-green-neon)' }}>
                        <CheckCircle2 size={20} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{fileNameBack}</span>
                      </div>
                    ) : (
                      <>
                        <Upload size={24} style={{ color: 'var(--text-secondary)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Haz clic para subir o arrastra la foto trasera
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>
                          PNG, JPG o PDF hasta 5MB
                        </span>
                      </>
                    )}
                    <input 
                      type="file" 
                      required
                      accept="image/*,.pdf" 
                      onChange={(e) => handleFileChange(e, 'back')} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                </div>

                {/* Form Controls */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                  <button 
                    type="button" 
                    onClick={handlePrevStep}
                    disabled={loading}
                    className="btn btn-secondary" 
                    style={{ flex: 1 }}
                  >
                    Atrás
                  </button>
                  <button 
                    type="button" 
                    onClick={() => handleFinalSubmit()}
                    disabled={loading || !documentId || !fileNameFront || !fileNameBack}
                    className="btn btn-gold" 
                    style={{ flex: 1, gap: '0.5rem' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="spin-logo" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        Verificar y Registrar
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </div>
        )}

        {/* Footer Link */}
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" style={{ color: 'var(--color-green-neon)', fontWeight: 600, textDecoration: 'none' }} className="nav-link">
            Inicia sesión aquí
          </Link>
        </div>

      </div>
    </main>
  );
}
