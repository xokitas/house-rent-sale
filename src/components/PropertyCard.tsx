'use client';

import { useState } from 'react';
import { Property } from '@/lib/types';
import { useCurrency } from '@/lib/currency';
import { MapPin, ImageIcon, Phone, MessageCircle, Heart, Star, Check } from 'lucide-react';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { formatPrice } = useCurrency();
  const [liked, setLiked] = useState(false);

  const mainImage = property.images && property.images.length > 0 ? property.images[0] : null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = property as any; // Cast temporal hasta migrar types.ts

  // El precio formateado dinámicamente con useCurrency
  const formattedPrice = formatPrice(property.price, property.currency);

  const isAlquiler = property.status.includes('long_term');

  return (
    <div className="bg-bg-card rounded-[2.5rem] border border-border-main overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] group text-left">
      {/* SECCIÓN IMAGEN */}
      <div className="relative h-55 w-full bg-bg-main overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-text-muted gap-1">
            <ImageIcon className="w-8 h-8 stroke-[1.5]" />
            <span className="text-xs font-semibold">Sin vista previa</span>
          </div>
        )}

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Badge Favorito */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 active:scale-90 shadow-sm cursor-pointer z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked ? 'text-rose-500 fill-rose-500' : 'text-slate-500'
            }`}
          />
        </button>

        {/* Badge Destacado (Priority 1, 2, 3) */}
        {property.priority && property.priority <= 3 && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 bg-brand-secondary text-white text-[10px] font-black tracking-wider uppercase px-3 py-1.5 rounded-full shadow-md">
              <Star className="w-3.5 h-3.5 fill-current" />
              Destacado
            </span>
          </div>
        )}

        {/* Badge de Verificado */}
        {!property.is_sold && (
          <div className="absolute top-4 right-15">
            <span className="text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 bg-brand-primary/20 text-brand-primary font-black backdrop-blur-md border border-brand-primary/30 shadow-xs">
              <Check className="w-3 h-3 stroke-3" /> Verificado
            </span>
          </div>
        )}

        {/* Badge Vendida / Intercambiada */}
        {property.is_sold && (
          <div className="absolute top-4 left-4">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1.5 rounded-full">
              Vendida
            </span>
          </div>
        )}

        {/* Etiquetas de Moneda y Alquiler */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="inline-block bg-[#1B4D3E] text-[#5EEAD4] text-xs font-black px-3 py-1.5 rounded-xl shadow-md tracking-tight">
            {formattedPrice}
            {isAlquiler && <span className="text-[10px] font-bold text-white/80">/mes</span>}
          </span>
        </div>

        {/* Cantidad de Imágenes */}
        {property.images && property.images.length > 1 && (
          <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            {property.images.length} fotos
          </span>
        )}
      </div>

      {/* CUERPO DE LA TARJETA */}
      <div className="p-5 flex-1 flex flex-col text-left">
        <Link href={`/propiedad/${property.id}`} className="flex-1 flex flex-col group/body">
          {/* Título */}
          <h3 className="text-base font-black text-text-main line-clamp-1 mb-1 group-hover:text-brand-primary transition-colors leading-snug">
            {property.title}
          </h3>

          {/* Reparto y Dirección */}
          <p className="flex items-center gap-1 text-xs font-semibold text-text-muted mb-3">
            <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span className="truncate">
              {property.address || `${property.neighborhood || 'Zona general'}, Camagüey`}
            </span>
          </p>

          {/* Atributos / Características Rápidas */}
          <div className="flex items-center gap-4 text-xs font-bold text-text-muted mb-4 bg-bg-main p-2.5 rounded-2xl border border-border-main transition-colors duration-200">
            {property.bedrooms !== undefined && property.bedrooms > 0 && (
              <span className="flex items-center gap-1.5">
                🛏️ <strong className="text-text-main">{property.bedrooms}</strong> cuartos
              </span>
            )}
            {property.bathrooms !== undefined && property.bathrooms > 0 && (
              <span className="flex items-center gap-1.5">
                🚿 <strong className="text-text-main">{property.bathrooms}</strong> baños
              </span>
            )}
            {property.construction_area !== undefined && property.construction_area !== null && (
              <span className="flex items-center gap-1.5">
                📐 <strong className="text-text-main">{property.construction_area}</strong> m²
              </span>
            )}
          </div>

                    {/* Características Adicionales destacadas */}
          {p.amenities && p.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {p.amenities.slice(0, 3).map((amenity: string) => (
                <span
                  key={amenity}
                  className="inline-flex items-center gap-1 bg-brand-primary/10 text-brand-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-brand-primary/5"
                >
                  <span>•</span> {amenity}
                </span>
              ))}
            </div>
          )}
        </Link>

        {/* Acciones de contacto (Fuera del Link para evitar anidación de <a>) */}
                <div className="mt-auto pt-4 border-t border-border-main flex items-center gap-2">
          <a
            href={`tel:${property.contact || ''}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-bg-main hover:bg-border-main text-text-main border border-border-main transition shrink-0 active:scale-95 cursor-pointer"
            title={`Llamar al ${property.contact || ''}`}
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href={`https://wa.me/${(property.contact || '').replace('+', '').replace(/\s+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 h-10 text-xs font-black rounded-xl text-white bg-[#25D366] hover:opacity-95 transition shadow-sm active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
