import { Conversation, Message } from './types';

/**
 * ============================================================================
 * ARQUITECTURA DE MENSAJERÍA FUTURA - TU CASITA
 * ============================================================================
 *
 * Este archivo prepara las bases para la futura mensajería en tiempo real
 * entre usuarios (compradores/interesados) y propietarios de inmuebles.
 *
 * Se apoya en:
 *  - Supabase Auth (para identificar al remitente/destinatario).
 *  - Supabase Database (tablas de `conversations` y `messages`).
 *  - Supabase Realtime (para suscripciones automáticas de mensajes entrantes).
 *
 * NOTA: No activar consultas activas en el UI hasta que las tablas estén
 * completamente desplegadas y configuradas en Supabase.
 */

/**
 * Obtener la lista de conversaciones activas del usuario autenticado.
 * Filtra las conversaciones donde el usuario sea comprador (buyer_id) o vendedor (seller_id).
 *
 * @param userId ID del usuario autenticado actual.
 * @returns Promesa con la lista de conversaciones estructuradas.
 */
export async function getConversations(userId: string): Promise<Conversation[]> {
  try {
    // Ejemplo de consulta futura:
    // const { data, error } = await supabase
    //   .from('conversations')
    //   .select(`
    //     *,
    //     property:properties(title, images)
    //   `)
    //   .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    //   .order('updated_at', { ascending: false });

    // if (error) throw error;
    // return data as Conversation[];

    console.log('[MESSAGING ARCHITECTURE] getConversations llamada con userId:', userId);
    return [];
  } catch (err) {
    console.error('Error al obtener conversaciones:', err);
    return [];
  }
}

/**
 * Obtener todos los mensajes asociados a una conversación específica.
 *
 * @param conversationId ID de la conversación a consultar.
 * @returns Lista de mensajes ordenados cronológicamente.
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    // Ejemplo de consulta futura:
    // const { data, error } = await supabase
    //   .from('messages')
    //   .select('*')
    //   .eq('conversation_id', conversationId)
    //   .order('created_at', { ascending: true });

    // if (error) throw error;
    // return data as Message[];

    console.log('[MESSAGING ARCHITECTURE] getMessages llamada con conversationId:', conversationId);
    return [];
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    return [];
  }
}

/**
 * Enviar un nuevo mensaje dentro de una conversación.
 *
 * @param conversationId ID de la conversación.
 * @param senderId ID del usuario que envía el mensaje.
 * @param content Contenido de texto del mensaje.
 */
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<Message | null> {
  try {
    // Ejemplo de inserción futura:
    // const { data, error } = await supabase
    //   .from('messages')
    //   .insert([{
    //     conversation_id: conversationId,
    //     sender_id: senderId,
    //     content,
    //     is_read: false
    //   }])
    //   .select()
    //   .single();

    // // Actualizar fecha de conversación
    // await supabase
    //   .from('conversations')
    //   .update({ updated_at: new Date().toISOString() })
    //   .eq('id', conversationId);

    // if (error) throw error;
    // return data as Message;

    console.log('[MESSAGING ARCHITECTURE] sendMessage enviado:', { conversationId, senderId, content });
    return null;
  } catch (err) {
    console.error('Error al enviar mensaje:', err);
    return null;
  }
}

/**
 * Iniciar una nueva conversación vinculada a una propiedad.
 * Evita duplicados si el comprador ya tiene un chat activo con el vendedor por ese inmueble.
 */
export async function createConversation(
  propertyId: string,
  buyerId: string,
  sellerId: string
): Promise<Conversation | null> {
  try {
    // Ejemplo de inserción futura:
    // const { data, error } = await supabase
    //   .from('conversations')
    //   .insert([{ property_id: propertyId, buyer_id: buyerId, seller_id: sellerId }])
    //   .select()
    //   .single();

    // if (error) throw error;
    // return data as Conversation;

    console.log('[MESSAGING ARCHITECTURE] createConversation creada para la propiedad:', propertyId, 'con comprador:', buyerId, 'y vendedor:', sellerId);
    return null;
  } catch (err) {
    console.error('Error al crear conversación:', err);
    return null;
  }
}

/**
 * SUSCRIPCIÓN EN TIEMPO REAL CON SUPABASE REALTIME
 *
 * Para escuchar mensajes entrantes en caliente (mientras el usuario tiene abierto el chat):
 *
 * ```typescript
 * import { useEffect } from 'react';
 * import { supabase } from './supabase';
 *
 * export function useRealtimeMessages(conversationId: string, onNewMessage: (msg: any) => void) {
 *   useEffect(() => {
 *     if (!conversationId) return;
 *
 *     // Canal para escuchar cambios en la tabla 'messages'
 *     const channel = supabase
 *       .channel(`chat:${conversationId}`)
 *       .on(
 *         'postgres_changes',
 *         {
 *           event: 'INSERT',
 *           schema: 'public',
 *           table: 'messages',
 *           filter: `conversation_id=eq.${conversationId}`
 *         },
 *         (payload) => {
 *           onNewMessage(payload.new);
 *         }
 *       )
 *       .subscribe();
 *
 *     return () => {
 *       supabase.removeChannel(channel);
 *     };
 *   }, [conversationId, onNewMessage]);
 * }
 * ```
 */
