'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { compressImageToWebP } from '@/lib/compressor';
import { PropertyStatus } from '@/lib/types';

// Leemos la clave desde .env.local
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD; 

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  // Estado del formulario
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<PropertyStatus>('long_term');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [contact, setContact] = useState('+53');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // Carga de imágenes
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert('Debes seleccionar al menos una imagen de la propiedad.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Comprimiendo imágenes a formato WebP...');

    try {
      const uploadedImageUrls: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setStatusMessage(`Procesando imagen ${i + 1} de ${selectedFiles.length}...`);
        
        const compressedFile = await compressImageToWebP(file);
        
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.webp`;
        const filePath = `properties/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('properties')
          .upload(filePath, compressedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('properties')
          .getPublicUrl(filePath);

        uploadedImageUrls.push(publicUrlData.publicUrl);
      }

      setStatusMessage('Guardando propiedad en Supabase...');

      const { error: insertError } = await supabase
        .from('properties')
        .insert([
          {
            title,
            address,
            status,
            price: Number(price),
            currency,
            contact,
            description,
            latitude: latitude ? parseFloat(latitude) : null,
            longitude: longitude ? parseFloat(longitude) : null,
            images: uploadedImageUrls,
          },
        ]);

      if (insertError) throw insertError;

      alert('¡Propiedad guardada y publicada con éxito!');
      
      setTitle('');
      setAddress('');
      setPrice('');
      setDescription('');
      setLatitude('');
      setLongitude('');
      setSelectedFiles([]);
      
   } catch (err: any) {
      // Imprimimos el objeto desglosado para ver el mensaje real en la consola
      console.error('Error completo:', JSON.stringify(err, null, 2));
      console.error('Mensaje directo:', err?.message, err?.error_description, err);

      alert(`Error al guardar: ${err?.message || err?.error_description || JSON.stringify(err)}`);
    } finally {
      setIsProcessing(false);
      setStatusMessage('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-6 rounded-2xl shadow-md max-w-sm w-full space-y-4">
          <h1 className="text-xl font-bold text-slate-900 text-center">Acceso Administrador</h1>
          <input
            type="password"
            placeholder="Introduce la contraseña"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition cursor-pointer"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Panel de Control</h1>
            <p className="text-xs text-slate-500 mt-1">Agregar nueva vivienda a TuCasita</p>
          </div>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            Cerrar Sesión
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título corto</label>
            <input
              type="text"
              required
              placeholder="Ej. Casa en Garrido"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tipo de Clasificación</label>
              <select
                value={status}
                onChange={(e: any) => setStatus(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900"
              >
                <option value="long_term">Alquiler (Larga estadía)</option>
                <option value="local_rent">Renta Nacional (CUP)</option>
                <option value="international_hostel">Hostal / Renta Internacional (USD/EUR)</option>
                <option value="sale">Venta</option>
                <option value="day_pass">Pasadía / Eventos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Precio</label>
              <input
                type="number"
                required
                placeholder="Ej. 15000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Moneda</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white text-slate-900"
              >
                <option value="USD">USD</option>
                <option value="CUP">CUP</option>
                <option value="MLC">MLC</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección / Referencia</label>
              <input
                type="text"
                required
                placeholder="Ej. Calle Maceo e/ San Martín y San Esteban"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono / WhatsApp</label>
              <input
                type="text"
                required
                placeholder="Ej. +5351234567"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Latitud (Opcional)</label>
              <input
                type="text"
                placeholder="Ej. 21.371008"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Longitud (Opcional)</label>
              <input
                type="text"
                placeholder="Ej. -77.913083"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción</label>
            <textarea
              rows={4}
              placeholder="Detalles de la casa, comodidades, aire acondicionado, agua 24h, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900"
            />
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">Fotos de la casa</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-blue-50 hover:file:bg-blue-100 cursor-pointer"
            />
            {selectedFiles.length > 0 && (
              <p className="text-xs text-emerald-600 font-semibold">
                ✓ {selectedFiles.length} foto(s) seleccionada(s) para convertir a WebP
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 text-white font-bold text-sm rounded-xl transition shadow-md active:scale-95 cursor-pointer ${
              isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isProcessing ? statusMessage : '🚀 Publicar Casa'}
          </button>
        </form>
      </div>
    </div>
  );
}