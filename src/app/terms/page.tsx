'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Scale, HelpCircle } from 'lucide-react';

export default function TermsAndConditions() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#050a07',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      padding: '4rem 1.5rem',
      backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(14, 94, 53, 0.25) 0%, transparent 50%)',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Back Button */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '0.9rem',
          alignSelf: 'flex-start',
        }} className="nav-link">
          <ArrowLeft size={16} />
          Volver a Inicio
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--color-gold)' }}>
            <Scale size={32} />
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', margin: 0 }} className="gold-text-gradient">
              Términos y Condiciones
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Última actualización: 9 de Julio de 2026
          </p>
        </div>

        {/* Warning Banner */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
        }}>
          <ShieldAlert size={24} style={{ color: '#ef4444', flexShrink: 0, marginTop: '0.1rem' }} />
          <div>
            <h4 style={{ color: '#f87171', fontSize: '1rem', margin: '0 0 0.25rem 0', fontWeight: 600 }}>INFORMACIÓN DE ALTO RIESGO</h4>
            <p style={{ fontSize: '0.85rem', margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              MacheteCoin ($MACHETE) es un token de tipo meme creado exclusivamente con fines de entretenimiento y diversión comunitaria. No tiene utilidad práctica, respaldo financiero ni garantía de valor intrínseco. No arriesgues fondos que no puedas permitirte perder por completo.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem', lineHeight: 1.7 }}>
          
          <section>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              1. Aceptación de los Términos
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Al acceder o utilizar el sitio web oficial de MacheteCoin (el &quot;Sitio&quot;) y el simulador de intercambio integrado, aceptas regirte por estos Términos y Condiciones y todas las leyes y regulaciones aplicables. Si no estás de acuerdo con alguno de estos términos, tienes prohibido usar o acceder a este Sitio.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              2. Naturaleza del Token $MACHETE
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              El token $MACHETE es una moneda de broma (&quot;meme coin&quot;). No constituye una inversión, un valor financiero (security), un contrato de inversión ni confiere derechos de voto ni de participación en ninguna empresa. La adquisición de $MACHETE no debe realizarse con la expectativa de obtener plusvalías o beneficios financieros.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              3. Simulador de Intercambio (MacheteSwap)
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              El widget o simulador MacheteSwap provisto en el Sitio es una herramienta interactiva con fines educativos y recreativos. Las transacciones realizadas en este simulador son simulaciones virtuales almacenadas en base de datos. Ninguna criptomoneda real es transferida o liquidada de forma física a través de este formulario. Los saldos simulados no tienen ningún valor monetario en el mundo real.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              4. Limitación de Responsabilidad
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              En la máxima medida permitida por la ley aplicable, el equipo de MacheteCoin, sus creadores y desarrolladores no serán responsables de ningún daño directo, indirecto, incidental, especial, consecuente o punitivo, incluyendo, sin limitación, la pérdida de beneficios, datos, uso u otras pérdidas intangibles resultantes de:
            </p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <li>Tu acceso o uso (o incapacidad de acceder o usar) el Sitio.</li>
              <li>Cualquier fluctuación de precio drástica del token $MACHETE en mercados secundarios descentralizados (DEX).</li>
              <li>Fallas tecnológicas, ataques maliciosos o exploits en los contratos inteligentes o en el Sitio.</li>
            </ul>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              5. Enlaces a Sitios de Terceros
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              El Sitio contiene enlaces a plataformas externas como Twitter, Telegram, Discord, Raydium, dexscreener, etc. No tenemos control sobre el contenido ni las prácticas de estos sitios de terceros y no asumimos ninguna responsabilidad sobre sus términos de uso o políticas.
            </p>
          </section>

          <section>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
              6. Modificaciones de los Términos
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              Nos reservamos el derecho de modificar o reemplazar estos Términos y Condiciones en cualquier momento sin previo aviso. Es tu responsabilidad revisar esta página periódicamente para informarte de cualquier cambio.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
