'use client';

import React from 'react';
import { CAMAGUEY_MUNICIPALITIES } from '@/lib/types';

interface PropertyLocationCardProps {
  province: string;
  municipality: string;
  neighborhood: string;
  latitude: string;
  longitude: string;
  onFormChange: (field: string, value: string) => void;
  isPublicWizard?: boolean; // Optional prop to lock province or style slightly differently
}

export default function PropertyLocationCard({
  province,
  municipality,
  neighborhood,
  latitude,
  longitude,
  onFormChange,
  isPublicWizard = false,
}: PropertyLocationCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-6 animate-in fade-in duration-300">

      {/* SECCIÓN CABECERA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-brand-primary uppercase tracking-wider flex items-center gap-2">
          <span>📍</span> Ubicación de la Propiedad
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          {isPublicWizard
            ? 'Indica el municipio, reparto o barrio donde se encuentra tu propiedad en Camagüey.'
            : 'Define la provincia, municipio, barrio o reparto, así como las coordenadas geográficas aproximadas.'}
        </p>
      </div>

      {/* CAMPOS DE DIRECCIÓN GEOGRÁFICA */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* PROVINCIA (DESHABILITADA) */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Provincia
          </label>
          <input
            type="text"
            disabled
            value={province || 'Camagüey'}
            className="w-full text-xs p-3.5 bg-[#E8E2D8]/40 border border-[#E2D8C7] rounded-xl text-[#5A5245]/70 font-bold select-none focus:outline-none cursor-not-allowed"
          />
        </div>

        {/* MUNICIPIO (SELECT) */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Municipio <span className="text-brand-primary">*</span>
          </label>
          <select
            value={municipality}
            required
            onChange={(e) => onFormChange('municipality', e.target.value)}
            className="w-full text-xs p-[13.5px] bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all duration-200 cursor-pointer"
          >
            <option value="">Seleccione un municipio</option>
            {CAMAGUEY_MUNICIPALITIES.map((mun) => (
              <option key={mun} value={mun}>
                {mun}
              </option>
            ))}
          </select>
        </div>

        {/* REPARTO / BARRIO (TEXT LIBRE) */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Reparto / Barrio <span className="text-brand-primary">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Reparto Simoni"
            value={neighborhood}
            onChange={(e) => onFormChange('neighborhood', e.target.value)}
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      {/* COORDENADAS (LATITUD Y LONGITUD) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8E2D8]/60">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Latitud (Opcional)
          </label>
          <input
            type="text"
            placeholder="21.3804"
            value={latitude}
            onChange={(e) => onFormChange('latitude', e.target.value)}
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all duration-200"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Longitud (Opcional)
          </label>
          <input
            type="text"
            placeholder="-77.9162"
            value={longitude}
            onChange={(e) => onFormChange('longitude', e.target.value)}
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      {/* TEXTO DE AYUDA RECOMENDADO */}
      <div className="p-4 bg-[#F2ECE1]/40 border border-[#E2D8C7] rounded-2xl flex gap-3 items-start">
        <span className="text-lg shrink-0 mt-0.5">💡</span>
        <p className="text-[11px] text-[#5A5245] leading-relaxed font-semibold">
          Recomendamos obtener las coordenadas utilizando <strong>MAPS.ME</strong> u otra aplicación basada en OpenStreetMap, ya que suele ofrecer una mejor cobertura para muchas zonas de Cuba. Luego simplemente copia y pega la latitud y la longitud.
        </p>
      </div>

    </div>
  );
}
