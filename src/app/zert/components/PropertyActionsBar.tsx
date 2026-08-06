'use client';

import React from 'react';

interface PropertyActionsBarProps {
  editingId: string | null;
  isProcessing: boolean;
  onCancel: () => void;
  onSaveDraft: () => void;
}

export default function PropertyActionsBar({
  editingId,
  isProcessing,
  onCancel,
  onSaveDraft,
}: PropertyActionsBarProps) {
  return (
    <div className="bg-bg-card rounded-3xl p-5 border border-border-main shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
      <div className="text-left">
        <span className="block text-xs font-black text-text-main uppercase tracking-wider">
          ¿Estás listo para guardar?
        </span>
        <span className="text-[10px] text-text-muted font-semibold mt-0.5 block">
          Revisa que todos los campos requeridos estén completos correctamente.
        </span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 sm:flex-none px-4 py-3 text-xs font-bold text-text-muted hover:text-brand-primary hover:bg-bg-main rounded-xl transition-all duration-200 border border-border-main bg-bg-card cursor-pointer"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onSaveDraft}
          className="flex-1 sm:flex-none px-4 py-3 text-xs font-bold text-brand-primary hover:opacity-90 bg-brand-primary/10 rounded-xl transition-all duration-200 border border-border-main cursor-pointer"
        >
          Guardar borrador
        </button>

        <button
          type="submit"
          disabled={isProcessing}
          className="flex-2 sm:flex-none px-6 py-3 text-xs font-extrabold text-bg-card bg-brand-primary hover:opacity-95 rounded-xl shadow-md transition-all duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isProcessing
            ? 'Procesando...'
            : editingId
            ? '💾 Guardar cambios'
            : '🚀 Publicar propiedad'}
        </button>
      </div>
    </div>
  );
}
