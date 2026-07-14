'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabaseClient } from '@/lib/supabase';
import { Loader2, MessageSquare, Send, XCircle, Download, Trash2, Clock, CheckCircle } from 'lucide-react';

interface AdminSupportChatsProps {
  forceChatUserId?: string | null;
  onChatForced?: () => void;
}

export default function AdminSupportChats({ forceChatUserId, onChatForced }: AdminSupportChatsProps) {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [activeRightTab, setActiveRightTab] = useState<'current' | 'history'>('current');
  const [viewingHistoryChatId, setViewingHistoryChatId] = useState<string | null>(null);

  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  const [showUserModal, setShowUserModal] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    loadAdminUser();
    loadChats();

    if (supabaseClient) {
      const chatsChannel = supabaseClient
        .channel('admin_support_chats')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'support_chats' },
          () => loadChats()
        )
        .subscribe();

      return () => {
        supabaseClient?.removeChannel(chatsChannel);
      };
    }
  }, []);

  const loadAdminUser = async () => {
    if (supabaseClient) {
      const { data } = await supabaseClient.auth.getUser();
      setAdminUser(data?.user);
    }
  };

  const loadChats = async () => {
    if (!supabaseClient) return;
    setLoadingChats(true);
    try {
      const { data, error } = await supabaseClient
        .from('support_chats')
        .select(`
          id, status, created_at, updated_at, user_id,
          support_messages (id)
        `)
        .order('updated_at', { ascending: false });
      
      if (!error && data) {
        // We keep all chats. Even empty ones if they are open. Closed empty chats are ignored.
        const validChats = data.filter(chat => (chat.support_messages && chat.support_messages.length > 0) || chat.status === 'open');

        const userIds = validChats.map(c => c.user_id).filter(Boolean);
        let profilesData: any[] = [];
        if (userIds.length > 0) {
          const { data: pData } = await supabaseClient
            .from('profiles')
            .select('id, username, email, avatar_url')
            .in('id', userIds);
          profilesData = pData || [];
        }

        const chatsWithProfiles = validChats.map(chat => ({
          ...chat,
          profiles: profilesData.find(p => p.id === chat.user_id) || null
        }));

        setChats(chatsWithProfiles);
      }
    } catch (e) { console.error(e); }
    setLoadingChats(false);
  };

  // Resolve current open chat and selected chat
  const currentOpenChat = chats.find(c => c.user_id === selectedUserId && c.status === 'open');
  const selectedChatId = activeRightTab === 'current' ? currentOpenChat?.id : viewingHistoryChatId;
  const selectedChat = chats.find(c => c.id === selectedChatId);

  useEffect(() => {
    if (!selectedChatId || !supabaseClient) {
      setMessages([]);
      return;
    }

    loadMessages(selectedChatId);

    const channel = supabaseClient
      .channel(`admin_chat_${selectedChatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `chat_id=eq.${selectedChatId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabaseClient?.removeChannel(channel);
    };
  }, [selectedChatId]);

  useEffect(() => {
    if (forceChatUserId) {
      setSelectedUserId(forceChatUserId);
      setActiveRightTab('current');
      setViewingHistoryChatId(null);
      if (onChatForced) onChatForced();
    }
  }, [forceChatUserId, onChatForced]);

  const loadMessages = async (chatId: string) => {
    if (!supabaseClient) return;
    setLoadingMessages(true);
    try {
      const { data, error } = await supabaseClient
        .from('support_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });
      
      if (!error && data) {
        setMessages(data);
        scrollToBottom();

        // Mark as read
        if (adminUser) {
          await supabaseClient
            .from('support_messages')
            .update({ is_read: true })
            .eq('chat_id', chatId)
            .neq('sender_id', adminUser.id)
            .eq('is_read', false);
        }
      }
    } catch (e) { console.error(e); }
    setLoadingMessages(false);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedChatId || !adminUser || !supabaseClient) return;

    const messageText = inputValue.trim();
    setInputValue('');

    try {
      await supabaseClient
        .from('support_messages')
        .insert({
          chat_id: selectedChatId,
          sender_id: adminUser.id,
          message: messageText
        });
      await supabaseClient.from('support_chats').update({ updated_at: new Date().toISOString() }).eq('id', selectedChatId);
    } catch (err) { console.error('Error sending message:', err); }
  };

  const handleCloseChat = async (chatId: string) => {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('support_chats').update({ status: 'closed' }).eq('id', chatId);
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, status: 'closed' } : c));
      setActiveRightTab('history');
      setViewingHistoryChatId(chatId);
    } catch (e) { console.error(e); }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!supabaseClient) return;
    if (!window.confirm('¿Estás seguro de que deseas eliminar este chat? Esta acción es irreversible y borrará todos los mensajes.')) return;
    try {
      await supabaseClient.from('support_chats').delete().eq('id', chatId);
      setChats(prev => prev.filter(c => c.id !== chatId));
      if (viewingHistoryChatId === chatId) {
        setViewingHistoryChatId(null);
      }
    } catch (e) { console.error(e); }
  };

  const handleCreateNewChatForSelectedUser = async () => {
    if (!selectedUserId || !supabaseClient) return;
    try {
      const { data: newChat, error } = await supabaseClient
        .from('support_chats')
        .insert({ user_id: selectedUserId, status: 'open' })
        .select()
        .single();
        
      if (!error && newChat) {
        const selectedUserProfile = chats.find(c => c.user_id === selectedUserId)?.profiles;
        setChats(prev => [{ ...newChat, profiles: selectedUserProfile, support_messages: [] }, ...prev]);
        setActiveRightTab('current');
      }
    } catch (e) { console.error(e); }
  };

  const handleExportChat = () => {
    if (!selectedChatId || !selectedChat) return;
    
    let content = `Registro de Chat - MacheteCoin Support\n`;
    content += `Usuario: ${selectedChat.profiles?.username || 'Desconocido'}\n`;
    content += `Email: ${selectedChat.profiles?.email || 'Desconocido'}\n`;
    content += `ID Usuario: ${selectedChat.profiles?.id || 'Desconocido'}\n`;
    content += `ID Chat: ${selectedChat.id}\n`;
    content += `Estado: ${selectedChat.status}\n`;
    content += `Fecha de exportación: ${new Date().toLocaleString()}\n\n`;
    content += `--- MENSAJES ---\n\n`;
    
    messages.forEach(msg => {
      const isAdmin = msg.sender_id === adminUser?.id;
      const senderName = isAdmin ? 'Soporte (Admin)' : (selectedChat.profiles?.username || 'Usuario');
      const date = new Date(msg.created_at).toLocaleString();
      content += `[${date}] ${senderName}:\n${msg.message}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const username = selectedChat.profiles?.username || 'usuario';
    const userId = selectedChat.profiles?.id || 'desconocido';
    link.download = `log_chat_${username}_${userId.substring(0,8)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Group unique users from chats
  const uniqueUsers = Array.from(new Map(chats.filter(c => c.profiles).map(chat => [chat.user_id, chat.profiles])).values());

  return (
    <div style={{ display: 'flex', height: '600px', background: 'rgba(5, 10, 7, 0.5)', border: '1px solid rgba(255, 199, 0, 0.1)', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Sidebar - Users List */}
      <div style={{ width: '300px', borderRight: '1px solid rgba(255, 199, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255, 199, 0, 0.1)', background: 'rgba(255, 199, 0, 0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} /> Usuarios
            <button 
              onClick={() => { const a = new Audio('/sounds/machete.mp3'); a.play().catch(e => console.error(e)); }} 
              style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              title="Probar sonido"
            >🔔</button>
          </h2>
          <button 
            onClick={async () => {
              setShowUserModal(true);
              setLoadingUsers(true);
              if (supabaseClient) {
                const { data } = await supabaseClient.from('profiles').select('id, username, email').order('username', { ascending: true });
                if (data) setUserList(data);
              }
              setLoadingUsers(false);
            }}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-gold)',
              color: 'var(--color-gold)',
              padding: '0.3rem 0.6rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              cursor: 'pointer'
            }}
          >
            + Nuevo Ticket
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingChats ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando...</div>
          ) : uniqueUsers.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No hay usuarios con tickets.
            </div>
          ) : (
            uniqueUsers.map(user => {
              const userChats = chats.filter(c => c.user_id === user.id);
              const hasOpen = userChats.some(c => c.status === 'open');
              return (
                <div 
                  key={user.id}
                  onClick={() => { setSelectedUserId(user.id); setActiveRightTab('current'); setViewingHistoryChatId(null); }}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    background: selectedUserId === user.id ? 'rgba(255,199,0,0.1)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {user.username || 'Usuario'}
                    </span>
                    {hasOpen ? (
                      <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(0, 255, 102, 0.1)', color: 'var(--color-green-neon)' }}>
                        Abierto
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>
                        Historial
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {user.email}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!selectedUserId ? (
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
            Selecciona un usuario de la lista para ver sus tickets.
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 199, 0, 0.1)' }}>
              <button
                onClick={() => { setActiveRightTab('current'); setViewingHistoryChatId(null); }}
                style={{
                  flex: 1, padding: '1rem', background: activeRightTab === 'current' ? 'rgba(255, 199, 0, 0.1)' : 'transparent',
                  color: activeRightTab === 'current' ? 'var(--color-gold)' : 'var(--text-secondary)',
                  border: 'none', borderBottom: activeRightTab === 'current' ? '2px solid var(--color-gold)' : '2px solid transparent',
                  cursor: 'pointer', fontWeight: activeRightTab === 'current' ? 'bold' : 'normal',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <MessageSquare size={16} /> Chat Actual
              </button>
              <button
                onClick={() => { setActiveRightTab('history'); setViewingHistoryChatId(null); }}
                style={{
                  flex: 1, padding: '1rem', background: activeRightTab === 'history' ? 'rgba(255, 199, 0, 0.1)' : 'transparent',
                  color: activeRightTab === 'history' ? 'var(--color-gold)' : 'var(--text-secondary)',
                  border: 'none', borderBottom: activeRightTab === 'history' ? '2px solid var(--color-gold)' : '2px solid transparent',
                  cursor: 'pointer', fontWeight: activeRightTab === 'history' ? 'bold' : 'normal',
                  display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <Clock size={16} /> Historial
              </button>
            </div>

            {/* Content Area */}
            {activeRightTab === 'current' ? (
              !currentOpenChat ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)', gap: '1rem' }}>
                  <p>Este usuario no tiene un ticket abierto actualmente.</p>
                  <button onClick={handleCreateNewChatForSelectedUser} className="btn btn-gold">
                    + Iniciar Nuevo Chat
                  </button>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-green-neon)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle size={14} /> Ticket Activo ({currentOpenChat.id.substring(0,8)})
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={handleExportChat} style={{ background: 'rgba(255, 199, 0, 0.1)', border: '1px solid rgba(255, 199, 0, 0.3)', color: 'var(--color-gold)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Download size={14} /> Guardar TXT
                      </button>
                      <button onClick={() => handleCloseChat(currentOpenChat.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <XCircle size={14} /> Cerrar Chat
                      </button>
                    </div>
                  </div>
                  <MessageList messages={messages} loadingMessages={loadingMessages} adminUser={adminUser} messagesEndRef={messagesEndRef} selectedChat={currentOpenChat} />
                  <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.4)' }}>
                    <input 
                      type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--text-primary)', outline: 'none' }}
                    />
                    <button type="submit" disabled={!inputValue.trim()} className="btn btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: inputValue.trim() ? 1 : 0.5, cursor: inputValue.trim() ? 'pointer' : 'not-allowed' }}>
                      <Send size={18} /> Enviar
                    </button>
                  </form>
                </div>
              )
            ) : (
              // Historial Tab
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                {!viewingHistoryChatId ? (
                  <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                    {chats.filter(c => c.user_id === selectedUserId && c.status === 'closed').length === 0 ? (
                      <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>No hay chats cerrados en el historial de este usuario.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {chats.filter(c => c.user_id === selectedUserId && c.status === 'closed').map(closedChat => (
                          <div 
                            key={closedChat.id} 
                            onClick={() => setViewingHistoryChatId(closedChat.id)}
                            style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                          >
                            <div>
                              <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Ticket Cerrado</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ID: {closedChat.id.substring(0,13)}...</div>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                              {new Date(closedChat.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button onClick={() => setViewingHistoryChatId(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem' }}>
                        ← Volver a la lista
                      </button>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={handleExportChat} style={{ background: 'rgba(255, 199, 0, 0.1)', border: '1px solid rgba(255, 199, 0, 0.3)', color: 'var(--color-gold)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Download size={14} /> Guardar TXT
                        </button>
                        <button onClick={() => handleDeleteChat(viewingHistoryChatId)} style={{ background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Trash2 size={14} /> Eliminar Chat
                        </button>
                      </div>
                    </div>
                    <MessageList messages={messages} loadingMessages={loadingMessages} adminUser={adminUser} messagesEndRef={messagesEndRef} selectedChat={selectedChat!} />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* User Selection Modal (New Ticket) */}
      {showUserModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }} onClick={() => setShowUserModal(false)} />
          <div style={{ background: '#0a100d', border: '1px solid rgba(255, 199, 0, 0.2)', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px', position: 'relative', zIndex: 101, display: 'flex', flexDirection: 'column', maxHeight: '80vh' }}>
            <button onClick={() => setShowUserModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <XCircle size={24} />
            </button>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>Iniciar Nuevo Ticket</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Busca y selecciona un usuario para iniciar una nueva conversación de soporte.</p>
            
            <input 
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '0.75rem 1rem', color: 'var(--text-primary)', outline: 'none', marginBottom: '1rem' }}
            />

            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
              {loadingUsers ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="spin-logo" /></div>
              ) : (
                userList.filter(u => 
                  (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                  (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
                ).map(u => (
                  <div 
                    key={u.id}
                    onClick={async () => {
                      setShowUserModal(false);
                      try {
                        const { data: existingChats } = await supabaseClient!.from('support_chats').select('*').eq('user_id', u.id).eq('status', 'open').limit(1);
                        if (existingChats && existingChats.length > 0) {
                          setSelectedUserId(u.id);
                          setActiveRightTab('current');
                        } else {
                          const { data: newChat, error } = await supabaseClient!.from('support_chats').insert({ user_id: u.id, status: 'open' }).select().single();
                          if (!error && newChat) {
                            setChats(prev => [{ ...newChat, profiles: u, support_messages: [] }, ...prev]);
                            setSelectedUserId(u.id);
                            setActiveRightTab('current');
                          }
                        }
                      } catch(e) { console.error(e); }
                    }}
                    style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s', background: 'transparent' }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,199,0,0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{u.username || 'Usuario'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function MessageList({ messages, loadingMessages, adminUser, messagesEndRef, selectedChat }: any) {
  return (
    <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {loadingMessages ? (
         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
           <Loader2 className="spin-logo" size={24} style={{ color: 'var(--color-gold)' }} />
         </div>
      ) : messages.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 'auto', marginBottom: 'auto' }}>
          Aún no hay mensajes en este chat.
        </div>
      ) : (
        messages.map((msg: any) => {
          const isAdmin = msg.sender_id === adminUser?.id;
          return (
            <div key={msg.id} style={{ 
              alignSelf: isAdmin ? 'flex-end' : 'flex-start',
              maxWidth: '75%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: isAdmin ? 'flex-end' : 'flex-start'
            }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', padding: '0 0.2rem' }}>
                {isAdmin ? 'Tú (Admin)' : (selectedChat?.profiles?.username || 'Usuario')}
              </span>
              <div style={{
                padding: '0.6rem 0.85rem',
                borderRadius: '12px',
                background: isAdmin ? 'rgba(255, 199, 0, 0.15)' : 'rgba(255,255,255,0.05)',
                color: 'var(--text-primary)',
                border: `1px solid ${isAdmin ? 'rgba(255, 199, 0, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                borderBottomRightRadius: isAdmin ? '2px' : '12px',
                borderBottomLeftRadius: !isAdmin ? '2px' : '12px',
                fontSize: '0.9rem',
                lineHeight: 1.4,
                wordBreak: 'break-word'
              }}>
                {msg.message}
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
