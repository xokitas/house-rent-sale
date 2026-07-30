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
  MapPin,
  MessageCircle,
  Users,
  FlaskConical,
  ImageIcon,
  ArrowRight,
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

  // CATEGORÍAS CON SUS ICONOS Y COLORES (Lucide React)
  const categories = [
    { value: 'sale', label: 'Venta', icon: Tag, textColor: 'text-[#1E67AD]', bgColor: 'bg-[#1E67AD]/10', description: 'Venta de propiedades. Encuentra tu hogar ideal ajustado a tu presupuesto.' },
    { value: 'long_term', label: 'Alquiler de larga estadía', icon: Calendar, textColor: 'text-emerald-600', bgColor: 'bg-emerald-500/10', description: 'Propiedades y casas con esquemas de pagos mensuales para residir a largo plazo.' },
    { value: 'commercial_space', label: 'Alquiler comercial', icon: Building2, textColor: 'text-purple-600', bgColor: 'bg-purple-500/10', description: 'Espacios, locales o partes de casas destinados a la implementación de negocios y emprendimientos.' },
    { value: 'international_hostel', label: 'Hostal internacional', icon: Globe, textColor: 'text-orange-500', bgColor: 'bg-orange-500/10', description: 'Alojamientos pensados para estadías medianas con todas las comodidades, dirigidos principalmente a turismo extranjero (USD/EUR).' },
    { value: 'local_rent', label: 'Renta nacional', icon: Coins, textColor: 'text-amber-600', bgColor: 'bg-amber-500/10', description: 'Pensado para estadías cortas (una noche, un día o hasta una semana), ideal para personas que viajan entre provincias.' },
    { value: 'swap', label: 'Permuta', icon: ArrowLeftRight, textColor: 'text-teal-600', bgColor: 'bg-teal-500/10', description: 'Casas y propiedades disponibles para intercambio directo con otros propietarios.' },
    { value: 'day_pass', label: 'Pasadías o eventos', icon: Sparkles, textColor: 'text-pink-600', bgColor: 'bg-pink-500/10', description: 'Negocios, fincas o locales que ofrecen días de piscina o espacios para celebrar bodas, quinceañeros, cumpleaños y reuniones.' },
  ];

  return (
    <main className="min-h-screen bg-[#FBF9F5] text-slate-800 antialiased selection:bg-[#1E67AD]/10 selection:text-[#1E67AD]">
      {/* ENCABEZADO PRINCIPAL (STICKY) */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* LOGO DE LA MARCA */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center bg-[#F2ECE1] rounded-2xl border border-[#E2D8C7] overflow-hidden">
              <img src="/logo.png" alt="TuCasita Logo" className="w-full h-full object-contain" />
            </div>

            <div className="flex flex-col leading-none">
              <div className="flex items-baseline text-xl sm:text-2xl font-black tracking-tight">
                <span className="text-[#1E67AD]">Tu</span>
                <span className="text-[#C8976C]">Casita</span>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-0.5">
                Encuentra tu lugar en Camagüey
              </span>
            </div>
          </Link>

          {/* NAVEGACIÓN CENTRAL (DESKTOP) */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-sm font-bold text-[#5A5245] hover:text-[#1E67AD] transition-colors">
              Inicio
            </Link>
            <Link href="#properties" className="text-sm font-bold text-[#5A5245] hover:text-[#1E67AD] transition-colors">
              Propiedades
            </Link>
            <Link href="#categorias" className="text-sm font-bold text-[#5A5245] hover:text-[#1E67AD] transition-colors">
              Quiénes somos
            </Link>
            <Link href="#buscador" className="text-sm font-bold text-[#5A5245] hover:text-[#1E67AD] transition-colors">
              Contacto
            </Link>
          </nav>

          {/* ACCIONES DERECHA: FILTRO + BUSCAR + MENÚ */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Filtro Drawer de la Lógica Real */}
            <FilterDrawer filterType={rawTypes} maxPrice={params?.maxPrice || ''} />

            {/* Acceso rápido al buscador */}
            <a
              href="#buscador"
              aria-label="Ir al buscador"
              className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-[#E2D8C7] text-[#5A5245] hover:text-[#1E67AD] hover:border-[#1E67AD] transition-all shadow-xs active:scale-95"
            >
              <Search className="w-5 h-5" />
            </a>

            {/* Botón de Acciones de Empresa */}
            <ActionMenu />
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-[#E8E2D8]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* COLUMNA IZQUIERDA */}
            <div className="space-y-6 text-left">
              {/* Badge Beta + Aviso prototipo */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <span className="inline-flex items-center gap-2 bg-[#1E67AD] text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wide shrink-0 shadow-sm">
                  <FlaskConical className="w-3.5 h-3.5" />
                  Beta gratuita
                </span>
                <p className="text-xs font-semibold text-slate-500 leading-relaxed bg-[#F2ECE1]/60 border border-[#E2D8C7] rounded-xl px-3 py-2 max-w-sm">
                  Esta es una versión de prototipo. Poco a poco implementaremos más funcionalidades.
                </p>
              </div>

              {/* H1 */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none">
                  <span className="block text-[#153B6B]">Bienvenido a</span>
                  <span className="block text-[#1E67AD]">Tu Casita</span>
                </h1>
                <p className="text-lg sm:text-xl font-bold text-[#C8976C] leading-snug max-w-md pt-3 text-pretty">
                  La forma más sencilla de encontrar propiedades y alojamientos en Camagüey.
                </p>
              </div>

              {/* Beneficios rápidos (chips) */}
              <div className="flex flex-wrap gap-4 pt-1">
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#1E67AD]/10 flex items-center justify-center text-[#1E67AD]">
                    <Coins className="w-4.5 h-4.5" />
                  </span>
                  <span className="text-sm font-bold text-[#5A5245] leading-tight">
                    Filtra por
                    <br />
                    presupuesto
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <MessageCircle className="w-4.5 h-4.5" />
                  </span>
                  <span className="text-sm font-bold text-[#5A5245] leading-tight">
                    Contacta por
                    <br />
                    WhatsApp
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-9 h-9 rounded-xl bg-[#1E67AD]/10 flex items-center justify-center text-[#1E67AD]">
                    <Users className="w-4.5 h-4.5" />
                  </span>
                  <span className="text-sm font-bold text-[#5A5245] leading-tight">
                    Sin
                    <br />
                    intermediarios
                  </span>
                </div>
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                <a
                  href="#properties"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 text-sm font-black text-white bg-[#1E67AD] rounded-2xl shadow-lg shadow-[#1E67AD]/25 hover:bg-[#175691] hover:scale-[1.02] transition-all duration-200 active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  Explorar propiedades
                </a>
                <Link
                  href="/publicar"
                  className="inline-flex flex-col items-center justify-center px-7 py-3 text-sm font-black text-[#1E67AD] border-2 border-[#E2D8C7] hover:border-[#1E67AD] rounded-2xl bg-white transition-all duration-200 shadow-xs active:scale-95"
                >
                  <span className="inline-flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Publicar una propiedad
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 normal-case">(Próximamente)</span>
                </Link>
              </div>
            </div>

            {/* COLUMNA DERECHA - PLACEHOLDER DE IMAGEN (LISTO PARA TU FOTO) */}
            {/*
              Para usar tu propia foto de Camagüey, reemplaza este bloque por:
              <img src="/hero-camaguey.jpg" alt="Camagüey" className="w-full h-full object-cover" />
              (coloca la imagen en la carpeta /public)
            */}
            <div className="relative">
              <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[2rem] lg:rounded-[2.5rem] border border-[#E2D8C7] bg-gradient-to-br from-[#EAF2FA] to-[#F2ECE1] shadow-xl flex flex-col items-center justify-center text-center p-8 select-none">
                <div className="w-16 h-16 rounded-2xl bg-white/70 border border-[#E2D8C7] flex items-center justify-center text-[#1E67AD] shadow-sm mb-4">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <p className="text-sm font-black text-[#1E67AD]">Añade tu foto de Camagüey</p>
                <p className="text-xs font-semibold text-slate-500 mt-1 max-w-xs">
                  Sustituye este espacio por una imagen guardada en <span className="font-bold">/public</span>.
                </p>

                <span className="absolute bottom-5 right-5 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E2D8C7] text-[10px] font-black tracking-widest uppercase text-[#1E67AD] shadow-sm">
                  <MapPin className="w-3 h-3" />
                  Camagüey
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN CATEGORÍAS */}
      <section id="categorias" className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-[#153B6B] tracking-tight text-balance">
            ¿Qué puedes encontrar en Tu Casita?
          </h2>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-[#E2D8C7]" />
            <Home className="w-4 h-4 text-[#C8976C]" />
            <span className="h-px w-12 bg-[#E2D8C7]" />
          </div>
        </div>

        {/* Grid de 7 categorías (Responsivo: 4+3 en Desktop, 2 en Tablet, 1 en Mobile) */}
        {/* Vista Móvil / Tablet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-5">
          {categories.map((cat) => (
            <CategoryCard key={cat.value} cat={cat} getCategoryUrl={getCategoryUrl} />
          ))}
        </div>

        {/* Vista Escritorio (4 + 3) */}
        <div className="hidden lg:block space-y-5">
          <div className="grid grid-cols-4 gap-5">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.value} cat={cat} getCategoryUrl={getCategoryUrl} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-5 max-w-5xl mx-auto">
            {categories.slice(4, 7).map((cat) => (
              <CategoryCard key={cat.value} cat={cat} getCategoryUrl={getCategoryUrl} />
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN BUSCADOR UNIFICADO */}
      <section id="buscador" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="w-full bg-[#F5EFE6]/80 rounded-3xl border border-[#E2D8C7] p-6 sm:p-8 space-y-5">
          <h3 className="text-lg font-black text-[#153B6B]">Encuentra lo que necesitas</h3>

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Buscador Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Ej: Apartamento en Centro, Casa con piscina..."
                className="w-full bg-white border border-[#E2D8C7] text-sm font-semibold text-[#5A5245] rounded-2xl py-3.5 pl-4 pr-11 placeholder:text-slate-400 focus:outline-none focus:border-[#1E67AD] focus:ring-1 focus:ring-[#1E67AD] transition-all"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Selector Categorías (Visual, preparado para conectar) */}
            <div className="relative w-full lg:w-56">
              <select
                className="w-full bg-white border border-[#E2D8C7] text-sm font-bold text-[#5A5245] rounded-2xl py-3.5 pl-4 pr-9 focus:outline-none focus:border-[#1E67AD] appearance-none cursor-pointer"
                defaultValue=""
              >
                <option value="">Todas las categorías</option>
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label.replace(/^[^\s]+\s/, '')}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>

            {/* Selector Precio Máximo (Visual, preparado para conectar) */}
            <div className="relative w-full lg:w-48">
              <select
                className="w-full bg-white border border-[#E2D8C7] text-sm font-bold text-[#5A5245] rounded-2xl py-3.5 pl-4 pr-9 focus:outline-none focus:border-[#1E67AD] appearance-none cursor-pointer"
                defaultValue="100000"
              >
                <option value="25000">Precio máximo · 25,000 USD</option>
                <option value="50000">Precio máximo · 50,000 USD</option>
                <option value="100000">Precio máximo · 100,000 USD</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>

            {/* Botón Buscar */}
            <button
              type="button"
              className="lg:w-auto w-full bg-[#1E67AD] hover:bg-[#175691] text-white font-black text-sm px-8 py-3.5 rounded-2xl transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Buscar</span>
            </button>
          </div>

          <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-[#1E67AD]" />
            Buscando en <span className="font-black text-[#1E67AD]">Camagüey</span>, Cuba
          </p>
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {/* Encabezado propiedades */}
        <div id="properties" className="flex items-end justify-between gap-4 scroll-mt-24">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black text-[#153B6B] tracking-tight">
              Propiedades destacadas
            </h2>
            <p className="text-sm font-semibold text-slate-500">
              Explora las últimas propiedades publicadas en Tu Casita.
            </p>
          </div>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-black text-[#1E67AD] hover:gap-2.5 transition-all shrink-0"
          >
            Ver todas
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* PESTAÑAS DE CLASIFICACIONES REALES */}
        <div className="flex flex-wrap gap-2 pb-2">
          {/* BOTÓN TODAS */}
          <Link
            href={getCategoryUrl('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              selectedTypes.length === 0
                ? 'bg-[#1E67AD] text-white shadow-md shadow-[#1E67AD]/20'
                : 'bg-white border border-[#E2D8C7] text-[#5A5245] hover:border-[#1E67AD] hover:text-[#1E67AD]'
            }`}
          >
            Todas
          </Link>

          {/* OPCIONES DE CLASIFICACIÓN REAL */}
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = selectedTypes.includes(opt.value);
            return (
              <Link
                key={opt.value}
                href={getCategoryUrl(opt.value)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#1E67AD] text-white shadow-md shadow-[#1E67AD]/20'
                    : 'bg-white border border-[#E2D8C7] text-[#5A5245] hover:border-[#1E67AD] hover:text-[#1E67AD]'
                }`}
              >
                <span>{opt.label.replace(/^[^\s]+\s/, '')}</span>
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

function CategoryCard({
  cat,
  getCategoryUrl,
}: {
  cat: CategoryItem;
  getCategoryUrl: (val: string) => string;
}) {
  const Icon = cat.icon;
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2D8C7]/70 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Contenedor del icono con acento de color suave */}
        <div className={`w-12 h-12 rounded-2xl ${cat.bgColor} flex items-center justify-center mb-4`}>
          <Icon className={`w-6 h-6 ${cat.textColor}`} />
        </div>
        <h3 className="text-lg font-black text-[#153B6B] mb-2 leading-tight text-balance">{cat.label}</h3>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed mb-5">{cat.description}</p>
      </div>
      <Link
        href={`${getCategoryUrl(cat.value)}#properties`}
        className="text-sm font-black text-[#1E67AD] inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
      >
        <span>Ver opciones</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
