'use client';

import { useState } from 'react';
import { SlidersHorizontal, X, ArrowRight } from 'lucide-react';

interface FilterDrawerProps {
  filterType: string;
  maxPrice: string;
  onPriceChange: (price: string) => void;
}

export default function FilterDrawer({ filterType, maxPrice, onPriceChange }: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempMaxPrice, setTempMaxPrice] = useState<string>(maxPrice || '');

  const handleApply = () => {
    onPriceChange(tempMaxPrice);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempMaxPrice('');
    onPriceChange('');
    setIsOpen(false);
  };

  return (
    <>
      {/* BOTÓN DE FILTRADO (PIXEL-PERFECT MOCKUP) */}
      <button
        type="button"
        onClick={() => {
          setTempMaxPrice(maxPrice || '');
          setIsOpen(true);
        }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black tracking-tight bg-brand-secondary text-white hover:opacity-95 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        Filtros
        {maxPrice && (
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
        )}
      </button>

      {/* DRAWER CONTENEDOR */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Fondo traslúcido */}
          <div
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel Lateral */}
          <div className="relative w-full max-w-sm bg-bg-card h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-200 border-l border-border-main text-left">
            {/* Encabezado */}
            <div className="flex items-center justify-between pb-4 border-b border-border-main">
              <h2 className="text-sm font-black text-text-main tracking-tight flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
                Filtros de búsqueda
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-bg-main text-text-muted hover:text-text-main rounded-xl transition cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Campos de Filtro */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {/* Sección Presupuesto */}
              <div className="space-y-2">
                <h3 className="text-[10px] font-black text-text-muted uppercase tracking-wider">
                  Presupuesto Máximo
                </h3>
                <div className="relative">
                  <input
                    type="number"
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    placeholder="Ej. 50000"
                    className="w-full bg-bg-main border border-border-main rounded-2xl py-3.5 px-4 text-xs font-bold text-text-main placeholder:text-text-muted/40 focus:outline-none focus:border-brand-primary focus:bg-bg-card transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-brand-primary">
                    USD
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-text-muted">
                  Se filtrarán las propiedades cuyo precio sea menor o igual al valor especificado.
                </p>
              </div>
            </div>

            {/* Acciones */}
            <div className="pt-4 border-t border-border-main flex items-center gap-3 bg-bg-card">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3.5 bg-bg-main hover:bg-border-main text-text-main text-xs font-black rounded-2xl transition cursor-pointer"
              >
                Limpiar todo
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-3.5 bg-brand-primary text-bg-card hover:opacity-95 text-xs font-black rounded-2xl transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Aplicar filtros
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
