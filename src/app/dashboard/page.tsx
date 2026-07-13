'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService, Profile, SwapTx } from '@/lib/supabase';
import { 
  ArrowLeft, Wallet, LogOut, Loader2, Coins, History, Copy, Check, 
  Shield, Clock, AlertCircle, User, Settings, Lock, Trash2, Key,
  CreditCard, ExternalLink, Calendar, CheckCircle2, ChevronRight, HelpCircle,
  FileText, Upload, RefreshCw, Smartphone, ToggleLeft, ToggleRight, QrCode
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function Dashboard() {
  const router = useRouter();
  
  // Tab control ('resumen', 'historial', 'perfil')
  const [activeTab, setActiveTab] = useState<'resumen' | 'historial' | 'perfil'>('resumen');
  
  const [user, setUser] = useState<Profile | null>(null);
  const [swaps, setSwaps] = useState<SwapTx[]>([]);
  const [walletInput, setWalletInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedWallet, setCopiedWallet] = useState(false);

  // PROFILE EDIT FIELDS
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhoneCode, setEditPhoneCode] = useState('+34');
  const [editPhoneNum, setEditPhoneNum] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileMessage, setProfileMessage] = useState({ text: '', type: 'success' });
  const [profileLoading, setProfileLoading] = useState(false);



  // 2FA GOOGLE AUTH MODAL
  const [showTwoFaModal, setShowTwoFaModal] = useState(false);
  const [twoFaSecret, setTwoFaSecret] = useState('');
  const [twoFaCodeInput, setTwoFaCodeInput] = useState('');
  const [twoFaError, setTwoFaError] = useState('');
  const [twoFaFactorId, setTwoFaFactorId] = useState('');
  const [twoFaQrCodeSvg, setTwoFaQrCodeSvg] = useState('');

  // DELETE ACCOUNT CONFIRM MODAL
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  // GOOGLE LINK MOCK STATE
  const [googleLinked, setGoogleLinked] = useState(false);

  useEffect(() => {
    MacheteService.init();
    loadSession();
  }, [router]);

  const loadSession = async () => {
    const u = await MacheteService.getCurrentUser();
    if (!u) {
      router.push('/login');
      return;
    }
    setUser(u);
    setWalletInput(u.wallet_address || '');
    
    // Set edit form values
    setEditFirstName(u.first_name || '');
    setEditLastName(u.last_name || '');
    setEditEmail(u.email || '');
    let pCode = '+34';
    let pNum = u.phone || '';
    if (u.phone && u.phone.includes(' ')) {
      const parts = u.phone.split(' ');
      pCode = parts[0];
      pNum = parts.slice(1).join('').replace(/[^0-9]/g, '');
    } else if (u.phone && u.phone.startsWith('+')) {
      if (u.phone.startsWith('+34')) { pCode = '+34'; pNum = u.phone.substring(3); }
      else if (u.phone.startsWith('+52')) { pCode = '+52'; pNum = u.phone.substring(3); }
      else if (u.phone.startsWith('+54')) { pCode = '+54'; pNum = u.phone.substring(3); }
      else if (u.phone.startsWith('+57')) { pCode = '+57'; pNum = u.phone.substring(3); }
      else if (u.phone.startsWith('+33')) { pCode = '+33'; pNum = u.phone.substring(3); }
      else if (u.phone.startsWith('+49')) { pCode = '+49'; pNum = u.phone.substring(3); }
      else if (u.phone.startsWith('+1')) { pCode = '+1'; pNum = u.phone.substring(2); }
      else pNum = u.phone.replace(/[^0-9]/g, '');
    } else {
      pNum = u.phone ? u.phone.replace(/[^0-9]/g, '') : '';
    }
    setEditPhoneCode(pCode);
    setEditPhoneNum(pNum);
    setEditBirthDate(u.birth_date || '');
    setEditUsername(u.username || '');
    setAvatarBase64(u.avatar_url || null);
    setGoogleLinked(u.id.length > 10); // Simulates linked status

    // Load swaps
    const userSwaps = await MacheteService.getUserSwaps(u.id);
    setSwaps(userSwaps);
    setLoading(false);
  };

  const handleLogout = async () => {
    await MacheteService.signOut();
    router.push('/');
    router.refresh();
  };

  // WALLET LINK / UNLINK
  const handleLinkWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !walletInput) return;

    // Validate EVM format (Polygon/Ethereum)
    if (!/^0x[a-fA-F0-9]{40}$/.test(walletInput)) {
      setProfileMessage({ text: 'Error: La dirección no es válida. Debe ser una billetera Polygon/EVM real (ej. 0x...).', type: 'error' });
      return;
    }

    setWalletLoading(true);
    const result = await MacheteService.updateWallet(user.id, walletInput);
    setWalletLoading(false);

    if (result.success) {
      setUser(prev => prev ? { ...prev, wallet_address: walletInput } : null);
      setProfileMessage({ text: 'Billetera vinculada correctamente. Tu saldo ya está asociado.', type: 'success' });
    } else {
      setProfileMessage({ text: result.error || 'Error al vincular la billetera.', type: 'error' });
    }
  };

  const handleUnlinkWallet = async () => {
    if (!user) return;
    setWalletLoading(true);
    const result = await MacheteService.updateWallet(user.id, '');
    setWalletLoading(false);
    if (result.success) {
      setUser(prev => prev ? { ...prev, wallet_address: null } : null);
      setWalletInput('');
      setProfileMessage({ text: 'Billetera desvinculada.', type: 'success' });
    }
  };

  // EDIT PROFILE
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!currentPassword) {
      setProfileMessage({ text: 'Por favor, introduce tu contraseña actual para guardar cualquier modificación.', type: 'error' });
      return;
    }

    setProfileLoading(true);
    setProfileMessage({ text: '', type: 'success' });

    if (newPassword) {
      if (newPassword.length < 8) {
        setProfileMessage({ text: 'La nueva contraseña debe tener al menos 8 caracteres.', type: 'error' });
        setProfileLoading(false);
        return;
      }
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasLowercase = /[a-z]/.test(newPassword);
      const hasNumbers = /\d/.test(newPassword);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
      
      if (!hasUppercase || !hasLowercase || !hasNumbers || !hasSpecialChar) {
        setProfileMessage({ text: 'La nueva contraseña debe incluir mayúsculas, minúsculas, números y al menos un carácter especial.', type: 'error' });
        setProfileLoading(false);
        return;
      }
    }

    // Build update data
    const updateData: Partial<Profile> = {
      first_name: editFirstName,
      last_name: editLastName,
      phone: `${editPhoneCode} ${editPhoneNum}`.trim(),
      birth_date: editBirthDate,
      username: editUsername,
      avatar_url: avatarBase64
    };

    if (editEmail !== user.email) {
      updateData.email = editEmail;
    }

    const result = await MacheteService.updateProfile(user.id, updateData, currentPassword, newPassword || undefined);
    setProfileLoading(false);

    if (result.success) {
      setProfileMessage({ text: 'Perfil actualizado con éxito.', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      // Reload updated session
      loadSession();
    } else {
      setProfileMessage({ text: result.error || 'Contraseña incorrecta o error al actualizar datos.', type: 'error' });
    }
  };

  // AVATAR UPDATE
  const handleAvatarEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setProfileMessage({ text: 'El avatar supera 1MB.', type: 'error' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };



  // 2FA MOCK / REAL INITIATION
  const handleToggleTwoFa = async () => {
    if (user?.two_fa_enabled) {
      if (confirm('¿Estás seguro de desactivar la autenticación en dos pasos? Tu cuenta será menos segura.')) {
        MacheteService.updateProfile(user.id, { two_fa_enabled: false, two_fa_secret: null }).then(() => {
          loadSession();
        });
      }
    } else {
      setLoading(true);
      const res = await MacheteService.enrollMFA();
      setLoading(false);
      
      if (res.success && res.factorId) {
        setTwoFaFactorId(res.factorId);
        setTwoFaSecret(res.secret || '');
        setTwoFaQrCodeSvg(res.qrCode || '');
        setTwoFaError('');
        setShowTwoFaModal(true);
      } else {
        setProfileMessage({ text: res.error || 'Error al iniciar 2FA', type: 'error' });
      }
    }
  };

  const handleConfirmTwoFa = async () => {
    if (!twoFaCodeInput || twoFaCodeInput.length < 6) {
      setTwoFaError('El código OTP debe ser de 6 dígitos.');
      return;
    }
    
    setLoading(true);
    // Verify MFA Factor
    const verifyRes = await MacheteService.challengeAndVerifyMFA(twoFaFactorId, twoFaCodeInput);
    
    if (!verifyRes.success) {
      setLoading(false);
      setTwoFaError(verifyRes.error || 'Código incorrecto o expirado.');
      return;
    }

    // If verification succeeded, mark profile as enabled
    if (user) {
      const res = await MacheteService.updateProfile(user.id, {
        two_fa_enabled: true,
        two_fa_secret: twoFaSecret
      });
      setLoading(false);
      if (res.success) {
        setShowTwoFaModal(false);
        setTwoFaCodeInput('');
        loadSession();
      } else {
        setTwoFaError('Error al guardar 2FA en el perfil');
      }
    }
  };

  // GOOGLE ACCOUNT LINK MOCK
  const handleLinkGoogle = () => {
    if (googleLinked) {
      if (confirm('¿Desvincular cuenta de Google?')) {
        setGoogleLinked(false);
        setProfileMessage({ text: 'Cuenta de Google desvinculada con éxito.', type: 'success' });
      }
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setGoogleLinked(true);
        setProfileMessage({ text: 'Cuenta de Google vinculada correctamente.', type: 'success' });
      }, 800);
    }
  };

  // DANGER ZONE DELETE ACCOUNT
  const handleDeleteAccount = async () => {
    if (!deleteConfirmPassword) {
      setDeleteError('Se requiere tu contraseña para autorizar la eliminación.');
      return;
    }
    if (user) {
      setLoading(true);
      const result = await MacheteService.deleteAccount(user.id);
      setLoading(false);
      if (result.success) {
        setShowDeleteModal(false);
        router.push('/');
        router.refresh();
      } else {
        setDeleteError('La contraseña introducida es incorrecta.');
      }
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleCopyWallet = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2000);
  };

  if (loading) {
    return (
      <div style={{
        width: '100vw', height: '100vh', background: '#050a07',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
      }}>
        <Loader2 className="spin-logo" size={48} style={{ color: 'var(--color-gold)' }} />
        <span style={{ fontFamily: 'var(--font-title)', color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Cargando Panel de Usuario...
        </span>
      </div>
    );
  }

  const activeUser = user!;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Banner Navigation */}
      <header style={{
        background: 'rgba(8, 17, 12, 0.95)',
        borderBottom: '1px solid rgba(255, 199, 0, 0.15)',
        padding: '1rem 0',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="nav-link">
            <ArrowLeft size={16} />
            Volver a la Web
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {activeUser.role === 'admin' && (
              <Link href="/admin" className="btn btn-glass" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.25rem' }}>
                <Shield size={14} style={{ color: 'var(--color-gold)' }} />
                Admin Panel
              </Link>
            )}
            <button onClick={handleLogout} className="btn btn-glass" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', gap: '0.25rem', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.1)' }}>
              <LogOut size={14} />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container" style={{ flex: 1, padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Profile Welcome Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)', background: 'rgba(0,0,0,0.3)' }}>
              {activeUser.avatar_url ? (
                <Image src={activeUser.avatar_url} alt="Profile Avatar" fill style={{ objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                  <User size={28} />
                </div>
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>
                Hola, <span className="gold-text-gradient">{activeUser.username}</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.15rem' }}>
                {activeUser.email}
              </p>
            </div>
          </div>
          
          {/* Status Badges */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Role badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: activeUser.role === 'admin' ? 'rgba(255, 199, 0, 0.08)' : 'rgba(255, 255, 255, 0.03)',
              border: `1px solid ${activeUser.role === 'admin' ? 'rgba(255, 199, 0, 0.25)' : 'rgba(255, 255, 255, 0.06)'}`,
              padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase',
              color: activeUser.role === 'admin' ? 'var(--color-gold)' : 'var(--text-primary)',
            }}>
              {activeUser.role === 'admin' ? <Shield size={13} /> : <Wallet size={13} />}
              {activeUser.role === 'admin' ? 'Administrador' : 'Inversor'}
            </div>


          </div>
        </div>

        {/* Dashboard Tabs Header */}
        <div style={{
          display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '1rem', marginTop: '0.5rem'
        }}>
          <button 
            onClick={() => setActiveTab('resumen')}
            style={{
              padding: '0.75rem 1rem', background: 'transparent', border: 'none',
              color: activeTab === 'resumen' ? 'var(--color-gold)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'resumen' ? '2px solid var(--color-gold)' : 'none',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Resumen
          </button>
          <button 
            onClick={() => setActiveTab('historial')}
            style={{
              padding: '0.75rem 1rem', background: 'transparent', border: 'none',
              color: activeTab === 'historial' ? 'var(--color-gold)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'historial' ? '2px solid var(--color-gold)' : 'none',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Historial de Swaps
          </button>
          <button 
            onClick={() => setActiveTab('perfil')}
            style={{
              padding: '0.75rem 1rem', background: 'transparent', border: 'none',
              color: activeTab === 'perfil' ? 'var(--color-gold)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'perfil' ? '2px solid var(--color-gold)' : 'none',
              fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer'
            }}
          >
            Mi Perfil
          </button>
        </div>

        {/* PROFILE ACTION NOTIFICATIONS */}
        {profileMessage.text && (
          <div style={{
            background: profileMessage.type === 'success' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            border: `1px solid ${profileMessage.type === 'success' ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)'}`,
            borderRadius: '8px', padding: '0.75rem 1.25rem',
            color: profileMessage.type === 'success' ? '#4ade80' : '#f87171',
            fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            {profileMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{profileMessage.text}</span>
          </div>
        )}

        {/* TAB 1: RESUMEN */}
        {activeTab === 'resumen' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="dashboard-grid">
            
            {/* Card 1: Balance Details */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255, 199, 0, 0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-gold)' }}>
                <Coins size={24} />
                <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saldo Acumulado</h3>
              </div>
              
              <div style={{ padding: '0.5rem 0' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.2em' }}>DISPONIBLE EN <Image src="/logo-oficial.png" alt="$" width={14} height={14} style={{ width: '1.2em', height: '1.2em' }} /> MacheteCoin</span>
                <h2 style={{ fontSize: '3rem', color: 'var(--text-primary)', fontFamily: 'var(--font-title)', marginTop: '0.25rem', overflowWrap: 'break-word' }}>
                  {activeUser.machete_balance.toLocaleString()} <span style={{ color: 'var(--color-gold)', fontSize: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.1em' }}><Image src="/logo-oficial.png" alt="$" width={32} height={32} style={{ width: '1em', height: '1em' }} /> MacheteCoin</span>
                </h2>
              </div>

              {/* Verified Phone/Wallet details inside summary card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Teléfono Verificado por SMS:</span>
                  <span style={{ color: activeUser.phone_verified ? '#4ade80' : '#fbbf24', fontWeight: 'bold' }}>
                    {activeUser.phone_verified ? 'SÍ' : 'NO (Verificar en pestaña Mi Perfil)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Monedas Asignadas a Wallet:</span>
                  <span style={{ color: activeUser.wallet_address ? '#4ade80' : '#fbbf24', fontWeight: 'bold' }}>
                    {activeUser.wallet_address ? 'SÍ' : 'NO (Vincula tu billetera para operar)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Wallet Linker */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-green-neon)' }}>
                <Wallet size={24} />
                <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vincular Billetera Cripto</h3>
              </div>

              {activeUser.wallet_address ? (
                /* Wallet Linked State */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Tienes una dirección blockchain enlazada a tu cuenta. Los intercambios que realices se asociarán automáticamente a esta clave pública.
                  </p>
                  <div style={{
                    background: 'rgba(0,255,102,0.04)',
                    border: '1px solid rgba(0,255,102,0.15)',
                    padding: '1rem', borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem',
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--color-green-neon)', fontWeight: 700 }}>CLAVE PÚBLICA ENLAZADA:</span>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '240px', color: 'var(--text-primary)' }} className="wallet-text">
                        {activeUser.wallet_address}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleCopyWallet(activeUser.wallet_address!)} className="btn btn-glass" style={{ padding: '0.4rem' }}>
                        {copiedWallet ? <Check size={14} style={{ color: 'var(--color-green-neon)' }} /> : <Copy size={14} />}
                      </button>
                      <button onClick={handleUnlinkWallet} className="btn" style={{ padding: '0.4rem 0.75rem', background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.75rem' }}>
                        Desvincular
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Unlinked state */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(!activeUser.phone_verified || !activeUser.two_fa_enabled) ? (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '8px',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      textAlign: 'left'
                    }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', color: '#fbbf24', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        <AlertCircle size={16} />
                        <span>Acción Bloqueada por Seguridad</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        Para vincular una billetera externa y operar con MacheteCoin, es obligatorio cumplir los siguientes requisitos de seguridad básicos:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#4ade80' }}>
                          <CheckCircle2 size={14} />
                          <span>E-mail verificado correctamente</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: activeUser.phone_verified ? '#4ade80' : '#fbbf24' }}>
                          {activeUser.phone_verified ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                          <span>Teléfono móvil verificado {activeUser.phone_verified ? '' : '(Pendiente en Mi Perfil)'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: activeUser.two_fa_enabled ? '#4ade80' : '#fbbf24' }}>
                          {activeUser.two_fa_enabled ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                          <span>Autenticación 2FA Activada {activeUser.two_fa_enabled ? '' : '(Pendiente de configurar)'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleLinkWallet} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        Vincula tu clave pública de Polygon o Ethereum (ej. MetaMask, Trust Wallet) para asociar el saldo acumulado en compras de MacheteCoins.
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <input 
                          type="text" 
                          required
                          placeholder="Pega tu clave pública (ej. 0x1234...)"
                          value={walletInput}
                          onChange={(e) => setWalletInput(e.target.value)}
                          style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '10px',
                            padding: '0.75rem 1rem',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            outline: 'none',
                          }}
                        />
                      </div>
                      <button type="submit" disabled={walletLoading || !walletInput} className="btn btn-gold" style={{ width: '100%', gap: '0.25rem' }}>
                        {walletLoading ? <Loader2 size={16} className="spin-logo" /> : null}
                        Vincular Billetera
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: HISTORIAL */}
        {activeTab === 'historial' && (
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-gold)' }}>
              <History size={24} />
              <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Historial de Intercambios (DEX Swaps)</h3>
            </div>

            {swaps.length > 0 ? (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Fecha / Hora</th>
                      <th>Pago</th>
                      <th>Tokens Adquiridos</th>
                      <th>Tx Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {swaps.map((tx) => (
                      <tr key={tx.id}>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td style={{ fontWeight: 600 }}>
                          {tx.from_amount} {tx.from_token}
                        </td>
                        <td style={{ color: 'var(--color-gold)', fontWeight: 700 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2em' }}>+{tx.to_amount.toLocaleString()} <Image src="/logo-oficial.png" alt="$" width={14} height={14} style={{ width: '1em', height: '1em' }} /> MacheteCoin</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', width: '140px', whiteSpace: 'nowrap' }} className="hash-text">
                              {tx.tx_hash}
                            </span>
                            <button onClick={() => handleCopyHash(tx.tx_hash)} style={{ background: 'transparent', border: 'none', color: 'var(--color-gold)', cursor: 'pointer' }}>
                              {copiedHash === tx.tx_hash ? <Check size={12} style={{ color: 'var(--color-green-neon)' }} /> : <Copy size={12} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.95rem' }}>No has realizado intercambios todavía.</p>
                <Link href="/#comprar" style={{ color: 'var(--color-gold)', fontSize: '0.9rem', fontWeight: 600 }} className="nav-link">
                  Ir a realizar un Swap de prueba en el simulador
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MI PERFIL (COMPREHENSIVE) */}
        {activeTab === 'perfil' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Edit details form */}
            <form onSubmit={handleUpdateProfile} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-gold)' }}>
                <Settings size={24} />
                <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Configuración del Perfil</h3>
              </div>

              {/* Avatar upload */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '8px' }}>
                <div style={{ position: 'relative', width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', border: '2px dashed var(--color-gold)', background: 'rgba(0,0,0,0.3)' }}>
                  {avatarBase64 ? (
                    <Image src={avatarBase64} alt="Avatar" fill style={{ objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}>
                      <Upload size={20} />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept=".jpg,.jpeg,.png"
                    onChange={handleAvatarEdit}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Cambiar Foto de Perfil</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Sube una imagen .jpg, .jpeg o .png de máximo 1MB.</p>
                </div>
              </div>

              {/* User details grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="profile-edit-grid">
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="username" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Apodo / Username</label>
                  <input 
                    type="text" 
                    id="username"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="email" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Correo Electrónico</label>
                  <input 
                    type="email" 
                    id="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="firstName" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Nombre</label>
                  <input 
                    type="text" 
                    id="firstName"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="lastName" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Apellidos</label>
                  <input 
                    type="text" 
                    id="lastName"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="phone" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Teléfono Móvil</label>
                  <div style={{
                    display: 'flex',
                    background: 'rgba(0,0,0,0.25)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}>
                    <select 
                      value={editPhoneCode}
                      onChange={(e) => setEditPhoneCode(e.target.value)}
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
                    <input 
                      type="tel" 
                      id="phone"
                      placeholder="654 321 098"
                      value={editPhoneNum}
                      onChange={(e) => setEditPhoneNum(e.target.value.replace(/[^0-9]/g, ''))}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        padding: '0.65rem 0.9rem', 
                        color: 'var(--text-primary)', 
                        outline: 'none',
                        width: '100%',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="birth" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fecha de Nacimiento</label>
                  <input 
                    type="date" 
                    id="birth"
                    value={editBirthDate}
                    onChange={(e) => setEditBirthDate(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: 'var(--text-primary)', outline: 'none', colorScheme: 'dark' }}
                  />
                </div>

              </div>

              {/* Password change (Optional) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 'bold' }}>Cambiar Contraseña (Opcional)</span>
                <div style={{ display: 'flex', gap: '1rem' }} className="profile-edit-grid">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                    <label htmlFor="newpass" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Nueva Contraseña</label>
                    <input 
                      type="password" 
                      id="newpass"
                      placeholder="Mínimo 8 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: 'var(--text-primary)', outline: 'none' }}
                    />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                      Debe incluir mayúsculas, minúsculas, números y al menos un carácter especial.
                    </span>
                  </div>
                </div>
              </div>

              {/* Password authorization (Required to save) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255, 199, 0, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 199, 0, 0.15)' }}>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', color: 'var(--color-gold)', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  <Lock size={14} />
                  <span>Contraseña Actual de Autorización</span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                  Por motivos de seguridad, debes introducir tu **contraseña actual** para poder guardar cualquier cambio en tu perfil de usuario.
                </p>
                <input 
                  type="password" 
                  required
                  placeholder="Introduce tu contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255, 199, 0, 0.3)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <button type="submit" disabled={profileLoading} className="btn btn-gold" style={{ width: '100%', gap: '0.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {profileLoading ? <Loader2 size={16} className="spin-logo" /> : null}
                Guardar Modificaciones
              </button>
            </form>

            {/* Security Section (2FA & Google Account) */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-gold)' }}>
                <Key size={24} />
                <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seguridad Adicional</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                
                {/* 2FA Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <Smartphone size={20} style={{ color: 'var(--color-gold)', marginTop: '0.1rem' }} />
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Autenticador de Google (2FA)</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                        Añade una capa de protección adicional introduciendo un código OTP temporal desde tu app móvil al iniciar sesión.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleToggleTwoFa}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: activeUser.two_fa_enabled ? 'var(--color-green-neon)' : 'var(--text-secondary)' }}
                  >
                    {activeUser.two_fa_enabled ? <ToggleRight size={38} /> : <ToggleLeft size={38} />}
                  </button>
                </div>

                {/* Google OAuth Link */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <div style={{ background: '#fff', borderRadius: '4px', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0.1rem' }}>
                      <Image src="https://www.google.com/favicon.ico" alt="Google Logo" width={14} height={14} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>Vinculación con Cuenta de Google</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                        Permite iniciar sesión rápidamente vinculando o desvinculando tu cuenta de Google.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLinkGoogle}
                    className="btn"
                    style={{ 
                      padding: '0.4rem 1rem', 
                      background: googleLinked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${googleLinked ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.08)'}`,
                      color: googleLinked ? '#f87171' : 'var(--text-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {googleLinked ? 'Desvincular' : 'Vincular Google'}
                  </button>
                </div>

              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.02)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f87171' }}>
                <Trash2 size={24} />
                <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Zona de Peligro</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                La eliminación de la cuenta es un proceso **totalmente irreversible**. Perderás permanentemente tu nombre de usuario, el saldo acumulado en MacheteCoins y cualquier vinculación de billetera.
              </p>
              
              <button 
                onClick={() => { setDeleteConfirmPassword(''); setDeleteError(''); setShowDeleteModal(true); }}
                className="btn" 
                style={{ 
                  alignSelf: 'flex-start', background: 'rgba(239,68,68,0.1)', 
                  border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', 
                  padding: '0.5rem 1.25rem', fontSize: '0.8rem', fontWeight: 'bold' 
                }}
              >
                Eliminar Mi Cuenta permanentemente
              </button>
            </div>

          </div>
        )}

      </main>



      {/* 2FA SETUP MODAL */}
      {showTwoFaModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '380px', width: '100%', padding: '2rem',
            border: '1px solid rgba(255,199,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1.25rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--color-gold)' }}>
              <QrCode size={48} />
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>Autenticador Google 2FA</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', lineHeight: 1.45 }}>
                Escanea el código QR en tu app Google Authenticator o introduce la siguiente clave secreta:
              </p>
            </div>

            <div style={{ background: '#fff', padding: '0.75rem', borderRadius: '8px', display: 'inline-block', margin: '0 auto' }}>
              {twoFaQrCodeSvg ? (
                <div dangerouslySetInnerHTML={{ __html: twoFaQrCodeSvg }} style={{ width: 130, height: 130 }} />
              ) : (
                <QRCodeSVG 
                  value={`otpauth://totp/MacheteCoin:${editEmail}?secret=${twoFaSecret}&issuer=MacheteCoin`}
                  size={130}
                />
              )}
            </div>

            <div style={{
              background: 'rgba(255, 199, 0, 0.05)', border: '1px solid rgba(255, 199, 0, 0.15)',
              borderRadius: '8px', padding: '0.5rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--color-gold)'
            }}>
              Secret Key: <strong>{twoFaSecret}</strong>
            </div>

            {twoFaError && (
              <span style={{ color: '#f87171', fontSize: '0.7rem' }}>{twoFaError}</span>
            )}

            <input 
              type="text" 
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              value={twoFaCodeInput}
              onChange={(e) => setTwoFaCodeInput(e.target.value.replace(/[^0-9]/g, ''))}
              style={{
                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255, 199, 0, 0.3)', borderRadius: '8px',
                padding: '0.8rem', color: 'var(--color-gold)', fontSize: '1.5rem', fontWeight: 'bold',
                textAlign: 'center', letterSpacing: '0.5em', outline: 'none', width: '100%'
              }}
            />

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setShowTwoFaModal(false)}
                className="btn"
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmTwoFa}
                className="btn btn-gold"
                style={{ flex: 1 }}
              >
                Activar 2FA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DANGER ZONE DELETE ACCOUNT CONFIRM MODAL */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem',
        }}>
          <div className="glass-panel" style={{
            maxWidth: '420px', width: '100%', padding: '2rem',
            border: '1px solid rgba(239,68,68,0.3)', display: 'flex', flexDirection: 'column', gap: '1.25rem',
            background: '#0d0505'
          }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#f87171' }}>
              <AlertCircle size={22} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 'bold' }}>¿Confirmas la eliminación permanente?</h3>
            </div>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Para confirmar que deseas borrar tu cuenta por completo (incluyendo tu saldo de MacheteCoins y toda tu información de seguridad), introduce tu **contraseña de inicio de sesión**.
            </p>

            {deleteError && (
              <span style={{ color: '#f87171', fontSize: '0.75rem', textAlign: 'left' }}>{deleteError}</span>
            )}

            <input 
              type="password" 
              placeholder="Introduce tu contraseña"
              value={deleteConfirmPassword}
              onChange={(e) => setDeleteConfirmPassword(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', padding: '0.65rem 0.9rem', color: 'var(--text-primary)', outline: 'none' }}
            />

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="btn"
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="btn"
                style={{ flex: 1, background: '#ef4444', color: '#fff', fontWeight: 'bold' }}
              >
                Eliminar Cuenta
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .dashboard-grid {
          grid-template-columns: 1fr !important;
        }
        .profile-edit-grid {
          grid-template-columns: 1fr !important;
        }
        @media (min-width: 768px) {
          .profile-edit-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (min-width: 992px) {
          .dashboard-grid {
            grid-template-columns: 1.1fr 0.9fr !important;
          }
          .wallet-text {
            width: 320px !important;
          }
          .hash-text {
            width: 250px !important;
          }
        }
      `}</style>
    </div>
  );
}

