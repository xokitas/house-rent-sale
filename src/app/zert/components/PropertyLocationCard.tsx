'use client';

import React from 'react';

interface PropertyLocationCardProps {
  latitude: string;
  longitude: string;
  onFormChange: (field: string, value: string) => void;
}

export default function PropertyLocationCard({
  latitude,
  longitude,
  onFormChange,
}: PropertyLocationCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-6 animate-in fade-in duration-300">

      {/* SECCIÓN CABECERA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-[#1E67AD] uppercase tracking-wider flex items-center gap-2">
          <span>📍</span> Ubicación de la Propiedad
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          Introduce las coordenadas geográficas aproximadas para que los compradores puedan ver la zona en el mapa.
        </p>
      </div>

      {/* COORDENADAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Latitud (Opcional)
          </label>
          <input
            type="text"
            placeholder="21.3804"
            value={latitude}
            onChange={(e) => onFormChange('latitude', e.target.value)}
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
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
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
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
