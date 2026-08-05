'use client';

import React from 'react';
import { PropertyStatus, STATUS_OPTIONS } from '@/lib/types';

interface ReviewStepProps {
  formData: {
    status: PropertyStatus;
    property_type: string;
    title: string;
    price: string;
    currency: string;
    municipality: string;
    neighborhood: string;
    latitude: string;
    longitude: string;
    bedrooms: string;
    bathrooms: string;
    living_rooms: string;
    dining_rooms: string;
    kitchens: string;
    indoor_patios: string;
    outdoor_patios: string;
    garages: string;
    terraces: string;
    balconies: string;
    portals: string;
    floors: string;
    construction_area: string;
    land_area: string;
    amenities: string[];
    description: string;
    owner_name: string;
    contact: string;
    admin_comment: string;
    // Hostel
    rooms_available: string;
    private_bathroom: boolean;
    shared_bathroom: boolean;
    breakfast: boolean;
    lunch: boolean;
    dinner: boolean;
    airport_pickup: boolean;
    check_in: string;
    check_out: string;
    languages: string[];
    // Day Pass
    capacity: string;
    event_schedule: string;
    music_allowed: boolean;
    // Commercial
    commercial_front: boolean;
    warehouse: boolean;
    office: boolean;
    industrial_power: boolean;
  };
  existingImages: string[];
  selectedFiles: File[];
  onGoToStep: (step: number) => void;
}

