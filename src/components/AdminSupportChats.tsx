'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabaseClient } from '@/lib/supabase';
import { Loader2, MessageSquare, Send, XCircle, Download } from 'lucide-react';

export default function AdminSupportChats() {
  const [chats, setChats] = useState<any[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    loadAdminUser();
    loadChats();

    // Listen for new chats
    if (supabaseClient) {
      const chatsChannel = supabaseClient
        .channel('admin_support_chats')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'support_chats' },
          () => {
            loadChats(); // Reload chats when any change occurs (new chat or updated status)
          }
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
          id, status, created_at, updated_at, user_id
        `)
        .order('updated_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching support chats:', error);
      }
      
      if (!error && data) {
        // Fetch profiles separately to avoid PostgREST foreign key relationship errors with auth.users
        const userIds = data.map(c => c.user_id).filter(Boolean);
        let profilesData: any[] = [];
        if (userIds.length > 0) {
          const { data: pData } = await supabaseClient
            .from('profiles')
            .select('id, username, email, avatar_url')
            .in('id', userIds);
          profilesData = pData || [];
        }

        const chatsWithProfiles = data.map(chat => ({
          ...chat,
          profiles: profilesData.find(p => p.id === chat.user_id) || null
        }));

        setChats(chatsWithProfiles);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingChats(false);
  };

  useEffect(() => {
    if (!selectedChatId || !supabaseClient) return;

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
    } catch (e) {
      console.error(e);
    }
    setLoadingMessages(false);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleCloseChat = async (chatId: string) => {
    if (!supabaseClient) return;
    try {
      await supabaseClient.from('support_chats').update({ status: 'closed' }).eq('id', chatId);
      setChats(prev => prev.map(c => c.id === chatId ? { ...c, status: 'closed' } : c));
      if (selectedChatId === chatId) {
        setSelectedChatId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportChat = () => {
    const selectedChat = chats.find(c => c.id === selectedChatId);
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

  const selectedChat = chats.find(c => c.id === selectedChatId);

  return (
    <div style={{ display: 'flex', height: '600px', background: 'rgba(5, 10, 7, 0.5)', border: '1px solid rgba(255, 199, 0, 0.1)', borderRadius: '12px', overflow: 'hidden' }}>
      {/* Sidebar - Chat List */}
      <div style={{ width: '300px', borderRight: '1px solid rgba(255, 199, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255, 199, 0, 0.1)', background: 'rgba(255, 199, 0, 0.05)' }}>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={18} /> Conversaciones
          </h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingChats ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando chats...</div>
          ) : chats.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No hay conversaciones abiertas.
            </div>
          ) : (
            chats.map(chat => (
              <div 
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  background: selectedChatId === chat.id ? 'rgba(255,199,0,0.1)' : 'transparent',
                  transition: 'background 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                    {chat.profiles?.username || 'Usuario'}
                  </span>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    padding: '0.1rem 0.4rem', 
                    borderRadius: '4px',
                    background: chat.status === 'open' ? 'rgba(0, 255, 102, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: chat.status === 'open' ? 'var(--color-green-neon)' : '#f87171'
                  }}>
                    {chat.status === 'open' ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {chat.profiles?.email}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedChatId && selectedChat ? (
          <>
            <div style={{ padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Chat con <span style={{ color: 'var(--color-gold)' }}>{selectedChat.profiles?.username || 'Usuario'}</span>
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selectedChat.profiles?.email}</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={handleExportChat}
                  style={{ background: 'rgba(255, 199, 0, 0.1)', border: '1px solid rgba(255, 199, 0, 0.3)', color: 'var(--color-gold)', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <Download size={14} /> Guardar TXT
                </button>
                {selectedChat.status === 'open' && (
                  <button 
                    onClick={() => handleCloseChat(selectedChat.id)}
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <XCircle size={14} /> Cerrar Chat
                  </button>
                )}
              </div>
            </div>

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
                messages.map((msg) => {
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
                        {isAdmin ? 'Tú (Admin)' : (selectedChat.profiles?.username || 'Usuario')}
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

            {selectedChat.status === 'open' && (
              <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '0.75rem', background: 'rgba(0,0,0,0.4)' }}>
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  style={{
                    flex: 1,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
                <button type="submit" disabled={!inputValue.trim()} className="btn btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0 1.25rem' }}>
                  <Send size={18} /> Enviar
                </button>
              </form>
            )}
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary)' }}>
            <MessageSquare size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <p>Selecciona una conversación del panel lateral</p>
          </div>
        )}
      </div>

    </div>
  );
}
