// ==========================================
// TIPOS PRINCIPALES TU CASITA MVP
// ==========================================

export type PropertyStatus =
  | 'sale'
  | 'swap'
  | 'long_term';


export type Currency =
  | 'USD'
  | 'EUR'
  | 'CUP';


export interface Property {

  // IDENTIFICACIÓN
  id: string | number;
  created_at?: string;
  updated_at?: string;

  // INFORMACIÓN PRINCIPAL
  title: string;
  description?: string;

  price: number;
  currency: Currency;

  status: PropertyStatus[];

  // PUBLICACIÓN
  is_published?: boolean;
  is_sold?: boolean;

  priority: number;

  // IMÁGENES
  images: string[];

  // UBICACIÓN
  address: string;

  province?: string;
  municipality?: string | null;
  neighborhood?: string | null;

  latitude?: number | null;
  longitude?: number | null;

  // TIPO DE PROPIEDAD MVP
  property_type?: PropertyType | null;


  // CARACTERÍSTICAS
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


  // CONTACTO
  contact?: string;

  contact_name?: string;
  contact_phone?: string;
  contact_whatsapp?: string;

  show_contact?: boolean;

  // SEGURIDAD UBICACIÓN
  show_exact_address?: boolean;


  // MÉTRICAS
  views_count?: number;
  contacts_count?: number;
  favorites_count?: number;
  shares_count?: number;


  // USUARIO
  created_by?: string;
  publisher_id?: string;
}

// ==========================================
// MUNICIPIOS DE CAMAGÜEY
// ==========================================

export const CAMAGUEY_MUNICIPALITIES: string[] = [
  'Camagüey',
  'Carlos M. de Céspedes',
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



// ==========================================
// TIPOS DE INMUEBLE MVP
// ==========================================

export type PropertyType =
  | 'Casa'
  | 'Apartamento'
  | 'Finca'
  | 'Terreno'
  | 'Habitación'
  | 'Otro';



export const STATUS_OPTIONS: {
  value: PropertyStatus;
  label: string;
}[] = [

  {
    value: 'sale',
    label: '🏷️ Venta'
  },

  {
    value: 'swap',
    label: '🔄 Permuta'
  },

  {
    value: 'long_term',
    label: '📅 Alquiler larga estancia'
  }

];



export const PROPERTY_TYPE_OPTIONS: PropertyType[] = [
  'Casa',
  'Apartamento',
  'Finca',
  'Terreno',
  'Habitación',
  'Otro'
];



export const PRIORITY_OPTIONS = [

  {
    value: 1,
    label: '⭐ Prioridad 1'
  },

  {
    value: 2,
    label: '💼 Prioridad 2'
  },

  {
    value: 3,
    label: '🏠 Prioridad 3'
  },

  {
    value: 4,
    label: '📄 Prioridad 4'
  }

];



// ==========================================
// MENSAJERÍA FUTURA
// ==========================================


export interface Conversation {

  id: string;

  property_id?: number;

  buyer_id: string;

  owner_id: string;


  last_message?: string;

  last_message_at?: string;

  is_active: boolean;


  created_at: string;

  updated_at: string;


  // Datos auxiliares frontend
  property_title?: string;

  property_image?: string;

  unread_count?: number;

}



export interface Message {

  id: string;

  conversation_id: string;

  sender_id: string;

  content: string;

  is_read: boolean;

  read_at?: string | null;

  created_at: string;

}