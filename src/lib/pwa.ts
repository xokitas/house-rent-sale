'use client';

/**
 * Utilidad modular para el registro futuro de un Service Worker de PWA.
 * Actualmente se encuentra desacoplado y listo para ser activado.
 */
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Reemplazar con la ruta real del Service Worker cuando esté listo para producción.
      // navigator.serviceWorker.register('/sw.js').then((reg) => {
      //   console.log('Service Worker registrado con éxito:', reg.scope);
      // }).catch((err) => {
      //   console.error('Fallo al registrar el Service Worker:', err);
      // });
    });
  }
}
