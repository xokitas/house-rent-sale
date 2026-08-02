import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types';
import { notFound } from 'next/navigation';
import PropertyDetailClient from './PropertyDetailClient';

export const revalidate = 0;

interface PropertyPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { id } = await params;

  // Consultamos la propiedad directamente en Supabase usando el ID de la ruta
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !property) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-6 pb-24">
      <PropertyDetailClient property={property as Property} />
    </div>
  );
}
