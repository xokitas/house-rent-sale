'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SlidersHorizontal, X, ArrowRight, Check } from 'lucide-react';
import { MVP_STATUS_OPTIONS } from '@/lib/constants';

interface FilterDrawerProps {
  filterType: string;
  maxPrice: string;
}

export default function FilterDrawer({ filterType, maxPrice }: FilterDrawerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const selectedTypes = filterType === 'all' ? [] : filterType.split(',').filter(Boolean);
  const [tempTypes, setTempTypes] = useState<string[]>(selectedTypes);
  const [tempMaxPrice, setTempMaxPrice] = useState<string>(maxPrice || '');

  const toggleType = (value: string) => {
    if (tempTypes.includes(value)) {
      setTempTypes(tempTypes.filter((t) => t !== value));
    } else {
      setTempTypes([...tempTypes, value]);
    }
  };

  const handleApply = () => {
    const typeParam = tempTypes.length > 0 ? `type=${tempTypes.join(',')}` : 'type=all';
    const priceParam = tempMaxPrice ? `&maxPrice=${tempMaxPrice}` : '';
    router.push(`/?${typeParam}${priceParam}`);
    setIsOpen(false);
  };

  const handleReset = () => {
    setTempTypes([]);
    setTempMaxPrice('');
    router.push('/');
    setIsOpen(false);
  };

  return (
    <>
      {/* BOTÓN DE FILTRADO FLOTANTE O EN CABECERA */}
      <button
        type="button"
        onClick={() => {
          setTempTypes(selectedTypes);
          setTempMaxPrice(maxPrice || '');
          setIsOpen(true);
        }}
        className="inline-flex items-center justify-center gap-2 px-4 h-11 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-[#1E67AD] hover:border-[#1E67AD] transition-all shadow-xs active:scale-95 cursor-pointer font-bold text-xs"
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filtros
        {selectedTypes.length > 0 && (
          <span className="w-5 h-5 rounded-full bg-[#1E67AD] text-white text-[10px] font-black flex items-center justify-center">
            {selectedTypes.length}
          </span>
        )}
      </button>

      {/* CONTENEDOR DEL SLIDE OVER (CAJÓN) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Fondo oscuro traslúcido */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel Lateral */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-200">
            {/* Encabezado */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#1E67AD]" />
                Filtros de búsqueda
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario de Filtros */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              {/* Sección Categorías del MVP */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Tipo de Clasificación
                </h3>
                <div className="flex flex-col gap-2">
                  {MVP_STATUS_OPTIONS.map((opt) => {
                    const isSelected = tempTypes.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleType(opt.value)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'border-[#1E67AD] bg-[#1E67AD]/5 text-[#1E67AD]'
                            : 'border-slate-100 hover:border-slate-200 text-slate-700 bg-white'
                        }`}
                      >
                        <span className="text-xs font-black">{opt.label}</span>
                        {isSelected && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sección Presupuesto */}
              <div className="space-y-3">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  Presupuesto máximo
                </h3>
                <div className="relative">
                  <input
                    type="number"
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    placeholder="Ej. 50000"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 px-4 text-xs font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#1E67AD] focus:bg-white transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    USD
                  </span>
                </div>
              </div>
            </div>

            {/* Acciones del cajón */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-black rounded-2xl transition cursor-pointer"
              >
                Limpiar todo
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 py-3.5 bg-[#1E67AD] hover:bg-[#175691] text-white text-xs font-black rounded-2xl transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                Aplicar filtros
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
