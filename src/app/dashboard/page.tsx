'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService, Profile, SwapTx } from '@/lib/supabase';
import { ArrowLeft, Wallet, LogOut, Loader2, Coins, History, Copy, Check, Shield } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [swaps, setSwaps] = useState<SwapTx[]>([]);
  const [walletInput, setWalletInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [walletLoading, setWalletLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedWallet, setCopiedWallet] = useState(false);

  useEffect(() => {
    MacheteService.init();
    const loadSession = async () => {
      const u = await MacheteService.getCurrentUser();
      if (!u) {
        // Not logged in, redirect
        router.push('/login');
        return;
      }
      setUser(u);
      setWalletInput(u.wallet_address || '');

      // Load swaps
      const userSwaps = await MacheteService.getUserSwaps(u.id);
      setSwaps(userSwaps);
      setLoading(false);
    };
    loadSession();
  }, [router]);

  const handleLogout = async () => {
    await MacheteService.signOut();
    router.push('/');
    router.refresh();
  };

  const handleLinkWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !walletInput) return;

    setWalletLoading(true);
    const result = await MacheteService.updateWallet(user.id, walletInput);
    setWalletLoading(false);

    if (result.success) {
      setUser(prev => prev ? { ...prev, wallet_address: walletInput } : null);
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
        width: '100vw',
        height: '100vh',
        background: '#050a07',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
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
        position: 'sticky',
        top: 0,
        zIndex: 50,
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
      <main className="container" style={{ flex: 1, padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Welcome Area */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem' }}>
              Hola, <span className="gold-text-gradient">{activeUser.username}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Bienvenido a tu panel de control de MacheteCoin.
            </p>
          </div>
          
          {/* Badge Role */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: activeUser.role === 'admin' ? 'rgba(255, 199, 0, 0.08)' : 'rgba(255, 255, 255, 0.03)',
            border: `1px solid ${activeUser.role === 'admin' ? 'rgba(255, 199, 0, 0.2)' : 'rgba(255, 255, 255, 0.05)'}`,
            padding: '0.4rem 0.85rem',
            borderRadius: '50px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            color: activeUser.role === 'admin' ? 'var(--color-gold)' : 'var(--text-secondary)',
          }}>
            {activeUser.role === 'admin' && <Shield size={12} />}
            Rol: {activeUser.role}
          </div>
        </div>

        {/* Dashboard Grid Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
        }} className="dashboard-grid">
          
          {/* Card 1: Balance Details */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid rgba(255, 199, 0, 0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-gold)' }}>
              <Coins size={24} />
              <h3 style={{ fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Saldo de Cuentas</h3>
            </div>
            
            <div style={{ padding: '0.5rem 0' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>TUS MONEDAS ACUMULADAS</span>
              <h2 style={{ fontSize: '3rem', color: 'var(--text-primary)', fontFamily: 'var(--font-title)', marginTop: '0.25rem', overflowWrap: 'break-word' }}>
                {activeUser.machete_balance.toLocaleString()} <span style={{ color: 'var(--color-gold)', fontSize: '2rem' }}>$MACHETE</span>
              </h2>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              * Saldo acumulado en base a simulaciones de Swap.
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
                <p style={{ fontSize: '0.9rem' }}>
                  Tienes una billetera enlazada correctamente a tu cuenta.
                </p>
                <div style={{
                  background: 'rgba(0,255,102,0.04)',
                  border: '1px solid rgba(0,255,102,0.15)',
                  padding: '1rem',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
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
              <form onSubmit={handleLinkWallet} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.9rem' }}>
                  Vincula tu clave pública de Solana (Phantom/Solflare) o Ethereum (Metamask) para asociarla a tu cuenta.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    required
                    placeholder="Pega tu clave pública (ej. MachETeX123...)"
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

        </div>

        {/* Transaction History Section */}
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
                        +{tx.to_amount.toLocaleString()} $MACHETE
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

      </main>

      <style jsx global>{`
        .dashboard-grid {
          grid-template-columns: 1fr !important;
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
