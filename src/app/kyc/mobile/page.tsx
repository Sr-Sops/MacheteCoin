'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Camera, CheckCircle, AlertCircle, RefreshCw, Upload } from 'lucide-react';
import { supabaseClient } from '@/lib/supabase';

function MobileKycContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session');
  const supabase = supabaseClient;
  
  const [step, setStep] = useState(1); // 1: Front, 2: Back, 3: Selfie, 4: Done
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [selfieImage, setSelfieImage] = useState<File | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Sesión inválida o expirada. Por favor, escanea de nuevo el código QR.');
    }
  }, [sessionId]);

  const uploadFile = async (file: File, type: string) => {
    if (!supabase) throw new Error('Supabase no está configurado.');
    const fileExt = file.name.split('.').pop();
    const fileName = `${sessionId}_${type}_${Date.now()}.${fileExt}`;
    const filePath = `kyc/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('kyc-documents')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    return filePath;
  };

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'selfie') => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (type === 'front') setFrontImage(file);
      if (type === 'back') setBackImage(file);
      if (type === 'selfie') setSelfieImage(file);
    }
  };

  const handleNext = async () => {
    if (step === 1 && frontImage) setStep(2);
    else if (step === 2 && backImage) setStep(3);
    else if (step === 3 && selfieImage) {
      // Submit all
      setLoading(true);
      setError(null);
      try {
        const frontUrl = await uploadFile(frontImage!, 'front');
        const backUrl = await uploadFile(backImage!, 'back');
        const selfieUrl = await uploadFile(selfieImage!, 'selfie');

        // Update or Insert session
        if (!supabase) throw new Error('Supabase no está configurado.');
        const { error: dbError } = await supabase
          .from('kyc_sessions')
          .upsert({ 
            id: sessionId,
            status: 'completed',
            front_url: frontUrl,
            back_url: backUrl,
            selfie_url: selfieUrl
          });

        if (dbError) throw dbError;

        setStep(4);
      } catch (err: any) {
        setError('Error al subir los documentos: ' + (err.message || 'Inténtalo de nuevo.'));
      } finally {
        setLoading(false);
      }
    }
  };

  if (error) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
        <AlertCircle size={48} color="#f87171" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#f87171', textAlign: 'center', marginBottom: '1rem' }}>{error}</h2>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
        <CheckCircle size={64} color="var(--color-green-neon)" style={{ marginBottom: '1.5rem' }} />
        <h2 style={{ color: 'var(--text-primary)', textAlign: 'center', marginBottom: '1rem' }}>¡Verificación Completada!</h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
          Tus documentos se han subido correctamente. Ya puedes volver a tu ordenador para continuar.
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--color-gold)', fontWeight: 'bold' }}>KYC en Vivo</h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Paso {step} de 3
        </p>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '1rem', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${(step / 3) * 100}%`, height: '100%', background: 'var(--color-gold)', transition: 'width 0.3s' }} />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
        {step === 1 && (
          <>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Documento: Anverso</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Captura la parte frontal de tu documento de identidad con buena iluminación.</p>
            </div>
            
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: '250px', height: '180px', borderRadius: '12px',
              border: frontImage ? '2px solid var(--color-green-neon)' : '2px dashed var(--color-gold)',
              background: 'rgba(0,0,0,0.3)',
              cursor: 'pointer', position: 'relative'
            }}>
              {frontImage ? (
                <>
                  <CheckCircle color="var(--color-green-neon)" size={32} />
                  <span style={{ marginTop: '0.5rem', color: 'var(--color-green-neon)', fontSize: '0.9rem' }}>Capturado</span>
                </>
              ) : (
                <>
                  <Camera color="var(--color-gold)" size={48} />
                  <span style={{ marginTop: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Abrir Cámara</span>
                </>
              )}
              {/* @ts-ignore */}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, 'front')} style={{ display: 'none' }} />
            </label>

            <button 
              onClick={handleNext} 
              disabled={!frontImage}
              className={`btn ${frontImage ? 'btn-gold' : ''}`}
              style={{ width: '100%', maxWidth: '300px', opacity: frontImage ? 1 : 0.5 }}
            >
              Continuar
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Documento: Reverso</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Captura la parte posterior de tu documento.</p>
            </div>
            
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: '250px', height: '180px', borderRadius: '12px',
              border: backImage ? '2px solid var(--color-green-neon)' : '2px dashed var(--color-gold)',
              background: 'rgba(0,0,0,0.3)',
              cursor: 'pointer', position: 'relative'
            }}>
              {backImage ? (
                <>
                  <CheckCircle color="var(--color-green-neon)" size={32} />
                  <span style={{ marginTop: '0.5rem', color: 'var(--color-green-neon)', fontSize: '0.9rem' }}>Capturado</span>
                </>
              ) : (
                <>
                  <Camera color="var(--color-gold)" size={48} />
                  <span style={{ marginTop: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Abrir Cámara</span>
                </>
              )}
              {/* @ts-ignore */}
              <input type="file" accept="image/*" capture="environment" onChange={(e) => handleCapture(e, 'back')} style={{ display: 'none' }} />
            </label>

            <button 
              onClick={handleNext} 
              disabled={!backImage}
              className={`btn ${backImage ? 'btn-gold' : ''}`}
              style={{ width: '100%', maxWidth: '300px', opacity: backImage ? 1 : 0.5 }}
            >
              Continuar
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Selfie en Vivo</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Tómate un selfie para verificar tu identidad frente a tu documento.</p>
            </div>
            
            <label style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: '200px', height: '250px', borderRadius: '100px',
              border: selfieImage ? '2px solid var(--color-green-neon)' : '2px dashed var(--color-gold)',
              background: 'rgba(0,0,0,0.3)',
              cursor: 'pointer', position: 'relative'
            }}>
              {selfieImage ? (
                <>
                  <CheckCircle color="var(--color-green-neon)" size={32} />
                  <span style={{ marginTop: '0.5rem', color: 'var(--color-green-neon)', fontSize: '0.9rem' }}>Capturado</span>
                </>
              ) : (
                <>
                  <Camera color="var(--color-gold)" size={48} />
                  <span style={{ marginTop: '1rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>Abrir Cámara Frontal</span>
                </>
              )}
              {/* @ts-ignore */}
              <input type="file" accept="image/*" capture="user" onChange={(e) => handleCapture(e, 'selfie')} style={{ display: 'none' }} />
            </label>

            <button 
              onClick={handleNext} 
              disabled={!selfieImage || loading}
              className={`btn ${selfieImage ? 'btn-gold' : ''}`}
              style={{ width: '100%', maxWidth: '300px', opacity: (selfieImage && !loading) ? 1 : 0.5 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                  <RefreshCw className="spin-logo" size={16} /> Subiendo Seguro...
                </span>
              ) : (
                'Finalizar Verificación'
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function MobileKycPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Cargando...</p>
      </div>
    }>
      <MobileKycContent />
    </Suspense>
  );
}
