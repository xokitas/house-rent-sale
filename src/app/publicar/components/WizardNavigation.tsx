'use client';

import React from 'react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  isProcessing?: boolean;
}

export default function WizardNavigation({
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  isProcessing = false,
}: WizardNavigationProps) {
  const isFirst = currentStep === 1;
  const isLast = currentStep === totalSteps;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-[#E8E2D8] mt-8 gap-4">
      {/* Botón Anterior */}
      <button
        type="button"
        onClick={onPrev}
        disabled={isFirst || isProcessing}
        className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
          isFirst
            ? 'opacity-0 pointer-events-none'
            : 'bg-[#F2ECE1] text-[#1E67AD] border border-[#E2D8C7] hover:bg-[#E2D8C7] active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed'
        }`}
      >
        ← Anterior
      </button>

      {/* Botón Siguiente / Enviar */}
      <button
        type="button"
        onClick={onNext}
        disabled={isProcessing}
        className="px-6 py-3.5 bg-gradient-to-r from-[#1E67AD] to-[#2A93A6] hover:opacity-95 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-md transition-all active:scale-95 disabled:opacity-55 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Procesando...</span>
          </>
        ) : isLast ? (
          <span>Enviar para revisión ✓</span>
        ) : (
          <span>Continuar →</span>
        )}
      </button>
    </div>
  );
}
