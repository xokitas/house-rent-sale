import { Property } from './types';

/**
 * Decoupled notification service helper.
 * Designed to cleanly separate future Telegram bot/webhook triggers from
 * the main Supabase insertion and UI logic.
 *
 * To implement in the future:
 * 1. Set up a Telegram bot via BotFather and retrieve the BOT_TOKEN.
 * 2. Configure a channel or retrieve the CHAT_ID where updates should be sent.
 * 3. Invoke fetch() pointing to the Telegram bot API:
 *    https://api.telegram.org/bot<token>/sendMessage
 */
export async function triggerTelegramNotification(property: Property): Promise<boolean> {
  try {
    // Standard structured message draft
    const messageLines = [
      `📢 *NUEVA SOLICITUD DE PUBLICACIÓN* 📢`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `🏷️ *Categoría:* ${property.status?.join(', ') || 'Sin especificar'}`,
      `🏠 *Tipo:* ${property.property_type || 'Desconocido'}`,
      `📝 *Título:* ${property.title}`,
      `💰 *Precio:* ${Number(property.price).toLocaleString('en-US')} ${property.currency}`,
      `📍 *Ubicación:* ${property.address}`,
      `📞 *Contacto:* ${property.contact}`,
      `━━━━━━━━━━━━━━━━━━━━━━━━`,
      `⚠️ *Estado:* Pendiente de aprobación en el panel de administración.`,
    ];

    const fullMessage = messageLines.join('\n');

    console.log('--- FUTURE TELEGRAM NOTIFICATION TRIGGER ---');
    console.log(fullMessage);
    console.log('--------------------------------------------');

    // Placeholder for future API call:
    // const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    // const telegramChatId = process.env.TELEGRAM_CHAT_ID;
    // if (telegramBotToken && telegramChatId) {
    //   await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       chat_id: telegramChatId,
    //       text: fullMessage,
    //       parse_mode: 'Markdown',
    //     }),
    //   });
    // }

    return true;
  } catch (err) {
    console.error('Error in triggerTelegramNotification:', err);
    return false;
  }
}
