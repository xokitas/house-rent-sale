export type PropertyStatus = 
  | 'long_term'            // Alquiler Larga Estadía
  | 'local_rent'           // Renta Nacional (CUP)
  | 'international_hostel' // Hostal / Renta Internacional (USD/EUR)
  | 'sale'                 // Venta
  | 'swap'                 // Permuta
  | 'day_pass'             // Pasadía / Eventos
  | 'sold';                // Vendida / Permutada (Cartel especial)

export interface Property {
  id: string;
  title: string;
  address: string;
  status: PropertyStatus[]; // Ahora es un arreglo para soportar múltiple selección
  price: number;
  currency: string;
  contact: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  is_sold?: boolean;        // Indicador si está vendida/permutada
  created_at?: string;
}