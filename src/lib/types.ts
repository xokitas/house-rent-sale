export type PropertyStatus = 
  | 'sale' 
  | 'long_term' 
  | 'international_hostel' 
  | 'local_rent'
  | 'day_pass';

export interface Property {
  id: string;
  title: string;
  address: string;
  status: PropertyStatus;
  price: number;
  currency: string;
  contact: string;
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
  images: string[];
  created_at?: string;
}