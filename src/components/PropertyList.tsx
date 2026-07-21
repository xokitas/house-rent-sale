'use client';

import { useState } from 'react';
import { Property } from '@/lib/types';
import PropertyModal from '@/components/PropertyModal';

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
        <p className="text-4xl mb-3">🔍</p>
        <h3 className="text-lg font-bold text-slate-900 mb-1">No encontramos propiedades</h3>
        <p className="text-slate-500 text-sm">Prueba ajustando o quitando los filtros de búsqueda.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 group">
        {properties.map((property) => {
          const mainImage = property.images && property.images.length > 0 
            ? property.images[0] 
            : null;

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
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${
                    property.status === 'rent' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : property.status === 'vacation'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {property.status === 'rent' ? 'Alquiler' : property.status === 'vacation' ? 'Renta Hostal' : 'Venta'}
                  </span>
                  
                  {property.latitude && property.longitude && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 transition bg-slate-100 hover:bg-blue-50 px-2.5 py-1 rounded-md border border-slate-200"
                    >
                      📍 Ver en mapa
                    </a>
                  )}
                </div>

                <h2 className="text-xl font-bold text-slate-900 line-clamp-1 mb-1">
                  {property.title}
                </h2>
                
                <p className="text-sm text-slate-500 mb-4">
                  📍 {property.address}
                </p>

                <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
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

      {/* MODAL CON EL CARRUSEL Y ANIMACIÓN */}
      <PropertyModal 
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </>
  );
}