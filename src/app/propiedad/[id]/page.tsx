import { supabase } from '@/lib/supabase';
import { Property } from '@/lib/types';
import { MVP_STATUSES } from '@/lib/constants';
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

  // 1. Cargar la propiedad
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .overlaps('status', MVP_STATUSES)
    .single();

  if (error || !property) {
    notFound();
  }

  // 2. Cargar imagenes desde la tabla relacional
  const { data: imagesData } = await supabase
    .from('property_images')
    .select('image_url, display_order')
    .eq('property_id', id)
    .order('display_order', { ascending: true });

  const relImages = (imagesData || []).map((img) => img.image_url);
  const finalImages = relImages.length > 0 ? relImages : (property.images || []);

  const propertyWithImages = {
    ...property,
    images: finalImages,
  } as Property;

  return (
    <div className="max-w-4xl mx-auto py-2 md:py-6 pb-24">
      <PropertyDetailClient property={propertyWithImages} />
    </div>
  );
}