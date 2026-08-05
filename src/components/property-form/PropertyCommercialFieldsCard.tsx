'use client';

import React from 'react';

interface PropertyCommercialFieldsCardProps {
  commercialFront: boolean;
  warehouse: boolean;
  office: boolean;
  industrialPower: boolean;
  onFormChange: (field: string, value: boolean) => void;
}

export default function PropertyCommercialFieldsCard({
  commercialFront,
  warehouse,
  office,
  industrialPower,
  onFormChange,
}: PropertyCommercialFieldsCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E2D8C7] shadow-sm space-y-6 animate-in fade-in duration-300">
      {/* CABECERA */}
      <div className="border-b border-[#E8E2D8] pb-4">
        <h3 className="text-sm font-black text-brand-primary uppercase tracking-wider flex items-center gap-2">
          <span>🏢</span> Datos de Local / Espacio Comercial
        </h3>
        <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
          Indica si el espacio cuenta con portal/frente comercial, almacenes, oficinas o electricidad de alto voltaje.
        </p>
      </div>

      {/* CHECKBOXES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: '🏪 Frente Comercial', field: 'commercial_front', val: commercialFront },
          { label: '📦 Almacén', field: 'warehouse', val: warehouse },
          { label: '💼 Oficina', field: 'office', val: office },
          { label: '⚡ Corriente Trifásica', field: 'industrial_power', val: industrialPower },
        ].map((item) => (
          <label
            key={item.field}
            className={`p-3.5 rounded-2xl border text-left transition-all duration-300 flex items-center gap-2.5 cursor-pointer select-none ${
              item.val
                ? 'border-brand-primary bg-blue-50/40 text-brand-primary font-bold'
                : 'border-[#E2D8C7] text-[#5A5245] bg-[#FBF9F5] hover:bg-[#E2D8C7]/20 font-semibold'
            }`}
          >
            <input
              type="checkbox"
              checked={item.val}
              onChange={(e) => onFormChange(item.field, e.target.checked)}
              className="sr-only"
            />
            <span
              className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                item.val
                  ? 'bg-brand-primary border-brand-primary text-white'
                  : 'border-[#E2D8C7] bg-white'
              }`}
            >
              {item.val && (
                <svg
                  className="w-2.5 h-2.5 stroke-2 stroke-current fill-none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </span>
            <span className="text-xs">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
