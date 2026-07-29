'use client';

import React from 'react';

interface PropertyAmenitiesCardProps {
  amenities: string[];
  onChange: (amenities: string[]) => void;
}

export const AMENITY_OPTIONS = [
  'Agua 24 horas',
  'Cisterna',
  'Tanque elevado',
  'Turbina',
  'Aire acondicionado',
  'Amueblada',
  'Piscina',
  'Jardín',
  'Internet',
  'Gas',
  'Calentador',
  'Patio',
  'Terraza',
  'Cerca perimetral',
  'Sistema de cámaras',
  'Portón eléctrico',
  'Acepta mascotas',
  'Generador eléctrico',
];

export default function PropertyAmenitiesCard({
  amenities,
  onChange,
}: PropertyAmenitiesCardProps) {
  const handleToggle = (amenity: string) => {
    if (amenities.includes(amenity)) {
      onChange(amenities.filter((item) => item !== amenity));
    } else {
      onChange([...amenities, amenity]);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-6 animate-in fade-in duration-300">
      {/* SECCIÓN CABECERA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-[#1E67AD] uppercase tracking-wider flex items-center gap-2">
          <span>✨</span> Amenidades de la Propiedad
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          Selecciona todas las comodidades y servicios adicionales que posee la propiedad.
        </p>
      </div>

      {/* CHECKBOXES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {AMENITY_OPTIONS.map((amenity) => {
          const isChecked = amenities.includes(amenity);
          return (
            <label
              key={amenity}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-3 cursor-pointer select-none ${
                isChecked
                  ? 'border-[#1E67AD] bg-blue-50/40 text-[#1E67AD] font-bold'
                  : 'border-[#E2D8C7] text-[#5A5245] bg-[#FBF9F5] hover:bg-[#E2D8C7]/20 font-semibold text-xs'
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(amenity)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  isChecked
                    ? 'bg-[#1E67AD] border-[#1E67AD] text-white'
                    : 'border-[#E2D8C7] bg-white'
                }`}
              >
                {isChecked && (
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
              <span className="text-xs">{amenity}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
