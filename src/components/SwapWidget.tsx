'use client';

import React, { useState, useEffect } from 'react';
import { MacheteService, Profile, CoinSettings } from '@/lib/supabase';
import { ArrowDown, Info, HelpCircle, CheckCircle2, Copy, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface SwapWidgetProps {
  settings: CoinSettings;
}

export default function SwapWidget({ settings }: SwapWidgetProps) {
  const [user, setUser] = useState<Profile | null>(null);
  const [fromToken, setFromToken] = useState<'SOL' | 'USDT'>('SOL');
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [copiedTx, setCopiedTx] = useState(false);

  useEffect(() => {
    // Load session
    const loadSession = async () => {
      const u = await MacheteService.getCurrentUser();
      setUser(u);
    };
    loadSession();
  }, []);

  // Recalculate output amount based on fromAmount, token type, and settings swap_rate
  useEffect(() => {
    const amountNum = parseFloat(fromAmount);
    if (!isNaN(amountNum) && amountNum > 0) {
      // 1 SOL = swap_rate $MACHETE. Let's make 1 USDT = swap_rate / 150 $MACHETE (as SOL is ~150 USD)
      const multiplier = fromToken === 'SOL' ? Number(settings.swap_rate) : Number(settings.swap_rate) / 150;
      setToAmount(amountNum * multiplier);
    } else {
      setToAmount(0);
    }
  }, [fromAmount, fromToken, settings.swap_rate]);

  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const amountNum = parseFloat(fromAmount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    setLoading(true);
    const result = await MacheteService.executeSwap(user.id, fromToken, amountNum, toAmount);
    setLoading(false);

    if (result.success && result.txHash) {
      setTxHash(result.txHash);
      setSuccess(true);
      
      // Update local state balance for immediate feedback
      setUser(prev => prev ? {
        ...prev,
        machete_balance: Number(prev.machete_balance || 0) + toAmount
      } : null);
    }
  };

  const handleCopyTx = () => {
    navigator.clipboard.writeText(txHash);
    setCopiedTx(true);
    setTimeout(() => setCopiedTx(false), 2000);
  };

  const resetSwap = () => {
    setSuccess(false);
    setTxHash('');
    setFromAmount('1');
  };

  return (
    <div className="glass-panel" style={{
      maxWidth: '440px',
      width: '100%',
      margin: '0 auto',
      border: '1px solid rgba(255, 199, 0, 0.25)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      position: 'relative',
    }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Simulador MacheteSwap
        </h3>
        <span style={{ fontSize: '0.75rem', background: 'rgba(0,255,102,0.1)', color: 'var(--color-green-neon)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(0,255,102,0.2)' }}>
          TESTNET MOCK
        </span>
      </div>

      {success ? (
        /* Success Screen */
        <div style={{ textAlign: 'center', padding: '1.5rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{ color: 'var(--color-green-neon)', animation: 'pulse-slow 2s infinite' }}>
            <CheckCircle2 size={64} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>¡Intercambio Completado!</h4>
            <p style={{ fontSize: '0.9rem' }}>Los tokens $MACHETE han sido abonados en tu cuenta.</p>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            padding: '0.75rem',
            borderRadius: '8px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', overflow: 'hidden' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>TX HASH:</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '250px', textAlign: 'left' }}>
                {txHash}
              </span>
            </div>
            <button onClick={handleCopyTx} className="btn" style={{ padding: '0.4rem', background: 'rgba(255,255,255,0.05)', color: 'var(--color-gold)' }}>
              {copiedTx ? <Check size={14} style={{ color: 'var(--color-green-neon)' }} /> : <Copy size={14} />}
            </button>
          </div>

          {user && (
            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              Tu nuevo saldo: <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>{user.machete_balance.toLocaleString()} $MACHETE</span>
            </div>
          )}

          <button onClick={resetSwap} className="btn btn-gold" style={{ width: '100%', marginTop: '0.5rem' }}>
            Realizar Otro Intercambio
          </button>
        </div>
      ) : (
        /* Form Screen */
        <form onSubmit={handleSwap} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          
          {/* Pay Area */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Pagas</span>
              {user && (
                <span>Billetera: <span style={{ color: 'var(--color-gold)' }}>Enlazada</span></span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <input 
                type="number" 
                step="any"
                min="0.00000001"
                value={fromAmount}
                onChange={(e) => setFromAmount(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-title)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  width: '60%',
                }}
              />
              <select 
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value as 'SOL' | 'USDT')}
                style={{
                  background: 'var(--bg-jungle-light)',
                  border: '1px solid rgba(255, 199, 0, 0.2)',
                  color: 'var(--text-primary)',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '8px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="SOL">SOL</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </div>

          {/* Divider Arrow */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '-0.5rem 0' }}>
            <div style={{
              background: 'var(--bg-jungle-light)',
              border: '1px solid rgba(255, 199, 0, 0.2)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-gold)',
              zIndex: 5,
            }}>
              <ArrowDown size={16} />
            </div>
          </div>

          {/* Receive Area */}
          <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.03)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
              <span>Recibes (Estimado)</span>
              {user && (
                <span>Saldo: <span style={{ color: 'var(--color-gold)' }}>{user.machete_balance.toLocaleString()} $MACHETE</span></span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <input 
                type="text" 
                readOnly
                value={toAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  fontSize: '1.5rem',
                  fontFamily: 'var(--font-title)',
                  color: 'var(--color-gold)',
                  fontWeight: 700,
                  width: '70%',
                }}
              />
              <span style={{
                background: 'rgba(255, 199, 0, 0.1)',
                border: '1px solid rgba(255, 199, 0, 0.3)',
                color: 'var(--color-gold)',
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}>
                $MACHETE
              </span>
            </div>
          </div>

          {/* Price details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Precio estimado</span>
              <span>1 SOL = {Number(settings.swap_rate).toLocaleString()} $MACHETE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tolerancia de Deslizamiento (Slippage)</span>
              <span>0.1% (Auto)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Tarifas del Exchange (LP Provider Fee)</span>
              <span>Gratis (Simulado)</span>
            </div>
          </div>

          {/* Compliance Checks & Button CTA */}
          {user ? (
            (() => {
              const isPhoneVerified = !!user.phone_verified;
              const isWalletLinked = !!user.wallet_address;
              const isCompliant = isPhoneVerified && isWalletLinked;

              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  {!isCompliant && (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      border: '1px solid rgba(245, 158, 11, 0.25)',
                      borderRadius: '8px',
                      padding: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      textAlign: 'left'
                    }}>
                      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', color: '#fbbf24', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        <Info size={14} />
                        <span>Operaciones Bloqueadas</span>
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                        Para comprar, vender o retirar $MACHETE debes cumplir los siguientes requisitos en tu cuenta:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.7rem', marginTop: '0.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#4ade80' }}>
                          <CheckCircle2 size={12} />
                          <span>E-mail verificado correctamente</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isPhoneVerified ? '#4ade80' : '#fbbf24' }}>
                          {isPhoneVerified ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          <span>Teléfono móvil verificado ({isPhoneVerified ? 'Listo' : 'Pendiente en Mi Perfil'})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: isWalletLinked ? '#4ade80' : '#fbbf24' }}>
                          {isWalletLinked ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                          <span>Billetera cripto vinculada ({isWalletLinked ? 'Listo' : 'Pendiente en Dashboard'})</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={loading || toAmount <= 0 || !isCompliant}
                    className="btn btn-gold" 
                    style={{ 
                      width: '100%', 
                      opacity: isCompliant ? 1 : 0.5,
                      cursor: isCompliant ? 'pointer' : 'not-allowed'
                    }}
                  >
                    {loading ? 'Procesando Swap...' : isCompliant ? 'Intercambiar (Simulado)' : 'Cumple los Requisitos para Operar'}
                  </button>
                </div>
              );
            })()
          ) : (
            <Link href="/login" className="btn btn-green" style={{ width: '100%', marginTop: '0.5rem', textAlign: 'center' }}>
              Inicia Sesión para Hacer Swap
            </Link>
          )}

        </form>
      )}
    </div>
  );
}
