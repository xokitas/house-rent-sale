'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyStatus, STATUS_OPTIONS, PRIORITY_OPTIONS } from '@/lib/types';

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // FILTRO RÁPIDO PARA LA LISTA DEL ADMIN
  const [adminFilter, setAdminFilter] = useState<string>('all');

  // ESTADOS DEL FORMULARIO
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'USD',
    address: '',
    contact: '',
    latitude: '',
    longitude: '',
    priority: 3, // Prioridad por defecto
  });

  const [selectedStatuses, setSelectedStatuses] = useState<PropertyStatus[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSold, setIsSold] = useState<boolean>(false);

  // CARGAR PROPIEDADES AL INICIAR
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar propiedades:', error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  // MANEJO DE ARCHIVOS SELECCIONADOS
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
    }
  };

  // COMPRESIÓN DE IMÁGENES A WEBP
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxWidth = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Error al comprimir la imagen'));
            },
            'image/webp',
            0.8
          );
        } else {
          reject(new Error('No se pudo obtener el contexto 2D'));
        }
      };
      img.onerror = (err) => reject(err);
    });
  };

  // SUBIDA DE IMÁGENES A SUPABASE BUCKET
  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      try {
        const compressedBlob = await compressImage(file);
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;

        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(fileName, compressedBlob, {
            contentType: 'image/webp',
          });

        if (error) {
          console.error('Error subiendo imagen:', error);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from('property-images')
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          uploadedUrls.push(publicUrlData.publicUrl);
        }
      } catch (err) {
        console.error('Error procesando imagen:', err);
      }
    }

    return uploadedUrls;
  };

  // SELECCIONAR / DESSELECCIONAR CLASIFICACIONES
  const toggleStatus = (status: PropertyStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // GUARDAR / ACTUALIZAR PROPIEDAD
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedStatuses.length === 0) {
      alert('Por favor, selecciona al menos una clasificación para la propiedad.');
      return;
    }

    setIsProcessing(true);

    try {
      const newImageUrls = await uploadImages();
      const allImages = [...existingImages, ...newImageUrls];

      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price) || 0,
        currency: formData.currency,
        address: formData.address,
        contact: formData.contact,
        images: allImages,
        status: selectedStatuses,
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        is_sold: isSold,
        priority: Number(formData.priority),
      };

      if (editingId) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingId);

        if (error) throw error;
        alert('✅ Propiedad actualizada con éxito');
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) throw error;
        alert('✅ Propiedad publicada con éxito');
      }

      resetForm();
      fetchProperties();
    } catch (err: any) {
      console.error('Error al guardar:', err);
      const errorMessage =
        err?.message ||
        err?.details ||
        (typeof err === 'object' ? JSON.stringify(err) : String(err));
      alert(`Error al guardar: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // EDICIÓN DE PROPIEDAD
  const handleEdit = (property: Property) => {
    setEditingId(property.id);
    setFormData({
      title: property.title || '',
      description: property.description || '',
      price: property.price ? String(property.price) : '',
      currency: property.currency || 'USD',
      address: property.address || '',
      contact: property.contact || '',
      latitude: property.latitude ? String(property.latitude) : '',
      longitude: property.longitude ? String(property.longitude) : '',
      priority: property.priority || 3,
    });

    const statuses = Array.isArray(property.status)
      ? property.status
      : [property.status];

    setSelectedStatuses(statuses);
    setExistingImages(property.images || []);
    setSelectedFiles([]);
    setIsSold(!!property.is_sold);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ELIMINAR PROPIEDAD
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) return;

    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      alert('🗑️ Propiedad eliminada');
      fetchProperties();
    } catch (err: any) {
      alert(`Error al eliminar: ${err?.message || 'Ocurrió un problema'}`);
    }
  };

  // RESETEAR FORMULARIO
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      currency: 'USD',
      address: '',
      contact: '',
      latitude: '',
      longitude: '',
      priority: 3,
    });
    setSelectedStatuses([]);
    setExistingImages([]);
    setSelectedFiles([]);
    setIsSold(false);
  };

  // PROPIEDADES FILTRADAS SEGÚN LA PESTAÑA SELECCIONADA EN EL ADMIN
  const filteredProperties = properties.filter((prop) => {
    if (adminFilter === 'all') return true;
    const propStatuses = Array.isArray(prop.status) ? prop.status : [prop.status];
    return propStatuses.includes(adminFilter as PropertyStatus);
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* CABECERA */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {editingId ? '📝 Editar Propiedad' : '➕ Publicar Nueva Propiedad'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Panel de Administración • Tu Casita Camagüey
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              🏠 Ver página principal
            </a>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                Cancelar Edición
              </button>
            )}
          </div>
        </div>

        {/* FORMULARIO (ESTILOS MEJORADOS PARA MÁXIMA LEGIBILIDAD EN LOS INPUTS) */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* TÍTULO */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Título de la publicación</label>
              <input
                type="text"
                required
                placeholder="Ej. Casa en Reparto Simoni, 3 cuartos"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PRECIO Y MONEDA */}
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2 space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Precio</label>
                <input
                  type="number"
                  required
                  placeholder="Ej. 15000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase">Moneda</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="CUP">CUP</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            {/* DIRECCIÓN */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Dirección / Zona</label>
              <input
                type="text"
                required
                placeholder="Ej. Calle Avellaneda #123, Camagüey"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* CONTACTO */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Teléfono de contacto / WhatsApp</label>
              <input
                type="text"
                required
                placeholder="Ej. +5351234567"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* LATITUD Y LONGITUD */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Latitud (Opcional)</label>
              <input
                type="text"
                placeholder="Ej. 21.3833"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">Longitud (Opcional)</label>
              <input
                type="text"
                placeholder="Ej. -77.9167"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* DESCRIPCIÓN */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 uppercase">Descripción detallada</label>
            <textarea
              rows={4}
              required
              placeholder="Describe las características de la propiedad (habitaciones, baño, patio, agua 24h, etc.)..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* CLASIFICACIONES */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase">
              Clasificaciones (Puedes seleccionar varias)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {STATUS_OPTIONS.map((opt) => {
                const isSelected = selectedStatuses.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleStatus(opt.value)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition text-left flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELECTOR DE PRIORIDAD */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl space-y-2">
            <label className="block text-xs font-bold text-amber-900 uppercase">
              👑 Prioridad de Publicación
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: Number(e.target.value) })}
              className="w-full text-xs font-semibold p-3 bg-white border border-amber-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* ESTADO VENDIDA / PERMUTADA */}
          {editingId && (
            <div className="p-4 bg-red-50/60 border border-red-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="block text-xs font-bold text-red-900 uppercase">Marcar como Vendida / Permutada</span>
                <span className="text-[11px] text-red-700">Muestra un sello visual en la tarjeta sin borrar los datos</span>
              </div>
              <input
                type="checkbox"
                checked={isSold}
                onChange={(e) => setIsSold(e.target.checked)}
                className="w-5 h-5 rounded text-red-600 focus:ring-red-500 cursor-pointer"
              />
            </div>
          )}

          {/* GESTIÓN DE FOTOS */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase">Fotos de la casa</label>
            
            {/* Guardadas */}
            {existingImages.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-slate-500 font-semibold">Fotos guardadas previamente:</p>
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

            {/* Nuevas */}
            {selectedFiles.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-blue-600 font-semibold">Fotos nuevas listas a subir ({selectedFiles.length}):</p>
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
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? 'Procesando e imágenes...' : editingId ? '💾 Guardar Cambios' : '🚀 Publicar Propiedad'}
          </button>
        </form>

        {/* LISTA Y PESTAÑAS DE CLASIFICACIONES EN EL PANEL ADMIN */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900">
              Propiedades Registradas ({filteredProperties.length})
            </h2>
            
            {/* PESTAÑAS / BOTONES DE FILTRADO EN EL ADMIN */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setAdminFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                  adminFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todas ({properties.length})
              </button>
              {STATUS_OPTIONS.map((opt) => {
                const count = properties.filter((p) => {
                  const st = Array.isArray(p.status) ? p.status : [p.status];
                  return st.includes(opt.value);
                }).length;

                return (
                  <button
                    key={opt.value}
                    onClick={() => setAdminFilter(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${
                      adminFilter === opt.value
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {loading ? (
            <p className="text-xs text-slate-500">Cargando propiedades...</p>
          ) : filteredProperties.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No hay propiedades en la clasificación seleccionada.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredProperties.map((prop) => (
                <div key={prop.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {prop.images && prop.images.length > 0 ? (
                      <img src={prop.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xs">🏠</div>
                    )}
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 line-clamp-1">{prop.title}</h3>
                      <p className="text-[11px] text-slate-500">
                        {prop.price} {prop.currency} • Prioridad {prop.priority || 3} {prop.is_sold ? '• 🔴 VENDIDA' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(prop)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(prop.id)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}