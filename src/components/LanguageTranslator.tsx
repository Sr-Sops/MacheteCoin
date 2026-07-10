'use client';

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const LANGUAGES = [
  { code: 'es', name: 'ES', flag: '🇪🇸' },
  { code: 'en', name: 'EN', flag: '🇺🇸' },
  { code: 'fr', name: 'FR', flag: '🇫🇷' },
  { code: 'de', name: 'DE', flag: '🇩🇪' },
  { code: 'it', name: 'IT', flag: '🇮🇹' },
  { code: 'pt', name: 'PT', flag: '🇧🇷' },
  { code: 'zh-CN', name: 'ZH', flag: '🇨🇳' },
];

export default function LanguageTranslator() {
  const [activeLang, setActiveLang] = useState('es');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if script is already injected
    if (!document.getElementById('google-translate-script')) {
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            { 
              pageLanguage: 'es', 
              includedLanguages: LANGUAGES.map(l => l.code).join(','),
              autoDisplay: false
            },
            'google_translate_element'
          );
        }
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
    
    // Check cookies to see if language is already selected
    const match = document.cookie.match(/googtrans=\/es\/([a-zA-Z-]+)/);
    if (match && match[1]) {
      setActiveLang(match[1]);
    }
  }, []);

  const handleTranslate = (langCode: string) => {
    setActiveLang(langCode);
    setIsOpen(false);
    
    // The standard way to programmatically change Google Translate
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    } else {
      // Fallback: set cookie and reload
      if (langCode === 'es') {
        document.cookie = "googtrans=/es/es; path=/; domain=" + window.location.hostname;
        document.cookie = "googtrans=/es/es; path=/;";
      } else {
        document.cookie = `googtrans=/es/${langCode}; path=/; domain=` + window.location.hostname;
        document.cookie = `googtrans=/es/${langCode}; path=/;`;
      }
      window.location.reload();
    }
  };

  const activeOption = LANGUAGES.find(l => l.code === activeLang) || LANGUAGES[0];

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Hidden original google translate element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      {/* Global CSS overrides to hide Google's top bar and tooltips */}
      <style dangerouslySetInnerHTML={{__html: `
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        body { top: 0px !important; }
        #goog-gt-tt { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
      `}} />

      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          padding: '0.4rem 0.8rem', borderRadius: '50px', cursor: 'pointer',
          color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600,
          transition: 'all 0.3s ease'
        }}
        className="lang-btn-hover"
      >
        <span style={{ fontSize: '1.1rem' }}>{activeOption.flag}</span>
        <span>{activeOption.name}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
          marginBottom: '0.5rem', background: '#0a140f', border: '1px solid rgba(255,199,0,0.3)',
          borderRadius: '12px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100, minWidth: '100px'
        }}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleTranslate(lang.code)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: activeLang === lang.code ? 'rgba(255,199,0,0.1)' : 'transparent',
                border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer',
                color: activeLang === lang.code ? 'var(--color-gold)' : 'var(--text-secondary)',
                fontSize: '0.85rem', fontWeight: 600, width: '100%', textAlign: 'left',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = activeLang === lang.code ? 'rgba(255,199,0,0.1)' : 'transparent'}
            >
              <span style={{ fontSize: '1.1rem' }}>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
