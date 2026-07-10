'use client';

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const LANGUAGES = [
  { code: 'es', name: 'ES', flag: '🇪🇸', full: 'Español' },
  { code: 'en', name: 'EN', flag: '🇺🇸', full: 'English' },
  { code: 'fr', name: 'FR', flag: '🇫🇷', full: 'Français' },
  { code: 'de', name: 'DE', flag: '🇩🇪', full: 'Deutsch' },
  { code: 'it', name: 'IT', flag: '🇮🇹', full: 'Italiano' },
  { code: 'pt', name: 'PT', flag: '🇧🇷', full: 'Português' },
  { code: 'zh-CN', name: 'ZH', flag: '🇨🇳', full: '中文' },
  { code: 'ja', name: 'JA', flag: '🇯🇵', full: '日本語' },
  { code: 'ko', name: 'KO', flag: '🇰🇷', full: '한국어' },
  { code: 'ru', name: 'RU', flag: '🇷🇺', full: 'Русский' },
  { code: 'ar', name: 'AR', flag: '🇸🇦', full: 'العربية' },
  { code: 'hi', name: 'HI', flag: '🇮🇳', full: 'हिन्दी' },
  { code: 'tr', name: 'TR', flag: '🇹🇷', full: 'Türkçe' },
  { code: 'nl', name: 'NL', flag: '🇳🇱', full: 'Nederlands' },
  { code: 'pl', name: 'PL', flag: '🇵🇱', full: 'Polski' },
  { code: 'sv', name: 'SV', flag: '🇸🇪', full: 'Svenska' },
  { code: 'el', name: 'EL', flag: '🇬🇷', full: 'Ελληνικά' },
  { code: 'th', name: 'TH', flag: '🇹🇭', full: 'ไทย' },
  { code: 'vi', name: 'VI', flag: '🇻🇳', full: 'Tiếng Việt' },
  { code: 'id', name: 'ID', flag: '🇮🇩', full: 'Bahasa Indonesia' },
  { code: 'cs', name: 'CS', flag: '🇨🇿', full: 'Čeština' },
  { code: 'hu', name: 'HU', flag: '🇭🇺', full: 'Magyar' },
  { code: 'ro', name: 'RO', flag: '🇷🇴', full: 'Română' },
  { code: 'uk', name: 'UK', flag: '🇺🇦', full: 'Українська' },
  { code: 'he', name: 'HE', flag: '🇮🇱', full: 'עברית' },
  { code: 'da', name: 'DA', flag: '🇩🇰', full: 'Dansk' },
  { code: 'fi', name: 'FI', flag: '🇫🇮', full: 'Suomi' },
  { code: 'no', name: 'NO', flag: '🇳🇴', full: 'Norsk' },
  { code: 'bg', name: 'BG', flag: '🇧🇬', full: 'Български' },
  { code: 'hr', name: 'HR', flag: '🇭🇷', full: 'Hrvatski' },
  { code: 'sk', name: 'SK', flag: '🇸🇰', full: 'Slovenčina' },
  { code: 'ms', name: 'MS', flag: '🇲🇾', full: 'Bahasa Melayu' },
  { code: 'fil', name: 'TL', flag: '🇵🇭', full: 'Filipino' },
  { code: 'sr', name: 'SR', flag: '🇷🇸', full: 'Српски' },
  { code: 'sl', name: 'SL', flag: '🇸🇮', full: 'Slovenščina' },
  { code: 'et', name: 'ET', flag: '🇪🇪', full: 'Eesti' },
  { code: 'lv', name: 'LV', flag: '🇱🇻', full: 'Latviešu' },
  { code: 'lt', name: 'LT', flag: '🇱🇹', full: 'Lietuvių' },
  { code: 'sw', name: 'SW', flag: '🇰🇪', full: 'Kiswahili' },
  { code: 'ur', name: 'UR', flag: '🇵🇰', full: 'اردو' },
  { code: 'fa', name: 'FA', flag: '🇮🇷', full: 'فارسی' },
  { code: 'bn', name: 'BN', flag: '🇧🇩', full: 'বাংলা' },
  { code: 'ta', name: 'TA', flag: '🇮🇳', full: 'தமிழ்' },
  { code: 'te', name: 'TE', flag: '🇮🇳', full: 'తెలుగు' },
  { code: 'mr', name: 'MR', flag: '🇮🇳', full: 'मराठी' },
  { code: 'gu', name: 'GU', flag: '🇮🇳', full: 'ગુજરાતી' },
  { code: 'kn', name: 'KN', flag: '🇮🇳', full: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'ML', flag: '🇮🇳', full: 'മലയാളം' },
  { code: 'pa', name: 'PA', flag: '🇮🇳', full: 'ਪੰਜਾਬੀ' },
  { code: 'am', name: 'AM', flag: '🇪🇹', full: 'አማርኛ' },
  { code: 'is', name: 'IS', flag: '🇮🇸', full: 'Íslenska' },
  { code: 'ga', name: 'GA', flag: '🇮🇪', full: 'Gaeilge' },
  { code: 'cy', name: 'CY', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', full: 'Cymraeg' },
  { code: 'mt', name: 'MT', flag: '🇲🇹', full: 'Malti' },
  { code: 'sq', name: 'SQ', flag: '🇦🇱', full: 'Shqip' },
  { code: 'mk', name: 'MK', flag: '🇲🇰', full: 'Македонски' },
  { code: 'ka', name: 'KA', flag: '🇬🇪', full: 'ქართული' },
  { code: 'hy', name: 'HY', flag: '🇦🇲', full: 'Հայերեն' },
  { code: 'az', name: 'AZ', flag: '🇦🇿', full: 'Azərbaycan' },
  { code: 'kk', name: 'KK', flag: '🇰🇿', full: 'Қазақ' },
  { code: 'uz', name: 'UZ', flag: '🇺🇿', full: 'Oʻzbek' },
  { code: 'mn', name: 'MN', flag: '🇲🇳', full: 'Монгол' },
  { code: 'ne', name: 'NE', flag: '🇳🇵', full: 'नेपाली' },
  { code: 'si', name: 'SI', flag: '🇱🇰', full: 'සිංහල' },
  { code: 'km', name: 'KM', flag: '🇰🇭', full: 'ខ្មែរ' },
  { code: 'lo', name: 'LO', flag: '🇱🇦', full: 'ລາວ' },
  { code: 'my', name: 'MY', flag: '🇲🇲', full: 'မြန်မာ' },
  { code: 'af', name: 'AF', flag: '🇿🇦', full: 'Afrikaans' },
  { code: 'zu', name: 'ZU', flag: '🇿🇦', full: 'isiZulu' },
  { code: 'xh', name: 'XH', flag: '🇿🇦', full: 'isiXhosa' },
  { code: 'yo', name: 'YO', flag: '🇳🇬', full: 'Yorùbá' },
  { code: 'ig', name: 'IG', flag: '🇳🇬', full: 'Igbo' },
  { code: 'ha', name: 'HA', flag: '🇳🇬', full: 'Hausa' },
  { code: 'mg', name: 'MG', flag: '🇲🇬', full: 'Malagasy' },
  { code: 'ny', name: 'NY', flag: '🇲🇼', full: 'Chichewa' },
  { code: 'sn', name: 'SN', flag: '🇿🇼', full: 'Shona' },
  { code: 'st', name: 'ST', flag: '🇱🇸', full: 'Sesotho' },
  { code: 'su', name: 'SU', flag: '🇮🇩', full: 'Basa Sunda' },
  { code: 'jw', name: 'JW', flag: '🇮🇩', full: 'Basa Jawa' },
  { code: 'mi', name: 'MI', flag: '🇳🇿', full: 'Māori' },
  { code: 'sm', name: 'SM', flag: '🇼🇸', full: 'Gagana Samoa' },
  { code: 'ht', name: 'HT', flag: '🇭🇹', full: 'Kreyòl Ayisyen' },
  { code: 'haw', name: 'HW', flag: '🇺🇸', full: 'ʻŌlelo Hawaiʻi' },
  { code: 'ku', name: 'KU', flag: '🇹🇯', full: 'Kurdî' },
  { code: 'ps', name: 'PS', flag: '🇦🇫', full: 'پښتو' },
  { code: 'sd', name: 'SD', flag: '🇵🇰', full: 'سنڌي' },
  { code: 'yi', name: 'YI', flag: '✡️', full: 'ייִדיש' },
  { code: 'eo', name: 'EO', flag: '🌍', full: 'Esperanto' },
  { code: 'la', name: 'LA', flag: '🏛️', full: 'Latina' },
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
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 100, minWidth: '180px',
          maxHeight: '350px', overflowY: 'auto'
        }}
        className="custom-scrollbar"
        >
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleTranslate(lang.code)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: activeLang === lang.code ? 'rgba(255,199,0,0.1)' : 'transparent',
                border: 'none', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer',
                color: activeLang === lang.code ? 'var(--color-gold)' : 'var(--text-secondary)',
                fontSize: '0.85rem', fontWeight: 600, width: '100%', textAlign: 'left',
                transition: 'all 0.2s ease', flexShrink: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = activeLang === lang.code ? 'rgba(255,199,0,0.1)' : 'transparent'}
            >
              <span style={{ fontSize: '1.2rem' }}>{lang.flag}</span>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: activeLang === lang.code ? 'var(--color-gold)' : 'var(--text-primary)' }}>{lang.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 400 }}>{lang.full}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
