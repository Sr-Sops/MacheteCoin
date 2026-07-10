'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, User, Loader2 } from 'lucide-react';
import { supabaseClient, Profile } from '@/lib/supabase';

export default function SupportChatWidget({ user }: { user: Profile | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat and messages when opened
  useEffect(() => {
    if (isOpen && user && supabaseClient) {
      loadChat();
    }
  }, [isOpen, user]);

  // Realtime subscription for new messages
  useEffect(() => {
    if (!chatId || !supabaseClient) return;

    const channel = supabaseClient
      .channel(`chat_${chatId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'support_messages', filter: `chat_id=eq.${chatId}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabaseClient?.removeChannel(channel);
    };
  }, [chatId]);

  const loadChat = async () => {
    if (!user || !supabaseClient) return;
    setLoading(true);

    try {
      // Find active chat for user
      const { data: chatData, error: chatError } = await supabaseClient
        .from('support_chats')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'open')
        .maybeSingle();

      let activeChatId = chatData?.id;

      if (!activeChatId) {
        // Create new chat
        const { data: newChat, error: newChatError } = await supabaseClient
          .from('support_chats')
          .insert({ user_id: user.id, status: 'open' })
          .select()
          .single();

        if (newChatError) throw newChatError;
        activeChatId = newChat?.id;
      }

      setChatId(activeChatId);

      // Load messages
      if (activeChatId) {
        const { data: msgData, error: msgError } = await supabaseClient
          .from('support_messages')
          .select('*')
          .eq('chat_id', activeChatId)
          .order('created_at', { ascending: true });

        if (!msgError && msgData) {
          setMessages(msgData);
          scrollToBottom();
        }
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatId || !user || !supabaseClient) return;

    const messageText = inputValue.trim();
    setInputValue('');

    try {
      await supabaseClient
        .from('support_messages')
        .insert({
          chat_id: chatId,
          sender_id: user.id,
          message: messageText
        });
      // Updating chat's updated_at
      await supabaseClient.from('support_chats').update({ updated_at: new Date().toISOString() }).eq('id', chatId);

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

  // Only show if user is logged in
  if (!user) return null;

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
      
      {isOpen ? (
        <div className="glass-panel" style={{ 
          width: '350px', 
          height: '500px', 
          display: 'flex', 
          flexDirection: 'column',
          border: '1px solid rgba(255, 199, 0, 0.2)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
          overflow: 'hidden'
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
                <MessageSquare size={16} style={{ color: '#000' }} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                Soporte en Vivo
              </h3>
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

          {/* Input Area */}
          <form onSubmit={handleSendMessage} style={{ 
            padding: '0.75rem', 
            background: 'rgba(0,0,0,0.6)', 
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Escribe tu mensaje..."
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '0.5rem 1rem',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
            <button type="submit" disabled={!inputValue.trim()} style={{
              background: inputValue.trim() ? 'var(--color-gold)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
              color: inputValue.trim() ? '#000' : 'rgba(255,255,255,0.3)',
              transition: 'all 0.2s ease'
            }}>
              <Send size={16} />
            </button>
          </form>

        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            background: 'var(--color-gold)',
            border: 'none',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(255, 199, 0, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            color: '#000'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <MessageSquare size={28} />
        </button>
      )}

    </div>
  );
}
