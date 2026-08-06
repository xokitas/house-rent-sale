'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, MapPin, Plus, MessageSquare, User } from 'lucide-react';

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
    { href: '/mensajes', label: 'Mensajes', icon: MessageSquare },
    { href: '/perfil', label: 'Perfil', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-bg-card/95 backdrop-blur-md border-t border-border-main shadow-[0_-8px_24px_rgba(0,0,0,0.04)] pb-safe-bottom transition-all duration-300 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-full md:max-w-md md:rounded-[2rem] md:border md:border-border-main md:shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:pb-0">
      <div className="max-w-md mx-auto px-6 h-16 flex items-center justify-between w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));

          if (item.isCenter) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-4 flex flex-col items-center group cursor-pointer"
                aria-label={item.label}
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-secondary to-[#c4603e] flex items-center justify-center text-white shadow-lg shadow-brand-secondary/30 transition-transform active:scale-90 duration-200 group-hover:scale-105">
                  <Icon className="w-5.5 h-5.5 stroke-[2.5]" />
                </div>
                <span className="text-[10px] font-black text-brand-secondary mt-1 tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors cursor-pointer"
            >
              <Icon
                className={`w-5.5 h-5.5 transition-transform duration-200 active:scale-95 ${
                  isActive ? 'text-brand-primary stroke-[2.2]' : 'text-text-muted stroke-[1.8]'
                }`}
              />
              <span
                className={`text-[10px] mt-1 font-bold transition-all ${
                  isActive ? 'text-brand-primary font-black' : 'text-text-muted font-semibold'
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
