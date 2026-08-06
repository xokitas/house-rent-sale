'use client';

import { MessageSquare, Home } from 'lucide-react';
import Link from 'next/link';

export default function MensajesPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center mb-6">
        <MessageSquare className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black text-text-main tracking-tight mb-2">
        Mensajes
      </h1>
      <p className="text-sm font-semibold text-text-muted max-w-sm mb-6 leading-relaxed">
        Próximamente podrás comunicarte directamente con propietarios y usuarios desde aquí.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-brand-primary hover:opacity-95 text-bg-card text-sm font-black px-6 py-3 rounded-2xl transition shadow-md active:scale-95 cursor-pointer"
      >
        <Home className="w-4 h-4" />
        Explorar propiedades
      </Link>
    </div>
  );
}
