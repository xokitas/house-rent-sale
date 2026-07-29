'use client';

import React from 'react';

interface PropertyDescriptionCardProps {
  description: string;
  onFormChange: (field: string, value: string) => void;
}

export default function PropertyDescriptionCard({
  description,
  onFormChange,
}: PropertyDescriptionCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-4 animate-in fade-in duration-300">

      {/* SECCIÓN CABECERA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-[#1E67AD] uppercase tracking-wider flex items-center gap-2">
          <span>📝</span> Descripción Detallada
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          Describe las características más importantes de la propiedad para que se destaque del resto.
        </p>
      </div>

      {/* TEXTAREA Y AYUDA */}
      <div className="space-y-1.5">
        <textarea
          rows={6}
          required
          placeholder="Ej. Hermosa casa amplia de 3 habitaciones, portal de corretaje, garaje privado, cisterna y sistema de agua 24 horas. Lista para entrar a vivir..."
          value={description}
          onChange={(e) => onFormChange('description', e.target.value)}
          className="w-full text-xs p-4 bg-[#FBF9F5] border border-[#E2D8C7] rounded-2xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/40 focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200 resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between text-[10px] text-[#5A5245]/60 font-semibold px-1">
          <span>Sugerencia: Detalla el estado constructivo y servicios disponibles.</span>
          <span>{description.length} caracteres</span>
        </div>
      </div>

    </div>
  );
}
