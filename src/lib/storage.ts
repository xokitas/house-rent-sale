import { supabase } from './supabase';

/**
 * Extrae el path relativo dentro del bucket desde una URL pública de Supabase Storage.
 * Ej: https://.../properties/properties/123.webp -> properties/123.webp
 * Ej: https://.../properties/123.webp -> 123.webp
 */
export function extractStoragePath(imageUrl: string, bucketName: string): string | null {
  try {
    const url = new URL(imageUrl);
    const parts = url.pathname.split('/');
    const bucketIndex = parts.indexOf(bucketName);
    if (bucketIndex === -1 || bucketIndex + 1 >= parts.length) return null;
    // Todo lo que viene después del nombre del bucket es el path interno
    return parts.slice(bucketIndex + 1).join('/');
  } catch {
    return null;
  }
}

/**
 * Borra una imagen del bucket de Supabase Storage.
 */
export async function deleteImageFromStorage(imageUrl: string, bucketName: string = 'properties'): Promise<void> {
  const path = extractStoragePath(imageUrl, bucketName);
  if (!path) {
    console.warn('No se pudo extraer el path de la URL:', imageUrl);
    return;
  }

  const { error } = await supabase.storage.from(bucketName).remove([path]);
  if (error) {
    console.error('Error borrando imagen del bucket:', error);
  } else {
    console.log('Imagen borrada del bucket:', path);
  }
}