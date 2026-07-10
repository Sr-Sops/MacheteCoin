'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MacheteService, Profile, CoinSettings, RoadmapPhase } from '@/lib/supabase';
import { ArrowLeft, Shield, Save, Loader2, Settings, MessageSquare, ListTodo, CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminSupportChats from '@/components/AdminSupportChats';

export default function AdminPanel() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<CoinSettings | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([]);
  const [activeTab, setActiveTab] = useState<'coin' | 'socials' | 'roadmap' | 'users' | 'support'>('coin');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Promotion states
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteLoading, setPromoteLoading] = useState(false);
  const [promoteError, setPromoteError] = useState('');

  // Form states
  const [contractAddress, setContractAddress] = useState('');
  const [blockchainNetwork, setBlockchainNetwork] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [taxBuy, setTaxBuy] = useState(0);
  const [taxSell, setTaxSell] = useState(0);
  const [swapRate, setSwapRate] = useState(0);

  const [twitterUrl, setTwitterUrl] = useState('');
  const [telegramUrl, setTelegramUrl] = useState('');
  const [discordUrl, setDiscordUrl] = useState('');
  const [dexscreenerUrl, setDexscreenerUrl] = useState('');
  const [raydiumUrl, setRaydiumUrl] = useState('');

  useEffect(() => {
    MacheteService.init();
    const loadSessionAndData = async () => {
      const u = await MacheteService.getCurrentUser();
      if (!u || u.role !== 'admin') {
        // Unauthorized, redirect to home/login
        router.push('/');
        return;
      }
      setUser(u);

      // Load Settings and Roadmap
      const s = await MacheteService.getCoinSettings();
      const r = await MacheteService.getRoadmap();
      
      setSettings(s);
      setRoadmap(r);

      // Set General forms
      setContractAddress(s.contract_address);
      setBlockchainNetwork(s.blockchain_network);
      setTotalSupply(s.total_supply);
      setTaxBuy(Number(s.tax_buy));
      setTaxSell(Number(s.tax_sell));
      setSwapRate(Number(s.swap_rate));

      // Set Socials forms
      setTwitterUrl(s.twitter_url);
      setTelegramUrl(s.telegram_url);
      setDiscordUrl(s.discord_url);
      setDexscreenerUrl(s.dexscreener_url);
      setRaydiumUrl(s.raydium_url);

      setLoading(false);
    };
    loadSessionAndData();
  }, [router]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await MacheteService.updateCoinSettings({
      contract_address: contractAddress,
      blockchain_network: blockchainNetwork,
      total_supply: totalSupply,
      tax_buy: Number(taxBuy),
      tax_sell: Number(taxSell),
      swap_rate: Number(swapRate),
    });
    setSaving(false);
    if (result.success) {
      showNotification('¡Parámetros de la moneda actualizados correctamente!');
    }
  };

  const handleSaveSocials = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const result = await MacheteService.updateCoinSettings({
      twitter_url: twitterUrl,
      telegram_url: telegramUrl,
      discord_url: discordUrl,
      dexscreener_url: dexscreenerUrl,
      raydium_url: raydiumUrl,
    });
    setSaving(false);
    if (result.success) {
      showNotification('¡Enlaces sociales actualizados correctamente!');
    }
  };

  const handleStatusChange = async (id: number, status: 'pending' | 'in_progress' | 'completed') => {
    setSaving(true);
    const result = await MacheteService.updateRoadmapPhase(id, { status });
    setSaving(false);
    if (result.success) {
      setRoadmap(prev => prev.map(p => p.id === id ? { ...p, status } : p));
      showNotification('¡Estado de la fase del roadmap actualizado!');
    }
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
          Protegiendo acceso del Administrador...
        </span>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Admin header */}
      {/* Standard Header */}
      <Header 
        twitterUrl={twitterUrl} 
        telegramUrl={telegramUrl} 
        discordUrl={discordUrl} 
      />
      {/* Main body */}
      <main className="container" style={{ flex: 1, padding: '3rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <div>
          <h1 style={{ fontSize: '2rem' }}>Panel de Control del <span className="gold-text-gradient">Administrador</span></h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Modifica los parámetros globales de la web, tokenomics, enlaces de redes sociales y fases del roadmap en tiempo real.
          </p>
        </div>

        {/* Global Notification Banner */}
        {successMsg && (
          <div style={{
            background: 'rgba(0, 255, 102, 0.08)',
            border: '2px solid var(--color-green-neon)',
            borderRadius: '10px',
            padding: '1rem',
            color: 'var(--color-green-neon)',
            fontWeight: 600,
            fontSize: '0.95rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 0 15px rgba(0, 255, 102, 0.2)',
            animation: 'pulse-slow 3s infinite',
          }}>
            <CheckCircle size={18} />
            {successMsg}
          </div>
        )}

        {/* Tab buttons */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          gap: '1rem',
          paddingBottom: '0.5rem',
        }}>
          <button 
            onClick={() => setActiveTab('coin')}
            className="btn"
            style={{
              background: activeTab === 'coin' ? 'rgba(255, 199, 0, 0.1)' : 'transparent',
              color: activeTab === 'coin' ? 'var(--color-gold)' : 'var(--text-secondary)',
              border: activeTab === 'coin' ? '1px solid rgba(255, 199, 0, 0.3)' : 'none',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              borderRadius: '8px',
            }}
          >
            <Settings size={16} style={{ marginRight: '0.25rem' }} />
            Parámetros del Token
          </button>
          
          <button 
            onClick={() => setActiveTab('socials')}
            className="btn"
            style={{
              background: activeTab === 'socials' ? 'rgba(255, 199, 0, 0.1)' : 'transparent',
              color: activeTab === 'socials' ? 'var(--color-gold)' : 'var(--text-secondary)',
              border: activeTab === 'socials' ? '1px solid rgba(255, 199, 0, 0.3)' : 'none',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              borderRadius: '8px',
            }}
          >
            <MessageSquare size={16} style={{ marginRight: '0.25rem' }} />
            Redes Sociales y DEX
          </button>

          <button 
            onClick={() => setActiveTab('roadmap')}
            className="btn"
            style={{
              background: activeTab === 'roadmap' ? 'rgba(255, 199, 0, 0.1)' : 'transparent',
              color: activeTab === 'roadmap' ? 'var(--color-gold)' : 'var(--text-secondary)',
              border: activeTab === 'roadmap' ? '1px solid rgba(255, 199, 0, 0.3)' : 'none',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              borderRadius: '8px',
            }}
          >
            <ListTodo size={16} style={{ marginRight: '0.25rem' }} />
            Gestión del Roadmap
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className="btn"
            style={{
              background: activeTab === 'users' ? 'rgba(255, 199, 0, 0.1)' : 'transparent',
              color: activeTab === 'users' ? 'var(--color-gold)' : 'var(--text-secondary)',
              border: activeTab === 'users' ? '1px solid rgba(255, 199, 0, 0.3)' : 'none',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              borderRadius: '8px',
            }}
          >
            <Shield size={16} style={{ marginRight: '0.25rem' }} />
            Usuarios y KYC
          </button>
          
          <button 
            onClick={() => setActiveTab('support')}
            className="btn"
            style={{
              background: activeTab === 'support' ? 'rgba(255, 199, 0, 0.1)' : 'transparent',
              color: activeTab === 'support' ? 'var(--color-gold)' : 'var(--text-secondary)',
              border: activeTab === 'support' ? '1px solid rgba(255, 199, 0, 0.3)' : 'none',
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              borderRadius: '8px',
            }}
          >
            <MessageSquare size={16} style={{ marginRight: '0.25rem' }} />
            Soporte (Chats)
          </button>
        </div>

        {/* Tab Contents */}
        <div style={{ marginTop: '1rem' }}>
          
          {/* Tab 1: Coin settings */}
          {activeTab === 'coin' && (
            <form onSubmit={handleSaveGeneral} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gold)' }}>Editar Parámetros de la Moneda</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="admin-grid">
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Cadena de Bloques (Network)</label>
                  <input 
                    type="text" 
                    value={blockchainNetwork} 
                    onChange={(e) => setBlockchainNetwork(e.target.value)} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Dirección del Contrato (Contract Address)</label>
                  <input 
                    type="text" 
                    value={contractAddress} 
                    onChange={(e) => setContractAddress(e.target.value)} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none', fontFamily: 'monospace' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Suministro Total (Suministro Máximo)</label>
                  <input 
                    type="text" 
                    value={totalSupply} 
                    onChange={(e) => setTotalSupply(e.target.value)} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Swap Rate (Ratio $MACHETE por SOL/USDT)</label>
                  <input 
                    type="number" 
                    value={swapRate} 
                    onChange={(e) => setSwapRate(Number(e.target.value))} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Impuesto Compra (Buy Tax %)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={taxBuy} 
                    onChange={(e) => setTaxBuy(Number(e.target.value))} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Impuesto Venta (Sell Tax %)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={taxSell} 
                    onChange={(e) => setTaxSell(Number(e.target.value))} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none' }}
                  />
                </div>

              </div>

              <button type="submit" disabled={saving} className="btn btn-gold" style={{ alignSelf: 'flex-start', gap: '0.5rem', marginTop: '1rem' }}>
                {saving ? <Loader2 size={16} className="spin-logo" /> : <Save size={16} />}
                Guardar Parámetros
              </button>
            </form>
          )}

          {/* Tab 2: Social Links settings */}
          {activeTab === 'socials' && (
            <form onSubmit={handleSaveSocials} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gold)' }}>Editar Enlaces de Redes Sociales y DEX</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }} className="admin-grid">
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>X / Twitter URL</label>
                  <input 
                    type="url" 
                    value={twitterUrl} 
                    onChange={(e) => setTwitterUrl(e.target.value)} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Telegram URL</label>
                  <input 
                    type="url" 
                    value={telegramUrl} 
                    onChange={(e) => setTelegramUrl(e.target.value)} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Discord URL</label>
                  <input 
                    type="url" 
                    value={discordUrl} 
                    onChange={(e) => setDiscordUrl(e.target.value)} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>DexScreener URL</label>
                  <input 
                    type="url" 
                    value={dexscreenerUrl} 
                    onChange={(e) => setDexscreenerUrl(e.target.value)} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Raydium / Uniswap Exchange URL</label>
                  <input 
                    type="url" 
                    value={raydiumUrl} 
                    onChange={(e) => setRaydiumUrl(e.target.value)} 
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0.65rem 0.85rem', color: '#fff', outline: 'none' }}
                  />
                </div>

              </div>

              <button type="submit" disabled={saving} className="btn btn-gold" style={{ alignSelf: 'flex-start', gap: '0.5rem', marginTop: '1rem' }}>
                {saving ? <Loader2 size={16} className="spin-logo" /> : <Save size={16} />}
                Guardar Enlaces
              </button>
            </form>
          )}

          {/* Tab 3: Roadmap status management */}
          {activeTab === 'roadmap' && (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gold)' }}>Gestionar Fases del Roadmap</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Cambia el estado de finalización de cada hito para actualizar la línea de tiempo pública.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '0.5rem' }}>
                {roadmap.map((phase) => (
                  <div key={phase.id} style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 700 }}>FASE {phase.phase_number}</span>
                        <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)' }}>{phase.title}</h4>
                      </div>
                      
                      {/* State Dropdown Selector */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Estado:</span>
                        <select 
                          value={phase.status}
                          onChange={(e) => handleStatusChange(phase.id, e.target.value as any)}
                          style={{
                            background: 'var(--bg-jungle-light)',
                            border: '1px solid rgba(255,199,0,0.15)',
                            color: '#fff',
                            padding: '0.35rem 0.5rem',
                            borderRadius: '6px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          <option value="pending">Pendiente</option>
                          <option value="in_progress">En Desarrollo</option>
                          <option value="completed">Completado</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <strong>Hitos incluidos:</strong>
                      <ul style={{ paddingLeft: '1.25rem', marginTop: '0.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {phase.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: Users Promotion */}
          {activeTab === 'users' && (
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--color-gold)' }}>Promover otro Administrador</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                Introduce el correo electrónico de un usuario registrado en la base de datos para promover su rol a **Administrador (Admin)**. Este nuevo administrador tendrá acceso a todos los paneles y configuraciones del sitio.
              </p>

              <form 
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!promoteEmail) return;
                  setPromoteLoading(true);
                  setPromoteError('');
                  try {
                    const res = await MacheteService.promoteUserByEmail(promoteEmail);
                    if (res.success) {
                      showNotification(`¡Usuario ${promoteEmail} promovido a Administrador con éxito!`);
                      setPromoteEmail('');
                    } else {
                      setPromoteError(res.error || 'Error al promover usuario.');
                    }
                  } catch (err: any) {
                    setPromoteError(err?.message || String(err));
                  } finally {
                    setPromoteLoading(false);
                  }
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '480px' }}
              >
                {promoteError && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.25)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.9rem',
                    color: '#f87171',
                    fontSize: '0.8rem',
                  }}>
                    {promoteError}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label htmlFor="promoteEmail" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Correo Electrónico del Usuario
                  </label>
                  <input 
                    type="email" 
                    id="promoteEmail"
                    required
                    placeholder="usuario-a-promover@gmail.com"
                    value={promoteEmail}
                    onChange={(e) => setPromoteEmail(e.target.value)}
                    style={{
                      background: 'rgba(0,0,0,0.25)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      padding: '0.7rem 1rem',
                      color: 'var(--text-primary)',
                      fontSize: '0.9rem',
                      outline: 'none',
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={promoteLoading || !promoteEmail}
                  className="btn btn-gold"
                  style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {promoteLoading ? <Loader2 size={16} className="spin-logo" /> : null}
                  Hacer Administrador
                </button>
              </form>
            </div>
          )}

          {/* Tab 5: Support Chats */}
          {activeTab === 'support' && (
            <AdminSupportChats />
          )}

        </div>

      </main>

      {/* Standard Footer */}
      <Footer 
        twitterUrl={twitterUrl} 
        telegramUrl={telegramUrl} 
        discordUrl={discordUrl} 
      />

      <style jsx global>{`
        .admin-grid {
          grid-template-columns: 1fr !important;
        }
        @media (min-width: 768px) {
          .admin-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
