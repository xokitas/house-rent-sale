export type PropertyStatus = 
  | 'sale' 
  | 'swap' 
  | 'long_term' 
  | 'local_rent' 
  | 'international_hostel' 
  | 'day_pass' 
  | 'commercial_space'; // <--- NUEVA CLASIFICACIÓN

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  address: string;
  contact: string;
  images: string[];
  status: PropertyStatus[];
  latitude?: number | null;
  longitude?: number | null;
  is_sold?: boolean;
  priority: number; // <--- NUEVO CAMPO DE PRIORIDAD (1, 2, 3 o 4)
  created_at?: string;
}

export const STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: 'sale', label: '🏷️ Venta' },
  { value: 'swap', label: '🔄 Permuta' },
  { value: 'long_term', label: '📅 Alquiler Larga Estadía' },
  { value: 'local_rent', label: '💵 Renta Nacional (CUP)' },
  { value: 'international_hostel', label: '✈️ Hostal / Internacional' },
  { value: 'day_pass', label: '🎉 Pasadía / Eventos' },
  { value: 'commercial_space', label: '🏢 Renta de Local / Espacio Comercial' }, // <--- NUEVA
];

export const PRIORITY_OPTIONS = [
  { value: 1, label: '⭐ Prioridad 1: Patrocinada / De Pago (Aparece Primero)' },
  { value: 2, label: '💼 Prioridad 2: Agente / Inmobiliaria' },
  { value: 3, label: '🏠 Prioridad 3: Estándar Destacada (Buena Calidad)' },
  { value: 4, label: '📄 Prioridad 4: Estándar Básica' },
];