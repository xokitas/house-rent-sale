'use client';

import { Heart, Home } from 'lucide-react';
import Link from 'next/link';

export default function FavoritosPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
        <Heart className="w-8 h-8" />
      </div>
      <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
        Mis Favoritos
      </h1>
      <p className="text-sm font-semibold text-slate-500 max-w-sm mb-6 leading-relaxed">
        Guarda los inmuebles que más te interesen para acceder a ellos de forma rápida, incluso sin conexión.
      </p>

      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#1E67AD] hover:bg-[#175691] text-white text-sm font-black px-6 py-3 rounded-2xl transition shadow-md active:scale-95 cursor-pointer"
      >
        <Home className="w-4 h-4" />
        Explorar propiedades
      </Link>
    </div>
  );
}
