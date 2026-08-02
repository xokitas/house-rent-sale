'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, MapPin, Plus, Heart, User } from 'lucide-react';

export default function BottomNavigation() {
  const pathname = usePathname();

  // No mostrar la Bottom Navigation en las rutas del administrador (/zert)
  if (pathname?.startsWith('/zert')) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Explorar', icon: Search },
    { href: '/mapa', label: 'Mapa', icon: MapPin },
    { href: '/publicar', label: 'Publicar', icon: Plus, isCenter: true },
    { href: '/favoritos', label: 'Favoritos', icon: Heart },
    { href: '/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-safe-bottom">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-4 flex flex-col items-center group"
                aria-label={item.label}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E67AD] to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-[#1E67AD]/30 transition-transform active:scale-90 duration-200 group-hover:scale-105">
                  <Icon className="w-6 h-6 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-[#1E67AD] mt-1 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 text-slate-400 hover:text-[#1E67AD] transition-colors"
            >
              <Icon
                className={`w-5 h-5 transition-transform duration-200 active:scale-95 ${
                  isActive ? 'text-[#1E67AD] stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'
                }`}
              />
              <span
                className={`text-[10px] mt-1 font-bold transition-all ${
                  isActive ? 'text-[#1E67AD] font-black' : 'text-slate-500 font-semibold'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
