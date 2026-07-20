export interface Property {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  address: string;
  price: number;
  currency: string;
  contact: string;
  status: 'rent' | 'vacation' | 'sale' | 'occupied' | 'sold';
  images: string[];
  latitude: number | null;
  longitude: number | null;
}