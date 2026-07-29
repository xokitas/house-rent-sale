import { supabase } from '@/lib/supabase';
import { Property, STATUS_OPTIONS } from '@/lib/types';
import FilterDrawer from '@/components/FilterDrawer';
import PropertyList from '@/components/PropertyList';
import ActionMenu from '@/components/ActionMenu';
import Link from 'next/link';
import {
  Tag,
  Calendar,
  Building2,
  Globe,
  Coins,
  ArrowLeftRight,
  Sparkles,
  Search,
  Home,
  ChevronDown,
  Check
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

  const { data: properties, error } = await query as { data: Property[] | null, error: { message: string } | null };
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

  // CATEGORÍAS CON SUS ICONOS Y COLORES (Lucide React)
  const categories = [
    { value: 'sale', label: 'Venta', icon: Tag, textColor: 'text-[#1E67AD]', bgColor: 'bg-[#1E67AD]/10', description: 'Compra la casa de tus sueños en las mejores zonas de la ciudad.' },
    { value: 'long_term', label: 'Alquiler de larga estadía', icon: Calendar, textColor: 'text-emerald-600', bgColor: 'bg-emerald-500/10', description: 'Hogares listos para habitar de manera estable y prolongada.' },
    { value: 'commercial_space', label: 'Alquiler comercial', icon: Building2, textColor: 'text-purple-600', bgColor: 'bg-purple-500/10', description: 'Locales y oficinas ideales para posicionar tu negocio.' },
    { value: 'international_hostel', label: 'Hostal internacional', icon: Globe, textColor: 'text-indigo-600', bgColor: 'bg-indigo-500/10', description: 'Hospedajes vacacionales confortables en USD o EUR.' },
    { value: 'local_rent', label: 'Renta nacional', icon: Coins, textColor: 'text-amber-600', bgColor: 'bg-amber-500/10', description: 'Alquileres temporales en moneda nacional (CUP).' },
    { value: 'swap', label: 'Permuta', icon: ArrowLeftRight, textColor: 'text-rose-600', bgColor: 'bg-rose-500/10', description: 'Intercambios y permutas directas entre propietarios.' },
    { value: 'day_pass', label: 'Pasadías o eventos', icon: Sparkles, textColor: 'text-pink-600', bgColor: 'bg-pink-500/10', description: 'Espacios ideales con piscina o áreas para festejos.' },
  ];

  return (
    <main className="min-h-screen bg-[#FBF9F5] text-slate-800 antialiased selection:bg-[#1E67AD]/10 selection:text-[#1E67AD]">
      {/* ENCABEZADO PRINCIPAL (STICKY & CONSERVADO) */}
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

      {/* NUEVA HERO SECTION MODERNA (70vh aprox en desktop, formas blur de fondo, sin imágenes externas) */}
      <section className="relative overflow-hidden py-12 lg:py-20 bg-linear-to-b from-white to-[#FBF9F5] border-b border-[#E8E2D8]/40">
        {/* Formas difuminadas suaves usando divs con blur */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center lg:min-h-[60vh]">

            {/* COLUMNA IZQUIERDA */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 text-left">
              {/* Badge Beta */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 bg-linear-to-rrom-[#1E67AD]/10 to-[#2A93A6]/10 border border-[#1E67AD]/20 px-3 py-1 rounded-full">
                  <span className="text-xs sm:text-sm">🧪</span>
                  <span className="text-xs font-black bg-linear-to-r from-[#1E67AD] to-[#2A93A6] bg-clip-text text-transparent uppercase tracking-wider">
                    Beta gratuita
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-500 max-w-lg leading-relaxed">
                  Estamos construyendo nuevas funcionalidades. Poco a poco iremos incorporando nuevas herramientas para propietarios y clientes.
                </p>
              </div>

              {/* H1 Muy Grande */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#5A5245] tracking-tight leading-tight">
                Encuentra la <br className="hidden sm:inline" />
                propiedad ideal <br className="hidden lg:inline" />
                en <span className="bg-linear-to-rrom-[#1E67AD] to-[#2A93A6] bg-clip-text text-transparent">Camagüey</span>
              </h1>

              {/* Beneficios Rápidos (Sin párrafos redundantes) */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Check className="w-4 h-4 stroke-3" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-[#5A5245]">Filtra por presupuesto</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Check className="w-4 h-4 stroke-3" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-[#5A5245]">Contacta por WhatsApp</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Check className="w-4 h-4 stroke-3" />
                  </div>
                  <span className="text-sm sm:text-base font-bold text-[#5A5245]">Sin intermediarios</span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                <a
                  href="#properties"
                  className="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-white bg-linear-to-r from-[#1E67AD] to-[#2A93A6] rounded-2xl shadow-lg shadow-[#1E67AD]/25 hover:opacity-95 hover:scale-[1.02] transition-all duration-200 text-center active:scale-95"
                >
                  Explorar propiedades
                </a>
                <div className="flex flex-col">
                  <button
                    disabled
                    className="inline-flex items-center justify-center px-8 py-4 text-sm font-black text-[#1E67AD] border-2 border-[#1E67AD]/30 rounded-2xl bg-white/50 cursor-not-allowed text-center opacity-70"
                  >
                    Publicar una propiedad
                  </button>
                  <span className="text-[10px] font-black text-[#C8976C] tracking-widest uppercase text-center sm:text-left mt-1.5 ml-1">
                    ⏳ Próximamente
                  </span>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA - PLACEHOLDER CON GRADIENTE DE MARCA (PREPARADO PARA FUTURA IMAGEN LOCAL) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md aspect-square overflow-hidden rounded-[2.5rem] border-8 border-white shadow-xl group bg-linear-to-br from-[#1E67AD] to-[#2A93A6] flex flex-col items-center justify-center p-8 text-white select-none transition-transform duration-500 hover:scale-[1.01]">
                {/* Patrón de cuadrícula suave decorativo */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] bg-size-[16px_16px] opacity-15 pointer-events-none rounded-4xl" />

                {/* Círculo decorativo difuminado interno */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner transition-transform duration-300 group-hover:scale-110">
                    <Home className="w-10 h-10 text-white" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-extrabold tracking-tight">Tu Casita Camagüey</h3>
                    <p className="text-xs font-medium text-white/80 max-w-60">
                      Encuentra, publica y gestiona propiedades de manera ágil y directa.
                    </p>
                  </div>
                </div>

                {/* Sello o etiqueta flotante de la app */}
                <div className="absolute bottom-6 right-6 z-10 bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-[10px] font-bold tracking-widest uppercase">
                  📍 Camagüey
                </div>

                <div className="absolute inset-0 ring-1 ring-black/5 rounded-4xl pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECCIÓN CATEGORÍAS */}
      <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-black text-[#5A5245] tracking-tight">
            ¿Qué puedes encontrar en Tu Casita?
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-[#1E67AD] to-[#2A93A6] mx-auto rounded-full" />
        </div>

        {/* Grid de 7 categorías (Responsivo: 4+3 en Desktop, 2 en Tablet, 1 en Mobile) */}
        {/* Vista Móvil / Tablet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.value} cat={cat} getCategoryUrl={getCategoryUrl} />
          ))}
        </div>

        {/* Vista Escritorio (4 + 3) */}
        <div className="hidden lg:block space-y-6">
          <div className="grid grid-cols-4 gap-6">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.value} cat={cat} getCategoryUrl={getCategoryUrl} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
            {categories.slice(4, 7).map((cat) => (
              <CategoryCard key={cat.value} cat={cat} getCategoryUrl={getCategoryUrl} />
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN BUSCADOR UNIFICADO (BAJO EL GRID DE CATEGORÍAS) */}
      <section className="py-8 bg-linear-to-b from-transparent to-[#FBF9F5] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-sm border border-[#E2D8C7]/60 p-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
            {/* Buscador Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1E67AD] w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por zona, reparto o Calle..."
                className="w-full bg-slate-50 border border-slate-100 text-sm font-semibold text-[#5A5245] rounded-2xl py-3.5 pl-12 pr-4 placeholder:text-slate-400 focus:outline-none focus:border-[#1E67AD] focus:ring-1 focus:ring-[#1E67AD] transition-all"
              />
            </div>

            {/* Selector Categorías (Visual, preparado para conectar) */}
            <div className="relative w-full lg:w-52">
              <Home className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                className="w-full bg-slate-50 border border-slate-100 text-sm font-bold text-[#5A5245] rounded-2xl py-3.5 pl-10 pr-8 focus:outline-none appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="" disabled>Categoría</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label.replace(/^[^\s]+\s/, '')}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Selector Precio Máximo (Visual, preparado para conectar) */}
            <div className="relative w-full lg:w-44">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
              <input
                type="text"
                placeholder="Precio máx."
                className="w-full bg-slate-50 border border-slate-100 text-sm font-bold text-[#5A5245] rounded-2xl py-3.5 pl-10 pr-4 focus:outline-none"
              />
            </div>

            {/* Botón Buscar / Acciones Integradas */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex-1 lg:flex-none bg-linear-to-r from-[#1E67AD] to-[#2A93A6] hover:opacity-95 text-white font-black text-sm px-6 py-3.5 rounded-2xl transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>

              {/* Filtro Drawer de la Lógica Real */}
              <FilterDrawer filterType={rawTypes} maxPrice={params?.maxPrice || ''} />

              {/* Botón de Acciones de Empresa */}
              <ActionMenu />
            </div>
          </div>
        </div>

        {/* Botón de Limpiar Filtros Reales Activos */}
        {selectedTypes.length > 0 && (
          <div className="flex justify-center mt-4">
            <Link
              href="/"
              className="text-xs font-bold text-[#1E67AD] hover:underline bg-[#EAF2FA] px-4 py-2 rounded-full border border-[#D0E2F4] transition-all flex items-center gap-2 shadow-xs"
            >
              ✕ Limpiar filtros activos ({selectedTypes.length})
            </Link>
          </div>
        )}
      </section>

      {/* SECCIÓN LISTADO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        
        {/* Encabezado elegante para propiedades */}
        <div id="properties" className="pt-4 pb-2 text-left space-y-1.5 scroll-mt-24">
          <h2 className="text-3xl font-black text-[#5A5245] tracking-tight">
            Propiedades destacadas
          </h2>
          <p className="text-sm font-semibold text-slate-500">
            Explora las últimas propiedades publicadas en Camagüey.
          </p>
        </div>

        {/* PARRILLA / PESTAÑAS DE CLASIFICACIONES REALES (Accesibilidad extra, conservada y refinada) */}
        <div className="flex flex-wrap gap-2 pb-4">
          {/* BOTÓN TODAS */}
          <Link
            href={getCategoryUrl('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs ${
              selectedTypes.length === 0
                ? 'bg-linear-to-r from-[#1E67AD] to-[#2A93A6] text-white shadow-md shadow-[#1E67AD]/20'
                : 'bg-white border border-[#E2D8C7]/60 text-[#5A5245] hover:bg-[#F5EFE6] hover:text-[#1E67AD]'
            }`}
          >
            🏠 Todas
          </Link>

          {/* OPCIONES DE CLASIFICACIÓN REAL */}
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = selectedTypes.includes(opt.value);
            return (
              <Link
                key={opt.value}
                href={getCategoryUrl(opt.value)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 ${
                  isSelected
                    ? 'bg-linear-to-r from-[#1E67AD] to-[#2A93A6] text-white shadow-md shadow-[#1E67AD]/20 ring-2 ring-[#1E67AD]/50 ring-offset-1'
                    : 'bg-white border border-[#E2D8C7]/60 text-[#5A5245] hover:bg-[#F5EFE6] hover:text-[#1E67AD]'
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

        {/* Listado Principal de Propiedades */}
        <div>
          {error ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 font-medium text-center">
              Error al cargar las propiedades: {error.message}
            </div>
          ) : (
            <PropertyList properties={propertyList} />
          )}
        </div>
      </section>
    </main>
  );
}

// Componente Tarjeta de Categoría Reutilizable
interface CategoryItem {
  value: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  textColor: string;
  bgColor: string;
  description: string;
}

function CategoryCard({ cat, getCategoryUrl }: { cat: CategoryItem; getCategoryUrl: (val: string) => string }) {
  const Icon = cat.icon;
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7]/60 shadow-xs hover:shadow-md hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Contenedor del icono con acento de color suave */}
        <div className={`w-12 h-12 rounded-2xl ${cat.bgColor} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`w-6 h-6 ${cat.textColor}`} />
        </div>
        <h3 className="text-base font-black text-slate-800 mb-2">{cat.label}</h3>
        <p className="text-xs text-slate-500 font-bold leading-relaxed mb-4">{cat.description}</p>
      </div>
      <Link
        href={`${getCategoryUrl(cat.value)}#properties`}
        className={`text-xs font-black ${cat.textColor} hover:underline inline-flex items-center gap-1.5`}
      >
        <span>Ver opciones</span>
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}