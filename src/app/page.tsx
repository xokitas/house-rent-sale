import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types';

// Forzamos a Next.js a que traiga datos frescos en cada visita (SSR)
export const revalidate = 0;

export default async function HomePage() {
  // 1. Llamada directa a Supabase desde el Servidor
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false }) as { data: Property[] | null, error: any };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-red-500 font-medium">
        Error al cargar las propiedades: {error.message}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <header className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Directorio de Casas
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Explora alquileres y ventas disponibles en Camagüey.
          </p>
        </header>

        {/* Listado de Tarjetas */}
        {!properties || properties.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-slate-200">
            <p className="text-slate-500 text-lg">No hay propiedades publicadas todavía.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div 
                key={property.id} 
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between transition hover:shadow-md"
              >
                <div className="p-6">
                  {/* Etiqueta de Estado */}
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 ${
                    property.status === 'rent' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {property.status === 'rent' ? 'Alquiler' : 'Venta'}
                  </span>

                  {/* Título y Dirección */}
                  <h2 className="text-xl font-bold text-slate-900 line-clamp-1 mb-1">
                    {property.title}
                  </h2>
                  <p className="text-sm text-slate-500 mb-4 flex items-center">
                    📍 {property.address}
                  </p>

                  {/* Descripción corta */}
                  <p className="text-slate-600 text-sm line-clamp-3">
                    {property.description || 'Sin descripción disponible.'}
                  </p>
                </div>

                {/* Pie de la Tarjeta con Precio y Contacto */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-lg font-black text-slate-900">
                    {property.price.toLocaleString()} <span className="text-xs font-bold text-blue-600">{property.currency}</span>
                  </div>
                  <a 
                    href={`https://wa.me/${property.contact.replace('+', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-slate-900 hover:bg-slate-800 transition"
                  >
                    Contactar
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}