export default function ReviewStep({ formData, existingImages, selectedFiles, onGoToStep }: ReviewStepProps) {
  const categoryLabel = STATUS_OPTIONS.find(o => o.value === formData.status)?.label || formData.status;

  // Render photo previews (local and saved)
  const totalPhotos = existingImages.length + selectedFiles.length;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* SECCIÓN CABECERA INTERNA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-brand-primary uppercase tracking-wider flex items-center gap-2">
          <span>📋</span> Resumen de Publicación
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          Por favor, revisa detalladamente la información ingresada antes de enviar la solicitud para revisión administrativa.
        </p>
      </div>

      {/* BLOQUE DE SECCIONES INTERACTIVAS CON ACCESO DIRECTO AL PASO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* PASO 1 Y 2: CATEGORÍA Y DATOS BÁSICOS */}
        <div className="bg-[#FBF9F5]/40 border border-[#E2D8C7] rounded-2xl p-5 space-y-3 relative group">
          <button
            type="button"
            onClick={() => onGoToStep(1)}
            className="absolute top-4 right-4 text-[10px] font-black text-brand-primary hover:underline cursor-pointer uppercase"
          >
            ✏️ Editar Cat.
          </button>
          <h4 className="text-xs font-black text-[#5A5245] uppercase tracking-wider">
            1. Categoría y Clasificación
          </h4>
          <p className="text-xs font-bold text-brand-primary bg-brand-primary/5 border border-brand-primary/10 px-3 py-1.5 rounded-xl inline-block">
            {categoryLabel}
          </p>

          <div className="pt-3 border-t border-[#E8E2D8]/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-black text-[#5A5245]/50">2. Datos Básicos</span>
              <button
                type="button"
                onClick={() => onGoToStep(2)}
                className="text-[10px] font-black text-brand-primary hover:underline cursor-pointer uppercase"
              >
                ✏️ Editar
              </button>
            </div>
            <div>
              <span className="text-[9px] uppercase font-black text-[#5A5245]/40 block">Título de publicación</span>
              <span className="text-xs font-extrabold text-[#5A5245]">{formData.title}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[9px] uppercase font-black text-[#5A5245]/40 block">Tipo propiedad</span>
                <span className="text-xs font-bold text-[#5A5245]">{formData.property_type}</span>
              </div>
              <div>
                <span className="text-[9px] uppercase font-black text-[#5A5245]/40 block">Precio sugerido</span>
                <span className="text-xs font-extrabold text-emerald-700">
                  {Number(formData.price).toLocaleString('en-US')} {formData.currency}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PASO 3: UBICACIÓN */}
        <div className="bg-[#FBF9F5]/40 border border-[#E2D8C7] rounded-2xl p-5 space-y-3 relative">
          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className="absolute top-4 right-4 text-[10px] font-black text-brand-primary hover:underline cursor-pointer uppercase"
          >
            ✏️ Editar
          </button>
          <h4 className="text-xs font-black text-[#5A5245] uppercase tracking-wider">
            3. Ubicación Geográfica
          </h4>
          <div className="space-y-2">
            <div>
              <span className="text-[9px] uppercase font-black text-[#5A5245]/40 block">Provincia y Municipio</span>
              <span className="text-xs font-extrabold text-[#5A5245]">Camagüey, {formData.municipality}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-black text-[#5A5245]/40 block">Barrio o Reparto</span>
              <span className="text-xs font-bold text-[#5A5245]">{formData.neighborhood}</span>
            </div>
            {(formData.latitude || formData.longitude) && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <span className="text-[8px] uppercase font-black text-[#5A5245]/40 block">Latitud</span>
                  <span className="text-xs font-mono font-bold text-[#5A5245]/70">{formData.latitude || '-'}</span>
                </div>
                <div>
                  <span className="text-[8px] uppercase font-black text-[#5A5245]/40 block">Longitud</span>
                  <span className="text-xs font-mono font-bold text-[#5A5245]/70">{formData.longitude || '-'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PASO 4: CARACTERÍSTICAS ESTRUCTURALES Y EXTRA */}
        <div className="bg-[#FBF9F5]/40 border border-[#E2D8C7] rounded-2xl p-5 space-y-3 relative md:col-span-2">
          <button
            type="button"
            onClick={() => onGoToStep(4)}
            className="absolute top-4 right-4 text-[10px] font-black text-brand-primary hover:underline cursor-pointer uppercase"
          >
            ✏️ Editar
          </button>
          <h4 className="text-xs font-black text-[#5A5245] uppercase tracking-wider">
            4. Características Físicas y de Distribución
          </h4>

          {/* Áreas si existen */}
          <div className="flex gap-4">
            {formData.construction_area && (
              <div>
                <span className="text-[9px] uppercase font-black text-[#5A5245]/40">Área Construida</span>
                <p className="text-xs font-extrabold text-[#5A5245]">{formData.construction_area} m²</p>
              </div>
            )}
            {formData.land_area && (
              <div>
                <span className="text-[9px] uppercase font-black text-[#5A5245]/40">Área de Terreno</span>
                <p className="text-xs font-extrabold text-[#5A5245]">{formData.land_area} m²</p>
              </div>
            )}
          </div>

          {/* Distribuciones estándar */}
          {formData.property_type !== 'Terreno' && formData.property_type !== 'Solar' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#E8E2D8]/50">
              {formData.bedrooms && Number(formData.bedrooms) > 0 && (
                <div className="text-xs text-[#5A5245] font-semibold">🛏️ {formData.bedrooms} Cuarto(s)</div>
              )}
              {formData.bathrooms && Number(formData.bathrooms) > 0 && (
                <div className="text-xs text-[#5A5245] font-semibold">🚽 {formData.bathrooms} Baño(s)</div>
              )}
              {formData.living_rooms && Number(formData.living_rooms) > 0 && (
                <div className="text-xs text-[#5A5245] font-semibold">🛋️ {formData.living_rooms} Sala(s)</div>
              )}
              {formData.kitchens && Number(formData.kitchens) > 0 && (
                <div className="text-xs text-[#5A5245] font-semibold">🍳 {formData.kitchens} Cocina(s)</div>
              )}
              {formData.garages && Number(formData.garages) > 0 && (
                <div className="text-xs text-[#5A5245] font-semibold">🚗 {formData.garages} Garaje(s)</div>
              )}
              {formData.floors && Number(formData.floors) > 0 && (
                <div className="text-xs text-[#5A5245] font-semibold">🏢 {formData.floors} Planta(s)</div>
              )}
            </div>
          )}

          {/* Características Específicas de Categoría */}
          {formData.status === 'international_hostel' && (
            <div className="pt-3 border-t border-[#E8E2D8]/50 space-y-1 bg-emerald-50/20 p-3 rounded-xl">
              <span className="text-[9px] uppercase font-black text-brand-primary block">Hostal / Internacional</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-[#5A5245]/80">
                <div>🛏️ Disp: {formData.rooms_available || '0'} habitacion(es)</div>
                <div>🕒 Entrada: {formData.check_in || '-'} | Salida: {formData.check_out || '-'}</div>
                <div className="col-span-2">
                  🗣️ Idiomas: {formData.languages.length > 0 ? formData.languages.join(', ') : 'Solo Español'}
                </div>
                <div className="col-span-2 flex flex-wrap gap-2 pt-1">
                  {formData.private_bathroom && <span className="bg-white px-2 py-0.5 rounded-lg border text-[10px]">🚿 Baño Privado</span>}
                  {formData.breakfast && <span className="bg-white px-2 py-0.5 rounded-lg border text-[10px]">🍳 Desayuno</span>}
                  {formData.airport_pickup && <span className="bg-white px-2 py-0.5 rounded-lg border text-[10px]">🚗 Aeropuerto</span>}
                </div>
              </div>
            </div>
          )}

          {formData.status === 'day_pass' && (
            <div className="pt-3 border-t border-[#E8E2D8]/50 space-y-1 bg-emerald-50/20 p-3 rounded-xl">
              <span className="text-[9px] uppercase font-black text-brand-primary block">Pasadía / Evento</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-[#5A5245]/80">
                <div>👥 Capacidad: {formData.capacity || '-'} personas</div>
                <div>🕒 Horario: {formData.event_schedule || '-'}</div>
                <div className="col-span-2">
                  🎵 Música: {formData.music_allowed ? '✅ Permitida' : '❌ No permitida'}
                </div>
              </div>
            </div>
          )}

          {formData.status === 'commercial_space' && (
            <div className="pt-3 border-t border-[#E8E2D8]/50 space-y-1 bg-purple-50/20 p-3 rounded-xl">
              <span className="text-[9px] uppercase font-black text-brand-primary block">Espacio Comercial</span>
              <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#5A5245]/80">
                {formData.commercial_front && <span className="bg-white px-2 py-0.5 rounded-lg border text-[10px]">🏪 Frente Comercial</span>}
                {formData.warehouse && <span className="bg-white px-2 py-0.5 rounded-lg border text-[10px]">📦 Almacén</span>}
                {formData.office && <span className="bg-white px-2 py-0.5 rounded-lg border text-[10px]">💼 Oficina</span>}
                {formData.industrial_power && <span className="bg-white px-2 py-0.5 rounded-lg border text-[10px]">⚡ Corriente Trifásica</span>}
              </div>
            </div>
          )}
        </div>

        {/* PASO 5: AMENIDADES */}
        <div className="bg-[#FBF9F5]/40 border border-[#E2D8C7] rounded-2xl p-5 space-y-3 relative">
          <button
            type="button"
            onClick={() => onGoToStep(5)}
            className="absolute top-4 right-4 text-[10px] font-black text-brand-primary hover:underline cursor-pointer uppercase"
          >
            ✏️ Editar
          </button>
          <h4 className="text-xs font-black text-[#5A5245] uppercase tracking-wider">
            5. Amenidades
          </h4>
          {formData.amenities.length === 0 ? (
            <p className="text-xs text-[#5A5245]/60 font-semibold italic">Ninguna seleccionada</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {formData.amenities.map(a => (
                <span key={a} className="px-2 py-1 bg-white border border-[#E2D8C7] rounded-xl text-[10px] font-bold text-[#5A5245]">
                  ✨ {a}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* PASO 6: IMÁGENES Y DESCRIPCIÓN */}
        <div className="bg-[#FBF9F5]/40 border border-[#E2D8C7] rounded-2xl p-5 space-y-3 relative">
          <button
            type="button"
            onClick={() => onGoToStep(6)}
            className="absolute top-4 right-4 text-[10px] font-black text-brand-primary hover:underline cursor-pointer uppercase"
          >
            ✏️ Editar
          </button>
          <h4 className="text-xs font-black text-[#5A5245] uppercase tracking-wider">
            6. Descripción y Fotos
          </h4>
          <div>
            <span className="text-[9px] uppercase font-black text-[#5A5245]/40 block">Descripción detallada</span>
            <p className="text-xs font-semibold text-[#5A5245] bg-white border border-[#E2D8C7]/50 p-3 rounded-xl line-clamp-3 leading-relaxed">
              {formData.description || '(Sin descripción provista)'}
            </p>
          </div>
          <div>
            <span className="text-[9px] uppercase font-black text-[#5A5245]/40 block">Imágenes cargadas</span>
            <p className="text-xs font-bold text-brand-primary">
              📸 {totalPhotos} {totalPhotos === 1 ? 'imagen seleccionada' : 'imágenes seleccionadas'}
            </p>
          </div>
        </div>

        {/* PASO 7: DATOS DE CONTACTO */}
        <div className="bg-[#FBF9F5]/40 border border-[#E2D8C7] rounded-2xl p-5 space-y-3 relative md:col-span-2">
          <button
            type="button"
            onClick={() => onGoToStep(7)}
            className="absolute top-4 right-4 text-[10px] font-black text-brand-primary hover:underline cursor-pointer uppercase"
          >
            ✏️ Editar
          </button>
          <h4 className="text-xs font-black text-[#5A5245] uppercase tracking-wider">
            7. Información de Contacto (Para Administración)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[9px] uppercase font-black text-[#5A5245]/40 block">Propietario / Solicitante</span>
              <span className="text-xs font-extrabold text-[#5A5245]">{formData.owner_name}</span>
            </div>
            <div>
              <span className="text-[9px] uppercase font-black text-[#5A5245]/40 block">Teléfono / WhatsApp</span>
              <span className="text-xs font-extrabold text-brand-primary">{formData.contact}</span>
            </div>
            {formData.admin_comment && (
              <div className="sm:col-span-2">
                <span className="text-[9px] uppercase font-black text-[#5A5245]/40 block">Comentario para revisión</span>
                <p className="text-xs font-bold text-amber-800 bg-amber-50/50 border border-amber-100 p-2.5 rounded-xl">
                  💬 {formData.admin_comment}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
