'use client';

import React from 'react';
import { PROPERTY_TYPE_OPTIONS } from '@/lib/types';

interface PropertyStructuralCardProps {
  propertyType: string;
  bedrooms: string;
  bathrooms: string;
  livingRooms: string;
  diningRooms: string;
  kitchens: string;
  indoorPatios: string;
  outdoorPatios: string;
  garages: string;
  terraces: string;
  balconies: string;
  portals: string;
  floors: string;
  constructionArea: string;
  landArea: string;
  onFormChange: (field: string, value: string) => void;
  category?: string; // Optional prop for public wizard intelligence
}

export default function PropertyStructuralCard({
  propertyType,
  bedrooms,
  bathrooms,
  livingRooms,
  diningRooms,
  kitchens,
  indoorPatios,
  outdoorPatios,
  garages,
  terraces,
  balconies,
  portals,
  floors,
  constructionArea,
  landArea,
  onFormChange,
  category,
}: PropertyStructuralCardProps) {
  // INTELLIGENCE FIELD VISIBILITY LOGIC
  const isTerrenoOrSolar = propertyType === 'Terreno' || propertyType === 'Solar';
  const isCommercialSpace = propertyType === 'Local Comercial' || category === 'commercial_space';
  const isHostelOrRoom = propertyType === 'Hostal' || propertyType === 'Habitación' || category === 'international_hostel';

  // Determine what structural fields to display
  const showConstructionArea = !isTerrenoOrSolar;
  const showLandArea = true; // Always show land area or keep it as optional

  // Determine which distribution inputs are shown
  interface DistributionItem {
    label: string;
    field: string;
    val: string;
  }

  const allDistributionFields: DistributionItem[] = [
    { label: '🛏️ Cuartos', field: 'bedrooms', val: bedrooms },
    { label: '🚽 Baños', field: 'bathrooms', val: bathrooms },
    { label: '🛋️ Salas', field: 'living_rooms', val: livingRooms },
    { label: '🍽️ Comedores', field: 'dining_rooms', val: diningRooms },
    { label: '🍳 Cocinas', field: 'kitchens', val: kitchens },
    { label: '🪴 Patios Int.', field: 'indoor_patios', val: indoorPatios },
    { label: '🌳 Patios Ext.', field: 'outdoor_patios', val: outdoorPatios },
    { label: '🚗 Garajes', field: 'garages', val: garages },
    { label: '🌇 Terrazas', field: 'terraces', val: terraces },
    { label: '🌅 Balcones', field: 'balconies', val: balconies },
    { label: '🚪 Portales', field: 'portals', val: portals },
    { label: '🏢 Pisos/Plantas', field: 'floors', val: floors },
  ];

  let visibleDistributionFields: DistributionItem[] = [];

  if (isTerrenoOrSolar) {
    // Terrenos and Solars don't show any room distributions
    visibleDistributionFields = [];
  } else if (isCommercialSpace) {
    // Only show relevant fields for commercial spaces
    visibleDistributionFields = allDistributionFields.filter(item =>
      ['bathrooms', 'garages', 'floors'].includes(item.field)
    );
  } else if (isHostelOrRoom) {
    // Only show relevant fields for hostels / independent rooms
    visibleDistributionFields = allDistributionFields.filter(item =>
      ['bedrooms', 'bathrooms', 'floors'].includes(item.field)
    );
  } else {
    // Show all for standard housing / residential
    visibleDistributionFields = allDistributionFields;
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-6 animate-in fade-in duration-300">
      {/* SECCIÓN CABECERA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-[#1E67AD] uppercase tracking-wider flex items-center gap-2">
          <span>🏗️</span> Características Estructurales
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          {isTerrenoOrSolar
            ? 'Detalla las dimensiones físicas y de terreno de la propiedad.'
            : 'Detalla los tipos de espacios, habitaciones, áreas y dimensiones físicas de la propiedad.'}
        </p>
      </div>

      {/* TIPO DE PROPIEDAD */}
      <div className="space-y-1.5">
        <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
          Tipo de Propiedad <span className="text-[#1E67AD]">*</span>
        </label>
        <select
          value={propertyType}
          required
          onChange={(e) => onFormChange('property_type', e.target.value)}
          className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200 cursor-pointer"
        >
          <option value="">Seleccione tipo de propiedad</option>
          {PROPERTY_TYPE_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* ÁREAS (CONSTRUCCIÓN Y TERRENO) */}
      {(showConstructionArea || showLandArea) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {showConstructionArea && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
                Área de Construcción (m²)
              </label>
              <input
                type="number"
                placeholder="Ej. 120"
                value={constructionArea}
                onChange={(e) => onFormChange('construction_area', e.target.value)}
                className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
              />
            </div>
          )}

          {showLandArea && (
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
                Área de Terreno (m²) {isTerrenoOrSolar && <span className="text-[#1E67AD]">*</span>}
              </label>
              <input
                type="number"
                required={isTerrenoOrSolar}
                placeholder="Ej. 300"
                value={landArea}
                onChange={(e) => onFormChange('land_area', e.target.value)}
                className="w-full text-xs p-3.5 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200"
              />
            </div>
          )}
        </div>
      )}

      {/* GRID DE CANTIDADES DE HABITACIONES Y ESPACIOS */}
      {visibleDistributionFields.length > 0 && (
        <div className="pt-4 border-t border-[#E8E2D8] space-y-4">
          <h4 className="text-[11px] font-black text-[#1E67AD] uppercase tracking-wider">
            Distribución de Habitaciones y Espacios
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {visibleDistributionFields.map((item) => (
              <div key={item.field} className="space-y-1">
                <label className="block text-[10px] font-black text-[#5A5245] uppercase tracking-wider">
                  {item.label}
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={item.val}
                  onChange={(e) => onFormChange(item.field, e.target.value)}
                  className="w-full text-xs p-3 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-[#1E67AD] focus:bg-white transition-all duration-200 text-center"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
