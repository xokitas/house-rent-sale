import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types';
import FilterDrawer from '@/components/FilterDrawer';
import PropertyList from '@/components/PropertyList';
import { MVP_STATUSES, MVP_STATUS_OPTIONS } from '@/lib/constants';
import Link from 'next/link';
import {
  Tag,
  Calendar,
  ArrowLeftRight,
  Search,
  Sparkles,
  MapPin,
  MessageCircle,
  Coins,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    type?: string;
    maxPrice?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const rawTypes = params?.type || 'all';
  const maxPrice = params?.maxPrice ? Number(params.maxPrice) : null;

  // Convertimos los tipos seleccionados en un Array para multiselección
  const selectedTypes = rawTypes === 'all' ? [] : rawTypes.split(',').filter(Boolean);

  // 1. CONSULTA A SUPABASE CON ORDEN DE PRIORIDAD
  let query = supabase
    .from('properties')
    .select('*')
    .eq('is_published', true) // Solo aprobados y publicados
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });

  // 2. FILTRAR POR MÚLTIPLES TIPOS (ARRAY EN SUPABASE), EXCLUSIVO DEL MVP
  if (selectedTypes.length > 0) {
    const validSelections = selectedTypes.filter((t) => MVP_STATUSES.includes(t as any));
    if (validSelections.length > 0) {
      query = query.overlaps('status', validSelections);
    } else {
      // Si el usuario intentara forzar tipos no incluidos en el MVP por URL
      query = query.overlaps('status', MVP_STATUSES);
    }
  } else {
    // Si no hay filtro explícito, solo traemos los clasificados como MVP_STATUSES
    query = query.overlaps('status', MVP_STATUSES);
  }

  // 3. FILTRO POR PRECIO MÁXIMO
  if (maxPrice && !isNaN(maxPrice)) {
    query = query.lte('price', maxPrice);
  }

  const { data: properties, error } = (await query) as {
    data: Property[] | null;
    error: { message: string } | null;
  };
  const propertyList = properties || [];

  // GENERAR URL PARA MULTISELECCIÓN
  const getCategoryUrl = (categoryValue: string) => {
    let newTypes: string[];

    if (categoryValue === 'all') {
      newTypes = [];
    } else if (selectedTypes.includes(categoryValue)) {
      newTypes = selectedTypes.filter((t) => t !== categoryValue);
    } else {
      newTypes = [...selectedTypes, categoryValue];
    }

    const typeParam = newTypes.length > 0 ? `type=${newTypes.join(',')}` : 'type=all';
    const priceParam = maxPrice ? `&maxPrice=${maxPrice}` : '';

    return `/?${typeParam}${priceParam}`;
  };

  // CATEGORÍAS DISPONIBLES EN EL MVP CON SUS ICONOS Y CONFIGURACIÓN VISUAL
  const categoriesMap = [
    { value: 'sale', label: 'Venta de casas', icon: Tag, colorClass: 'from-[#1E67AD]/10 to-[#1E67AD]/20 text-[#1E67AD]', description: 'Venta directa de propiedades ajustadas a tu presupuesto.' },
    { value: 'long_term', label: 'Alquiler mensual', icon: Calendar, colorClass: 'from-emerald-500/10 to-emerald-500/20 text-emerald-600', description: 'Casas y apartamentos para vivir bajo contratos a largo plazo.' },
    { value: 'swap', label: 'Permuta directa', icon: ArrowLeftRight, colorClass: 'from-teal-500/10 to-teal-500/20 text-teal-600', description: 'Inmuebles disponibles para intercambio recíproco de propietarios.' },
  ];

  return (
    <div className="space-y-10 pb-20 text-left">
      {/* 1. SECCIÓN BIENVENIDA / ENCABEZADO */}
      <section className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2.5rem] border border-slate-700/50 relative overflow-hidden shadow-lg shadow-slate-900/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />

        <div className="space-y-2 relative z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 bg-[#1E67AD]/20 border border-[#1E67AD]/30 text-sky-400 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" />
            MVP Tu Casita Camagüey
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Encuentra tu próximo hogar
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-300 leading-relaxed text-balance">
            La forma más directa y simple de alquilar, comprar o permutar propiedades en Camagüey, libre de comisiones excesivas.
          </p>
        </div>

        {/* Acciones de Cabecera Rápida */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto relative z-10">
          <FilterDrawer filterType={rawTypes} maxPrice={params?.maxPrice || ''} />

          <Link
            href="/publicar"
            className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-2xl bg-gradient-to-br from-[#1E67AD] to-emerald-600 text-white font-black text-xs shadow-md shadow-[#1E67AD]/20 hover:opacity-95 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Publicar propiedad
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 2. SECCIÓN MÉTODOS DE BÚSQUEDA / ACCESOS DIRECTOS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4.5 h-4.5 text-[#1E67AD]" />
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            Clasificaciones destacadas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {categoriesMap.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedTypes.includes(cat.value);

            return (
              <Link
                key={cat.value}
                href={getCategoryUrl(cat.value)}
                className={`p-6 rounded-[2rem] border transition-all duration-300 flex flex-col justify-between hover:shadow-md hover:-translate-y-0.5 group cursor-pointer text-left ${
                  isSelected
                    ? 'border-[#1E67AD] bg-[#1E67AD]/5 shadow-xs'
                    : 'border-slate-100 hover:border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${cat.colorClass} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 group-hover:text-[#1E67AD] transition-colors leading-tight mb-1">
                    {cat.label}
                  </h3>
                  <p className="text-slate-500 text-[11px] font-semibold leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>
                <span className="text-[10px] font-black text-[#1E67AD] tracking-wider uppercase inline-flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Explorar
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. SECCIÓN LISTADO GENERAL DE PROPIEDADES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-none">
              Inmuebles destacados
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              Listado en tiempo real con las mejores opciones de Camagüey.
            </p>
          </div>

          {selectedTypes.length > 0 && (
            <Link
              href="/"
              className="text-[10px] font-black text-[#1E67AD] tracking-wider uppercase bg-[#1E67AD]/5 border border-[#1E67AD]/10 px-3 py-1.5 rounded-full hover:bg-[#1E67AD]/10 transition-all"
            >
              Ver todas (limpiar filtros)
            </Link>
          )}
        </div>

        {/* Pestañas de categorías rápidas */}
        <div className="flex flex-wrap gap-2 pb-2">
          <Link
            href={getCategoryUrl('all')}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all ${
              selectedTypes.length === 0
                ? 'bg-[#1E67AD] text-white shadow-sm shadow-[#1E67AD]/20'
                : 'bg-white border border-slate-100 text-slate-600 hover:border-slate-200'
            }`}
          >
            Todas las propiedades
          </Link>

          {MVP_STATUS_OPTIONS.map((opt) => {
            const isSelected = selectedTypes.includes(opt.value);
            return (
              <Link
                key={opt.value}
                href={getCategoryUrl(opt.value)}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#1E67AD] text-white shadow-sm shadow-[#1E67AD]/20'
                    : 'bg-white border border-slate-100 text-slate-600 hover:border-slate-200'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-[10px]">✓</span>}
              </Link>
            );
          })}
        </div>

        {/* Listado principal */}
        <div>
          {error ? (
            <div className="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-200 font-medium text-center max-w-md mx-auto">
              Error al cargar las propiedades: {error.message}
            </div>
          ) : (
            <PropertyList properties={propertyList} />
          )}
        </div>
      </section>
    </div>
  );
}
