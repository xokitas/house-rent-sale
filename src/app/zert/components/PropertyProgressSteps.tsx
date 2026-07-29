'use client';

import React from 'react';

interface PropertyProgressStepsProps {
  currentStep?: number; // purely visual context, but we can make it elegant based on fields completed
}

export default function PropertyProgressSteps({ currentStep = 1 }: PropertyProgressStepsProps) {
  const steps = [
    { number: '①', label: 'Información' },
    { number: '②', label: 'Ubicación' },
    { number: '③', label: 'Fotografías' },
    { number: '④', label: 'Publicar' },
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-[#E2D8C7] shadow-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[11px] font-black text-[#5A5245]/60 uppercase tracking-widest">
          Progreso del registro
        </span>
        <div className="flex flex-wrap items-center gap-3 sm:gap-6">
          {steps.map((step, index) => {
            const isActive = index + 1 <= currentStep;
            return (
              <div key={step.label} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1E67AD] to-[#2A93A6] text-white shadow-md shadow-[#1E67AD]/10'
                      : 'bg-[#F2ECE1]/60 text-[#5A5245]/50 border border-transparent'
                  }`}
                >
                  <span className="text-sm leading-none font-extrabold">{step.number}</span>
                  <span className="leading-none">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <span className="text-xs text-[#5A5245]/20 hidden md:inline">➔</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
