'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService, supabaseClient } from '@/lib/supabase';
import { 
  ArrowLeft, Mail, Lock, Eye, EyeOff, UserPlus, Loader2, CheckCircle2, 
  User, ShieldCheck, Calendar, Phone, FileText, Upload, RefreshCw, Check,
  AlertCircle, Copy, HelpCircle, Key, FileCode, CheckSquare, Smartphone, Camera
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { setupRecaptcha } from '@/lib/firebase';
const BIP39_WORDS = [
  'alpha', 'beta', 'gamma', 'delta', 'omega', 'machete', 'capybara', 'crypto',
  'token', 'wallet', 'blockchain', 'jungle', 'forest', 'river', 'gold', 'silver',
  'bronze', 'diamond', 'emerald', 'ruby', 'safari', 'tokenomics', 'supply', 'ledger',
  'node', 'miner', 'staking', 'yield', 'swap', 'liquidity', 'pool', 'chart',
  'market', 'bull', 'bear', 'whale', 'shrimp', 'crab', 'octopus', 'dolphin',
  'moon', 'rocket', 'orbit', 'planet', 'star', 'galaxy', 'universe', 'cosmos'
];

export default function Register() {
  const router = useRouter();
  
  // URL Setup Check
  const [isAdminSetup, setIsAdminSetup] = useState(false);
  const [isMock, setIsMock] = useState(false);
  
  // Active Step (1: Credentials & Avatar, 2: Personal Details & Phone SMS, 3: Recovery Words)
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // DUPLICATION ERROR STATES
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  // POPUP MODALS STATE
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

  // STEP 1 FIELDS
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [avatarName, setAvatarName] = useState('');
  
  // STEP 2 FIELDS
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneCode, setPhoneCode] = useState('+34');
  const [phoneNum, setPhoneNum] = useState('');
  const [birthDate, setBirthDate] = useState('');
  
  // PHONE VERIFICATION OTP STATES
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);

  // STEP 3 FIELDS (RECOVERY)
  const [recoveryWords, setRecoveryWords] = useState('');
  const [copiedWords, setCopiedWords] = useState(false);
  const [savedWords, setSavedWords] = useState(false);

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

    setupRecaptcha('recaptcha-container');
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

  // AVATAR FILE UPLOADER & VALIDATION
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 1MB)
    if (file.size > 1024 * 1024) {
      setError('El tamaño del avatar no debe superar 1 MB.');
      return;
    }

    // Validate extension (.jpg, .jpeg, .png)
    const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validExtensions.includes(file.type)) {
      setError('Formato no soportado. Sube una imagen en formato .jpg, .jpeg o .png.');
      return;
    }

    setError('');
    setAvatarName(file.name);

    // Read as Base64 for localstorage / db profile sync
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // OTP CODE SENDER (SMS)
  const handleSendOtp = async () => {
    if (!phoneNum) {
      setError('Por favor, introduce tu número de teléfono.');
      return;
    }
    setError('');
    setVerifyingPhone(true);

    const fullPhone = `${phoneCode}${phoneNum}`;

    try {
      if (isMock) {
        // Generate a random 6-digit code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        setOtpCode(code);
        setOtpSent(true);
        setShowOtpModal(true);
        console.log(`[SMS VERIFIER] Código OTP generado: ${code}`);
      } else {
        // CALL FIREBASE OTP AUTH API
        if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
          setupRecaptcha('recaptcha-container');
        }
        
        const { error: authErr } = await MacheteService.sendSmsOtp(fullPhone, window.recaptchaVerifier);
        if (authErr) {
          setError(typeof authErr === 'string' ? authErr : JSON.stringify(authErr));
        } else {
          setOtpSent(true);
          setShowOtpModal(true);
        }
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setVerifyingPhone(false);
    }
  };

  // OTP CODE VERIFICATION
  const handleVerifyOtp = async () => {
    if (!otpInput) return;
    setError('');
    setLoading(true);

    const fullPhone = `${phoneCode}${phoneNum}`;

    try {
      if (isMock || otpCode) {
        if (otpInput === otpCode) {
          setPhoneVerified(true);
          setShowOtpModal(false);
          setError('');
        } else {
          setError('El código introducido no es válido.');
        }
      } else {
        // CALL SUPABASE OTP VERIFICATION
        const success = await MacheteService.verifySmsOtp(fullPhone, otpInput);
        if (success) {
          setPhoneVerified(true);
          setShowOtpModal(false);
        } else {
          setError('Código SMS incorrecto o expirado.');
        }
      }
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // STEP NAVIGATION & VALIDATIONS
  const handleNextStep = async () => {
    setError('');
    setEmailError('');
    setUsernameError('');
    setPhoneError('');
    
    if (step === 1) {
      if (!email || !password) {
        setError('Por favor, rellena todos los campos de credenciales.');
        return;
      }
      if (password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres.');
        return;
      }
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      
      if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChar) {
        setError('La contraseña debe incluir mayúsculas, minúsculas, números y al menos un carácter especial.');
        return;
      }
      if (!termsAccepted) {
        setError('Debes aceptar los Términos y Condiciones.');
        return;
      }

      setLoading(true);
      const isEmailDuplicated = await MacheteService.checkDuplicateField('email', email);
      setLoading(false);

      if (isEmailDuplicated) {
        setEmailError('Este correo electrónico ya está registrado.');
        return;
      }

      setStep(2);
    } else if (step === 2) {
      if (!username || !firstName || !lastName || !phoneNum || !birthDate) {
        setError('Por favor, rellena todos los datos personales y tu Alias.');
        return;
      }

      setLoading(true);
      const isUsernameDuplicated = await MacheteService.checkDuplicateField('username', username);
      const fullPhone = `${phoneCode} ${phoneNum}`;
      const isPhoneDuplicated = await MacheteService.checkDuplicateField('phone', fullPhone);
      setLoading(false);

      let hasDuplicateError = false;
      if (isUsernameDuplicated) {
        setUsernameError('Este nombre de usuario ya está registrado.');
        hasDuplicateError = true;
      }
      if (isPhoneDuplicated) {
        setPhoneError('Este número de teléfono ya está registrado.');
        hasDuplicateError = true;
      }

      if (hasDuplicateError) {
        return;
      }

      const age = calculateAge(birthDate);
      if (age < 18) {
        setError('Debes ser mayor de 18 años para abrir una cuenta oficial.');
        return;
      }
      
      if (!phoneVerified && !isAdminSetup) {
        handleSendOtp();
        return;
      }
      
      generateRecoveryWordsStep();
    }
  };

  const generateRecoveryWordsStep = () => {
    // Generate 12 random BIP39 words
    const words: string[] = [];
    for (let i = 0; i < 12; i++) {
      const idx = Math.floor(Math.random() * BIP39_WORDS.length);
      words.push(BIP39_WORDS[idx]);
    }
    setRecoveryWords(words.join(' '));
    setStep(3);
  };

  const handlePrevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };



  const handleFinalSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await MacheteService.signUp({
        email,
        username,
        password,
        firstName,
        lastName,
        phone: `${phoneCode} ${phoneNum}`,
        phoneVerified: phoneVerified || isAdminSetup,
        birthDate,
        role: isAdminSetup ? 'admin' : 'user',
        avatarUrl: avatarBase64 || undefined,
        recoveryWords: recoveryWords || undefined,
      });

      if (res.success) {
        if (!isMock) {
          // Tell the user to check their email
          alert("¡Registro exitoso! Por favor, verifica tu correo electrónico para poder iniciar sesión.\n\n(Puedes personalizar el mensaje y remitente en Supabase -> Authentication -> Email Templates)");
          router.push('/login');
        } else {
          router.push('/dashboard');
        }
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

  const handleCopyWords = () => {
    navigator.clipboard.writeText(recoveryWords);
    setCopiedWords(true);
    setTimeout(() => setCopiedWords(false), 2000);
  };

  return (
    <main style={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      position: 'relative',
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(255, 199, 0, 0.04) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '2.5rem 2rem',
        border: '1px solid rgba(255, 199, 0, 0.15)',
        boxShadow: '0 20px 45px rgba(0,0,0,0.6)',
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
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ position: 'relative', width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)' }}>
            <Image src="/logo-oficial.png" alt="Logo MacheteCoin" fill style={{ objectFit: 'cover' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }} className="gold-text-gradient">
              {isAdminSetup ? 'Setup Administrador' : 'Crear Cuenta Machete'}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Paso {step} de 3 — {step === 1 ? 'Cuenta Principal' : step === 2 ? 'Datos de Contacto' : 'Llaves de Seguridad'}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '4px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '2px',
          overflow: 'hidden',
          display: 'flex',
        }}>
          <div style={{
            width: `${(step / 3) * 100}%`,
            height: '100%',
            background: 'var(--color-gold)',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 10px rgba(255,199,0,0.5)',
          }} />
        </div>

        {/* Error notification */}
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

        {/* STEP 1: CREDENTIALS & AVATAR */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Avatar upload */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                position: 'relative',
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                border: '2px dashed rgba(255,199,0,0.4)',
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                cursor: 'pointer',
              }}>
                {avatarBase64 ? (
                  <Image src={avatarBase64} alt="Avatar Preview" fill style={{ objectFit: 'cover' }} />
                ) : (
                  <Upload size={22} style={{ color: 'var(--color-gold)', opacity: 0.8 }} />
                )}
                <input 
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAvatarChange}
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, width: '100%', height: '100%',
                    opacity: 0, cursor: 'pointer'
                  }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {avatarName ? avatarName : 'Subir Foto de Perfil'}
                </p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  Formatos soportados: JPG, JPEG, PNG. Max. 1MB.
                </p>
              </div>
            </div>

            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="email" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Correo Electrónico
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.25)',
                border: emailError ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '0.7rem 1rem',
                gap: '0.75rem',
              }}>
                <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
                <input 
                  type="email" 
                  id="email"
                  required
                  placeholder="ejemplo@machetecoin.es"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
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
              {emailError && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '-0.25rem', paddingLeft: '0.25rem' }}>
                  {emailError}
                </span>
              )}
            </div>

            {/* Password Input */}
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
                  placeholder="Mínimo 8 caracteres"
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
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                Debe incluir mayúsculas, minúsculas, números y al menos un carácter especial.
              </span>
            </div>

            {/* Terms Acceptance checkbox */}
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
                Confirmo que he leído y acepto los{' '}
                <button 
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-green-neon)',
                    textDecoration: 'underline',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  Términos de Servicio y Políticas de Privacidad
                </button>
                {' '}y certifico que todos mis datos introducidos son auténticos.
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

        {/* STEP 2: PERSONAL PROFILE DATA & PHONE OTP */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Username Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="username" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Nombre de Usuario (Apodo de cuenta)
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(0,0,0,0.25)',
                border: usernameError ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.06)',
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
                  onChange={(e) => { setUsername(e.target.value); setUsernameError(''); }}
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
              {usernameError && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '-0.25rem', paddingLeft: '0.25rem' }}>
                  {usernameError}
                </span>
              )}
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

            {/* Mobile Phone Field with Verify Button */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="phone" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Teléfono Móvil
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  background: 'rgba(0,0,0,0.25)',
                  border: phoneError ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  flex: 1
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
                    <option value="+33" style={{ background: '#080F0C' }}>🇫🇷 +33</option>
                    <option value="+49" style={{ background: '#080F0C' }}>🇩🇪 +49</option>
                  </select>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '0 0.5rem 0 0.75rem', color: 'var(--text-secondary)' }}>
                    <Phone size={16} />
                  </div>
                  <input 
                    type="tel" 
                    required
                    placeholder="654 321 098"
                    value={phoneNum}
                    onChange={(e) => { setPhoneNum(e.target.value.replace(/[^0-9]/g, '')); setPhoneError(''); }}
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
              {phoneError && (
                <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '-0.25rem', paddingLeft: '0.25rem' }}>
                  {phoneError}
                </span>
              )}
            </div>

            {/* Birth Date Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label htmlFor="birthDate" style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                Fecha de Nacimiento
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
                    colorScheme: 'dark',
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={handlePrevStep}
                className="btn" 
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Volver
              </button>
              <button 
                type="button" 
                onClick={handleNextStep}
                className="btn btn-gold" 
                style={{ flex: 1 }}
              >
                Continuar al Paso 3
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: RECOVERY WORDS */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <ShieldCheck size={48} style={{ color: 'var(--color-gold)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Frase Semilla</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: 1.4 }}>
                Guarda estas 12 palabras en un lugar seguro. Son la única forma de recuperar tu cuenta si pierdes el acceso.
              </p>
            </div>

            <div style={{ 
              background: 'rgba(0,0,0,0.4)', 
              border: '1px dashed rgba(255,199,0,0.3)', 
              borderRadius: '8px', 
              padding: '1.25rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              justifyContent: 'center',
              userSelect: 'all'
            }}>
              {recoveryWords.split(' ').map((word, idx) => (
                <span key={idx} style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  padding: '0.3rem 0.6rem', 
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontFamily: 'monospace',
                  color: 'var(--color-gold)'
                }}>
                  <span style={{ opacity: 0.5, marginRight: '0.3rem', fontSize: '0.7rem' }}>{idx + 1}</span>
                  {word}
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCopyWords}
              className="btn"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}
            >
              <Copy size={16} style={{ marginRight: '0.5rem' }} />
              Copiar Frase al Portapapeles
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', padding: '1rem', borderRadius: '8px' }}>
              <input type="checkbox" id="savedWords" checked={savedWords} onChange={(e) => setSavedWords(e.target.checked)} style={{ width: '18px', height: '18px', accentColor: '#f87171', marginTop: '0.1rem' }} />
              <label htmlFor="savedWords" style={{ fontSize: '0.8rem', color: '#f87171', lineHeight: 1.4, cursor: 'pointer' }}>
                He guardado estas palabras y entiendo que MacheteCoin no puede recuperarlas por mí.
              </label>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                type="button" 
                onClick={() => setStep(2)}
                className="btn" 
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Volver
              </button>
              <button 
                type="button" 
                onClick={handleFinalSubmit}
                disabled={!savedWords || loading}
                className="btn btn-gold" 
                style={{ flex: 1 }}
              >
                {loading ? <Loader2 className="spin-logo" /> : 'Finalizar Registro'}
              </button>
            </div>
          </div>
        )}

      </div> {/* End of main glass-panel */}

      {/* POPUP MODAL: TERMS AND CONDITIONS */}
      {showTermsModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '560px',
            width: '100%',
            maxHeight: '80vh',
            padding: '2rem',
            border: '1px solid rgba(255,199,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--color-gold)' }} className="gold-text-gradient">
              Términos de Servicio y Políticas de Privacidad
            </h3>
            
            <div style={{
              flex: 1,
              overflowY: 'auto',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              background: 'rgba(0,0,0,0.3)',
              padding: '1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }} className="scrollable-content">
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>1. Aceptación del Contrato</h4>
              <p>Al registrarte en MacheteCoin, declaras que tienes al menos 18 años y que aceptas la vinculación de tu billetera cripto para transferencias directas, asegurando la veracidad de tu correo y teléfono.</p>
              
              <p>Protege la privacidad de todos los usuarios mediante protocolos criptográficos avanzados.</p>
            </div>
            
            <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
              <h4 style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>3. Custodia Segura de Activos</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Tu número de teléfono móvil está fuertemente encriptado en reposo y nunca será vendido ni transferido a terceros comerciales.</p>
            </div>

            <button
              type="button"
              onClick={() => setShowTermsModal(false)}
              className="btn btn-gold"
              style={{ width: '100%', alignSelf: 'center' }}
            >
              Cerrar y Aceptar
            </button>
          </div>
        </div>
      )}

      {/* POPUP MODAL: SMS OTP VERIFICATION CODE */}
      {showOtpModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '380px',
            width: '100%',
            padding: '2rem',
            border: '1px solid rgba(255,199,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            textAlign: 'center',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-gold)', marginBottom: '0.25rem' }}>
              <ShieldCheck size={36} />
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                Confirmación por SMS
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.45 }}>
                Hemos enviado un código de verificación de 6 dígitos al número **{phoneCode} {phoneNum}**.
              </p>
            </div>

            {/* OTP code helper alert if in Mock Mode */}
            {isMock && (
              <div style={{
                background: 'rgba(255, 199, 0, 0.06)',
                border: '1px solid rgba(255, 199, 0, 0.15)',
                borderRadius: '8px',
                padding: '0.6rem',
                fontSize: '0.75rem',
                color: 'var(--color-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}>
                <HelpCircle size={14} />
                <span>Simulador OTP: El código es <strong>{otpCode}</strong></span>
              </div>
            )}

            {/* Code Input */}
            <input 
              type="text" 
              maxLength={6}
              placeholder="Introduce los 6 dígitos"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/[^0-9]/g, ''))}
              style={{
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '0.75rem',
                color: 'var(--text-primary)',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                textAlign: 'center',
                letterSpacing: '0.2em',
                outline: 'none',
              }}
            />

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="btn"
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={loading || otpInput.length < 6}
                onClick={handleVerifyOtp}
                className="btn btn-gold"
                style={{ flex: 1 }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Firebase reCAPTCHA Container (invisible) */}
      <div id="recaptcha-container"></div>
    </main>
  );
}
