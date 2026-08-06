'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyStatus } from '@/lib/types';
import { useCurrency, CurrencyType } from '@/lib/currency';
import { MVP_STATUSES } from '@/lib/constants';
import PropertyList from '@/components/PropertyList';
import FilterDrawer from '@/components/FilterDrawer';
import { useTheme } from '@/components/ThemeProvider';
import {
  Bell,
  Search,
  SlidersHorizontal,
  Sun,
  Moon,
  Home,
  Tag,
  ArrowLeftRight,
  Calendar,
} from 'lucide-react';

export default function HomePage() {
  const { currency, changeCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();

  // Estados locales para datos, carga, filtros y búsqueda
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sale' | 'swap' | 'long_term'>('sale');
  const [searchQuery, setSearchQuery] = useState('');

  // Estado para el drawer de filtros avanzados
  const [maxPriceFilter, setMaxPriceFilter] = useState<string>('');

  // Cargar propiedades reales de Supabase
  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('is_published', true)
          .overlaps('status', MVP_STATUSES)
          .order('priority', { ascending: true })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching properties from Supabase:', error);
        } else if (data) {
          console.log(`Loaded ${data.length} real properties from Supabase.`);
          setProperties(data as Property[]);
        }
      } catch (err) {
        console.error('Error fetching properties from Supabase:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  // Filtrado reactivo en el cliente (búsqueda + pestañas + precio máximo)
  const filteredProperties = properties.filter((p) => {
    // 1. Filtrado por clasificación de pestaña activa (Venta, Permuta, Alquiler)
    const matchesTab = p.status.includes(activeTab);

    // 2. Filtrado por búsqueda en título, reparto/barrio o descripción
    const text = (p.title + ' ' + (p.neighborhood || '') + ' ' + (p.description || '')).toLowerCase();
    const matchesSearch = searchQuery === '' || text.includes(searchQuery.toLowerCase());

    // 3. Filtrado por precio máximo (si se definió en los filtros)
    const matchesPrice = !maxPriceFilter || p.price <= Number(maxPriceFilter);

    return matchesTab && matchesSearch && matchesPrice;
  });

  const activeTabLabel =
    activeTab === 'sale'
      ? 'En Venta'
      : activeTab === 'swap'
      ? 'En Permuta'
      : 'En Alquiler';

  return (
    <div className="w-full flex flex-col min-h-screen bg-bg-main transition-colors duration-200 text-left">
      {/* 1. CABECERA (PIXEL PERFECT FIGMA) */}
      <div className="bg-bg-card border-b border-border-main px-4 py-4.5 sticky top-0 z-30 shadow-xs transition-colors duration-200 rounded-3xl md:rounded-[2rem] md:mt-2">
        <div className="flex flex-row items-center justify-between gap-4 mb-3.5">
          <div className="space-y-0.5 min-w-0 shrink">
            <p className="text-[9px] sm:text-[10px] font-black tracking-[0.12em] text-brand-secondary uppercase truncate">
              Camagüey, Cuba
            </p>
            <h1 className="text-base sm:text-2xl font-black tracking-tight text-text-main leading-none truncate">
              Inmobiliaria <span className="text-brand-primary">Tu Casita</span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-3 shrink-0">
            {/* Fila 1: Notificaciones y Tema */}
            <div className="flex items-center gap-1.5">
              {/* Botón de tema claro/oscuro */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full bg-bg-main hover:bg-border-main flex items-center justify-center text-text-muted transition-colors cursor-pointer"
                title="Cambiar Apariencia"
              >
                {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5" />}
              </button>

              {/* Campana de notificaciones */}
              <button className="relative w-9 h-9 rounded-full bg-bg-main hover:bg-border-main flex items-center justify-center text-text-muted transition-colors">
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-brand-secondary" />
              </button>
            </div>

            {/* Fila 2: Selector de moneda capsule */}
            <div className="flex rounded-xl overflow-hidden border border-border-main p-0.5 bg-bg-main/30 shrink-0">
              {(['USD', 'CUP', 'EUR'] as CurrencyType[]).map((c) => (
                <button
                  key={c}
                  onClick={() => changeCurrency(c)}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
                    currency === c
                      ? 'bg-brand-primary text-bg-card shadow-xs'
                      : 'text-text-muted hover:text-text-main'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. BARRA DE BÚSQUEDA Y FILTRO */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-bg-main border border-border-main transition-colors duration-200 min-w-0">
          <Search className="w-4.5 h-4.5 text-text-muted shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por reparto (Ej. La Caridad)..."
            className="flex-1 min-w-0 bg-transparent text-xs font-semibold outline-none text-text-main placeholder:text-text-muted/60"
          />
          <FilterDrawer
            filterType={activeTab}
            maxPrice={maxPriceFilter}
            onPriceChange={setMaxPriceFilter}
          />
        </div>

        {/* 3. PESTAÑAS DEL MVP (PIXEL-PERFECT TABS) */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'sale', label: 'Venta', icon: Tag },
            { id: 'swap', label: 'Permuta', icon: ArrowLeftRight },
            { id: 'long_term', label: 'Alquiler', icon: Calendar },
          ].map((t) => {
            const isActive = activeTab === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-brand-primary text-bg-card border-transparent shadow-sm'
                    : 'bg-bg-main text-text-muted border-border-main hover:border-text-muted/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. FEED PRINCIPAL */}
      <div className="flex-1 px-4 pt-5 pb-24">
        {loading ? (
          <div className="space-y-4">
            <div className="h-4 w-32 bg-border-main rounded-md shimmer" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-bg-card rounded-4xl border border-border-main shimmer" />
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs font-bold text-text-muted tracking-wide">
              {filteredProperties.length} propiedades · {activeTabLabel}
            </p>

            <PropertyList properties={filteredProperties} />

            {filteredProperties.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center gap-3 bg-bg-card rounded-4xl border border-border-main p-6 shadow-2xs">
                <span className="text-4xl animate-bounce">🏚️</span>
                <h3 className="text-sm font-black text-text-main leading-none">Sin resultados</h3>
                <p className="text-xs font-semibold text-text-muted leading-relaxed">
                  Intenta buscar en otro reparto, ajusta el presupuesto máximo o limpia tus filtros activos.
                </p>
                {(searchQuery || maxPriceFilter) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setMaxPriceFilter('');
                    }}
                    className="mt-2 text-xs font-black text-brand-primary hover:underline cursor-pointer"
                  >
                    Restaurar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
