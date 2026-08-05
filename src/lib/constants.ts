import { PropertyStatus } from './types';

// Categorías permitidas en el MVP de Tu Casita
export const MVP_STATUSES: PropertyStatus[] = ['sale', 'swap', 'long_term'];

// Definición centralizada de todas las clasificaciones/categorías del sistema
export const ALL_STATUS_OPTIONS = [
  { value: 'sale' as PropertyStatus, label: 'Venta', icon: 'Tag', colorClass: 'bg-brand-primary text-white', themeColor: '#1B4D3E' },
  { value: 'swap' as PropertyStatus, label: 'Permuta', icon: 'ArrowLeftRight', colorClass: 'bg-teal-600 text-white', themeColor: '#0D9488' },
  { value: 'long_term' as PropertyStatus, label: 'Alquiler de larga estadía', icon: 'Calendar', colorClass: 'bg-emerald-600 text-white', themeColor: '#059669' },
  { value: 'commercial_space' as PropertyStatus, label: 'Alquiler comercial', icon: 'Building2', colorClass: 'bg-purple-600 text-white', themeColor: '#7C3AED' },
  { value: 'international_hostel' as PropertyStatus, label: 'Hostal internacional', icon: 'Globe', colorClass: 'bg-orange-500 text-white', themeColor: '#F97316' },
  { value: 'local_rent' as PropertyStatus, label: 'Renta nacional', icon: 'Coins', colorClass: 'bg-amber-600 text-white', themeColor: '#D97706' },
  { value: 'day_pass' as PropertyStatus, label: 'Pasadías o eventos', icon: 'Sparkles', colorClass: 'bg-pink-600 text-white', themeColor: '#DB2777' },
];

// Opciones de categorías visibles públicamente (solo las del MVP)
export const MVP_STATUS_OPTIONS = ALL_STATUS_OPTIONS.filter((opt) =>
  MVP_STATUSES.includes(opt.value)
);
