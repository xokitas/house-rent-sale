'use client';

import { useState } from 'react';

interface FilterDrawerProps {
  filterType: string;
  maxPrice: string;
}

export default function FilterDrawer({ filterType, maxPrice }: FilterDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* BOTÓN FLOTANTE / ENCABEZADO PARA ABRIR FILTROS */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition shadow-md active:scale-95 cursor-pointer"
        >
          {/* Icono de Filtros / Hamburguesa estilizada */}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filtrar Búsqueda</span>
          {(filterType !== 'all' || maxPrice) && (
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          )}
        </button>

        <p className="text-xs text-slate-500 font-medium">
          {filterType !== 'all' || maxPrice ? 'Filtros activos' : 'Mostrando todo'}
        </p>
      </div>

      {/* OVERLAY / FONDO OSCURO Y PANEL LATERAL (DRAWER) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Fondo semi-transparente */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              
              {/* Encabezado del Panel */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎛️</span>
                  <h2 className="text-lg font-bold text-slate-900">Filtros de Búsqueda</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
                >
                  ✕
                </button>
              </div>

              {/* Formulario de Filtros */}
              <form method="GET" className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Tipo de Propiedad */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                    Tipo de propiedad a visualizar
                  </label>
                  <div className="space-y-2">
                    {[
                      { id: 'all', label: 'Todas las propiedades' },
                      { id: 'rent', label: 'Alquiler (Larga estancia)' },
                      { id: 'vacation', label: 'Renta u Hostal (Por días o noche)' },
                      { id: 'sale', label: 'En Venta' },
                    ].map((item) => (
                      <label 
                        key={item.id} 
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-sm font-semibold transition border ${
                          filterType === item.id 
                            ? 'bg-slate-950 text-white border-slate-950 shadow-sm' 
                            : 'text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        <input 
                          type="radio" 
                          name="type" 
                          value={item.id} 
                          defaultChecked={filterType === item.id}
                          className="sr-only"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filtro de Precio Máximo */}
                <div>
                  <label htmlFor="maxPrice" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Precio Máximo
                  </label>
                  <input 
                    type="number" 
                    id="maxPrice"
                    name="maxPrice" 
                    placeholder="Ej: 500" 
                    defaultValue={maxPrice}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-950 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50 font-medium"
                  />
                </div>

                {/* Botones de Acción */}
                <div className="pt-4 space-y-2">
                  <button 
                    type="submit" 
                    onClick={() => setIsOpen(false)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md active:scale-95"
                  >
                    Ver Resultados
                  </button>

                  {(filterType !== 'all' || maxPrice) && (
                    <a 
                      href="/" 
                      className="block text-center w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition"
                    >
                      Limpiar Filtros
                    </a>
                  )}
                </div>
              </form>

              {/* Pie del Panel */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-xs text-slate-400">
                MiCasita Camagüey • Filtros en tiempo real
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}