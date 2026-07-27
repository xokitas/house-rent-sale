'use client';

import React from 'react';
import Link from 'next/link';

interface PropertyHeaderProps {
  editingId: string | null;
  isProcessing: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
  onSubmitForm: () => void;
}

export default function PropertyHeader({
  editingId,
  isProcessing,
  onCancel,
  onSaveDraft,
  onSubmitForm,
}: PropertyHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E2D8C7] flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2A93A6] animate-pulse"></span>
          <span className="text-[10px] text-[#2A93A6] font-black tracking-widest uppercase">
            {editingId ? 'Modo de Edición Activo' : 'Nueva Publicación'}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E67AD] tracking-tight mt-1 leading-tight">
          Publicar / Editar Propiedad
        </h1>
        <p className="text-xs sm:text-sm text-[#5A5245] font-medium mt-1">
          Completa toda la información antes de publicar la propiedad.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-xs font-bold text-[#5A5245] hover:text-[#1E67AD] hover:bg-[#F2ECE1] rounded-xl transition-all duration-200 border border-[#E2D8C7] bg-white cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
          className="px-4 py-2.5 text-xs font-bold text-[#1E67AD] hover:opacity-90 bg-[#F2ECE1] rounded-xl transition-all duration-200 border border-[#E2D8C7] cursor-pointer"
        >
          Guardar borrador
        </button>

        <button
          type="button"
          onClick={onSubmitForm}
          disabled={isProcessing}
          className="px-5 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-[#1E67AD] to-[#2A93A6] hover:opacity-95 rounded-xl shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isProcessing
            ? 'Procesando...'
            : editingId
            ? 'Guardar cambios'
            : 'Publicar propiedad'}
        </button>
      </div>
    </div>
  );
}
