'use client';

import React from 'react';
import { Property, PropertyStatus } from '@/lib/types';
import { getStatusBadge } from '@/lib/utils';

interface PropertyPreviewCardProps {
  formData: {
    title: string;
    description: string;
    price: string;
    currency: string;
    address: string;
    contact: string;
    latitude: string;
    longitude: string;
    priority: number;
  };
  selectedStatuses: PropertyStatus[];
  existingImages: string[];
  selectedFiles: File[];
  isSold: boolean;
}

export default function PropertyPreviewCard({
  formData,
  selectedStatuses,
  existingImages,
  selectedFiles,
  isSold,
}: PropertyPreviewCardProps) {
  // Compute active preview image
  let previewImage: string | null = null;
  if (existingImages && existingImages.length > 0) {
    previewImage = existingImages[0];
  } else if (selectedFiles && selectedFiles.length > 0) {
    try {
      previewImage = URL.createObjectURL(selectedFiles[0]);
    } catch {
      previewImage = null;
    }
  }

  // Fallback to beautiful default SVG illustration instead of Unsplash
  const isPlaceholder = !previewImage;

  const displayTitle = formData.title.trim() || 'Título de tu maravillosa casa';
  const displayAddress = formData.address.trim() || 'Dirección de la propiedad, Camagüey';
  const displayPrice = formData.price.trim() ? Number(formData.price).toLocaleString('en-US') : '0';
  const displayCurrency = formData.currency;
  const displayDescription = formData.description.trim() || 'Aquí aparecerá la descripción detallada que redactes para tu propiedad...';

  return (
    <div className="bg-white rounded-3xl border border-[#E2D8C7] shadow-lg sticky top-24 overflow-hidden flex flex-col transition-all duration-300 transform hover:shadow-xl">

      {/* SECCIÓN CABECERA VISTA PREVIA */}
      <div className="px-5 py-4 bg-gradient-to-r from-[#1E67AD]/5 to-[#2A93A6]/5 border-b border-[#E8E2D8] flex items-center justify-between">
        <span className="text-[10px] font-black text-[#1E67AD] uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#1E67AD] animate-pulse"></span>
          Vista Previa en Tiempo Real
        </span>
        <span className="px-2 py-0.5 bg-[#F2ECE1] border border-[#E2D8C7] rounded-lg text-[9px] font-black text-[#5A5245] uppercase tracking-wider">
          Público
        </span>
      </div>

      {/* IMAGEN DE LA PROPIEDAD */}
      <div className="relative aspect-video w-full bg-[#F2ECE1]/30 overflow-hidden border-b border-[#E8E2D8] flex items-center justify-center">
        {isPlaceholder ? (
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-2 select-none">
            <span className="text-4xl animate-bounce-short">🏠</span>
            <h4 className="text-xs font-black text-[#1E67AD] uppercase tracking-wide">
              Vista previa de la propiedad
            </h4>
            <p className="text-[10px] text-[#5A5245]/60 font-medium max-w-[200px] leading-relaxed">
              Las imágenes aparecerán aquí una vez sean cargadas.
            </p>
          </div>
        ) : (
          <img
            src={previewImage!}
            alt={displayTitle}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]"
          />
        )}

        {/* ETIQUETA VENDIDO */}
        {isSold && (
          <div className="absolute top-3 left-3 bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl shadow-md z-10 animate-pulse">
            🔴 VENDIDA / PERMUTADA
          </div>
        )}

        {/* PRIORIDAD STAR */}
        {formData.priority === 1 && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-md z-10 flex items-center gap-1">
            ⭐ Destacado
          </div>
        )}
      </div>

      {/* DETALLES DE LA TARJETA */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* BADGES */}
          <div className="flex flex-wrap gap-1.5">
            {selectedStatuses.length === 0 ? (
              <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase border bg-slate-50 text-slate-400 border-slate-200">
                Sin categoría
              </span>
            ) : (
              selectedStatuses.map((st) => {
                const badge = getStatusBadge(st);
                return (
                  <span
                    key={st}
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider uppercase border leading-none ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                );
              })
            )}
          </div>

          {/* TÍTULO Y DIRECCIÓN */}
          <div className="space-y-1">
            <h3 className="text-base font-black text-[#1E67AD] tracking-tight leading-tight line-clamp-1">
              {displayTitle}
            </h3>
            <p className="text-[10px] font-bold text-[#5A5245] flex items-center gap-1">
              📍 {displayAddress}
            </p>
          </div>

          {/* DESCRIPCIÓN ACORTADA */}
          <p className="text-[11px] text-[#5A5245]/80 font-medium leading-relaxed line-clamp-3">
            {displayDescription}
          </p>
        </div>

        {/* PRECIO Y ACCIONES */}
        <div className="pt-4 border-t border-[#E8E2D8] flex items-end justify-between gap-4">
          <div>
            <span className="text-[8px] text-[#5A5245]/60 font-black uppercase tracking-wider">
              Precio de venta
            </span>
            <div className="text-lg font-black text-[#1E67AD] leading-none mt-0.5">
              {displayPrice}{' '}
              <span className="text-xs font-bold text-[#C8976C]">
                {displayCurrency}
              </span>
            </div>
          </div>

          {/* BOTONES DIRECTOS (REUTILIZACIÓN TOTAL) */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="w-8 h-8 rounded-xl bg-[#F2ECE1] hover:bg-[#E2D8C7] text-[#1E67AD] flex items-center justify-center text-xs transition duration-200"
              title="Llamar"
            >
              📞
            </button>
            <button
              type="button"
              className="px-3 h-8 bg-gradient-to-r from-[#1E67AD] to-[#2A93A6] text-white text-[10px] font-black uppercase rounded-xl transition duration-200 shadow-sm"
            >
              💬 Mensaje
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
