'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { compressImageToWebP } from '@/lib/compressor';
import { Property, PropertyStatus } from '@/lib/types';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'micasitacuba';

const STATUS_OPTIONS: { value: PropertyStatus; label: string }[] = [
  { value: 'sale', label: '🏷️ Venta' },
  { value: 'swap', label: '🔄 Permuta' },
  { value: 'long_term', label: '📅 Alquiler (Larga estadía)' },
  { value: 'local_rent', label: '💵 Renta Nacional (CUP)' },
  { value: 'international_hostel', label: '✈️ Hostal Internacional (USD/EUR)' },
  { value: 'day_pass', label: '🎉 Pasadía / Eventos' },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  
  // Lista de propiedades para gestión
  const [propertiesList, setPropertiesList] = useState<Property[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estado del formulario
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<PropertyStatus[]>(['sale']);
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [contact, setContact] = useState('+53');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isSold, setIsSold] = useState(false);

  // Imágenes
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Cargar lista de propiedades
  const fetchProperties = async () => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPropertiesList(data as Property[]);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  // Manejo de checkboxes de clasificación múltiple
  const handleStatusToggle = (status: PropertyStatus) => {
    if (selectedStatuses.includes(status)) {
      if (selectedStatuses.length === 1) {
        alert('Debe haber al menos una clasificación seleccionada.');
        return;
      }
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setAddress('');
    setSelectedStatuses(['sale']);
    setPrice('');
    setCurrency('USD');
    setContact('+53');
    setDescription('');
    setLatitude('');
    setLongitude('');
    setExistingImages([]);
    setSelectedFiles([]);
    setIsSold(false);
  };

  const handleEditClick = (property: Property) => {
    setEditingId(property.id);
    setTitle(property.title);
    setAddress(property.address);
    setSelectedStatuses(Array.isArray(property.status) ? property.status : [property.status]);
    setPrice(property.price.toString());
    setCurrency(property.currency);
    setContact(property.contact);
    setDescription(property.description);
    setLatitude(property.latitude ? property.latitude.toString() : '');
    setLongitude(property.longitude ? property.longitude.toString() : '');
    setExistingImages(property.images || []);
    setIsSold(property.is_sold || false);
    
    // Scroll suave hacia arriba para editar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProperty = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad definitivamente?')) return;

    const { error } = await supabase.from('properties').delete().eq('id', id);

    if (error) {
      alert(`Error al eliminar: ${error.message}`);
    } else {
      alert('Propiedad eliminada correctamente');
      if (editingId === id) resetForm();
      fetchProperties();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0 && existingImages.length === 0) {
      alert('Debes incluir al menos una imagen para la propiedad.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Procesando imágenes...');

    try {
      const newUploadedUrls: string[] = [];

      // Subir nuevas imágenes si se seleccionaron
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setStatusMessage(`Comprimiendo imagen ${i + 1} de ${selectedFiles.length}...`);
        
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

        newUploadedUrls.push(publicUrlData.publicUrl);
      }

      const finalImages = [...existingImages, ...newUploadedUrls];

      setStatusMessage('Guardando cambios en Supabase...');

      const payload = {
        title,
        address,
        status: selectedStatuses,
        price: Number(price),
        currency,
        contact,
        description,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        images: finalImages,
        is_sold: isSold,
      };

      if (editingId) {
        // ACTUALIZAR (UPDATE)
        const { error: updateError } = await supabase
          .from('properties')
          .update(payload)
          .eq('id', editingId);

        if (updateError) throw updateError;
        alert('¡Propiedad actualizada con éxito!');
      } else {
        // CREAR (INSERT)
        const { error: insertError } = await supabase
          .from('properties')
          .insert([payload]);

        if (insertError) throw insertError;
        alert('¡Propiedad creada y publicada con éxito!');
      }

      resetForm();
      fetchProperties();

    } catch (err: any) {
      console.error('Error al guardar:', err);
      // Muestra el mensaje detallado devuelto por Supabase
      alert(`Error al guardar: ${err?.message || err?.details || JSON.stringify(err)}`);
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
            className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* FORMULARIO DE EDICIÓN Y CREACIÓN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {editingId ? '📝 Editar Propiedad' : '➕ Publicar Nueva Propiedad'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {editingId ? 'Modifica los datos existentes de la casa' : 'Completa los campos para agregarla a la web'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              🏠 Ver página principal
            </a>

            {editingId && (
              <button
                onClick={resetForm}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título corto</label>
            <input
              type="text"
              required
              placeholder="Ej. Casa climatizada de 2 cuartos"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* SELECCIÓN MÚLTIPLE DE CLASIFICACIONES */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Clasificación (Puedes elegir varias)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const active = selectedStatuses.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleStatusToggle(opt.value)}
                    className={`p-3 rounded-xl border text-xs font-semibold text-left transition flex items-center justify-between cursor-pointer ${
                      active
                        ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                      active ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {active ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Precio</label>
              <input
                type="number"
                required
                placeholder="Ej. 15000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400"
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
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400"
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
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400"
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
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Longitud (Opcional)</label>
              <input
                type="text"
                placeholder="Ej. -77.913083"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descripción</label>
            <textarea
              rows={4}
              placeholder="Detalles de la casa, comodidades, etc."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* ESTADO VENDIDA / PERMUTADA */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-900">Marcar como "Vendida / Permutada"</p>
              <p className="text-[11px] text-amber-700">Mantiene la casa en la web pero mostrando el cartel de concretada</p>
            </div>
            <input
              type="checkbox"
              checked={isSold}
              onChange={(e) => setIsSold(e.target.checked)}
              className="w-5 h-5 accent-amber-600 cursor-pointer"
            />
          </div>

          {/* GESTIÓN DE FOTOS */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">Fotos de la casa</label>
            
            {/* Fotos ya guardadas en Supabase */}
            {existingImages.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-semibold">Fotos guardadas:</p>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border">
                      <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-red-600/80 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fotos nuevas seleccionadas desde la PC/Móvil */}
            {selectedFiles.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-blue-600 font-semibold">Fotos nuevas a subir ({selectedFiles.length}):</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-blue-400">
                      <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                        className="absolute inset-0 bg-red-600/80 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-4 text-white font-bold text-sm rounded-xl transition shadow-md active:scale-95 cursor-pointer ${
              isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800'
            }`}
          >
            {isProcessing ? statusMessage : editingId ? '💾 Guardar Cambios' : '🚀 Publicar Casa'}
          </button>
        </form>
      </div>

      {/* LISTADO DE PROPIEDADES EXISTENTES (GESTIÓN DE CASAS) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
          📋 Propiedades Publicadas ({propertiesList.length})
        </h2>

        {propertiesList.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No hay propiedades registradas aún.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {propertiesList.map((item) => (
              <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.images && item.images[0] ? (
                    <img src={item.images[0]} alt="" className="w-16 h-16 rounded-xl object-cover border shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center text-xs text-slate-400">Sin foto</div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                      {item.is_sold && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                          VENDIDA
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{item.address}</p>
                    <p className="text-xs font-semibold text-blue-600 mt-1">
                      {item.price} {item.currency}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleEditClick(item)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => handleDeleteProperty(item.id)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition cursor-pointer"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}