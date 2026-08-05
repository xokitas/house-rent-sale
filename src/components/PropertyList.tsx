'use client';

import { Property } from '@/lib/types';
import PropertyCard from './PropertyCard';
import { Search } from 'lucide-react';

interface PropertyListProps {
  properties: Property[];
}

export default function PropertyList({ properties }: PropertyListProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm max-w-md mx-auto my-6">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-primary">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-slate-900 mb-1">No encontramos propiedades</h3>
        <p className="text-slate-500 text-xs font-semibold">
          Prueba ajustando o quitando los filtros de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
