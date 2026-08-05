'use client';

import { useState } from 'react';
import { useCurrency } from '@/lib/currency';
import {
  User,
  Shield,
  Heart,
  FileText,
  TrendingUp,
  Settings,
  HelpCircle,
  Moon,
  Sun,
  Star,
  Check,
  Languages,
} from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  const { currency, changeCurrency } = useCurrency();
  const [darkMode, setDarkMode] = useState(false);

  // Estadísticas del agente ficticio Carlos Reyes (Mockup de Figma Make)
  const stats = [
    { label: 'Guardadas', value: 7, icon: Heart, color: 'text-rose-500' },
    { label: 'Anuncios', value: 3, icon: FileText, color: 'text-blue-500' },
    { label: 'Reseñas', value: 12, icon: Star, color: 'text-amber-500 fill-amber-500' },
  ];

  const menuItems = [
    { icon: '🏠', label: 'Mis propiedades', href: '#', badge: '3 activas' },
    { icon: '❤️', label: 'Guardados', href: '/favoritos' },
    { icon: '📊', label: 'Estadísticas de visitas', href: '#' },
    { icon: '🔔', label: 'Notificaciones y Alertas', href: '#' },
  ];

  const supportItems = [
    { icon: HelpCircle, label: 'Centro de Ayuda y Soporte', desc: 'Preguntas frecuentes y contacto' },
    { icon: Shield, label: 'Términos y Privacidad', desc: 'Políticas de uso seguro' },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-24 text-left">
      {/* 1. HERO CARD DEL AGENTE PREMIUM (MOCKUP DE FIGMA MAKE) */}
      <section className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#1B4D3E] to-emerald-800 text-white p-6 shadow-md shadow-emerald-950/10 border border-emerald-700/30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,#5EEAD4,transparent_50%)] opacity-20 pointer-events-none" />

        <div className="relative space-y-5">
          <div className="flex items-center gap-4">
            {/* Iniciales como avatar */}
            <div className="w-16 h-16 rounded-[1.25rem] bg-white/20 border border-white/15 flex items-center justify-center font-black text-2xl tracking-tight text-white shrink-0">
              CR
            </div>

            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black tracking-tight truncate leading-none">
                  Carlos Reyes
                </h2>
                <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full leading-none tracking-wider uppercase">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                  Gestor Premium
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-semibold truncate">
                carlos@tucasitacmg.cu
              </p>
              <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold">
                <Star className="w-3 h-3 fill-current" />
                <span>4.9 · Verificado</span>
              </div>
            </div>
          </div>

          {/* Rejilla de Métricas rápidas */}
          <div className="grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/5">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-emerald-950/20 py-3 text-center">
                <p className="text-xl font-black tracking-tight">{stat.value}</p>
                <p className="text-[10px] font-bold text-emerald-100/70 uppercase tracking-wider mt-0.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. PREFERENCIAS DEL USUARIO */}
      <section className="bg-white rounded-[2rem] border border-slate-100 p-5 space-y-4 shadow-2xs">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Settings className="w-4 h-4 text-brand-primary" />
          Preferencias de visualización
        </h3>

        {/* SELECTOR DE MONEDA GLOBAL (SOPORTE ARQUITECTÓNICO) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="space-y-0.5">
            <p className="text-xs font-black text-slate-800">Moneda preferida</p>
            <p className="text-[10px] text-slate-400 font-bold">Conversión automática en todo el catálogo</p>
          </div>

          <div className="flex bg-slate-200/50 p-1 rounded-xl border border-slate-200">
            {(['USD', 'CUP', 'EUR'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => changeCurrency(curr)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                  currency === curr
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        {/* MODO NOCTURNO (SIMULACIÓN DE APARIENCIA) */}
        <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="space-y-0.5">
            <p className="text-xs font-black text-slate-800">Modo oscuro</p>
            <p className="text-[10px] text-slate-400 font-bold">Optimizar lectura por las noches</p>
          </div>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer ${
              darkMode ? 'bg-brand-primary' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            >
              {darkMode ? (
                <Moon className="w-2.5 h-2.5 text-brand-primary" />
              ) : (
                <Sun className="w-2.5 h-2.5 text-slate-500" />
              )}
            </div>
          </button>
        </div>
      </section>

      {/* 3. MENÚ DE OPCIONES DEL PERFIL */}
      <section className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-2xs">
        <div className="divide-y divide-slate-100">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="w-full flex items-center justify-between px-5 py-4 text-left transition hover:bg-slate-50 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-base shrink-0 w-6 text-center">{item.icon}</span>
                <span className="text-xs font-black text-slate-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="bg-brand-primary/10 text-brand-primary text-[9px] font-black px-2 py-0.5 rounded-full leading-none">
                    {item.badge}
                  </span>
                )}
                <span className="text-slate-300 font-bold">›</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. SOPORTE Y AYUDA */}
      <section className="bg-white rounded-[2rem] border border-slate-100 p-5 space-y-4 shadow-2xs">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Soporte y Cuenta
        </h3>

        <div className="space-y-2.5">
          {supportItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl border border-slate-50 transition cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black text-slate-800 leading-none">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. ACCESO ADMINISTRATIVO */}
      <section className="pt-4 text-center">
        <Link
          href="/zert"
          className="inline-flex items-center gap-2 text-xs font-black tracking-wider text-slate-400 hover:text-brand-primary bg-slate-100/50 hover:bg-brand-primary/5 border border-dashed border-slate-200 hover:border-slate-300 px-6 py-3 rounded-2xl transition"
        >
          🔐 Ir al Panel Administrativo (/zert)
        </Link>
      </section>
    </div>
  );
}
