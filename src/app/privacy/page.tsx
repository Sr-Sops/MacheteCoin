'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, Database } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <Eye size={32} />
            <h1 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-title)', margin: 0 }} className="gold-text-gradient">
              Política de Privacidad
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0 }}>
            Última actualización: 9 de Julio de 2026
          </p>
        </div>

        {/* Intro */}
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
          En MacheteCoin, valoramos la privacidad de nuestra comunidad. Esta Política de Privacidad describe el tipo de información que recolectamos cuando visitas y utilizas nuestro Sitio, y cómo procesamos esos datos.
        </p>

        {/* Main Content */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '2.5rem', lineHeight: 1.7 }}>
          
          <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', margin: 0 }}>
              1. Información que Recolectamos
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
              Al registrarte o utilizar las funciones de nuestra plataforma, recolectamos los siguientes datos de forma directa:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.5rem 0' }}>
              <li><strong>Información de la Cuenta:</strong> Dirección de correo electrónico y nombre de usuario proporcionados durante el registro (gestionados de forma segura a través del servicio de autenticación Supabase Auth).</li>
              <li><strong>Dirección de Billetera (Wallet):</strong> Clave pública criptográfica de Solana o Ethereum que decidas vincular de manera voluntaria a tu cuenta desde el panel de usuario.</li>
              <li><strong>Historial de Simulaciones:</strong> Datos asociados a los intercambios virtuales realizados dentro de nuestro widget de simulador Swap (monto pagado, token de pago, saldo acumulado y hashes de transacciones generados por el simulador).</li>
            </ul>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', margin: 0 }}>
              2. Cómo Utilizaremos tus Datos
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
              Utilizamos la información recolectada únicamente para los siguientes fines operativos internos:
            </p>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0.5rem 0' }}>
              <li>Mantener activa e identificar de forma única tu sesión de usuario.</li>
              <li>Asociar tu clave pública enlazada a tu perfil y mostrarla en tu panel privado.</li>
              <li>Calcular y reflejar correctamente tus saldos acumulados de $MACHETE en la interfaz y en tu base de datos de transacciones.</li>
              <li>Prevenir fraudes informáticos o abusos repetitivos en las funciones de la web.</li>
            </ul>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', margin: 0 }}>
              3. Almacenamiento y Protección de Datos
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
              Todos los datos de cuentas reales e historial de transacciones se almacenan de forma segura utilizando la infraestructura en la nube de **Supabase (PostgreSQL)**, la cual emplea cifrado en reposo y en tránsito.
            </p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
              El Sitio también emplea almacenamiento local del navegador (LocalStorage) para guardar sesiones temporales rápidas y para almacenar datos simulados locales cuando las credenciales en la nube no están activadas.
            </p>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', margin: 0 }}>
              4. Divulgación de Datos a Terceros
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
              <strong>No vendemos, alquilamos ni compartimos</strong> tus datos personales con empresas comerciales externas bajo ninguna circunstancia. Tus datos solo serán accesibles para ti mismo y para los administradores técnicos autorizados de la plataforma para fines de mantenimiento técnico.
            </p>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ color: 'var(--color-gold)', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', margin: 0 }}>
              5. Derechos sobre tus Datos
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
              En cualquier momento, tienes el derecho de acceder, corregir o eliminar tu información de usuario. Puedes desvincular tu clave pública de billetera directamente en tu Panel de Control. Si deseas eliminar tu cuenta de forma permanente, contáctanos a través de nuestros canales de comunidad oficial y procesaremos tu baja.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
