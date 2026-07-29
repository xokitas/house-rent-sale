'use client';

import React from 'react';

interface WizardStepperProps {
  currentStep: number;
  totalSteps: number;
}

export default function WizardStepper({ currentStep, totalSteps }: WizardStepperProps) {
  // Step labels
  const steps = [
    { num: 1, label: 'Clasificación' },
    { num: 2, label: 'Datos Básicos' },
    { num: 3, label: 'Ubicación' },
    { num: 4, label: 'Características' },
    { num: 5, label: 'Amenidades' },
    { num: 6, label: 'Fotos y Desc.' },
    { num: 7, label: 'Contacto' },
    { num: 8, label: 'Revisión' },
  ];

  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="w-full space-y-4">
      {/* ProgressBar */}
      <div className="relative w-full h-2.5 bg-[#F2ECE1] rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#1E67AD] to-[#2A93A6] transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Stepper Header Info */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-black text-[#1E67AD] uppercase tracking-wider">
          Paso {currentStep} de {totalSteps}
        </span>
        <span className="text-xs font-black text-[#C8976C] uppercase tracking-wider">
          {percentage}% Completado
        </span>
      </div>

      {/* Steps indicators (Horizontal list for desktop, hides text on mobile) */}
      <div className="grid grid-cols-8 gap-1.5 md:gap-3">
        {steps.map((s) => {
          const isActive = s.num === currentStep;
          const isCompleted = s.num < currentStep;

          return (
            <div key={s.num} className="flex flex-col items-center text-center group">
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  isActive
                    ? 'bg-[#1E67AD] text-white ring-4 ring-[#1E67AD]/15 scale-105'
                    : isCompleted
                    ? 'bg-emerald-600 text-white'
                    : 'bg-[#F2ECE1] text-[#5A5245]/60'
                }`}
              >
                {isCompleted ? '✓' : s.num}
              </div>
              <span
                className={`hidden md:block text-[9px] font-bold mt-1.5 truncate max-w-full transition-colors ${
                  isActive
                    ? 'text-[#1E67AD] font-black'
                    : isCompleted
                    ? 'text-emerald-700'
                    : 'text-[#5A5245]/50'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
