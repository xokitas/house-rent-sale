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
    <div className="bg-bg-card rounded-3xl p-5 border border-border-main shadow-xs text-left transition-colors duration-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[11px] font-black text-text-muted uppercase tracking-widest">
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
                      ? 'bg-brand-primary text-bg-card shadow-md shadow-brand-primary/10'
                      : 'bg-bg-main text-text-muted/50 border border-transparent'
                  }`}
                >
                  <span className="text-sm leading-none font-extrabold">{step.number}</span>
                  <span className="leading-none">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <span className="text-xs text-text-muted/20 hidden md:inline">➔</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
