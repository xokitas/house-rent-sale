'use client';

import React from 'react';
import { PRIORITY_OPTIONS } from '@/lib/types';

interface PropertySettingsCardProps {
  editingId: string | null;
  priority: number;
  isSold: boolean;
  onFormChange: (field: string, value: string | number | boolean) => void;
  onToggleSold: (checked: boolean) => void;
}

export default function PropertySettingsCard({
  editingId,
  priority,
  isSold,
  onFormChange,
  onToggleSold,
}: PropertySettingsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-6 animate-in fade-in duration-300">

      {/* SECCIÓN CABECERA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-[#1E67AD] uppercase tracking-wider flex items-center gap-2">
          <span>⚙️</span> Configuración de la Publicación
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          Establece prioridades para posicionar tu anuncio u organiza su estado visual final.
        </p>
      </div>

      {/* SELECTOR DE PRIORIDAD PREMIUM (NO SELECT TRADICIONAL) */}
      <div className="space-y-3">
        <label className="block text-[11px] font-black text-[#C8976C] uppercase tracking-wider flex items-center gap-1.5">
          <span>👑</span> Prioridad de Publicación
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRIORITY_OPTIONS.map((p) => {
            const isSelected = Number(priority) === p.value;
            // Visual style variations for priority
            const colorClass = {
              1: isSelected ? 'border-[#C8976C] bg-amber-50/60 text-[#C8976C]' : 'hover:border-amber-200 hover:bg-amber-50/10',
              2: isSelected ? 'border-[#1E67AD] bg-blue-50/60 text-[#1E67AD]' : 'hover:border-blue-200 hover:bg-blue-50/10',
              3: isSelected ? 'border-[#2A93A6] bg-teal-50/60 text-[#2A93A6]' : 'hover:border-teal-200 hover:bg-teal-50/10',
              4: isSelected ? 'border-slate-400 bg-slate-50 text-slate-700' : 'hover:border-slate-300 hover:bg-slate-50/20',
            }[p.value as 1 | 2 | 3 | 4];

            return (
              <button
                key={p.value}
                type="button"
                onClick={() => onFormChange('priority', p.value)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer ${colorClass} ${
                  isSelected ? 'shadow-xs font-bold scale-[0.99]' : 'border-[#E2D8C7] text-[#5A5245] font-medium'
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-black">
                    {p.value === 1 ? '⭐ Patrocinada' : p.value === 2 ? '💼 Agente / Inmobiliaria' : p.value === 3 ? '🏠 Estándar Destacada' : '📄 Estándar Básica'}
                  </p>
                  <p className="text-[10px] text-black/45 leading-none font-semibold">
                    {p.value === 1 ? 'Aparece de primero' : p.value === 2 ? 'Inmobiliaria pro' : p.value === 3 ? 'Buena calidad' : 'Anuncio básico'}
                  </p>
                </div>
                <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                  isSelected ? 'bg-current border-current' : 'border-[#E2D8C7] bg-white'
                }`}>
                  {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ESTADO VENDIDA / PERMUTADA EN EDICIÓN */}
      {editingId && (
        <div className="p-4 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between gap-4">
          <div>
            <span className="block text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
              <span>🔴</span> Marcar como Vendida / Permutada
            </span>
            <span className="text-[10px] text-rose-800 font-semibold leading-relaxed mt-1 block">
              Muestra un sello de venta en la tarjeta sin eliminar la propiedad de la base de datos.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isSold}
              onChange={(e) => onToggleSold(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
          </label>
        </div>
      )}

    </div>
  );
}
