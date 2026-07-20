'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Loader2 } from 'lucide-react';
import { supabaseClient, Profile } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SupportChatWidget({ user }: { user: Profile | null }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [unreadCount, setUnreadCount] = useState(0);

  // Initialize: check if there's an active chat without creating one
  useEffect(() => {
    if (user && supabaseClient) {
      checkActiveChat();

      // Listen for newly created tickets by admin for this user
      const chatChannel = supabaseClient
        .channel(`user_chats_${user.id}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'support_tickets', filter: `user_id=eq.${user.id}` },
          (payload) => {
            if (payload.new.status === 'open') {
              setChatId(payload.new.id);
              loadMessages(payload.new.id);
            }
          }
        )
        .subscribe();

      return () => {
        supabaseClient?.removeChannel(chatChannel);
      };
    }
  }, [user]);

  // When opened, if chat exists, mark read.
  useEffect(() => {
    if (isOpen && user && supabaseClient) {
      if (chatId) {
        markMessagesAsRead();
      }
    }
  }, [isOpen, user, chatId]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!chatId || !supabaseClient) return;

    const channel = supabaseClient
      .channel(`chat_${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `ticket_id=eq.${chatId}` },
        (payload) => {
          const newMsg = payload.new as any;
          setMessages((prev) => [...prev, newMsg]);
          
          if (!isOpen && newMsg.sender_id !== user?.id) {
            setUnreadCount(prev => prev + 1);
          } else if (isOpen && newMsg.sender_id !== user?.id) {
            // mark as read immediately if open
            supabaseClient?.from('support_messages').update({ is_read: true }).eq('id', newMsg.id).then();
          }

          if (newMsg.sender_id !== user?.id) {
            try {
              if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(e => console.error("Audio play error:", e));
              }
            } catch(e) {}
          }
          
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'support_tickets', filter: `id=eq.${chatId}` },
        () => {
          setChatId(null);
          setMessages([]);
          setIsOpen(false);
          setUnreadCount(0);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'support_tickets', filter: `id=eq.${chatId}` },
        (payload) => {
          if (payload.new.status === 'closed') {
            setChatId(null);
            setMessages([]);
            setIsOpen(false);
            setUnreadCount(0);
          }
        }
      )
      .subscribe();

    return () => {
      supabaseClient?.removeChannel(channel);
    };
  }, [chatId]);

  const checkActiveChat = async () => {
    if (!user || !supabaseClient) return;
    try {
      const { data: chatData } = await supabaseClient
        .from('support_tickets')
        .select('id')
        .eq('user_id', user.id)
        .eq('status', 'open')
        .maybeSingle();

      if (chatData?.id) {
        setChatId(chatData.id);
        await loadMessages(chatData.id);
      }
    } catch (e) {
      console.error(e);
    }
  };



  const loadMessages = async (activeChatId: string) => {
    if (!supabaseClient) return;
    const { data: msgData, error: msgError } = await supabaseClient
      .from('support_messages')
      .select('*')
      .eq('ticket_id', activeChatId)
      .order('created_at', { ascending: true });

    if (!msgError && msgData) {
      setMessages(msgData);
      
      // Calculate unread
      const unread = msgData.filter(m => !m.is_read && m.sender_id !== user?.id).length;
      setUnreadCount(unread);
      
      if (isOpen && unread > 0) {
        markMessagesAsRead(activeChatId);
      }
    }
  };

  const markMessagesAsRead = async (targetChatId?: string) => {
    const id = targetChatId || chatId;
    if (!id || !user || !supabaseClient) return;
    
    setUnreadCount(0);
    // In support_messages we check if there's an is_read column, but let's safely ignore if not
    await supabaseClient
      .from('support_messages')
      .update({ is_read: true })
      .eq('ticket_id', id)
      .neq('sender_id', user.id)
      .eq('is_read', false);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !user || !supabaseClient) return;

    const messageText = inputValue.trim();
    setInputValue('');

    try {
      let activeChatId = chatId;

      // Lazily create chat if it doesn't exist
      if (!activeChatId) {
        const { data: newChat, error: newChatError } = await supabaseClient
          .from('support_tickets')
          .insert({ user_id: user.id, username: user.username, status: 'open' })
          .select()
          .single();
          
        if (newChatError) throw newChatError;
        activeChatId = newChat.id;
        setChatId(newChat.id);
      }

      await supabaseClient
        .from('support_messages')
        .insert({
          ticket_id: activeChatId,
          sender_id: user.id,
          message: messageText,
          is_admin: false
        });
      // Assuming we don't need updated_at for support_tickets as per new schema

      // Send email notification via API
      fetch('/api/notify-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          message: messageText
        })
      }).catch(err => console.error('Failed to send notification', err));

    } catch (err) {
      console.error('Error sending message:', err);
    }
  };


  return (
    <>
      <audio ref={audioRef} src="/sounds/machete.mp3" preload="auto" />
      <div style={{ position: 'fixed', bottom: '4.5rem', right: '2rem', zIndex: 9999 }}>
      
      {isOpen ? (
        <div style={{ 
          width: '350px', 
          maxWidth: 'calc(100vw - 3rem)',
          height: '500px', 
          maxHeight: '80vh',
          display: 'flex', 
          flexDirection: 'column',
          background: '#050a07', // Solid background instead of transparent
          border: '1px solid rgba(255, 199, 0, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          position: 'absolute',
          bottom: '80px',
          right: '0'
        }}>
          {/* Header */}
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(255, 199, 0, 0.1)', 
            borderBottom: '1px solid rgba(255, 199, 0, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ background: 'var(--color-gold)', borderRadius: '50%', padding: '0.3rem' }}>
                <MessageSquare size={20} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                <span style={{ fontWeight: 'bold' }}>Soporte en Vivo</span>
              </h3>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.play().catch(e => console.error(e));
                  }
                }} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginLeft: '0.5rem' }}
                title="Probar sonido"
              >🔔</button>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div style={{ 
            flex: 1, 
            padding: '1rem', 
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            background: 'rgba(0,0,0,0.4)'
          }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Loader2 className="spin-logo" size={24} style={{ color: 'var(--color-gold)' }} />
              </div>
            ) : !user ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 'auto', marginBottom: 'auto', padding: '0 1rem' }}>
                <div style={{ background: 'rgba(255,199,0,0.1)', padding: '1rem', borderRadius: '50%', width: '60px', height: '60px', margin: '0 auto 1rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={30} style={{ color: 'var(--color-gold)' }} />
                </div>
                <p style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Para contactar con Soporte, necesitas una cuenta.</p>
                <p style={{ fontSize: '0.8rem' }}>Inicia sesión o regístrate en unos segundos para poder hablar con nosotros.</p>
              </div>
            ) : messages.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 'auto', marginBottom: 'auto' }}>
                <p>Escribe tu mensaje a continuación.</p>
                <p>Un administrador te responderá pronto.</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMe = msg.sender_id === user.id;
                return (
                  <div key={msg.id} style={{ 
                    alignSelf: isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMe ? 'flex-end' : 'flex-start'
                  }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '0.2rem', padding: '0 0.2rem' }}>
                      {isMe ? 'Tú' : 'Admin'}
                    </span>
                    <div style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '12px',
                      background: isMe ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
                      color: isMe ? '#000' : 'var(--text-primary)',
                      borderBottomRightRadius: isMe ? '2px' : '12px',
                      borderBottomLeftRadius: !isMe ? '2px' : '12px',
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

          {/* Chat Input */}
          {!user ? (
            <div style={{ padding: '1rem', borderTop: '1px solid rgba(255, 199, 0, 0.2)', background: 'rgba(255, 199, 0, 0.1)', display: 'flex', justifyContent: 'center' }}>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  router.push('/login');
                }}
                className="btn btn-gold" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
              >
                Ir a Iniciar Sesión
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} style={{ padding: '1rem', borderTop: '1px solid rgba(255, 199, 0, 0.2)', display: 'flex', gap: '0.5rem', background: 'rgba(255, 199, 0, 0.1)' }}>
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Escribe tu mensaje..."
                style={{
                  flex: 1,
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(255, 199, 0, 0.3)',
                  borderRadius: '20px',
                  padding: '0.5rem 1rem',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button type="submit" disabled={!inputValue.trim()} style={{ background: 'var(--color-gold)', color: '#000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Send size={18} />
              </button>
            </form>
          )}

        </div>
      ) : (
        <button 
          onClick={() => {
            setIsOpen(true);
            markMessagesAsRead();
          }}
          style={{
            background: 'var(--color-gold)',
            color: '#000',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(255, 199, 0, 0.4)',
            transition: 'transform 0.2s',
            position: 'relative'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageSquare size={28} />
          {unreadCount > 0 && (
            <div style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: '#ef4444',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              minWidth: '22px',
              height: '22px',
              borderRadius: '11px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              padding: '0 4px'
            }}>
              {unreadCount}
            </div>
          )}
        </button>
      )}

    </div>
    </>
  );
}
