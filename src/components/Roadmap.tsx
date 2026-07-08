'use client';

import React from 'react';
import { RoadmapPhase } from '@/lib/supabase';
import { Check, Loader2, CircleDot } from 'lucide-react';

interface RoadmapProps {
  phases: RoadmapPhase[];
}

export default function Roadmap({ phases }: RoadmapProps) {
  return (
    <section id="roadmap" style={{ padding: '6rem 0', position: 'relative' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(255, 199, 0, 0.05) 0%, transparent 70%)',
        zIndex: -1,
        pointerEvents: 'none',
      }} />

      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="gold-text-gradient">
            El Sendero del Machete (Roadmap)
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem' }}>
            Nuestra hoja de ruta para abrir camino y conquistar el mercado DeFi paso a paso.
          </p>
        </div>

        {/* Timeline container */}
        <div style={{
          position: 'relative',
          maxWidth: '850px',
          margin: '0 auto',
        }} className="roadmap-container">
          
          {/* Vertical central timeline line */}
          <div style={{
            position: 'absolute',
            left: '31px',
            top: 0,
            width: '2px',
            height: '100%',
            background: 'linear-gradient(to bottom, var(--color-gold) 0%, rgba(14, 94, 53, 0.5) 50%, rgba(255, 255, 255, 0.05) 100%)',
          }} className="timeline-line" />

          {/* Phases Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {phases.map((phase) => {
              const isCompleted = phase.status === 'completed';
              const isInProgress = phase.status === 'in_progress';
              
              let statusText = 'Pendiente';
              let statusColor = 'var(--text-secondary)';
              let statusBg = 'rgba(255, 255, 255, 0.03)';
              let statusBorder = 'rgba(255, 255, 255, 0.05)';
              let statusIcon = <CircleDot size={14} />;

              if (isCompleted) {
                statusText = 'Completado';
                statusColor = 'var(--color-green-neon)';
                statusBg = 'rgba(0, 255, 102, 0.06)';
                statusBorder = 'rgba(0, 255, 102, 0.2)';
                statusIcon = <Check size={14} />;
              } else if (isInProgress) {
                statusText = 'En Desarrollo';
                statusColor = 'var(--color-gold)';
                statusBg = 'rgba(255, 199, 0, 0.08)';
                statusBorder = 'rgba(255, 199, 0, 0.3)';
                statusIcon = <Loader2 size={14} className="spin-logo" style={{ animationDuration: '3s' }} />;
              }

              return (
                <div key={phase.id} style={{
                  position: 'relative',
                  display: 'flex',
                  gap: '2.5rem',
                }} className="roadmap-item">
                  
                  {/* Timeline Dot Indicator */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: isCompleted 
                      ? 'var(--color-green-neon)' 
                      : isInProgress 
                        ? 'var(--color-gold)' 
                        : 'var(--bg-jungle-light)',
                    border: '4px solid var(--bg-jungle-deep)',
                    boxShadow: isInProgress 
                      ? '0 0 15px var(--color-gold)' 
                      : isCompleted 
                        ? '0 0 15px rgba(0, 255, 102, 0.4)' 
                        : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-title)',
                    color: isCompleted || isInProgress ? '#050a07' : 'var(--text-secondary)',
                    zIndex: 10,
                  }}>
                    {phase.phase_number}
                  </div>

                  {/* Phase Details Card */}
                  <div className="glass-panel" style={{
                    flex: 1,
                    padding: '2rem',
                    border: isInProgress 
                      ? '1px solid rgba(255, 199, 0, 0.3)' 
                      : '1px solid var(--border-glass)',
                  }}>
                    
                    {/* Header: Title + Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Fase 0{phase.phase_number}
                        </span>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                          {phase.title}
                        </h3>
                      </div>
                      
                      {/* Status Badge */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: statusColor,
                        background: statusBg,
                        border: `1px solid ${statusBorder}`,
                        padding: '0.35rem 0.75rem',
                        borderRadius: '50px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em',
                      }}>
                        {statusIcon}
                        {statusText}
                      </div>
                    </div>

                    <p style={{ fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                      {phase.description}
                    </p>

                    {/* Milestones List */}
                    {phase.items && phase.items.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {phase.items.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '4px',
                              background: isCompleted 
                                ? 'rgba(0, 255, 102, 0.15)' 
                                : 'rgba(255, 255, 255, 0.03)',
                              border: isCompleted 
                                ? '1px solid var(--color-green-neon)' 
                                : '1px solid rgba(255,255,255,0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              {isCompleted && <Check size={12} style={{ color: 'var(--color-green-neon)' }} />}
                            </div>
                            <span style={{
                              fontSize: '0.9rem',
                              color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)',
                              textDecoration: isCompleted ? 'line-through opacity-70' : 'none',
                            }}>
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                  </div>

                </div>
              );
            })}
          </div>

        </div>

      </div>

      <style jsx global>{`
        /* Desktop styles for timeline if we want alternative left/right layout */
        @media (min-width: 992px) {
          /* Keep simple vertical line on the left for neat layout or center it */
        }
      `}</style>
    </section>
  );
}
