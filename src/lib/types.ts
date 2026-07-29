export type PropertyStatus = 
  | 'sale' 
  | 'swap' 
  | 'long_term' 
  | 'local_rent' 
  | 'international_hostel' 
  | 'day_pass' 
  | 'commercial_space';

export interface Property {
  // 1. CAMPOS UNIVERSALES (Obligatorios y base)
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  contact: string;
  images: string[];
  status: PropertyStatus[];
  priority: number;
  created_at?: string;
  is_sold?: boolean;
  
  // CONTROL DE ESTADO
  is_published?: boolean;

  // 2. UBICACIÓN
  address: string;
  province?: string;
  municipality?: string | null;
  neighborhood?: string | null;
  latitude?: number | null;
  longitude?: number | null;

  // 3. CARACTERÍSTICAS ESTRUCTURALES
  property_type?: string | null;
  bedrooms?: number;
  bathrooms?: number;
  living_rooms?: number;
  dining_rooms?: number;
  kitchens?: number;
  indoor_patios?: number;
  outdoor_patios?: number;
  garages?: number;
  terraces?: number;
  balconies?: number;
  portals?: number;
  floors?: number;
  construction_area?: number | null;
  land_area?: number | null;

  // 4. AMENIDADES
  amenities?: string[];

  // 5. CAMPOS ESPECÍFICOS: HOSTAL / INTERNACIONAL
  rooms_available?: number | null;
  private_bathroom?: boolean;
  shared_bathroom?: boolean;
  breakfast?: boolean;
  lunch?: boolean;
  dinner?: boolean;
  airport_pickup?: boolean;
  check_in?: string | null;
  check_out?: string | null;
  languages?: string[];

  // 6. CAMPOS ESPECÍFICOS: PASADÍA / EVENTOS
  capacity?: number | null;
  event_schedule?: string | null;
  music_allowed?: boolean;

  // 7. CAMPOS ESPECÍFICOS: LOCAL COMERCIAL
  commercial_front?: boolean;
  warehouse?: boolean;
  office?: boolean;
  industrial_power?: boolean;
}

export const STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: 'sale', label: '🏷️ Venta' },
  { value: 'swap', label: '🔄 Permuta' },
  { value: 'long_term', label: '📅 Alquiler Larga Estadía' },
  { value: 'local_rent', label: '💵 Renta Nacional (CUP)' },
  { value: 'international_hostel', label: '✈️ Hostal / Internacional' },
  { value: 'day_pass', label: '🎉 Pasadía / Eventos' },
  { value: 'commercial_space', label: '🏢 Renta de Local / Espacio Comercial' },
];

export const PRIORITY_OPTIONS = [
  { value: 1, label: '⭐ Prioridad 1: Patrocinada / De Pago (Aparece Primero)' },
  { value: 2, label: '💼 Prioridad 2: Agente / Inmobiliaria' },
  { value: 3, label: '🏠 Prioridad 3: Estándar Destacada (Buena Calidad)' },
  { value: 4, label: '📄 Prioridad 4: Estándar Básica' },
];

export const CAMAGUEY_MUNICIPALITIES = [
  'Camagüey',
  'Carlos Manuel de Céspedes',
  'Esmeralda',
  'Florida',
  'Guáimaro',
  'Jimaguayú',
  'Minas',
  'Najasa',
  'Nuevitas',
  'Santa Cruz del Sur',
  'Sibanicú',
  'Sierra de Cubitas',
  'Vertientes',
];

export const PROPERTY_TYPE_OPTIONS = [
  'Casa',
  'Apartamento',
  'Finca',
  'Terreno',
  'Local Comercial',
  'Hostal',
  'Habitación',
  'Edificio',
  'Solar',
  'Otro',
];