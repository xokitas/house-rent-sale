'use client';

import React from 'react';

interface PropertyDayPassFieldsCardProps {
  capacity: string;
  eventSchedule: string;
  musicAllowed: boolean;
  onFormChange: (field: string, value: string | boolean) => void;
}

export default function PropertyDayPassFieldsCard({
  capacity,
  eventSchedule,
  musicAllowed,
  onFormChange,
}: PropertyDayPassFieldsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-6 animate-in fade-in duration-300">
      {/* CABECERA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-[#1E67AD] uppercase tracking-wider flex items-center gap-2">
          <span>🎉</span> Datos de Pasadía / Eventos
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          Define la capacidad permitida de personas, horarios de los eventos y si se autoriza música.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CAPACIDAD DE PERSONAS */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Capacidad Máxima (Personas)
          </label>
          <input
            type="number"
            min="0"
            placeholder="Ej. 50"
            value={capacity}
            onChange={(e) => onFormChange('capacity', e.target.value)}
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
          />
        </div>

        {/* HORARIO DEL EVENTO */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Horario del Evento / Pasadía
          </label>
          <input
            type="text"
            placeholder="Ej. 9:00 AM - 6:00 PM"
            value={eventSchedule}
            onChange={(e) => onFormChange('event_schedule', e.target.value)}
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      {/* MÚSICA PERMITIDA */}
      <div className="pt-4 border-t border-[#E8E2D8]">
        <label
          className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3 cursor-pointer select-none max-w-xs ${
            musicAllowed
              ? 'border-[#1E67AD] bg-blue-50/40 text-[#1E67AD] font-bold'
              : 'border-[#E2D8C7] text-[#5A5245] bg-[#FBF9F5] hover:bg-[#E2D8C7]/20 font-semibold'
          }`}
        >
          <input
            type="checkbox"
            checked={musicAllowed}
            onChange={(e) => onFormChange('music_allowed', e.target.checked)}
            className="sr-only"
          />
          <span
            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
              musicAllowed
                ? 'bg-[#1E67AD] border-[#1E67AD] text-white'
                : 'border-[#E2D8C7] bg-white'
            }`}
          >
            {musicAllowed && (
              <svg
                className="w-2.5 h-2.5 stroke-2 stroke-current fill-none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </span>
          <span className="text-xs">🔊 Se permite música</span>
        </label>
      </div>
    </div>
  );
}
