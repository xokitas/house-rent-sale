'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import { Property } from '@/lib/types';
import { getStatusBadge } from '@/lib/utils';
import { X, ChevronLeft, ChevronRight, MapPin, Phone, MessageCircle } from 'lucide-react';

interface PropertyModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyModal({ property, isOpen, onClose }: PropertyModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [rendered, setRendered] = useState(false);
  const [active, setActive] = useState(false);
  const [showMapAlert, setShowMapAlert] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      setActiveImageIndex(0);
      const timer = setTimeout(() => setActive(true), 10);
      return () => clearTimeout(timer);
    } else {
      setActive(false);
      const timer = setTimeout(() => setRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!rendered || !property) return null;

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80'];

  const mapUrl =
    property.latitude && property.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.address + ', Camagüey')}`;

  const confirmMapNavigation = () => {
    window.open(mapUrl, '_blank', 'noopener,noreferrer');
    setShowMapAlert(false);
  };

  // Garantizar que las clasificaciones se manejen como array
  const statuses = Array.isArray(property.status) ? property.status : [property.status];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Fondo oscuro con difuminado */}
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
          active ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Contenedor principal del Modal */}
      <div
        className={`relative bg-[#FBF9F5] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] border border-[#E2D8C7] transition-all duration-300 ease-out transform ${
          active ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
        }`}
      >
        {/* Cabecera */}
        <div className="p-4 sm:px-6 border-b border-[#E8E2D8] flex items-center justify-between bg-white sticky top-0 z-20 gap-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            {statuses.map((st) => {
              const badge = getStatusBadge(st);
              return (
                <span
                  key={st}
                  className={`px-2.5 py-1 rounded-full text-xs font-black tracking-wide border ${badge.className}`}
                >
                  {badge.label}
                </span>
              );
            })}
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-semibold truncate max-w-50 sm:max-w-xs">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-[#1E67AD]" />
              {property.address}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 rounded-full bg-[#F2ECE1] hover:bg-[#E2D8C7] text-[#1E67AD] flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* Carrusel */}
          <div className="space-y-3">
            <div className="relative h-64 sm:h-80 w-full bg-[#1E67AD]/10 rounded-2xl overflow-hidden border border-[#E2D8C7] shadow-inner">
              <img
                src={images[activeImageIndex] || '/placeholder.svg'}
                alt={property.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                    aria-label="Imagen anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    aria-label="Imagen siguiente"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Ver imagen ${idx + 1}`}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx
                        ? 'border-[#1E67AD] scale-95 shadow-md'
                        : 'border-[#E2D8C7] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img || '/placeholder.svg'} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Título y Precio */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
            <div>
              <h2 className="text-2xl font-black text-[#153B6B] tracking-tight text-balance">{property.title}</h2>
              <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 mt-1">
                <MapPin className="w-4 h-4 text-[#1E67AD]" />
                {property.address}
              </p>
            </div>

            <div className="bg-white px-4 py-3 rounded-2xl border border-[#E2D8C7] text-right sm:text-left shrink-0 shadow-xs">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-wider">Precio solicitado</p>
              <div className="text-2xl font-black text-[#1E67AD] leading-tight">
                {Number(property.price).toLocaleString('en-US')}{' '}
                <span className="text-sm font-bold text-[#C8976C]">{property.currency}</span>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <h3 className="text-xs font-black text-[#1E67AD] uppercase tracking-wider">Descripción de la propiedad</h3>
            <div className="bg-white p-4 rounded-2xl border border-[#E2D8C7] text-[#5A5245] text-sm leading-relaxed whitespace-pre-line font-medium shadow-xs">
              {property.description || 'El propietario no dejó una descripción detallada.'}
            </div>
          </div>

          {/* Botón de Mapa en el Modal */}
          <div>
            <button
              type="button"
              onClick={() => setShowMapAlert(true)}
              className="inline-flex items-center gap-2 text-xs font-black text-[#1E67AD] bg-[#F2ECE1] hover:bg-[#E2D8C7] px-4 py-2.5 rounded-xl border border-[#E2D8C7] transition cursor-pointer"
            >
              <MapPin className="w-4 h-4" />
              Ver ubicación en el mapa
            </button>
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="p-4 sm:px-6 bg-white border-t border-[#E8E2D8] flex items-center justify-between gap-4">
          <div className="text-xs font-semibold text-slate-500 hidden sm:block">
            ¿Te interesa? Comunícate directo con el dueño:
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={`tel:${property.contact}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#F2ECE1] hover:bg-[#E2D8C7] text-[#1E67AD] font-black text-xs rounded-xl border border-[#E2D8C7] transition text-center shadow-xs"
            >
              <Phone className="w-4 h-4" />
              Llamar
            </a>

            <a
              href={`https://wa.me/${property.contact.replace('+', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition text-center shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* MODAL DE ADVERTENCIA PARA EL MAPA DENTRO DEL DETALLE */}
      {showMapAlert && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-[#E2D8C7] text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-[#F2ECE1] text-[#1E67AD] rounded-2xl flex items-center justify-center mx-auto border border-[#E2D8C7]">
              <MapPin className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#153B6B]">Aviso sobre la ubicación</h3>
              <div className="text-xs text-[#5A5245] mt-2 space-y-2 text-left leading-relaxed font-medium">
                <p>
                  • <strong>Referencial:</strong> La ubicación indica la calle o zona general, no el número exacto de
                  la vivienda.
                </p>
                <p>
                  • <strong>Nombres de calles:</strong> Google Maps a veces usa nombres antiguos. Si vas a
                  desplazarte, se recomienda verificar en aplicaciones como <strong>Maps.me</strong> o coordinar
                  directamente con el dueño.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowMapAlert(false)}
                className="flex-1 px-4 py-2.5 bg-[#F2ECE1] hover:bg-[#E8E2D8] text-[#1E67AD] text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={confirmMapNavigation}
                className="flex-1 px-4 py-2.5 bg-[#1E67AD] hover:bg-[#175691] text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95 cursor-pointer"
              >
                Abrir mapa ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
