'use client';

import React from 'react';
import { PropertyStatus } from '@/lib/types';

interface PropertyCategoryCardProps {
  opt: { value: PropertyStatus; label: string };
  isSelected: boolean;
  onToggle: () => void;
}

export default function PropertyCategoryCard({ opt, isSelected, onToggle }: PropertyCategoryCardProps) {
  // Extract emoji and clean text
  const labelText = opt.label;
  const match = labelText.match(/^([^\s]+)\s+(.+)$/);
  const emoji = match ? match[1] : '🏠';
  const text = match ? match[2] : labelText;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-32 transition-all duration-300 group cursor-pointer ${
        isSelected
          ? 'border-[#1E67AD] bg-[#F2ECE1]/40 text-[#1E67AD] shadow-xs scale-[0.98]'
          : 'border-[#E2D8C7] bg-white text-[#5A5245] hover:bg-[#FBF9F5] hover:border-[#1E67AD]/50 hover:shadow-xs hover:translate-y-[-1px]'
      }`}
    >
      <div className="flex items-center justify-between w-full">
        <span className={`text-2xl p-2 rounded-xl transition-all duration-300 ${
          isSelected ? 'bg-white shadow-xs' : 'bg-[#F2ECE1]/30 group-hover:bg-white'
        }`}>
          {emoji}
        </span>
        <span className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-[#1E67AD] border-[#1E67AD] text-white'
            : 'border-[#E2D8C7] bg-white group-hover:border-[#1E67AD]'
        }`}>
          {isSelected && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </div>

      <div>
        <p className="text-[10px] uppercase tracking-wider font-extrabold text-[#5A5245]/40 mb-0.5">
          Clasificación
        </p>
        <h4 className={`text-xs font-bold leading-tight line-clamp-2 transition-colors ${
          isSelected ? 'text-[#1E67AD]' : 'text-[#5A5245]'
        }`}>
          {text}
        </h4>
      </div>
    </button>
  );
}
