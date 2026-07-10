'use client';

import React, { useEffect, useState } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: any;
  }
}

const LANGUAGES = [
  { code: 'es', name: 'ES', countryCode: 'es', full: 'Español' },
  { code: 'en', name: 'EN', countryCode: 'us', full: 'English' },
  { code: 'fr', name: 'FR', countryCode: 'fr', full: 'Français' },
  { code: 'de', name: 'DE', countryCode: 'de', full: 'Deutsch' },
  { code: 'it', name: 'IT', countryCode: 'it', full: 'Italiano' },
  { code: 'pt', name: 'PT', countryCode: 'br', full: 'Português' },
  { code: 'zh-CN', name: 'ZH', countryCode: 'cn', full: '中文' },
  { code: 'ja', name: 'JA', countryCode: 'jp', full: '日本語' },
  { code: 'ko', name: 'KO', countryCode: 'kr', full: '한국어' },
  { code: 'ru', name: 'RU', countryCode: 'ru', full: 'Русский' },
  { code: 'ar', name: 'AR', countryCode: 'sa', full: 'العربية' },
  { code: 'hi', name: 'HI', countryCode: 'in', full: 'हिन्दी' },
  { code: 'tr', name: 'TR', countryCode: 'tr', full: 'Türkçe' },
  { code: 'nl', name: 'NL', countryCode: 'nl', full: 'Nederlands' },
  { code: 'pl', name: 'PL', countryCode: 'pl', full: 'Polski' },
  { code: 'sv', name: 'SV', countryCode: 'se', full: 'Svenska' },
  { code: 'el', name: 'EL', countryCode: 'gr', full: 'Ελληνικά' },
  { code: 'th', name: 'TH', countryCode: 'th', full: 'ไทย' },
  { code: 'vi', name: 'VI', countryCode: 'vn', full: 'Tiếng Việt' },
  { code: 'id', name: 'ID', countryCode: 'id', full: 'Bahasa Indonesia' },
  { code: 'cs', name: 'CS', countryCode: 'cz', full: 'Čeština' },
  { code: 'hu', name: 'HU', countryCode: 'hu', full: 'Magyar' },
  { code: 'ro', name: 'RO', countryCode: 'ro', full: 'Română' },
  { code: 'uk', name: 'UK', countryCode: 'ua', full: 'Українська' },
  { code: 'he', name: 'HE', countryCode: 'il', full: 'עברית' },
  { code: 'da', name: 'DA', countryCode: 'dk', full: 'Dansk' },
  { code: 'fi', name: 'FI', countryCode: 'fi', full: 'Suomi' },
  { code: 'no', name: 'NO', countryCode: 'no', full: 'Norsk' },
  { code: 'bg', name: 'BG', countryCode: 'bg', full: 'Български' },
  { code: 'hr', name: 'HR', countryCode: 'hr', full: 'Hrvatski' },
  { code: 'sk', name: 'SK', countryCode: 'sk', full: 'Slovenčina' },
  { code: 'ms', name: 'MS', countryCode: 'my', full: 'Bahasa Melayu' },
  { code: 'fil', name: 'TL', countryCode: 'ph', full: 'Filipino' },
  { code: 'sr', name: 'SR', countryCode: 'rs', full: 'Српски' },
  { code: 'sl', name: 'SL', countryCode: 'si', full: 'Slovenščina' },
  { code: 'et', name: 'ET', countryCode: 'ee', full: 'Eesti' },
  { code: 'lv', name: 'LV', countryCode: 'lv', full: 'Latviešu' },
  { code: 'lt', name: 'LT', countryCode: 'lt', full: 'Lietuvių' },
  { code: 'sw', name: 'SW', countryCode: 'ke', full: 'Kiswahili' },
  { code: 'ur', name: 'UR', countryCode: 'pk', full: 'اردو' },
  { code: 'fa', name: 'FA', countryCode: 'ir', full: 'فارسی' },
  { code: 'bn', name: 'BN', countryCode: 'bd', full: 'বাংলা' },
  { code: 'ta', name: 'TA', countryCode: 'in', full: 'தமிழ்' },
  { code: 'te', name: 'TE', countryCode: 'in', full: 'తెలుగు' },
  { code: 'mr', name: 'MR', countryCode: 'in', full: 'मराठी' },
  { code: 'gu', name: 'GU', countryCode: 'in', full: 'ગુજરાતી' },
  { code: 'kn', name: 'KN', countryCode: 'in', full: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'ML', countryCode: 'in', full: 'മലയാളം' },
  { code: 'pa', name: 'PA', countryCode: 'in', full: 'ਪੰਜਾਬੀ' },
  { code: 'am', name: 'AM', countryCode: 'et', full: 'አማርኛ' },
  { code: 'is', name: 'IS', countryCode: 'is', full: 'Íslenska' },
  { code: 'ga', name: 'GA', countryCode: 'ie', full: 'Gaeilge' },
  { code: 'cy', name: 'CY', countryCode: 'gb-wls', full: 'Cymraeg' },
  { code: 'mt', name: 'MT', countryCode: 'mt', full: 'Malti' },
  { code: 'sq', name: 'SQ', countryCode: 'al', full: 'Shqip' },
  { code: 'mk', name: 'MK', countryCode: 'mk', full: 'Македонски' },
  { code: 'ka', name: 'KA', countryCode: 'ge', full: 'ქართული' },
  { code: 'hy', name: 'HY', countryCode: 'am', full: 'Հայերեն' },
  { code: 'az', name: 'AZ', countryCode: 'az', full: 'Azərbaycan' },
  { code: 'kk', name: 'KK', countryCode: 'kz', full: 'Қазақ' },
  { code: 'uz', name: 'UZ', countryCode: 'uz', full: 'Oʻzbek' },
  { code: 'mn', name: 'MN', countryCode: 'mn', full: 'Монгол' },
  { code: 'ne', name: 'NE', countryCode: 'np', full: 'नेपाली' },
  { code: 'si', name: 'SI', countryCode: 'lk', full: 'සිංහල' },
  { code: 'km', name: 'KM', countryCode: 'kh', full: 'ខ្មែរ' },
  { code: 'lo', name: 'LO', countryCode: 'la', full: 'ລາວ' },
  { code: 'my', name: 'MY', countryCode: 'mm', full: 'မြန်မာ' },
  { code: 'af', name: 'AF', countryCode: 'za', full: 'Afrikaans' },
  { code: 'zu', name: 'ZU', countryCode: 'za', full: 'isiZulu' },
  { code: 'xh', name: 'XH', countryCode: 'za', full: 'isiXhosa' },
  { code: 'yo', name: 'YO', countryCode: 'ng', full: 'Yorùbá' },
  { code: 'ig', name: 'IG', countryCode: 'ng', full: 'Igbo' },
  { code: 'ha', name: 'HA', countryCode: 'ng', full: 'Hausa' },
  { code: 'mg', name: 'MG', countryCode: 'mg', full: 'Malagasy' },
  { code: 'ny', name: 'NY', countryCode: 'mw', full: 'Chichewa' },
  { code: 'sn', name: 'SN', countryCode: 'zw', full: 'Shona' },
  { code: 'st', name: 'ST', countryCode: 'ls', full: 'Sesotho' },
  { code: 'su', name: 'SU', countryCode: 'id', full: 'Basa Sunda' },
  { code: 'jw', name: 'JW', countryCode: 'id', full: 'Basa Jawa' },
  { code: 'mi', name: 'MI', countryCode: 'nz', full: 'Māori' },
  { code: 'sm', name: 'SM', countryCode: 'ws', full: 'Gagana Samoa' },
  { code: 'ht', name: 'HT', countryCode: 'ht', full: 'Kreyòl Ayisyen' },
  { code: 'haw', name: 'HW', countryCode: 'us', full: 'ʻŌlelo Hawaiʻi' },
  { code: 'ku', name: 'KU', countryCode: 'tj', full: 'Kurdî' },
  { code: 'ps', name: 'PS', countryCode: 'af', full: 'پښتو' },
  { code: 'sd', name: 'SD', countryCode: 'pk', full: 'سنڌي' },
  { code: 'yi', name: 'YI', countryCode: 'il', full: 'ייִדיש' },
  { code: 'eo', name: 'EO', countryCode: 'un', full: 'Esperanto' },
  { code: 'la', name: 'LA', countryCode: 'va', full: 'Latina' },
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
        <img src={`https://flagcdn.com/w20/${activeOption.countryCode}.png`} alt={activeOption.name} style={{ width: 20, height: 15, borderRadius: 2 }} />
        <span>{activeOption.name}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
          marginTop: '0.5rem', background: '#0a140f', border: '1px solid rgba(255,199,0,0.3)',
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
              <img src={`https://flagcdn.com/w20/${lang.countryCode}.png`} alt={lang.name} style={{ width: 20, height: 15, borderRadius: 2 }} />
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
