'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyStatus } from '@/lib/types';
import Link from 'next/link';

// SUBCOMPONENTES
import PropertyHeader from './components/PropertyHeader';
import PropertyProgressSteps from './components/PropertyProgressSteps';
import PropertyBasicInfoCard from './components/PropertyBasicInfoCard';
import PropertyLocationCard from './components/PropertyLocationCard';
import PropertyStructuralCard from './components/PropertyStructuralCard';
import PropertyAmenitiesCard from './components/PropertyAmenitiesCard';
import PropertyHostelFieldsCard from './components/PropertyHostelFieldsCard';
import PropertyDayPassFieldsCard from './components/PropertyDayPassFieldsCard';
import PropertyCommercialFieldsCard from './components/PropertyCommercialFieldsCard';
import PropertyDescriptionCard from './components/PropertyDescriptionCard';
import PropertyGalleryCard from './components/PropertyGalleryCard';
import PropertySettingsCard from './components/PropertySettingsCard';
import PropertyPreviewCard from './components/PropertyPreviewCard';
import PropertyActionsBar from './components/PropertyActionsBar';
import RegisteredPropertiesList from './components/RegisteredPropertiesList';
import Toast from './components/Toast';

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // FILTRO RÁPIDO PARA LA LISTA DEL ADMIN
  const [adminFilter, setAdminFilter] = useState<string>('all');

  // ESTADO DE TOAST (MENSAJES INTERACTIVOS)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error' | 'warning'>('info');

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    setToastMessage(message);
    setToastType(type);
  }, []);

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

    // UBICACIÓN
    province: 'Camagüey', // Inicializado con Camagüey
    municipality: '',
    neighborhood: '',

    // CARACTERÍSTICAS ESTRUCTURALES
    property_type: '',
    bedrooms: '',
    bathrooms: '',
    living_rooms: '',
    dining_rooms: '',
    kitchens: '',
    indoor_patios: '',
    outdoor_patios: '',
    garages: '',
    terraces: '',
    balconies: '',
    portals: '',
    floors: '',
    construction_area: '',
    land_area: '',

    // AMENIDADES
    amenities: [] as string[],

    // CAMPOS HOSTAL / INTERNACIONAL
    rooms_available: '',
    private_bathroom: false,
    shared_bathroom: false,
    breakfast: false,
    lunch: false,
    dinner: false,
    airport_pickup: false,
    check_in: '',
    check_out: '',
    languages: [] as string[],

    // CAMPOS PASADÍA / EVENTOS
    capacity: '',
    event_schedule: '',
    music_allowed: false,

    // CAMPOS LOCAL COMERCIAL
    commercial_front: false,
    warehouse: false,
    office: false,
    industrial_power: false,
  });

  const [selectedStatuses, setSelectedStatuses] = useState<PropertyStatus[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSold, setIsSold] = useState<boolean>(false);

  // REFERENCIA AL FORMULARIO PARA REALIZAR SUBMIT PROGRAMÁTICO DESDE EL HEADER
  const formRef = useRef<HTMLFormElement>(null);

  // CARGAR PROPIEDADES AL INICIAR
  const fetchProperties = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al cargar propiedades:', error);
      showToast('Error al conectar con la base de datos', 'error');
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  }, [showToast]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperties();
  }, [fetchProperties]);

  // MANEJO DE ARCHIVOS SELECCIONADOS
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      showToast(`Imágenes añadidas temporalmente (${filesArray.length})`, 'info');
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
          console.error('Error subiendo imagen:', error, data);
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
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (selectedStatuses.length === 0) {
      showToast('Por favor, selecciona al menos una clasificación', 'warning');
      return;
    }

    setIsProcessing(true);
    showToast('Subiendo y optimizando imágenes...', 'info');

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

        // UBICACIÓN
        province: formData.province,
        municipality: formData.municipality || null,
        neighborhood: formData.neighborhood || null,

        // CARACTERÍSTICAS ESTRUCTURALES
        property_type: formData.property_type || null,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : 0,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : 0,
        living_rooms: formData.living_rooms ? Number(formData.living_rooms) : 0,
        dining_rooms: formData.dining_rooms ? Number(formData.dining_rooms) : 0,
        kitchens: formData.kitchens ? Number(formData.kitchens) : 0,
        indoor_patios: formData.indoor_patios ? Number(formData.indoor_patios) : 0,
        outdoor_patios: formData.outdoor_patios ? Number(formData.outdoor_patios) : 0,
        garages: formData.garages ? Number(formData.garages) : 0,
        terraces: formData.terraces ? Number(formData.terraces) : 0,
        balconies: formData.balconies ? Number(formData.balconies) : 0,
        portals: formData.portals ? Number(formData.portals) : 0,
        floors: formData.floors ? Number(formData.floors) : 0,
        construction_area: formData.construction_area ? Number(formData.construction_area) : null,
        land_area: formData.land_area ? Number(formData.land_area) : null,

        // AMENIDADES
        amenities: formData.amenities,

        // HOSTAL / INTERNACIONAL
        rooms_available: formData.rooms_available ? Number(formData.rooms_available) : null,
        private_bathroom: formData.private_bathroom,
        shared_bathroom: formData.shared_bathroom,
        breakfast: formData.breakfast,
        lunch: formData.lunch,
        dinner: formData.dinner,
        airport_pickup: formData.airport_pickup,
        check_in: formData.check_in || null,
        check_out: formData.check_out || null,
        languages: formData.languages,

        // PASADÍA / EVENTOS
        capacity: formData.capacity ? Number(formData.capacity) : null,
        event_schedule: formData.event_schedule || null,
        music_allowed: formData.music_allowed,

        // LOCAL COMERCIAL
        commercial_front: formData.commercial_front,
        warehouse: formData.warehouse,
        office: formData.office,
        industrial_power: formData.industrial_power,

        // CONTROL DE ESTADO
        is_published: editingId ? (editingProperty?.is_published ?? false) : false,
      };

      if (editingId) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingId);

        if (error) throw error;
        showToast('✅ Propiedad actualizada con éxito', 'success');
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) throw error;
        showToast('✅ Propiedad publicada con éxito', 'success');
      }

      resetForm();
      fetchProperties();
    } catch (err: unknown) {
      console.error('Error al guardar:', err);
      const errorMessage =
        err instanceof Error ? err.message : String(err);
      showToast(`Error al guardar: ${errorMessage}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // EDICIÓN DE PROPIEDAD
  const handleEdit = (property: Property) => {
    setEditingId(property.id);
    setEditingProperty(property);
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

      // UBICACIÓN
      province: property.province || 'Camagüey',
      municipality: property.municipality || '',
      neighborhood: property.neighborhood || '',

      // CARACTERÍSTICAS ESTRUCTURALES
      property_type: property.property_type || '',
      bedrooms: property.bedrooms !== undefined ? String(property.bedrooms) : '',
      bathrooms: property.bathrooms !== undefined ? String(property.bathrooms) : '',
      living_rooms: property.living_rooms !== undefined ? String(property.living_rooms) : '',
      dining_rooms: property.dining_rooms !== undefined ? String(property.dining_rooms) : '',
      kitchens: property.kitchens !== undefined ? String(property.kitchens) : '',
      indoor_patios: property.indoor_patios !== undefined ? String(property.indoor_patios) : '',
      outdoor_patios: property.outdoor_patios !== undefined ? String(property.outdoor_patios) : '',
      garages: property.garages !== undefined ? String(property.garages) : '',
      terraces: property.terraces !== undefined ? String(property.terraces) : '',
      balconies: property.balconies !== undefined ? String(property.balconies) : '',
      portals: property.portals !== undefined ? String(property.portals) : '',
      floors: property.floors !== undefined ? String(property.floors) : '',
      construction_area: property.construction_area !== null && property.construction_area !== undefined ? String(property.construction_area) : '',
      land_area: property.land_area !== null && property.land_area !== undefined ? String(property.land_area) : '',

      // AMENIDADES
      amenities: Array.isArray(property.amenities) ? property.amenities : [],

      // CAMPOS HOSTAL / INTERNACIONAL
      rooms_available: property.rooms_available !== null && property.rooms_available !== undefined ? String(property.rooms_available) : '',
      private_bathroom: !!property.private_bathroom,
      shared_bathroom: !!property.shared_bathroom,
      breakfast: !!property.breakfast,
      lunch: !!property.lunch,
      dinner: !!property.dinner,
      airport_pickup: !!property.airport_pickup,
      check_in: property.check_in || '',
      check_out: property.check_out || '',
      languages: Array.isArray(property.languages) ? property.languages : [],

      // CAMPOS PASADÍA / EVENTOS
      capacity: property.capacity !== null && property.capacity !== undefined ? String(property.capacity) : '',
      event_schedule: property.event_schedule || '',
      music_allowed: !!property.music_allowed,

      // CAMPOS LOCAL COMERCIAL
      commercial_front: !!property.commercial_front,
      warehouse: !!property.warehouse,
      office: !!property.office,
      industrial_power: !!property.industrial_power,
    });

    const statuses = Array.isArray(property.status)
      ? property.status
      : [property.status];

    setSelectedStatuses(statuses);
    setExistingImages(property.images || []);
    setSelectedFiles([]);
    setIsSold(!!property.is_sold);
    showToast(`Editando: ${property.title}`, 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ELIMINAR PROPIEDAD
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) return;

    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (error) throw error;
      showToast('🗑️ Propiedad eliminada', 'success');
      fetchProperties();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un problema';
      showToast(`Error al eliminar: ${errorMessage}`, 'error');
    }
  };

  // RESETEAR FORMULARIO
  const resetForm = () => {
    setEditingId(null);
    setEditingProperty(null);
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

      // UBICACIÓN
      province: 'Camagüey',
      municipality: '',
      neighborhood: '',

      // CARACTERÍSTICAS ESTRUCTURALES
      property_type: '',
      bedrooms: '',
      bathrooms: '',
      living_rooms: '',
      dining_rooms: '',
      kitchens: '',
      indoor_patios: '',
      outdoor_patios: '',
      garages: '',
      terraces: '',
      balconies: '',
      portals: '',
      floors: '',
      construction_area: '',
      land_area: '',

      // AMENIDADES
      amenities: [],

      // CAMPOS HOSTAL / INTERNACIONAL
      rooms_available: '',
      private_bathroom: false,
      shared_bathroom: false,
      breakfast: false,
      lunch: false,
      dinner: false,
      airport_pickup: false,
      check_in: '',
      check_out: '',
      languages: [],

      // CAMPOS PASADÍA / EVENTOS
      capacity: '',
      event_schedule: '',
      music_allowed: false,

      // CAMPOS LOCAL COMERCIAL
      commercial_front: false,
      warehouse: false,
      office: false,
      industrial_power: false,
    });
    setSelectedStatuses([]);
    setExistingImages([]);
    setSelectedFiles([]);
    setIsSold(false);
  };

  // MANEJAR EL BOTÓN DRAFT (TOAST ÚNICAMENTE VISUAL)
  const handleSaveDraft = () => {
    showToast('Esta funcionalidad estará disponible próximamente.', 'info');
  };

  // MANEJAR FORMULARIO CAMBIOS
  const handleFormChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ELIMINAR IMAGEN EXISTENTE
  const removeExistingImage = (idx: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== idx));
    showToast('Imagen eliminada de la lista guardada', 'warning');
  };

  // ELIMINAR ARCHIVO SELECCIONADO
  const removeSelectedFile = (idx: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
    showToast('Imagen temporal descartada', 'warning');
  };

  // PROGRAMATIC SUBMIT DESDE EL HEADER
  const triggerSubmit = () => {
    if (formRef.current) {
      // Usar HTML5 validation
      const isValid = formRef.current.reportValidity();
      if (isValid) {
        handleSubmit();
      }
    }
  };

  // Calcular paso del progreso (solo visual)
  const calculateStep = () => {
    if (selectedFiles.length > 0 || existingImages.length > 0) return 3;
    if (formData.latitude || formData.longitude) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] p-4 md:p-8 space-y-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* LOGO DE LA MARCA PARA MANTENER LA IDENTIDAD DE TU CASITA EN EL PANEL */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center bg-[#F2ECE1] rounded-2xl border border-[#E2D8C7] overflow-hidden">
              <img
                src="/logo.png"
                alt="TuCasita Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline text-xl font-extrabold tracking-tight leading-none">
                <span className="text-[#1E67AD]">Tu</span>
                <span className="text-[#C8976C] relative">
                  Casita
                  <span className="absolute -top-1.5 right-4.5 text-[8px] text-[#1E67AD]">♥</span>
                </span>
              </div>
              <span className="text-[8px] font-black text-[#1E67AD] tracking-[0.2em] uppercase mt-0.5">
                Panel Administrativo
              </span>
            </div>
          </div>

          <Link
            href="/"
            className="px-4 py-2 bg-[#F2ECE1] hover:bg-[#E2D8C7] text-[#1E67AD] border border-[#E2D8C7] text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            🏠 Ver página principal
          </Link>
        </div>

        {/* CABECERA CON BOTONES ACCIONES */}
        <PropertyHeader
          editingId={editingId}
          isProcessing={isProcessing}
          onCancel={resetForm}
          onSaveDraft={handleSaveDraft}
          onSubmitForm={triggerSubmit}
        />

        {/* INDICADOR DE PROGRESO */}
        <PropertyProgressSteps currentStep={calculateStep()} />

        {/* FORMULARIO Y VISTA PREVIA RESPONSIVE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* COLUMNA FORMULARIO (8 columnas de 12 en escritorio) */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="lg:col-span-8 space-y-8"
          >
            {/* SECCIÓN 1: INFORMACIÓN BÁSICA Y CATEGORÍAS */}
            <PropertyBasicInfoCard
              title={formData.title}
              price={formData.price}
              currency={formData.currency}
              address={formData.address}
              contact={formData.contact}
              selectedStatuses={selectedStatuses}
              onFormChange={handleFormChange}
              onToggleStatus={toggleStatus}
            />

            {/* SECCIÓN 2: UBICACIÓN DE LA PROPIEDAD */}
            <PropertyLocationCard
              province={formData.province}
              municipality={formData.municipality}
              neighborhood={formData.neighborhood}
              latitude={formData.latitude}
              longitude={formData.longitude}
              onFormChange={handleFormChange}
            />

            {/* SECCIÓN 2.5: CARACTERÍSTICAS ESTRUCTURALES */}
            <PropertyStructuralCard
              propertyType={formData.property_type}
              bedrooms={formData.bedrooms}
              bathrooms={formData.bathrooms}
              livingRooms={formData.living_rooms}
              diningRooms={formData.dining_rooms}
              kitchens={formData.kitchens}
              indoorPatios={formData.indoor_patios}
              outdoorPatios={formData.outdoor_patios}
              garages={formData.garages}
              terraces={formData.terraces}
              balconies={formData.balconies}
              portals={formData.portals}
              floors={formData.floors}
              constructionArea={formData.construction_area}
              landArea={formData.land_area}
              onFormChange={handleFormChange}
            />

            {/* SECCIÓN 2.6: AMENIDADES */}
            <PropertyAmenitiesCard
              amenities={formData.amenities}
              onChange={(newAmenities) => handleFormChange('amenities', newAmenities)}
            />

            {/* CAMPOS CONDICIONALES POR CATEGORÍA */}
            {selectedStatuses.includes('international_hostel') && (
              <PropertyHostelFieldsCard
                roomsAvailable={formData.rooms_available}
                privateBathroom={formData.private_bathroom}
                sharedBathroom={formData.shared_bathroom}
                breakfast={formData.breakfast}
                lunch={formData.lunch}
                dinner={formData.dinner}
                airportPickup={formData.airport_pickup}
                checkIn={formData.check_in}
                checkOut={formData.check_out}
                languages={formData.languages}
                onFormChange={handleFormChange}
                onLanguagesChange={(langs) => handleFormChange('languages', langs)}
              />
            )}

            {selectedStatuses.includes('day_pass') && (
              <PropertyDayPassFieldsCard
                capacity={formData.capacity}
                eventSchedule={formData.event_schedule}
                musicAllowed={formData.music_allowed}
                onFormChange={handleFormChange}
              />
            )}

            {selectedStatuses.includes('commercial_space') && (
              <PropertyCommercialFieldsCard
                commercialFront={formData.commercial_front}
                warehouse={formData.warehouse}
                office={formData.office}
                industrialPower={formData.industrial_power}
                onFormChange={handleFormChange}
              />
            )}

            {/* SECCIÓN 3: DESCRIPCIÓN DETALLADA */}
            <PropertyDescriptionCard
              description={formData.description}
              onFormChange={handleFormChange}
            />

            {/* SECCIÓN 4: GALERÍA DE IMÁGENES */}
            <PropertyGalleryCard
              existingImages={existingImages}
              selectedFiles={selectedFiles}
              onFileChange={handleFileChange}
              onRemoveExistingImage={removeExistingImage}
              onRemoveSelectedFile={removeSelectedFile}
            />

            {/* SECCIÓN 5: CONFIGURACIÓN DE LA PUBLICACIÓN */}
            <PropertySettingsCard
              editingId={editingId}
              priority={formData.priority}
              isSold={isSold}
              onFormChange={handleFormChange}
              onToggleSold={setIsSold}
            />

            {/* BOTONES FINALES DE ACCIÓN */}
            <PropertyActionsBar
              editingId={editingId}
              isProcessing={isProcessing}
              onCancel={resetForm}
              onSaveDraft={handleSaveDraft}
            />
          </form>

          {/* COLUMNA VISTA PREVIA (4 columnas de 12 en escritorio - Sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            <PropertyPreviewCard
              formData={formData}
              selectedStatuses={selectedStatuses}
              existingImages={existingImages}
              selectedFiles={selectedFiles}
              isSold={isSold}
            />
          </div>

        </div>

        {/* LISTADO DE PROPIEDADES REGISTRADAS DE SUPABASE */}
        <RegisteredPropertiesList
          properties={properties}
          loading={loading}
          adminFilter={adminFilter}
          onFilterChange={setAdminFilter}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

      </div>

      {/* TOASTS DE NOTIFICACIÓN */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
