import { PropertyStatus } from "./types";

export function getStatusBadge(status: PropertyStatus) {
  switch (status) {
    case 'sale':
      return {
        label: 'Venta',
        className: 'bg-blue-50 text-blue-700 border-blue-200',
      };
    case 'long_term':
      return {
        label: 'Alquiler (Larga Estadía)',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };
    case 'international_hostel':
      return {
        label: 'Hostal (USD/EUR)',
        className: 'bg-purple-50 text-purple-700 border-purple-200',
      };
    case 'local_rent':
      return {
        label: 'Renta Nacional (CUP)',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
      };
    case 'day_pass':
      return {
        label: 'Pasadía / Eventos',
        className: 'bg-rose-50 text-rose-700 border-rose-200',
      };
    default:
      return {
        label: 'Propiedad',
        className: 'bg-slate-50 text-slate-700 border-slate-200',
      };
  }
}