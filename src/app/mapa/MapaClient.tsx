'use client';

import dynamic from 'next/dynamic';
import { Property } from '@/lib/types';
import { Compass } from 'lucide-react';

// Importar dinámicamente el mapa con ssr: false, ahora sí desde un Client Component válido
const RealMap = dynamic(() => import('@/components/RealMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[65vh] rounded-[2.5rem] bg-slate-100 flex items-center justify-center border border-slate-100 shadow-xs">
      <div className="flex flex-col items-center gap-2">
        <div className="w-8 h-8 rounded-full border-4 border-slate-300 border-t-[#1E67AD] animate-spin" />
        <span className="text-xs font-bold text-slate-500">Cargando mapa interactivo...</span>
      </div>
    </div>
  ),
});

interface MapaClientProps {
  properties: Property[];
}

export default function MapaClient({ properties }: MapaClientProps) {
  return (
    <div className="space-y-6 text-left max-w-5xl mx-auto">
      {/* 1. SECCIÓN INFORMATIVA DEL MAPA */}
      <section className="space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-[#1E67AD]/10 text-[#1E67AD] px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 animate-pulse" />
          Mapa de propiedades
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
          Explora Camagüey
        </h1>
        <p className="text-xs sm:text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl">
          Visualiza geográficamente las mejores ofertas inmobiliarias del MVP. Se muestra un rango de zona aproximada para proteger la seguridad y privacidad del propietario.
        </p>
      </section>

      {/* 2. MAPA INTERACTIVO REAL */}
      <section className="relative">
        <RealMap properties={properties} />
      </section>

      {/* 3. AVISO DE PRIVACIDAD */}
      <section className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex items-start gap-3">
        <span className="text-lg shrink-0">ℹ️</span>
        <div className="space-y-0.5">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
            Compromiso con tu Seguridad
          </h4>
          <p className="text-[11px] font-semibold text-slate-500 leading-relaxed">
            Tu Casita no divulga de forma pública la numeración exacta de las propiedades. Los círculos de color representan la zona geográfica referencial. Una vez contactes al dueño, este te indicará la dirección detallada.
          </p>
        </div>
      </section>
    </div>
  );
}
