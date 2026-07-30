'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';

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

  const hasActiveFilters = filterType !== 'all' || (maxPrice && maxPrice !== '100000');

  return (
    <>
      {/* BOTÓN ICONO (ESTILO AZUL DE MARCA) */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Filtrar búsqueda"
        className="relative inline-flex items-center justify-center bg-[#1E67AD] hover:bg-[#175691] text-white w-11 h-11 rounded-2xl shadow-sm transition-all duration-300 ease-in-out cursor-pointer active:scale-95"
      >
        <SlidersHorizontal className="w-5 h-5 shrink-0" />

        {/* Indicador de filtro activo en el propio icono */}
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {/* PANEL LATERAL (DRAWER) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 max-w-full flex">
            <div className="w-screen max-w-md bg-[#FBF9F5] shadow-2xl flex flex-col justify-between">
              {/* Encabezado */}
              <div className="p-6 border-b border-[#E8E2D8] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#1E67AD]/10 flex items-center justify-center text-[#1E67AD]">
                    <SlidersHorizontal className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-black text-[#153B6B]">Filtros de búsqueda</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Cerrar filtros"
                  className="p-2 text-slate-400 hover:text-[#1E67AD] rounded-lg hover:bg-[#F2ECE1] transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Formulario de Filtros */}
              <form onSubmit={handleApplyFilters} className="p-6 space-y-6 flex-1 overflow-y-auto">
                {/* Tipo de Propiedad */}
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
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
                        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer text-sm font-bold transition border ${
                          selectedType === item.id
                            ? 'bg-[#1E67AD] text-white border-[#1E67AD] shadow-sm'
                            : 'bg-white text-[#5A5245] border-[#E2D8C7] hover:border-[#1E67AD]/50'
                        }`}
                      >
                        <span>{item.label}</span>
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                            selectedType === item.id ? 'border-white bg-white/20' : 'border-slate-300'
                          }`}
                        >
                          {selectedType === item.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filtro de Precio */}
                <div className="bg-white p-4 rounded-2xl border border-[#E2D8C7] space-y-3">
                  <div className="flex items-center justify-between">
                    <label htmlFor="maxPrice" className="text-xs font-black text-slate-500 uppercase tracking-wider">
                      Precio máximo
                    </label>
                    <span className="text-xs font-semibold text-slate-400">Exacto o rango</span>
                  </div>

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
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-[#E2D8C7] text-sm font-bold text-[#153B6B] bg-[#FBF9F5] focus:outline-none focus:ring-2 focus:ring-[#1E67AD]"
                    />
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={priceValue || '100000'}
                    onChange={(e) => setPriceValue(e.target.value)}
                    className="w-full h-2 bg-[#E2D8C7] rounded-lg appearance-none cursor-pointer accent-[#1E67AD]"
                  />

                  <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                    <span>$100</span>
                    <span>$50,000</span>
                    <span>$100,000</span>
                  </div>
                </div>

                {/* Botones de Acción */}
                <div className="pt-2 space-y-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#1E67AD] hover:bg-[#175691] text-white font-black text-sm rounded-xl transition shadow-md active:scale-95 cursor-pointer"
                  >
                    Ver resultados
                  </button>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-full py-2.5 bg-[#F2ECE1] hover:bg-[#E8E2D8] text-[#5A5245] font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>
              </form>

              {/* Pie del Panel */}
              <div className="p-4 bg-white border-t border-[#E8E2D8] text-center text-xs font-semibold text-slate-400">
                TuCasita Camagüey • Filtros en tiempo real
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
