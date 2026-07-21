import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types';
import FilterDrawer from '@/components/FilterDrawer';

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

  // 1. Filtro por Tipo de Propiedad (comprobamos contra 'type' o 'status')
  if (filterType && filterType !== 'all') {
    // Si tu columna en Supabase se llama 'type' o 'status':
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
              MiCasita <span className="text-blue-600 text-sm font-bold bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">Camagüey</span>
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

        {/* LISTADO DE PROPIEDADES */}
        <section>
          {error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 font-medium text-center">
              Error al cargar las propiedades: {error.message}
            </div>
          ) : !properties || properties.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-slate-200">
              <p className="text-4xl mb-3">🔍</p>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No encontramos propiedades</h3>
              <p className="text-slate-500 text-sm">Prueba ajustando o quitando los filtros de búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 group">
              {properties.map((property) => (
                <div 
                  key={property.id} 
                  className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between 
                             transition-all duration-300 ease-out
                             group-hover:opacity-40 group-hover:blur-[1px] 
                             hover:opacity-100 hover:blur-none hover:scale-[1.02] hover:shadow-xl hover:z-10 cursor-pointer"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase ${
                        property.status === 'rent' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : property.status === 'vacation'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {property.status === 'rent' 
                          ? 'Alquiler' 
                          : property.status === 'vacation' 
                          ? 'Renta Hostal' 
                          : 'Venta'}
                      </span>
                      
                      {property.latitude && property.longitude && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
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
                        {property.price.toLocaleString()} <span className="text-sm font-bold text-blue-600">{property.currency}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
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
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}