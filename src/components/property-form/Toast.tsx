'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'error' | 'warning';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100',
    info: 'bg-blue-50 border-blue-200 text-blue-800 shadow-blue-100',
    error: 'bg-rose-50 border-rose-200 text-rose-800 shadow-rose-100',
    warning: 'bg-amber-50 border-amber-200 text-amber-800 shadow-amber-100',
  }[type];

  const icon = {
    success: '✨',
    info: 'ℹ️',
    error: '🚨',
    warning: '⚠️',
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${bgColor} shadow-lg transition-all duration-300 transform scale-100 hover:scale-102`}>
        <span className="text-lg">{icon}</span>
        <p className="text-xs font-bold leading-none tracking-tight">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 w-5 h-5 rounded-full hover:bg-black/5 flex items-center justify-center text-xs font-black transition cursor-pointer"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
