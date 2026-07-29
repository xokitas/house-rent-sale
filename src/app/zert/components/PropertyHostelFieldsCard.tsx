'use client';

import React from 'react';

interface PropertyHostelFieldsCardProps {
  roomsAvailable: string;
  privateBathroom: boolean;
  sharedBathroom: boolean;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  airportPickup: boolean;
  checkIn: string;
  checkOut: string;
  languages: string[];
  onFormChange: (field: string, value: string | boolean) => void;
  onLanguagesChange: (languages: string[]) => void;
}

export const LANGUAGE_OPTIONS = [
  'Español',
  'Inglés',
  'Francés',
  'Alemán',
  'Italiano',
  'Portugués',
  'Ruso',
];

export default function PropertyHostelFieldsCard({
  roomsAvailable,
  privateBathroom,
  sharedBathroom,
  breakfast,
  lunch,
  dinner,
  airportPickup,
  checkIn,
  checkOut,
  languages,
  onFormChange,
  onLanguagesChange,
}: PropertyHostelFieldsCardProps) {
  const handleLanguageToggle = (lang: string) => {
    if (languages.includes(lang)) {
      onLanguagesChange(languages.filter((l) => l !== lang));
    } else {
      onLanguagesChange([...languages, lang]);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-6 animate-in fade-in duration-300">
      {/* CABECERA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-[#1E67AD] uppercase tracking-wider flex items-center gap-2">
          <span>✈️</span> Datos de Hostal / Internacional
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          Configura la disponibilidad, servicios de alimentación, horarios de entrada/salida e idiomas de atención.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* CANTIDAD DE HABITACIONES DISPONIBLES */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Habitaciones Disp.
          </label>
          <input
            type="number"
            min="0"
            placeholder="0"
            value={roomsAvailable}
            onChange={(e) => onFormChange('rooms_available', e.target.value)}
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
          />
        </div>

        {/* HORARIO CHECK-IN */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Horario Check-In
          </label>
          <input
            type="time"
            value={checkIn}
            onChange={(e) => onFormChange('check_in', e.target.value)}
            className="w-full text-xs p-[13px] bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200 cursor-pointer"
          />
        </div>

        {/* HORARIO CHECK-OUT */}
        <div className="space-y-1.5 sm:col-span-1">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Horario Check-Out
          </label>
          <input
            type="time"
            value={checkOut}
            onChange={(e) => onFormChange('check_out', e.target.value)}
            className="w-full text-xs p-[13px] bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200 cursor-pointer"
          />
        </div>
      </div>

      {/* SERVICIOS Y COMODIDADES (CHECKBOXES CARD STYLE) */}
      <div className="space-y-3 pt-4 border-t border-[#E8E2D8]">
        <h4 className="text-[11px] font-black text-[#1E67AD] uppercase tracking-wider">
          Servicios y Baños
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: '🚿 Baño Privado', field: 'private_bathroom', val: privateBathroom },
            { label: '🧼 Baño Compartido', field: 'shared_bathroom', val: sharedBathroom },
            { label: '🍳 Desayuno incl.', field: 'breakfast', val: breakfast },
            { label: '🍲 Almuerzo incl.', field: 'lunch', val: lunch },
            { label: '🍷 Cena incl.', field: 'dinner', val: dinner },
            { label: '🚗 Recogida Aeropuerto', field: 'airport_pickup', val: airportPickup },
          ].map((item) => (
            <label
              key={item.field}
              className={`p-3 rounded-2xl border text-left transition-all duration-300 flex items-center gap-2.5 cursor-pointer select-none ${
                item.val
                  ? 'border-[#1E67AD] bg-blue-50/40 text-[#1E67AD] font-bold'
                  : 'border-[#E2D8C7] text-[#5A5245] bg-[#FBF9F5] hover:bg-[#E2D8C7]/20 font-semibold'
              }`}
            >
              <input
                type="checkbox"
                checked={item.val}
                onChange={(e) => onFormChange(item.field, e.target.checked)}
                className="sr-only"
              />
              <span
                className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                  item.val
                    ? 'bg-[#1E67AD] border-[#1E67AD] text-white'
                    : 'border-[#E2D8C7] bg-white'
                }`}
              >
                {item.val && (
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
              <span className="text-xs">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* IDIOMAS DE ATENCIÓN MULTI-SELECTOR (CHECKBOXES CARD STYLE) */}
      <div className="space-y-3 pt-4 border-t border-[#E8E2D8]">
        <h4 className="text-[11px] font-black text-[#1E67AD] uppercase tracking-wider">
          Idiomas de Atención
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isChecked = languages.includes(lang);
            return (
              <label
                key={lang}
                className={`p-3 rounded-2xl border text-left transition-all duration-300 flex items-center gap-2.5 cursor-pointer select-none ${
                  isChecked
                    ? 'border-[#1E67AD] bg-blue-50/40 text-[#1E67AD] font-bold'
                    : 'border-[#E2D8C7] text-[#5A5245] bg-[#FBF9F5] hover:bg-[#E2D8C7]/20 font-semibold'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleLanguageToggle(lang)}
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
                <span className="text-xs">{lang}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
