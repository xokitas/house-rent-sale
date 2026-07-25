'use client';

export default function ActionMenu() {
  return (
    <div className="group relative inline-flex items-center">
      <div className="flex items-center bg-white border border-[#E2D8C7] shadow-sm rounded-2xl p-1 transition-all duration-300 hover:border-[#1E67AD]">
        
        {/* Icono del Logo de la Empresa */}
        <div className="w-9 h-9 rounded-xl bg-[#F2ECE1] border border-[#E2D8C7] flex items-center justify-center shrink-0 overflow-hidden cursor-pointer">
          <img src="/logo.png" alt="Empresa" className="w-6 h-6 object-contain" />
        </div>

        {/* Contenedor que se despliega suavemente a la derecha en Hover */}
        <div className="max-w-0 opacity-0 group-hover:max-w-md group-hover:opacity-100 group-hover:ml-2 overflow-hidden transition-all duration-500 ease-in-out flex items-center gap-1.5 whitespace-nowrap pr-1">
          
          {/* 1. Publicar una casa */}
          <button 
            onClick={() => alert('Acción provisional: Publicar una casa')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>🏠</span> Publicar una casa
          </button>

          {/* 2. Sugerir una idea */}
          <button 
            onClick={() => alert('Acción provisional: Sugerir una idea')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>💡</span> Sugerir idea
          </button>

          {/* 3. Reportar un error */}
          <button 
            onClick={() => alert('Acción provisional: Reportar un error')}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>⚠️</span> Reportar error
          </button>

        </div>
      </div>
    </div>
  );
}