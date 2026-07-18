export interface Property {
  id: number;
  created_at: string;
  title: string;
  description: string | null;
  address: string;
  price: number;
  currency: string;
  contact: string;
  status: 'rent' | 'sale' | 'occupied' | 'sold';
  images: string[];
}