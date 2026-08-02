'use client';

import { useState } from 'react';
import { Property } from '@/lib/types';
import { useCurrency } from '@/lib/currency';
import { MapPin, ImageIcon, Phone, MessageCircle, Heart, Check, Star } from 'lucide-react';
import Link from 'next/link';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const { formatPrice } = useCurrency();
  const [liked, setLiked] = useState(false);

  const mainImage = property.images && property.images.length > 0 ? property.images[0] : null;

  // El precio formateado dinámicamente con useCurrency
  const formattedPrice = formatPrice(property.price, property.currency);

  const isAlquiler = property.status.includes('long_term');

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] group">
      {/* SECCIÓN IMAGEN */}
      <div className="relative h-56 w-full bg-slate-100 overflow-hidden">
        {mainImage ? (
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-slate-400 gap-1">
            <ImageIcon className="w-8 h-8 stroke-[1.5]" />
            <span className="text-xs font-semibold">Sin vista previa</span>
          </div>
        )}

        {/* Gradiente sutil inferior */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Badge Favorito */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center transition-all hover:bg-white active:scale-90 shadow-sm cursor-pointer z-10"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked ? 'text-rose-500 fill-rose-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Badge Destacado (Priority 1, 2, 3) */}
        {property.priority && property.priority <= 3 && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 bg-[#D97757] text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
              <Star className="w-3 h-3 fill-current" />
              Destacado
            </span>
          </div>
        )}

        {/* Badge Vendida / Intercambiada */}
        {property.is_sold && (
          <div className="absolute top-4 left-4">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full">
              Fuera de catálogo
            </span>
          </div>
        )}

        {/* Etiquetas de Moneda y Alquiler */}
        <div className="absolute bottom-4 left-4 z-10">
          <span className="inline-block bg-[#1B4D3E] text-[#5EEAD4] text-xs font-black px-3 py-1.5 rounded-xl shadow-sm tracking-tight">
            {formattedPrice}
            {isAlquiler && <span className="text-[10px] font-bold text-white/80"> /mes</span>}
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
      <Link href={`/propiedad/${property.id}`} className="p-5 flex-1 flex flex-col text-left">
        {/* Título */}
        <h3 className="text-base font-black text-slate-900 line-clamp-1 mb-1 group-hover:text-[#1E67AD] transition-colors leading-snug">
          {property.title}
        </h3>

        {/* Reparto y Dirección */}
        <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-3">
          <MapPin className="w-3.5 h-3.5 text-[#1E67AD] shrink-0" />
          <span className="truncate">
            {property.neighborhood ? `${property.neighborhood}, ` : ''}
            {property.municipality || 'Camagüey'}
          </span>
        </p>

        {/* Atributos / Características Rápidas */}
        <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-4 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">
          {property.bedrooms !== undefined && property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              🛏️ <strong className="text-slate-800">{property.bedrooms}</strong> hab
            </span>
          )}
          {property.bathrooms !== undefined && property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              🚿 <strong className="text-slate-800">{property.bathrooms}</strong> bañ
            </span>
          )}
          {property.construction_area !== undefined && property.construction_area !== null && (
            <span className="flex items-center gap-1">
              📐 <strong className="text-slate-800">{property.construction_area}</strong> m²
            </span>
          )}
        </div>

        {/* Características Adicionales destacadas */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.amenities.slice(0, 3).map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 bg-[#1B4D3E]/5 text-[#1B4D3E] text-[10px] font-bold px-2 py-0.5 rounded-full"
              >
                <span>•</span> {amenity}
              </span>
            ))}
          </div>
        )}

        {/* Acciones de contacto */}
        <div
          className="mt-auto pt-4 border-t border-slate-100 flex items-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <a
            href={`tel:${property.contact}`}
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 transition shrink-0 active:scale-95"
            title={`Llamar al ${property.contact}`}
          >
            <Phone className="w-4 h-4" />
          </a>
          <a
            href={`https://wa.me/${property.contact.replace('+', '').replace(/\s+/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 h-10 text-xs font-black rounded-xl text-white bg-[#25D366] hover:opacity-95 transition shadow-sm active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            WhatsApp
          </a>
        </div>
      </Link>
    </div>
  );
}
