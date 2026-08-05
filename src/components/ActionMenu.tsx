'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Home, Lightbulb, AlertTriangle } from 'lucide-react';

export default function ActionMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative inline-flex items-center">
      {/* Botón disparador (icono de casa + chevron) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 bg-white border border-[#E2D8C7] shadow-xs rounded-2xl pl-2 pr-3 py-1.5 transition-all hover:border-brand-primary active:scale-95 cursor-pointer"
      >
        <span className="w-8 h-8 rounded-xl bg-[#F2ECE1] border border-[#E2D8C7] flex items-center justify-center shrink-0 overflow-hidden text-brand-primary">
          <Home className="w-4 h-4" />
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#5A5245] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Panel desplegable */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-60 bg-white border border-[#E2D8C7] rounded-2xl shadow-xl p-2 z-50 origin-top-right animate-in fade-in zoom-in-95 duration-150"
        >
          {/* 1. Publicar una casa */}
          <Link
            href="/publicar"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#5A5245] hover:bg-[#F5EFE6] transition-colors cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
              <Home className="w-4 h-4" />
            </span>
            Publicar una casa
          </Link>

          {/* 2. Sugerir una idea */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              alert('Acción provisional: Sugerir una idea');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#5A5245] hover:bg-[#F5EFE6] transition-colors cursor-pointer text-left"
          >
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
              <Lightbulb className="w-4 h-4" />
            </span>
            Sugerir idea
          </button>

          {/* 3. Reportar un error */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              alert('Acción provisional: Reportar un error');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-[#5A5245] hover:bg-[#F5EFE6] transition-colors cursor-pointer text-left"
          >
            <span className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </span>
            Reportar error
          </button>
        </div>
      )}
    </div>
  );
}
