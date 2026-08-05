'use client';

import React, { useRef, useState } from 'react';

interface PropertyGalleryCardProps {
  existingImages: string[];
  selectedFiles: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveExistingImage: (idx: number) => void;
  onRemoveSelectedFile: (idx: number) => void;
}

export default function PropertyGalleryCard({
  existingImages,
  selectedFiles,
  onFileChange,
  onRemoveExistingImage,
  onRemoveSelectedFile,
}: PropertyGalleryCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesList = e.dataTransfer.files;
      const simulatedEvent = {
        target: {
          files: filesList,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onFileChange(simulatedEvent);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-6 animate-in fade-in duration-300">

      {/* SECCIÓN CABECERA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-brand-primary uppercase tracking-wider flex items-center gap-2">
          <span>📸</span> Galería de Imágenes
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          Carga fotografías de alta calidad. El sistema optimizará el tamaño de forma automática.
        </p>
      </div>

      {/* ÁREA DRAG AND DROP MODERNA */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
          isDragOver
            ? 'border-brand-primary bg-[#F2ECE1]/40 scale-[0.99] shadow-inner'
            : 'border-[#E2D8C7] bg-[#FBF9F5] hover:border-brand-primary hover:bg-white'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center border border-[#E2D8C7] shadow-xs mb-3 text-2xl transition-transform duration-300 transform group-hover:scale-105">
          📁
        </div>

        <p className="text-xs font-black text-brand-primary">
          Arrastra imágenes aquí
        </p>
        <p className="text-[10px] text-[#5A5245]/60 font-semibold mt-1">
          o haz clic para seleccionarlas desde tu dispositivo
        </p>
      </div>

      {/* PEQUEÑOS INDICADORES DE OPTIMIZACIÓN */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50/50 border border-emerald-100 rounded-xl">
          <span className="text-xs">⚡</span>
          <span className="text-[9px] font-black text-emerald-800 uppercase tracking-wider">
            Conversión WebP
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50/50 border border-blue-100 rounded-xl">
          <span className="text-xs">📉</span>
          <span className="text-[9px] font-black text-blue-800 uppercase tracking-wider">
            Optimización
          </span>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-purple-50/50 border border-purple-100 rounded-xl">
          <span className="text-xs">🤖</span>
          <span className="text-[9px] font-black text-purple-800 uppercase tracking-wider">
            Compresión Inteligente
          </span>
        </div>
      </div>

      {/* MINIATURAS FOTOS GUARDADAS PREVIAMENTE */}
      {existingImages.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
            Imágenes guardadas ({existingImages.length})
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {existingImages.map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative group aspect-square rounded-2xl overflow-hidden border border-[#E2D8C7] bg-stone-100 shadow-xs"
              >
                <img
                  src={imgUrl}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveExistingImage(idx);
                    }}
                    className="w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center text-xs transition shadow-md hover:scale-105 cursor-pointer"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
                {idx === 0 && (
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-brand-primary text-white text-[8px] font-black uppercase rounded-md tracking-wider">
                    Principal
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MINIATURAS NUEVAS FOTOS */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#E8E2D8]/55">
          <h4 className="text-[11px] font-black text-brand-primary uppercase tracking-wider">
            Nuevas imágenes a subir ({selectedFiles.length})
          </h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {selectedFiles.map((file, idx) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={idx}
                  className="relative group aspect-square rounded-2xl overflow-hidden border border-brand-primary bg-stone-100 shadow-xs"
                >
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSelectedFile(idx);
                      }}
                      className="w-7 h-7 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center text-xs transition shadow-md hover:scale-105 cursor-pointer"
                      title="Quitar"
                    >
                      ✕
                    </button>
                  </div>
                  {existingImages.length === 0 && idx === 0 && (
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 bg-brand-primary text-white text-[8px] font-black uppercase rounded-md tracking-wider">
                      Principal
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
