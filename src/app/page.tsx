import { supabase } from '@/lib/supabase';
import { Property, STATUS_OPTIONS } from '@/lib/types';
import FilterDrawer from '@/components/FilterDrawer';
import PropertyList from '@/components/PropertyList';
import Link from 'next/link';

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
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false });

  // 2. FILTRO POR MÚLTIPLES TIPOS (ARRAY EN SUPABASE)
  if (selectedTypes.length > 0) {
    query = query.overlaps('status', selectedTypes);
  }

  // 3. FILTRO POR PRECIO MÁXIMO
  if (maxPrice && !isNaN(maxPrice)) {
    query = query.lte('price', maxPrice);
  }

  const { data: properties, error } = await query as { data: Property[] | null, error: any };
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

  // TEXTO DINÁMICO DE UX
  let dynamicStatusText = '';
  if (selectedTypes.length === 0) {
    dynamicStatusText = `Mostrando todas las propiedades (${propertyList.length})`;
  } else {
    const labels = selectedTypes
      .map((st) => STATUS_OPTIONS.find((opt) => opt.value === st)?.label)
      .filter(Boolean)
      .join(', ');
    dynamicStatusText = `Mostrando ${propertyList.length} ${propertyList.length === 1 ? 'opción' : 'opciones'} en: ${labels}`;
  }

  if (maxPrice && !isNaN(maxPrice)) {
    dynamicStatusText += ` • Hasta ${maxPrice} USD`;
  }

  return (
    <main className="min-h-screen bg-[#FBF9F5]">
      {/* ENCABEZADO PRINCIPAL CON LOS COLORES DEL LOGO */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#E8E2D8] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* LOGO DE LA MARCA (ISOTIPO + TIPOGRAFÍA) */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center bg-[#F2ECE1] rounded-2xl border border-[#E2D8C7] overflow-hidden">
              <img 
                src="/logo.png" 
                alt="TuCasita Logo" 
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline text-2xl sm:text-3xl font-extrabold tracking-tight leading-none">
                <span className="text-[#1E67AD]">Tu</span>
                <span className="text-[#C8976C] relative">
                  Casita
                  {/* Corazón sobre la i */}
                  <span className="absolute -top-1.5 right-4.5 text-[10px] text-[#1E67AD]">♥</span>
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-black text-[#1E67AD] tracking-[0.2em] uppercase mt-0.5">
                TU HOGAR, TU FUTURO.
              </span>
            </div>
          </Link>

          {/* ETIQUETA LOCALIDAD */}
          <div className="hidden sm:flex items-center gap-2 bg-[#F2ECE1] px-3.5 py-1.5 rounded-full border border-[#E2D8C7]">
            <span className="w-2 h-2 rounded-full bg-[#1E67AD] animate-pulse"></span>
            <span className="text-xs font-bold text-[#1E67AD] uppercase tracking-wide">Camagüey</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* BOTÓN COLAPSADO CON HOVER EXPANDIBLE (ARRIBA A LA IZQUIERDA) */}
        <div className="flex items-center justify-between">
          <div className="group relative inline-flex items-center">
            <div className="flex items-center bg-white border border-[#E2D8C7] shadow-sm rounded-2xl p-1.5 hover:border-[#1E67AD] transition-all duration-300">
              <FilterDrawer filterType={rawTypes} maxPrice={params?.maxPrice || ''} />
              <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out text-xs font-bold text-[#1E67AD] group-hover:px-2">
                Filtrar Búsqueda
              </span>
            </div>
          </div>

          {selectedTypes.length > 0 && (
            <Link
              href="/"
              className="text-xs font-bold text-[#1E67AD] hover:underline bg-[#EAF2FA] px-3 py-1.5 rounded-xl border border-[#D0E2F4]"
            >
              ✕ Limpiar filtros ({selectedTypes.length})
            </Link>
          )}
        </div>

        {/* PARRILLA / PESTAÑAS DE CLASIFICACIONES CON ESTILOS DEL LOGO */}
        <div className="flex flex-wrap gap-2">
          {/* BOTÓN TODAS */}
          <Link
            href={getCategoryUrl('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs ${
              selectedTypes.length === 0
                ? 'bg-linear-to-r from-[#1E67AD] to-[#2A93A6] text-white shadow-md shadow-[#1E67AD]/20'
                : 'bg-white border border-[#E2D8C7] text-[#5A5245] hover:bg-[#F5EFE6] hover:text-[#1E67AD]'
            }`}
          >
            🏠 Todas
          </Link>

          {/* OPCIONES DE CLASIFICACIÓN */}
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = selectedTypes.includes(opt.value);
            return (
              <Link
                key={opt.value}
                href={getCategoryUrl(opt.value)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                  isSelected
                    ? 'bg-linear-to-r from-[#1E67AD] to-[#2A93A6] text-white shadow-md shadow-[#1E67AD]/20 ring-2 ring-[#1E67AD] ring-offset-1'
                    : 'bg-white border border-[#E2D8C7] text-[#5A5245] hover:bg-[#F5EFE6] hover:text-[#1E67AD]'
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <span className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* INDICADOR TEXTUAL DINÁMICO DE RESULTADOS (UX) */}
        <div className="px-1 border-t border-[#E8E2D8] pt-4">
          <p className="text-xs font-bold text-[#5A5245] uppercase tracking-wider">
            {dynamicStatusText}
          </p>
        </div>

        {/* LISTADO DE PROPIEDADES */}
        <section>
          {error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 font-medium text-center">
              Error al cargar las propiedades: {error.message}
            </div>
          ) : (
            <PropertyList properties={propertyList} />
          )}
        </section>
      </div>
    </main>
  );
}