'use client';

import React, { useEffect } from 'react';
import { Property, PropertyStatus, STATUS_OPTIONS } from '@/lib/types';
import { getStatusBadge } from '@/lib/utils';

interface RegisteredPropertiesListProps {
  properties: Property[];
  loading: boolean;
  adminFilter: string;
  onFilterChange: (filter: string) => void;
  onEdit: (property: Property) => void;
  onDelete: (id: string) => void;
  view: 'all' | 'pending' | 'featured' | 'sold';
}

export default function RegisteredPropertiesList({
  properties,
  loading,
  adminFilter,
  onFilterChange,
  onEdit,
  onDelete,
  view,
}: RegisteredPropertiesListProps) {
  // Reset admin filter to 'all' when switching views to avoid conflicting filters
  useEffect(() => {
    onFilterChange('all');
  }, [view, onFilterChange]);

  // 1. First, apply the view filter
  const viewFilteredProperties = properties.filter((prop) => {
    if (view === 'pending') {
      return !prop.is_published;
    }
    if (view === 'featured') {
      return [1, 2, 3].includes(prop.priority);
    }
    if (view === 'sold') {
      return !!prop.is_sold;
    }
    // 'all' includes absolutely everything
    return true;
  });

  // 2. Second, apply the classification filter (tabs)
  const filteredProperties = viewFilteredProperties.filter((prop) => {
    if (adminFilter === 'all') return true;
    const propStatuses = Array.isArray(prop.status) ? prop.status : [prop.status];
    return propStatuses.includes(adminFilter as PropertyStatus);
  });

  // Helper to render a table body for a list of properties
  const renderTableContent = (propsList: Property[]) => {
    if (propsList.length === 0) {
      return (
        <tr>
          <td colSpan={5} className="py-8 text-center text-xs text-[#5A5245]/60 font-semibold bg-[#FBF9F5]/40 rounded-2xl">
            No hay propiedades para mostrar en esta sección.
          </td>
        </tr>
      );
    }

    return propsList.map((prop) => {
      const propStatuses = Array.isArray(prop.status) ? prop.status : [prop.status];

      return (
        <tr key={prop.id} className="hover:bg-[#FBF9F5]/40 transition-colors group">
          {/* INFO PRINCIPAL */}
          <td className="py-4 px-4">
            <div className="flex items-center gap-3">
              {prop.images && prop.images.length > 0 ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#E2D8C7] shrink-0 bg-stone-100">
                  <img src={prop.images[0]} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#F2ECE1] border border-[#E2D8C7] flex items-center justify-center text-lg shrink-0 select-none">
                  🏠
                </div>
              )}
              <div className="max-w-[180px] sm:max-w-xs md:max-w-md lg:max-w-lg">
                <h3 className="text-xs font-black text-[#1E67AD] truncate tracking-tight leading-snug">
                  {prop.title}
                </h3>
                <p className="text-[10px] text-[#5A5245]/70 font-semibold truncate mt-0.5">
                  📍 {prop.address}
                </p>
              </div>
            </div>
          </td>

          {/* CLASIFICACIÓN STATUS */}
          <td className="py-4 px-4">
            <div className="flex flex-wrap gap-1 max-w-[150px]">
              {propStatuses.map((st) => {
                const badge = getStatusBadge(st);
                return (
                  <span
                    key={st}
                    className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wider uppercase border leading-none ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                );
              })}
            </div>
          </td>

          {/* PRECIO */}
          <td className="py-4 px-4 whitespace-nowrap">
            <div className="text-xs font-extrabold text-[#1E67AD]">
              {Number(prop.price).toLocaleString('en-US')}{' '}
              <span className="text-[10px] text-[#C8976C] font-black">
                {prop.currency}
              </span>
            </div>
            {prop.is_sold && (
              <span className="inline-block mt-1 px-1.5 py-0.5 bg-rose-50 border border-rose-200 text-rose-700 text-[8px] font-black uppercase rounded-md tracking-wider leading-none">
                🔴 Vendida
              </span>
            )}
          </td>

          {/* PRIORIDAD */}
          <td className="py-4 px-4 whitespace-nowrap">
            {prop.priority === 1 ? (
              <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-[#C8976C] text-[9px] font-black uppercase rounded-lg tracking-wider">
                ⭐ Patrocinada
              </span>
            ) : prop.priority === 2 ? (
              <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 text-[9px] font-black uppercase rounded-lg tracking-wider">
                💼 Agente
              </span>
            ) : prop.priority === 3 ? (
              <span className="px-2 py-0.5 bg-teal-50 border border-teal-200 text-[#2A93A6] text-[9px] font-black uppercase rounded-lg tracking-wider">
                🏠 Estándar
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 text-[9px] font-black uppercase rounded-lg tracking-wider">
                📄 Básica
              </span>
            )}
          </td>

          {/* ACCIONES */}
          <td className="py-4 px-4 text-right whitespace-nowrap">
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={() => onEdit(prop)}
                className="px-3 py-1.5 bg-[#F2ECE1] hover:bg-[#E2D8C7] text-[#1E67AD] text-xs font-black rounded-xl transition cursor-pointer"
              >
                ✏️ Editar
              </button>
              <button
                type="button"
                onClick={() => onDelete(prop.id)}
                className="w-8 h-8 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center transition border border-rose-100 cursor-pointer text-xs font-black"
                title="Eliminar propiedad"
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  const isFeaturedView = view === 'featured';

  // Group properties if we are in featured view
  const featuredGroups = {
    p1: filteredProperties.filter((p) => p.priority === 1),
    p2: filteredProperties.filter((p) => p.priority === 2),
    p3: filteredProperties.filter((p) => p.priority === 3),
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2D8C7] space-y-6 animate-in fade-in duration-300">
      {/* CABECERA CON PESTAÑAS */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-[#E8E2D8] pb-4">
        <div>
          <h2 className="text-lg font-black text-[#1E67AD] tracking-tight">
            {view === 'all' && 'Todas las propiedades'}
            {view === 'pending' && 'Publicaciones pendientes'}
            {view === 'featured' && 'Propiedades destacadas'}
            {view === 'sold' && 'Propiedades vendidas'}
          </h2>
          <p className="text-xs text-[#5A5245] font-semibold mt-0.5">
            {view === 'all' && 'Administra, edita o elimina todas las propiedades de tu base de datos.'}
            {view === 'pending' && 'Propiedades pendientes de aprobación enviadas por los usuarios.'}
            {view === 'featured' && 'Propiedades premium destacadas organizadas según su nivel de prioridad.'}
            {view === 'sold' && 'Propiedades que ya han sido marcadas como vendidas.'}
          </p>
        </div>

        {/* PESTAÑAS DE FILTRADO */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              adminFilter === 'all'
                ? 'bg-gradient-to-r from-[#1E67AD] to-[#2A93A6] text-white shadow-md shadow-[#1E67AD]/10'
                : 'bg-[#F2ECE1]/55 text-[#5A5245] hover:bg-[#E2D8C7]/50 border border-transparent'
            }`}
          >
            Todas ({viewFilteredProperties.length})
          </button>

          {STATUS_OPTIONS.map((opt) => {
            const count = viewFilteredProperties.filter((p) => {
              const st = Array.isArray(p.status) ? p.status : [p.status];
              return st.includes(opt.value);
            }).length;

            const label = opt.label;
            const emojiAndText = label.split(' ');

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => onFilterChange(opt.value)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  adminFilter === opt.value
                    ? 'bg-gradient-to-r from-[#1E67AD] to-[#2A93A6] text-white shadow-md shadow-[#1E67AD]/10'
                    : 'bg-[#F2ECE1]/55 text-[#5A5245] hover:bg-[#E2D8C7]/50 border border-transparent'
                }`}
                title={opt.label}
              >
                {emojiAndText[0]} {emojiAndText.slice(1).join(' ')} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* CONTENIDO DE LA TABLA/LISTA */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#1E67AD] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-[#5A5245] font-semibold">Cargando propiedades de Supabase...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="py-12 text-center bg-[#FBF9F5] rounded-2xl border border-dashed border-[#E2D8C7]">
          <span className="text-3xl block mb-2">📂</span>
          <p className="text-xs text-[#5A5245] font-black uppercase tracking-wider">Sin propiedades</p>
          <p className="text-[11px] text-[#5A5245]/60 font-semibold mt-1">
            No hay propiedades en esta clasificación actualmente.
          </p>
        </div>
      ) : isFeaturedView ? (
        <div className="space-y-12">
          {/* GROUP 1: PRIORIDAD 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-2">
              <span className="text-base">⭐</span>
              <h3 className="text-sm font-black text-[#5A5245] uppercase tracking-wider">
                Prioridad 1 - Patrocinadas
              </h3>
              <span className="text-xs bg-[#F2ECE1] text-[#1E67AD] px-2 py-0.5 rounded-lg font-bold">
                {featuredGroups.p1.length}
              </span>
            </div>
            {featuredGroups.p1.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8E2D8] text-[10px] text-[#5A5245]/50 font-black uppercase tracking-widest bg-[#FBF9F5]/40">
                      <th className="py-3 px-4 font-black">Detalle Propiedad</th>
                      <th className="py-3 px-4 font-black">Clasificación</th>
                      <th className="py-3 px-4 font-black">Precio solicitado</th>
                      <th className="py-3 px-4 font-black">Prioridad</th>
                      <th className="py-3 px-4 text-right font-black">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D8]/50">
                    {renderTableContent(featuredGroups.p1)}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-[#5A5245]/50 italic pl-6">No hay propiedades con Prioridad 1.</p>
            )}
          </div>

          {/* GROUP 2: PRIORIDAD 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-2">
              <span className="text-base">🥈</span>
              <h3 className="text-sm font-black text-[#5A5245] uppercase tracking-wider">
                Prioridad 2 - Agente
              </h3>
              <span className="text-xs bg-[#F2ECE1] text-[#1E67AD] px-2 py-0.5 rounded-lg font-bold">
                {featuredGroups.p2.length}
              </span>
            </div>
            {featuredGroups.p2.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8E2D8] text-[10px] text-[#5A5245]/50 font-black uppercase tracking-widest bg-[#FBF9F5]/40">
                      <th className="py-3 px-4 font-black">Detalle Propiedad</th>
                      <th className="py-3 px-4 font-black">Clasificación</th>
                      <th className="py-3 px-4 font-black">Precio solicitado</th>
                      <th className="py-3 px-4 font-black">Prioridad</th>
                      <th className="py-3 px-4 text-right font-black">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D8]/50">
                    {renderTableContent(featuredGroups.p2)}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-[#5A5245]/50 italic pl-6">No hay propiedades con Prioridad 2.</p>
            )}
          </div>

          {/* GROUP 3: PRIORIDAD 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E8E2D8] pb-2">
              <span className="text-base">🏠</span>
              <h3 className="text-sm font-black text-[#5A5245] uppercase tracking-wider">
                Prioridad 3 - Estándar Destacada
              </h3>
              <span className="text-xs bg-[#F2ECE1] text-[#1E67AD] px-2 py-0.5 rounded-lg font-bold">
                {featuredGroups.p3.length}
              </span>
            </div>
            {featuredGroups.p3.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8E2D8] text-[10px] text-[#5A5245]/50 font-black uppercase tracking-widest bg-[#FBF9F5]/40">
                      <th className="py-3 px-4 font-black">Detalle Propiedad</th>
                      <th className="py-3 px-4 font-black">Clasificación</th>
                      <th className="py-3 px-4 font-black">Precio solicitado</th>
                      <th className="py-3 px-4 font-black">Prioridad</th>
                      <th className="py-3 px-4 text-right font-black">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2D8]/50">
                    {renderTableContent(featuredGroups.p3)}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-[#5A5245]/50 italic pl-6">No hay propiedades con Prioridad 3.</p>
            )}
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D8] text-[10px] text-[#5A5245]/50 font-black uppercase tracking-widest bg-[#FBF9F5]/40">
                <th className="py-3 px-4 font-black">Detalle Propiedad</th>
                <th className="py-3 px-4 font-black">Clasificación</th>
                <th className="py-3 px-4 font-black">Precio solicitado</th>
                <th className="py-3 px-4 font-black">Prioridad</th>
                <th className="py-3 px-4 text-right font-black">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D8]/50">
              {renderTableContent(filteredProperties)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
