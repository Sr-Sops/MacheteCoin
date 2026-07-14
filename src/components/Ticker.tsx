'use client';

import React, { useState, useEffect } from 'react';
import { MacheteService } from '@/lib/supabase';

export default function Ticker() {
  const [network, setNetwork] = useState('Polygon');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const s = await MacheteService.getCoinSettings();
        if (s?.network) {
          setNetwork(s.network);
        }
      } catch (e) {
        console.error('Error fetching settings for ticker:', e);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {Array.from({ length: 4 }).map((_, i) => (
          <React.Fragment key={i}>
            <div className="ticker-item">SUMINISTRO MÁXIMO: <span>1,000,000,000</span></div>
            <div className="ticker-item">DIRECCIÓN: <span>{network}</span></div>
            <div className="ticker-item">COMPRA TAX: <span>0%</span></div>
            <div className="ticker-item">VENTA TAX: <span>0%</span></div>
            <div className="ticker-item">LIQUIDEZ: <span>QUEMADA 🔥</span></div>
            <div className="ticker-item">SLIPPAGE: <span>0.1%</span></div>
            <div className="ticker-item">CONTRATO: <span>RENUNCIADO 🗡️</span></div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
