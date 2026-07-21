'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterDrawerProps {
  filterType: string;
  maxPrice: string;
}

export default function FilterDrawer({ filterType, maxPrice }: FilterDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(filterType || 'all');
  const [priceValue, setPriceValue] = useState(maxPrice || '100000');

  // Sincronizar el estado con la URL cuando cambien los parámetros
  useEffect(() => {
    setSelectedType(filterType || 'all');
    setPriceValue(maxPrice || '100000');
  }, [filterType, maxPrice]);

  // Función para aplicar filtros de forma imperativa en Next.js
  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams(searchParams.toString());

    if (selectedType && selectedType !== 'all') {
      params.set('type', selectedType);
    } else {
      params.delete('type');
    }

    if (priceValue && priceValue !== '100000') {
      params.set('maxPrice', priceValue);
    } else {
      params.delete('maxPrice');
    }

    // Forzamos el cambio de URL y refresco del servidor
    router.push(`/?${params.toString()}`);
    setIsOpen(false);
  };

  // Función para limpiar filtros
  const handleReset = () => {
    setSelectedType('all');
    setPriceValue('100000');
    router.push('/');
    setIsOpen(false);
  };

  return (
    <>
      {/* BOTÓN FLOTANTE PARA ABRIR FILTROS */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition shadow-md active:scale-95 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filtrar Búsqueda</span>
          {(filterType !== 'all' || (maxPrice && maxPrice !== '100000')) && (
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          )}
        </button>

        <p className="text-xs text-slate-500 font-medium">
          {filterType !== 'all' || (maxPrice && maxPrice !== '100000') ? 'Filtros activos' : 'Mostrando todo'}
        </p>
      </div>

      {/* PANEL LATERAL (DRAWER) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
              
              {/* Encabezado */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎛️</span>
                  <h2 className="text-lg font-bold text-slate-900">Filtros de Búsqueda</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Formulario de Filtros */}
              <form onSubmit={handleApplyFilters} className="p-6 space-y-6 flex-1 overflow-y-auto">
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
                      <div 
                        key={item.id} 
                        onClick={() => setSelectedType(item.id)}
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-sm font-semibold transition border ${
                          selectedType === item.id 
                            ? 'bg-slate-950 text-white border-slate-950 shadow-sm' 
                            : 'text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span>{item.label}</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          selectedType === item.id ? 'border-white bg-blue-600' : 'border-slate-300'
                        }`}>
                          {selectedType === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtro de Precio: Manual + Slider Sincronizados */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="maxPrice" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Precio Máximo
                    </label>
                    <span className="text-xs font-semibold text-slate-400">Exacto o Rango</span>
                  </div>

                  {/* Input manual de precio exacto */}
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                    <input 
                      type="number"
                      id="maxPrice"
                      min="0"
                      max="100000"
                      value={priceValue}
                      onChange={(e) => setPriceValue(e.target.value)}
                      placeholder="Ej: 500"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>

                  {/* Slider de Precio */}
                  <input 
                    type="range" 
                    min="100" 
                    max="100000" 
                    step="100"
                    value={priceValue || '100000'}
                    onChange={(e) => setPriceValue(e.target.value)}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                  />
                  
                  <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                    <span>$100</span>
                    <span>$50,000</span>
                    <span>$100,000</span>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="pt-2 space-y-2">
                  <button 
                    type="submit" 
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md active:scale-95 cursor-pointer"
                  >
                    Ver Resultados
                  </button>

                  {(filterType !== 'all' || (maxPrice && maxPrice !== '100000')) && (
                    <button 
                      type="button"
                      onClick={handleReset}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-xs rounded-xl transition cursor-pointer"
                    >
                      Limpiar Filtros
                    </button>
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