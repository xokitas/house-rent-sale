'use client';

import React from 'react';
import { PropertyStatus, STATUS_OPTIONS } from '@/lib/types';
import PropertyCategoryCard from './PropertyCategoryCard';

interface PropertyBasicInfoCardProps {
  title: string;
  price: string;
  currency: string;
  address: string;
  contact: string;
  selectedStatuses: PropertyStatus[];
  onFormChange: (field: string, value: string) => void;
  onToggleStatus: (status: PropertyStatus) => void;
}

export default function PropertyBasicInfoCard({
  title,
  price,
  currency,
  address,
  contact,
  selectedStatuses,
  onFormChange,
  onToggleStatus,
}: PropertyBasicInfoCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-8 animate-in fade-in duration-300">

      {/* SECCIÓN CABECERA INTERNA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-[#1E67AD] uppercase tracking-wider flex items-center gap-2">
          <span>✨</span> Información Básica
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          Define los datos de mayor relevancia, contacto y precio para captar el interés de tus clientes.
        </p>
      </div>

      {/* CUADRÍCULA DE CAMPOS INTELIGENTES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* TÍTULO DE LA PUBLICACIÓN */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Título de la publicación <span className="text-[#1E67AD]">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Casa en Reparto Simoni, 3 cuartos"
            value={title}
            onChange={(e) => onFormChange('title', e.target.value)}
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/40 focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
          />
        </div>

        {/* PRECIO Y MONEDA */}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2 space-y-1.5">
            <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
              Precio <span className="text-[#1E67AD]">*</span>
            </label>
            <input
              type="number"
              required
              placeholder="Ej. 15000"
              value={price}
              onChange={(e) => onFormChange('price', e.target.value)}
              className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/40 focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
              Moneda
            </label>
            <select
              value={currency}
              onChange={(e) => onFormChange('currency', e.target.value)}
              className="w-full text-xs p-[13.5px] bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#1E67AD] font-bold focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200 cursor-pointer"
            >
              <option value="USD">USD</option>
              <option value="CUP">CUP</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>

        {/* DIRECCIÓN */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Dirección / Zona <span className="text-[#1E67AD]">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ej. Calle Avellaneda #123, Camagüey"
            value={address}
            onChange={(e) => onFormChange('address', e.target.value)}
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/40 focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
          />
        </div>

        {/* TELÉFONO DE CONTACTO / WHATSAPP */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Teléfono de contacto / WhatsApp <span className="text-[#1E67AD]">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="Ej. +5351234567"
            value={contact}
            onChange={(e) => onFormChange('contact', e.target.value)}
            className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/40 focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
          />
        </div>
      </div>

      {/* CLASIFICACIONES DE CATEGORÍA INTERACTIVAS */}
      <div className="space-y-3.5 pt-4 border-t border-[#E8E2D8]">
        <div>
          <label className="block text-xs font-black text-[#1E67AD] uppercase tracking-wider">
            Categorías / Clasificación <span className="text-[#1E67AD]">*</span>
          </label>
          <p className="text-[10px] text-[#5A5245]/60 font-semibold mt-0.5">
            Puedes seleccionar múltiples clasificaciones si tu propiedad califica para varias.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = selectedStatuses.includes(opt.value);
            return (
              <PropertyCategoryCard
                key={opt.value}
                opt={opt}
                isSelected={isSelected}
                onToggle={() => onToggleStatus(opt.value)}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}
