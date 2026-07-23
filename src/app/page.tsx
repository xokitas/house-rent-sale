import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types';
import FilterDrawer from '@/components/FilterDrawer';
import PropertyList from '@/components/PropertyList';

export const revalidate = 0;

interface PageProps {
  searchParams: Promise<{
    type?: string;
    maxPrice?: string;
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filterType = params?.type || 'all';
  const maxPrice = params?.maxPrice ? Number(params.maxPrice) : null;

  let query = supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });

  // 1. Filtro por Tipo de Propiedad
  if (filterType && filterType !== 'all') {
    query = query.eq('status', filterType);
  }

  // 2. Filtro por Precio Máximo
  if (maxPrice && !isNaN(maxPrice)) {
    query = query.lte('price', maxPrice);
  }

  const { data: properties, error } = await query as { data: Property[] | null, error: any };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ENCABEZADO PRINCIPAL */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              TuCasita <span className="text-blue-600 text-sm font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">Camagüey</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 hidden md:block">
            Directorio de Alquileres, Rentas y Ventas
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* COMPONENTE INTERACTIVO DE FILTROS */}
        <FilterDrawer filterType={filterType} maxPrice={params?.maxPrice || ''} />

        {/* LISTADO DE PROPIEDADES + MODAL CON CARRUSEL DE FOTOS */}
        <section>
          {error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 font-medium text-center">
              Error al cargar las propiedades: {error.message}
            </div>
          ) : (
            <PropertyList properties={properties || []} />
          )}
        </section>
      </div>
    </main>
  );
}