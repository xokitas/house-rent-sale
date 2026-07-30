'use client';

import { useState } from 'react';
import { Property } from '@/lib/types';
import PropertyModal from '@/components/PropertyModal';
import { getStatusBadge } from '@/lib/utils';
import { MapPin, ImageIcon, Phone, MessageCircle, Search } from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
}

// Mapa de colores para el badge principal según la clasificación
const STATUS_BADGE_COLORS: Record<string, string> = {
  sale: 'bg-[#1E67AD]',
  long_term: 'bg-emerald-600',
  commercial_space: 'bg-purple-600',
  international_hostel: 'bg-orange-500',
  local_rent: 'bg-amber-600',
  swap: 'bg-teal-600',
  day_pass: 'bg-pink-600',
};

export default function PropertyList({ properties }: PropertyListProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [pendingMapUrl, setPendingMapUrl] = useState<string | null>(null);

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center shadow-xs border border-[#E2D8C7]">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#F2ECE1] border border-[#E2D8C7] flex items-center justify-center text-[#1E67AD]">
          <Search className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-black text-[#153B6B] mb-1">No encontramos propiedades</h3>
        <p className="text-slate-500 text-sm font-semibold">Prueba ajustando o quitando los filtros de búsqueda.</p>
      </div>
    );
  }

  const handleMapClick = (e: React.MouseEvent, mapUrl: string) => {
    e.stopPropagation();
    setPendingMapUrl(mapUrl);
  };

  const confirmNavigation = () => {
    if (pendingMapUrl) {
      window.open(pendingMapUrl, '_blank', 'noopener,noreferrer');
      setPendingMapUrl(null);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {properties.map((property) => {
          const mainImage =
            property.images && property.images.length > 0 ? property.images[0] : null;

          const mapUrl =
            property.latitude && property.longitude
              ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
              : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  property.address + ', Camagüey'
                )}`;

          // Garantizamos que status sea tratado siempre como un arreglo
          const statuses = Array.isArray(property.status) ? property.status : [property.status];
          const primaryStatus = statuses[0];
          const primaryBadge = getStatusBadge(primaryStatus);
          const primaryColor = STATUS_BADGE_COLORS[primaryStatus] || 'bg-[#1E67AD]';

          return (
            <div
              key={property.id}
              onClick={() => setSelectedProperty(property)}
              className="bg-white rounded-2xl shadow-xs border border-[#E2D8C7]/70 overflow-hidden flex flex-col
                         transition-all duration-200 ease-out
                         hover:shadow-lg hover:-translate-y-1 cursor-pointer active:scale-[0.99]"
            >
              {/* VISTA PREVIA DE LA IMAGEN */}
              <div className="relative h-44 w-full bg-[#F2ECE1] overflow-hidden">
                {mainImage ? (
                  <img
                    src={mainImage || '/placeholder.svg'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-1">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-xs font-semibold">Sin vista previa</span>
                  </div>
                )}

                {/* Badge principal de clasificación (esquina superior izquierda) */}
                <span
                  className={`absolute top-3 left-3 ${primaryColor} text-white text-[11px] font-black px-3 py-1 rounded-full shadow-sm`}
                >
                  {primaryBadge.label}
                </span>

                {/* Badge de cantidad de imágenes */}
                {property.images && property.images.length > 1 && (
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <ImageIcon className="w-3 h-3" />
                    {property.images.length}
                  </span>
                )}

                {/* Botón del mapa flotante */}
                <button
                  type="button"
                  onClick={(e) => handleMapClick(e, mapUrl)}
                  className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#1E67AD] bg-white/90 backdrop-blur-md hover:bg-white px-2.5 py-1 rounded-full border border-white/60 shadow-sm cursor-pointer transition"
                >
                  <MapPin className="w-3 h-3" />
                  Mapa
                </button>
              </div>

              {/* CUERPO DE LA TARJETA */}
              <div className="p-4 flex-1 flex flex-col">
                {/* Precio grande */}
                <div className="mb-1">
                  <span className="text-xl font-black text-[#153B6B] leading-none">
                    {Number(property.price).toLocaleString('en-US')}
                  </span>{' '}
                  <span className="text-xs font-bold text-slate-500">{property.currency}</span>
                </div>

                {/* Título */}
                <h2 className="text-sm font-black text-[#5A5245] line-clamp-1 mb-2">
                  {property.title}
                </h2>

                {/* Ubicación */}
                <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="line-clamp-1">{property.address}</span>
                </p>

                {/* Etiquetas secundarias (si tiene más de una clasificación) */}
                {statuses.length > 1 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {statuses.slice(1).map((st) => {
                      const badge = getStatusBadge(st);
                      return (
                        <span
                          key={st}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F2ECE1] text-[#5A5245] border border-[#E2D8C7]"
                        >
                          {badge.label}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Acciones de contacto */}
                <div
                  className="mt-auto pt-3 border-t border-[#E8E2D8] flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <a
                    href={`tel:${property.contact}`}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#F2ECE1] hover:bg-[#E8E2D8] text-[#1E67AD] transition shrink-0"
                    title={`Llamar ${property.contact}`}
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/${property.contact.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-xs active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL DETALLE */}
      <PropertyModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      {/* MODAL ADVERTENCIA MAPA DE TARJETA */}
      {pendingMapUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#E2D8C7] text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-[#F2ECE1] text-[#1E67AD] rounded-2xl flex items-center justify-center mx-auto border border-[#E2D8C7]">
              <MapPin className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#153B6B]">Aviso sobre la ubicación</h3>
              <div className="text-xs text-[#5A5245] mt-2 space-y-2 text-left leading-relaxed font-medium">
                <p>
                  • <strong>Referencial:</strong> La ubicación indica la calle o zona general, no el
                  número exacto de la vivienda.
                </p>
                <p>
                  • <strong>Nombres de calles:</strong> Google Maps a veces usa nombres antiguos. Si
                  vas a desplazarte, se recomienda verificar en aplicaciones como{' '}
                  <strong>Maps.me</strong> o coordinar directamente con el dueño.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingMapUrl(null)}
                className="flex-1 px-4 py-2.5 bg-[#F2ECE1] hover:bg-[#E8E2D8] text-[#1E67AD] text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmNavigation}
                className="flex-1 px-4 py-2.5 bg-[#1E67AD] hover:bg-[#175691] text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
              >
                Abrir mapa ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
