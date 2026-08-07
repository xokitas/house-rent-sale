'use client';

import { useState } from 'react';
import { Property } from '@/lib/types';
import { useCurrency } from '@/lib/currency';
import { getStatusBadge } from '@/lib/utils';
import {
  ArrowLeft,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  User,
  Star,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PropertyDetailClientProps {
  property: Property;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const router = useRouter();
  const { formatPrice } = useCurrency();
  const [liked, setLiked] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = property.images && property.images.length > 0 ? property.images : [''];
  const formattedPrice = formatPrice(property.price, property.currency);
  const isAlquiler = property.status.includes('long_term');
  const mainBadge = getStatusBadge(property.status[0]);
  const p = property as any; // Cast temporal hasta migrar types.ts

  const nextImage = () => {
    setActiveImageIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-bg-card rounded-[2.5rem] border border-border-main overflow-hidden shadow-xs relative text-left transition-colors duration-200">
      {/* 1. CABECERA CON IMAGEN Y ACCIONES RÁPIDAS (ESTILO MOBILE FIRST) */}
      <div className="relative h-[40vh] sm:h-[45vh] w-full bg-bg-main overflow-hidden">
        <img
          src={images[activeImageIdx]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-black/30 pointer-events-none" />
        {/* Acciones superiores */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-slate-950/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-slate-950/60 active:scale-95 transition cursor-pointer border border-white/5"
            title="Atrás"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={() => setLiked(!liked)}
            className="w-10 h-10 rounded-full bg-slate-950/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-slate-950/60 active:scale-95 transition cursor-pointer border border-white/5"
            title="Favorito"
          >
            <Heart className={`w-5 h-5 ${liked ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
          </button>
        </div>

        {/* Navegación por flechas del slider */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/35 backdrop-blur-xs text-white flex items-center justify-center hover:bg-slate-950/50 active:scale-90 transition z-10 cursor-pointer border border-white/5"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-950/35 backdrop-blur-xs text-white flex items-center justify-center hover:bg-slate-950/50 active:scale-90 transition z-10 cursor-pointer border border-white/5"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicadores de imágenes */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeImageIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* Contador de fotos */}
        <div className="absolute bottom-6 right-6 z-10">
          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
            {activeImageIdx + 1} / {images.length} fotos
          </span>
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className="p-6 md:p-8 space-y-6">
        {/* Precio y Badges */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="inline-block bg-[#1B4D3E] text-[#5EEAD4] text-xl font-black px-4 py-1.5 rounded-2xl shadow-md">
              {formattedPrice}
              {isAlquiler && <span className="text-xs font-bold text-white/80"> /mes</span>}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="bg-brand-primary/10 text-brand-primary text-xs font-black px-3.5 py-1.5 rounded-full border border-brand-primary/15 shadow-2xs">
              {mainBadge.label}
            </span>
            {property.priority && property.priority <= 3 && (
              <span className="inline-flex items-center gap-1 bg-brand-secondary/15 text-brand-secondary text-xs font-black px-3 py-1.5 rounded-full border border-brand-secondary/15 shadow-2xs">
                <Star className="w-3.5 h-3.5 fill-current" />
                Destacado
              </span>
            )}
          </div>
        </div>

        {/* Título de la propiedad */}
        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-text-main leading-tight">
            {property.title}
          </h1>
          <p className="flex items-center gap-1.5 text-xs font-semibold text-text-muted">
            <MapPin className="w-4 h-4 text-brand-primary shrink-0" />
            <span>
              {property.address || `${property.neighborhood || 'Zona general'}, Camagüey`}
            </span>
          </p>
        </div>

        {/* Rejilla de Características principales */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Cuartos', value: property.bedrooms || 0, emoji: '🛏️' },
            { label: 'Baños', value: property.bathrooms || 0, emoji: '🚿' },
            { label: 'Superficie', value: property.construction_area ? `${property.construction_area}m²` : '---', emoji: '📐' },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-bg-main border border-border-main rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1"
            >
              <span className="text-xl">{item.emoji}</span>
              <span className="text-sm font-black text-text-main leading-none">{item.value}</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Descripción detallada */}
        <div className="space-y-2 pt-4 border-t border-border-main">
          <h2 className="text-sm font-black text-text-main uppercase tracking-wider">
            Descripción de la Propiedad
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-text-muted leading-relaxed whitespace-pre-line">
            {property.description || 'Sin descripción detallada por el momento.'}
          </p>
        </div>

        {/* Atributos locales / Amenidades */}
        {p.amenities && p.amenities.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border-main">
            <h2 className="text-sm font-black text-text-main uppercase tracking-wider">
              Comodidades y Atributos
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {p.amenities.map((amenity: string) => (
                <div
                  key={amenity}
                  className="flex items-center gap-2 p-3 bg-bg-main rounded-xl border border-border-main"
                >
                  <span className="w-5 h-5 rounded-lg bg-brand-primary/10 border border-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                    <Check className="w-3 h-3 stroke-3" />
                  </span>
                  <span className="text-xs font-black text-text-main">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Información de contacto / Propietario */}
        <div className="p-4 bg-bg-main border border-border-main rounded-3xl flex items-center gap-4 transition-colors duration-200">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-brand-primary to-brand-secondary flex items-center justify-center text-white shrink-0 font-black shadow-sm">
            <User className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider leading-none mb-1">
              Contacto Directo
            </p>
            <p className="text-sm font-black text-text-main truncate">
              Dueño del Inmueble
            </p>
            <p className="text-xs font-bold text-text-muted truncate mt-0.5">
              Tel: {property.contact}
            </p>
          </div>
        </div>
      </div>

      {/* 3. CTA FIJADO INFERIOR PARA ACCESO RÁPIDO */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card/95 backdrop-blur-md border-t border-border-main shadow-[0_-8px_24px_rgba(0,0,0,0.06)] p-4 pb-safe-bottom transition-colors duration-200">
        <div className="max-w-md mx-auto flex gap-3">
          <a
            href={`tel:${property.contact}`}
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-bg-main hover:bg-border-main text-text-main border border-border-main font-black text-xs transition active:scale-95"
          >
            <Phone className="w-4 h-4 text-brand-primary" />
            Llamar ahora
          </a>

          <a
            href={`tel:${property.contact || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 h-12 rounded-2xl bg-[#25D366] text-white font-black text-xs shadow-md shadow-[#25D366]/20 hover:opacity-95 transition active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
