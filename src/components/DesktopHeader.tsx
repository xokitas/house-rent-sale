'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ClipboardList, MapPin, User, LogIn } from 'lucide-react';

export default function DesktopHeader() {
  const pathname = usePathname();

  // No mostrar en el panel de administrador
  if (pathname?.startsWith('/zert')) {
    return null;
  }

  const navItems = [
    { href: '/', label: 'Explorar', icon: Home },
    { href: '/mapa', label: 'Mapa', icon: MapPin },
    { href: '/publicar', label: 'Publicar propiedad', icon: ClipboardList },
    { href: '/perfil', label: 'Mi cuenta', icon: User },
  ];

  return (
    <header className="hidden md:block bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* LOGO DE LA MARCA */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center bg-gradient-to-br from-[#1E67AD]/10 to-emerald-500/10 rounded-2xl border border-slate-100 overflow-hidden">
            <img src="/logo.png" alt="TuCasita Logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex flex-col leading-none">
            <div className="flex items-baseline text-xl font-black tracking-tight">
              <span className="text-[#1E67AD] bg-gradient-to-r from-[#1E67AD] to-emerald-600 bg-clip-text text-transparent">Tu</span>
              <span className="text-slate-800">Casita</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
              Encuentra tu lugar en Camagüey
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN PRINCIPAL */}
        <nav className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-bold flex items-center gap-2 transition-colors ${
                  isActive ? 'text-[#1E67AD] font-black' : 'text-slate-600 hover:text-[#1E67AD]'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* ACCESOS DE AUTENTICACIÓN / ADMIN */}
        <div className="flex items-center gap-3">
          <Link
            href="/zert"
            className="text-xs font-black tracking-wider text-[#1E67AD] hover:bg-[#1E67AD]/5 px-4 py-2.5 rounded-xl border border-slate-100 transition-colors"
          >
            PANEL ADMIN
          </Link>
        </div>
      </div>
    </header>
  );
}
