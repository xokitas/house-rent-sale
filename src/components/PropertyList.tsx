'use client';

import { useState } from 'react';
import { Property } from '@/lib/types';
import PropertyModal from '@/components/PropertyModal';
import { getStatusBadge } from '@/lib/utils';

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [pendingMapUrl, setPendingMapUrl] = useState<string | null>(null);

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
        <p className="text-4xl mb-3">🔍</p>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No encontramos propiedades</h3>
        <p className="text-slate-500 text-sm">Prueba ajustando o quitando los filtros de búsqueda.</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 group">
        {properties.map((property) => {
          const mainImage = property.images && property.images.length > 0 
            ? property.images[0] 
            : null;

          const mapUrl = property.latitude && property.longitude
            ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ', Camagüey')}`;

          // Garantizamos que status sea tratado siempre como un arreglo
          const statuses = Array.isArray(property.status) 
            ? property.status 
            : [property.status];

          return (
            <div 
              key={property.id} 
              onClick={() => setSelectedProperty(property)}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between 
                         transition-all duration-200 ease-out
                         hover:scale-[1.01] hover:shadow-xl cursor-pointer active:scale-95"
            >
              {/* VISTA PREVIA DE LA IMAGEN */}
              {mainImage ? (
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                  <img 
                    src={mainImage} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {property.images && property.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      📷 {property.images.length}
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-400 border-b border-slate-100 text-sm font-medium">
                  🏠 Sin vista previa
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-3">
                  {/* RENDEREAMOS UNO O VARIOS BADGES SEGÚN LAS CLASIFICACIONES DE LA CASA */}
                  <div className="flex flex-wrap gap-1">
                    {statuses.map((st) => {
                      const badge = getStatusBadge(st);
                      return (
                        <span 
                          key={st} 
                          className={`px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold tracking-wide uppercase border ${badge.className}`}
                        >
                          {badge.label}
                        </span>
                      );
                    })}
                  </div>
                  
                  {/* BOTÓN DEL MAPA EN TARJETA */}
                  <button
                    type="button"
                    onClick={(e) => handleMapClick(e, mapUrl)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-md border border-slate-200 cursor-pointer shrink-0"
                  >
                    📍 Mapa
                  </button>
                </div>

                <h2 className="text-xl font-bold text-slate-900 line-clamp-1 mb-1">
                  {property.title}
                </h2>
                
                <p className="text-sm text-slate-500 mb-4">
                  📍 {property.address}
                </p>

                <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1 whitespace-pre-line">
                  {property.description || 'Sin descripción disponible.'}
                </p>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Precio</p>
                  <div className="text-xl font-black text-slate-900 leading-tight">
                    {Number(property.price).toLocaleString('en-US')} <span className="text-sm font-bold text-blue-600">{property.currency}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
                  <a 
                    href={`tel:${property.contact}`}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
                    title="Toca para llamar"
                  >
                    📞 {property.contact}
                  </a>

                  <a 
                    href={`https://wa.me/${property.contact.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-3.5 py-1.5 text-xs font-bold rounded-lg text-white bg-slate-950 hover:bg-slate-800 transition shadow-sm active:scale-95"
                  >
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
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold border border-amber-100">
              📍
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-900">Aviso sobre la ubicación</h3>
              <div className="text-xs text-slate-500 mt-2 space-y-2 text-left leading-relaxed">
                <p>
                  • <strong>Referencial:</strong> La ubicación indica la calle o zona general, no el número exacto de la vivienda.
                </p>
                <p>
                  • <strong>Nombres de calles:</strong> Google Maps a veces usa nombres antiguos. Si vas a desplazarte, se recomienda verificar en aplicaciones como <strong>Maps.me</strong> o coordinar directamente con el dueño.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingMapUrl(null)}
                className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                onClick={confirmNavigation}
                className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-sm active:scale-95 cursor-pointer"
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