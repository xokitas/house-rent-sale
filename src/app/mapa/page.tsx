import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types';
import { MVP_STATUSES } from '@/lib/constants';
import MapaClient from './MapaClient';
import { AlertCircle } from 'lucide-react';

export const revalidate = 0;

const PRIVACY_OFFSET_RANGE = 0.0012;

function obfuscateCoordinate(value: number, seed: string, axis: 'lat' | 'lng') {
  const hash = Array.from(`${seed}:${axis}`).reduce(
    (accumulator, character) => ((accumulator * 31) + character.charCodeAt(0)) >>> 0,
    0,
  );

  const offset = (((hash % 1000) / 999) - 0.5) * PRIVACY_OFFSET_RANGE * 2;
  return Number((value + offset).toFixed(4));
}

export default async function MapaPage() {
  // Consultar propiedades reales publicadas del MVP de Tu Casita
  const { data: properties, error } = await supabase
    .from('properties')
    .select('*')
    .eq('is_published', true)
    .overlaps('status', MVP_STATUSES);

  if (error) {
    return (
      <div className="max-w-5xl mx-auto py-12 px-4">
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex items-center gap-3 text-rose-600 font-medium max-w-md mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>Ocurrió un error al cargar el mapa: {error.message}</span>
        </div>
      </div>
    );
  }

  const activeProperties = ((properties || []) as Property[]).map((property) => {
    if (property.latitude == null || property.longitude == null) {
      return property;
    }

    return {
      ...property,
      latitude: obfuscateCoordinate(property.latitude, String(property.id), 'lat'),
      longitude: obfuscateCoordinate(property.longitude, String(property.id), 'lng'),
    };
  });

  return (
    <div className="max-w-5xl mx-auto py-2 md:py-6 pb-24">
      <MapaClient properties={activeProperties} />
    </div>
  );
}
