'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Property, PropertyStatus } from '@/lib/types';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeProvider';

// SUBCOMPONENTES (EXCLUSIVOS DEL ADMIN)
import PropertyProgressSteps from './components/PropertyProgressSteps';
import PropertyBasicInfoCard from './components/PropertyBasicInfoCard';
import PropertySettingsCard from './components/PropertySettingsCard';
import PropertyPreviewCard from './components/PropertyPreviewCard';
import PropertyActionsBar from './components/PropertyActionsBar';
import RegisteredPropertiesList from './components/RegisteredPropertiesList';

// COMPONENTES COMPARTIDOS (ÚNICA FUENTE DE VERDAD)
import PropertyLocationCard from '@/components/property-form/PropertyLocationCard';
import PropertyStructuralCard from '@/components/property-form/PropertyStructuralCard';
import PropertyAmenitiesCard from '@/components/property-form/PropertyAmenitiesCard';
import PropertyHostelFieldsCard from '@/components/property-form/PropertyHostelFieldsCard';
import PropertyDayPassFieldsCard from '@/components/property-form/PropertyDayPassFieldsCard';
import PropertyCommercialFieldsCard from '@/components/property-form/PropertyCommercialFieldsCard';
import PropertyDescriptionCard from '@/components/property-form/PropertyDescriptionCard';
import PropertyGalleryCard from '@/components/property-form/PropertyGalleryCard';
import Toast from '@/components/property-form/Toast';

export default function AdminPage() {
  const { theme } = useTheme();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // FILTRO RÁPIDO PARA LA LISTA DEL ADMIN ('all', 'published', 'pending')
  const [adminFilter, setAdminFilter] = useState<string>('all');

  // NAVEGACIÓN ACTIVA DEL SIDEBAR
  const [activeView, setActiveView] = useState<'dashboard' | 'new_property' | 'all_properties' | 'pending' | 'featured' | 'sold' | 'extras'>('dashboard');

  // ESTADO DE MENÚ MÓVIL
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ESTADO DE SCROLL PARA SOMBRA EN HEADER
  const [isScrolled, setIsScrolled] = useState(false);

  // ESTADO DE TOAST (MENSAJES INTERACTIVOS)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error' | 'warning'>('info');

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    setToastMessage(message);
    setToastType(type);
  }, []);

  // DETECTAR DESPLAZAMIENTO PARA LA SOMBRA DEL HEADER
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
  const [isPublishedState, setIsPublishedState] = useState<boolean>(true); // Por defecto el admin publica directo

  const formRef = useRef<HTMLFormElement>(null);

  // EDICIÓN DE PROPIEDAD
  const handleEdit = (property: Property) => {
    setActiveView('new_property'); // Cambia a la vista del formulario
    setEditingId(property.id);
    setEditingProperty(property);
    setIsPublishedState(!!property.is_published);
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

      province: property.province || 'Camagüey',
      municipality: property.municipality || '',
      neighborhood: property.neighborhood || '',

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

      amenities: Array.isArray(property.amenities) ? property.amenities : [],

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

      capacity: property.capacity !== null && property.capacity !== undefined ? String(property.capacity) : '',
      event_schedule: property.event_schedule || '',
      music_allowed: !!property.music_allowed,

      commercial_front: !!property.commercial_front,
      warehouse: !!property.warehouse,
      office: !!property.office,
      industrial_power: !!property.industrial_power,
    });

    const statuses = Array.isArray(property.status) ? property.status : [property.status];

    setSelectedStatuses(statuses);
    setExistingImages(property.images || []);
    setSelectedFiles([]);
    setIsSold(!!property.is_sold);
    showToast(`Editando: ${property.title}`, 'info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
    const timer = setTimeout(() => {
      fetchProperties();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProperties]);

  // DETECTAR PARÁMETRO EN LA URL (?pending=ID O ?edit=ID) VIENEN DE TELEGRAM
  const urlProcessedRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && properties.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const pendingId = urlParams.get('pending') || urlParams.get('edit');
      
      if (pendingId && urlProcessedRef.current !== pendingId) {
        const foundProp = properties.find((p) => String(p.id) === String(pendingId));
        if (foundProp) {
          urlProcessedRef.current = pendingId;
          setTimeout(() => {
            handleEdit(foundProp);
            showToast(`Cargando solicitud pendiente ID: ${pendingId}`, 'info');
          }, 0);
        }
      }
    }
  }, [properties, showToast]);

  // SUBIDA Y COMPRESIÓN DE IMÁGENES
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      showToast(`Imágenes añadidas temporalmente (${filesArray.length})`, 'info');
    }
  };

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

  const toggleStatus = (status: PropertyStatus) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  // FUNCIONALIDAD: APROBAR PUBLICACIÓN DIRECTA
  const handleApproveProperty = async (propertyId: string) => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('properties')
        .update({ is_published: true })
        .eq('id', propertyId);

      if (error) throw error;

      showToast('🎉 ¡Propiedad aprobada y publicada exitosamente!', 'success');
      resetForm();
      fetchProperties();
    } catch (err) {
      console.error('Error aprobando propiedad:', err);
      showToast('Error al aprobar la propiedad', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // GUARDAR / ACTUALIZAR PROPIEDAD
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (selectedStatuses.length === 0) {
      showToast('Por favor, selecciona al menos una clasificación', 'warning');
      return;
    }

    setIsProcessing(true);
    showToast('Procesando solicitud e imágenes...', 'info');

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

        // ESTRUCTURALES
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

        // HOSTAL
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

        // PASADÍA
        capacity: formData.capacity ? Number(formData.capacity) : null,
        event_schedule: formData.event_schedule || null,
        music_allowed: formData.music_allowed,

        // LOCAL COMERCIAL
        commercial_front: formData.commercial_front,
        warehouse: formData.warehouse,
        office: formData.office,
        industrial_power: formData.industrial_power,

        // SI SE GUARDA DESDE EL ADMIN, QUEDA PUBLICADA POR DEFECTO
        is_published: true,
      };

      if (editingId) {
        const { error } = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', editingId);

        if (error) throw error;
        showToast('✅ Propiedad actualizada y aprobada', 'success');
      } else {
        const { error } = await supabase
          .from('properties')
          .insert([propertyData]);

        if (error) throw error;
        showToast('✅ Propiedad guardada y publicada', 'success');
      }

      resetForm();
      fetchProperties();
    } catch (err: unknown) {
      console.error('Error al guardar:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      showToast(`Error al guardar: ${errorMessage}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

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

  const resetForm = () => {
    setEditingId(null);
    setEditingProperty(null);
    setIsPublishedState(true);
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

      province: 'Camagüey',
      municipality: '',
      neighborhood: '',

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

      amenities: [],

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

      capacity: '',
      event_schedule: '',
      music_allowed: false,

      commercial_front: false,
      warehouse: false,
      office: false,
      industrial_power: false,
    });
    setSelectedStatuses([]);
    setExistingImages([]);
    setSelectedFiles([]);
    setIsSold(false);
    setActiveView('dashboard'); // Vuelve al dashboard al cancelar
  };

  const handleSaveDraft = () => {
    showToast('Esta funcionalidad estará disponible próximamente.', 'info');
  };

  const handleFormChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== idx));
    showToast('Imagen eliminada de la lista guardada', 'warning');
  };

  const removeSelectedFile = (idx: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== idx));
    showToast('Imagen temporal descartada', 'warning');
  };

  const triggerSubmit = () => {
    if (formRef.current) {
      const isValid = formRef.current.reportValidity();
      if (isValid) handleSubmit();
    }
  };

  const calculateStep = () => {
    if (selectedFiles.length > 0 || existingImages.length > 0) return 3;
    if (formData.latitude || formData.longitude) return 2;
    return 1;
  };

  // FILTRAR SOLICITUDES PENDIENTES
  const pendingProperties = properties.filter((p) => !p.is_published);

  // CONFIGURACIÓN DE ITEMS DE NAVEGACIÓN
  interface NavigationItem {
    id: 'dashboard' | 'new_property' | 'all_properties' | 'pending' | 'featured' | 'sold' | 'extras';
    label: string;
    icon: string;
    showBadge?: boolean;
  }

  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'new_property', label: 'Nueva publicación', icon: '➕' },
    { id: 'all_properties', label: 'Todas las propiedades', icon: '📋' },
    { id: 'pending', label: 'Publicaciones pendientes', icon: '⏳', showBadge: true },
    { id: 'featured', label: 'Destacadas', icon: '⭐' },
    { id: 'sold', label: 'Vendidas', icon: '🏷️' },
    { id: 'extras', label: 'Extras', icon: '🚧' },
  ];

  // RENDERIZADOR CONTENIDO DEL SIDEBAR (REUTILIZABLE)
  const renderSidebarContent = () => (
    <nav className="space-y-1.5">
      {navigationItems.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setActiveView(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/10 font-extrabold'
                : 'text-text-muted hover:text-brand-primary hover:bg-bg-main bg-transparent'
            }`}
          >
            <span className="text-sm shrink-0">{item.icon}</span>
            <span>{item.label}</span>

            {item.showBadge && pendingProperties.length > 0 && (
              <span className={`ml-auto px-2 py-0.5 text-[9px] font-black rounded-lg leading-none ${
                isActive
                  ? 'bg-bg-card text-brand-primary'
                  : 'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {pendingProperties.length}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-bg-main text-text-main select-none flex flex-col transition-colors duration-200">

      {/* 1. HEADER COHESIVO Y UNIFICADO SAAS */}
      <header className={`sticky top-0 z-40 bg-bg-card transition-all duration-200 ${
        isScrolled ? 'shadow-md border-b border-border-main/80' : 'shadow-xs border-b border-border-main'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* LOGO DE LA MARCA DE TU CASITA Y MENÚ MÓVIL */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-bg-main rounded-xl text-brand-primary transition active:scale-95 text-base cursor-pointer"
              title="Abrir menú"
            >
              ☰
            </button>

            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center bg-brand-primary/10 rounded-2xl border border-border-main overflow-hidden">
              <span className="text-xl">🏠</span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline text-xl font-extrabold tracking-tight leading-none">
                <span className="text-brand-primary">Tu</span>
                <span className="text-brand-secondary relative">
                  Casita
                  <span className="absolute -top-1.5 right-4.5 text-[8px] text-brand-primary">♥</span>
                </span>
              </div>
              <span className="text-[8px] font-black text-brand-primary tracking-[0.2em] uppercase mt-0.5">
                Panel Administrativo
              </span>
            </div>
          </div>

          {/* BOTONES PRINCIPALES DE ACCIÓN DENTRO DEL HEADER */}
          <div className="flex items-center gap-2">
            {activeView === 'new_property' ? (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3.5 py-2 text-xs font-bold text-text-muted hover:text-brand-primary hover:bg-bg-main rounded-xl transition border border-border-main bg-bg-card cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="hidden sm:inline-block px-3.5 py-2 text-xs font-bold text-brand-primary hover:opacity-90 bg-brand-primary/10 rounded-xl transition border border-border-main cursor-pointer"
                >
                  Guardar borrador
                </button>

                <button
                  type="button"
                  onClick={triggerSubmit}
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-extrabold text-bg-card bg-brand-primary hover:opacity-95 rounded-xl shadow-md transition active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isProcessing
                    ? 'Procesando...'
                    : editingId
                    ? 'Guardar'
                    : 'Publicar'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setActiveView('new_property')}
                className="px-4 py-2 bg-brand-primary text-bg-card text-xs font-bold rounded-xl shadow-md hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
              >
                ➕ Nueva publicación
              </button>
            )}

            <Link
              href="/"
              className="hidden sm:inline-flex px-4 py-2 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary border border-border-main text-xs font-bold rounded-xl transition items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 shrink-0 animate-in fade-in"
            >
              🏠 Ver principal
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative flex flex-col w-64 max-w-xs bg-bg-card h-full p-6 shadow-xl border-r border-border-main animate-in slide-in-from-left duration-200 text-left">
            <div className="flex items-center justify-between pb-6 border-b border-border-main">
              <span className="text-xs font-black text-brand-primary uppercase tracking-wider">Menú Panel</span>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-text-muted hover:text-brand-primary font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 py-6 overflow-y-auto">
              {renderSidebarContent()}
            </div>
          </div>
        </div>
      )}

      {/* 2. DISEÑO PRINCIPAL DE DOS COLUMNAS */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">

        {/* SIDEBAR COLUMNA IZQUIERDA (ESCRITORIO) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6">
          <div className="bg-bg-card border border-border-main rounded-3xl p-5 shadow-sm space-y-4">
            <div className="border-b border-border-main pb-3">
              <h3 className="text-xs font-black text-brand-primary uppercase tracking-wider">Navegación</h3>
              <p className="text-[10px] text-text-muted font-semibold mt-0.5">Gestión de la plataforma</p>
            </div>
            {renderSidebarContent()}
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL COLUMNA DERECHA */}
        <main className="flex-1 min-w-0 space-y-8">

          {/* VISTA 1: DASHBOARD */}
          {activeView === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">

              {/* INDICADOR DE PENDIENTES */}
              {pendingProperties.length > 0 ? (
                <div className="bg-amber-500/10 border-2 border-amber-500/30 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-base tracking-tight">
                      <span>🔔</span>
                      <span>Publicaciones pendientes</span>
                    </div>
                    <p className="text-xs text-text-muted font-semibold">
                      Hay {pendingProperties.length} publicación{pendingProperties.length > 1 ? 'es que esperan' : 'a que espera'} revisión antes de publicarse en la web.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveView('pending')}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition shadow-xs active:scale-95 cursor-pointer shrink-0"
                  >
                    🔍 Revisar ahora
                  </button>
                </div>
              ) : (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 shadow-xs flex items-center gap-3 text-left">
                  <span className="text-lg">✅</span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                    No hay publicaciones pendientes de aprobación. ¡Todo está al día!
                  </span>
                </div>
              )}

              {/* TARJETAS DE MÉTRICAS */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                <div className="bg-bg-card border border-border-main rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-black uppercase tracking-wider">Total</span>
                    <span className="text-lg">🏠</span>
                  </div>
                  <p className="text-3xl font-black text-brand-primary mt-2">{properties.length}</p>
                  <p className="text-[10px] text-text-muted font-semibold mt-1">Propiedades registradas</p>
                </div>

                <div className="bg-bg-card border border-border-main rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-black uppercase tracking-wider">Pendientes</span>
                    <span className="text-lg">⏳</span>
                  </div>
                  <p className="text-3xl font-black text-amber-500 mt-2">{pendingProperties.length}</p>
                  <p className="text-[10px] text-text-muted font-semibold mt-1">Por revisar y publicar</p>
                </div>

                <div className="bg-bg-card border border-border-main rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-black uppercase tracking-wider">Destacadas</span>
                    <span className="text-lg">⭐</span>
                  </div>
                  <p className="text-3xl font-black text-brand-primary mt-2">
                    {properties.filter(p => [1, 2, 3].includes(p.priority)).length}
                  </p>
                  <p className="text-[10px] text-text-muted font-semibold mt-1">Prioridad 1, 2, 3</p>
                </div>

                <div className="bg-bg-card border border-border-main rounded-3xl p-5 shadow-xs hover:shadow-sm transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-text-muted font-black uppercase tracking-wider">Vendidas</span>
                    <span className="text-lg">🔴</span>
                  </div>
                  <p className="text-3xl font-black text-rose-500 mt-2">
                    {properties.filter(p => p.is_sold).length}
                  </p>
                  <p className="text-[10px] text-text-muted font-semibold mt-1">Fuera de catálogo</p>
                </div>
              </div>

              {/* ACCIONES RÁPIDAS EN PANEL */}
              <div className="space-y-4 text-left">
                <h3 className="text-xs font-black text-text-muted uppercase tracking-widest">Accesos Rápidos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveView('new_property')}
                    className="bg-bg-card hover:bg-bg-main border border-border-main hover:border-brand-primary p-5 rounded-3xl text-left transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-200">➕</span>
                    <h4 className="text-xs font-black text-brand-primary uppercase tracking-wider">Nueva publicación</h4>
                    <p className="text-[10px] text-text-muted font-semibold mt-1">Abre el formulario para registrar una nueva propiedad en venta o renta.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView('all_properties')}
                    className="bg-bg-card hover:bg-bg-main border border-border-main hover:border-brand-primary p-5 rounded-3xl text-left transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-200">📋</span>
                    <h4 className="text-xs font-black text-brand-primary uppercase tracking-wider">Todas las propiedades</h4>
                    <p className="text-[10px] text-text-muted font-semibold mt-1">Inspecciona y edita el catálogo general de viviendas sin filtros preestablecidos.</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView('pending')}
                    className="bg-bg-card hover:bg-bg-main border border-border-main hover:border-brand-primary p-5 rounded-3xl text-left transition-all duration-300 group cursor-pointer"
                  >
                    <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform duration-200">⏳</span>
                    <h4 className="text-xs font-black text-brand-primary uppercase tracking-wider">Publicaciones pendientes</h4>
                    <p className="text-[10px] text-text-muted font-semibold mt-1">Revisa el listado de propiedades no aprobadas enviadas por la comunidad.</p>
                  </button>
                </div>
              </div>

              {/* LISTADO DE PENDIENTES SI EXISTEN */}
              {pendingProperties.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-5 shadow-sm space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <h2 className="text-amber-600 dark:text-amber-400 text-sm font-black tracking-tight">
                      📝 Solicitudes Pendientes para Aprobación Directa
                    </h2>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                      Acciones rápidas
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {pendingProperties.map((prop) => (
                      <div
                        key={prop.id}
                        className="bg-bg-card border border-border-main rounded-2xl p-4 shadow-xs hover:border-amber-500/50 transition flex flex-col justify-between gap-4"
                      >
                        <div>
                          <h3 className="font-bold text-text-main text-xs line-clamp-1">{prop.title}</h3>
                          <p className="text-[10px] text-text-muted mt-1">
                            📍 {prop.neighborhood || prop.municipality || 'Camagüey'} • {prop.price} {prop.currency}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(prop)}
                            className="flex-1 py-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold rounded-xl transition cursor-pointer"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveProperty(prop.id)}
                            disabled={isProcessing}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs cursor-pointer"
                          >
                            ✅ Aprobar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VISTA 2: FORMULARIO NUEVA PUBLICACIÓN / EDICIÓN */}
          {activeView === 'new_property' && (
            <div className="space-y-8 animate-in fade-in duration-300">

              {/* AVISO SI SE ESTÁ REVISANDO UNA PROPIEDAD PENDIENTE */}
              {editingId && !isPublishedState && (
                <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold p-4 rounded-xl flex items-center justify-between text-left">
                  <span>ℹ️ Estás revisando una solicitud pendiente. Al hacer clic en <strong>Guardar Cambios</strong>, la propiedad quedará aprobada y publicada automáticamente.</span>
                </div>
              )}

              {/* INDICADOR DE PROGRESO */}
              <PropertyProgressSteps currentStep={calculateStep()} />

              {/* GRID PRINCIPAL DEL FORMULARIO Y PREVIEW */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <form ref={formRef} onSubmit={handleSubmit} className="lg:col-span-8 space-y-8">
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

                  <PropertyLocationCard
                    province={formData.province}
                    municipality={formData.municipality}
                    neighborhood={formData.neighborhood}
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    onFormChange={handleFormChange}
                  />

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

                  <PropertyAmenitiesCard
                    amenities={formData.amenities}
                    onChange={(newAmenities) => handleFormChange('amenities', newAmenities)}
                  />

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

                  <PropertyDescriptionCard
                    description={formData.description}
                    onFormChange={handleFormChange}
                  />

                  <PropertyGalleryCard
                    existingImages={existingImages}
                    selectedFiles={selectedFiles}
                    onFileChange={handleFileChange}
                    onRemoveExistingImage={removeExistingImage}
                    onRemoveSelectedFile={removeSelectedFile}
                  />

                  <PropertySettingsCard
                    editingId={editingId}
                    priority={formData.priority}
                    isSold={isSold}
                    onFormChange={handleFormChange}
                    onToggleSold={setIsSold}
                  />

                  <PropertyActionsBar
                    editingId={editingId}
                    isProcessing={isProcessing}
                    onCancel={resetForm}
                    onSaveDraft={handleSaveDraft}
                  />
                </form>

                <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
                  <PropertyPreviewCard
                    formData={formData}
                    selectedStatuses={selectedStatuses}
                    existingImages={existingImages}
                    selectedFiles={selectedFiles}
                    isSold={isSold}
                  />
                </div>
              </div>
            </div>
          )}

          {/* VISTAS DE TABLA FILTRADAS (REUTILIZACIÓN TOTAL) */}
          {(activeView === 'all_properties' || activeView === 'pending' || activeView === 'featured' || activeView === 'sold') && (
            <RegisteredPropertiesList
              properties={properties}
              loading={loading}
              adminFilter={adminFilter}
              onFilterChange={setAdminFilter}
              onEdit={handleEdit}
              onDelete={handleDelete}
              view={
                activeView === 'all_properties' ? 'all' :
                activeView === 'pending' ? 'pending' :
                activeView === 'featured' ? 'featured' : 'sold'
              }
            />
          )}

          {/* VISTA 7: EXTRAS - COMING SOON */}
          {activeView === 'extras' && (
            <div className="space-y-6 animate-in fade-in duration-300 text-left">
              <div className="bg-bg-card rounded-3xl p-6 border border-border-main shadow-sm">
                <span className="text-3xl block mb-2">🚧</span>
                <h2 className="text-lg font-black text-brand-primary tracking-tight">Próximamente</h2>
                <p className="text-xs text-text-muted font-semibold mt-0.5">
                  Estamos trabajando en nuevas herramientas avanzadas para optimizar la gestión de Tu Casita.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* ESTADÍSTICAS */}
                <div className="bg-bg-card border border-border-main rounded-3xl p-5 shadow-xs relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-md">
                    Próximamente
                  </div>
                  <span className="text-2xl block mb-2">📊</span>
                  <h3 className="text-xs font-black text-brand-primary uppercase tracking-wider">Estadísticas</h3>
                  <p className="text-[10px] text-text-muted font-semibold mt-1.5 leading-relaxed">
                    Gráficos detallados sobre visitas a tus propiedades, interacciones de clientes por WhatsApp, y clics en las clasificaciones más populares.
                  </p>
                </div>

                {/* REPORTES */}
                <div className="bg-bg-card border border-border-main rounded-3xl p-5 shadow-xs relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-md">
                    Próximamente
                  </div>
                  <span className="text-2xl block mb-2">📋</span>
                  <h3 className="text-xs font-black text-brand-primary uppercase tracking-wider">Reportes</h3>
                  <p className="text-[10px] text-text-muted font-semibold mt-1.5 leading-relaxed">
                    Generación y exportación de informes automatizados en formato PDF, Excel o CSV para analizar el rendimiento del catálogo de bienes raíces.
                  </p>
                </div>

                {/* USUARIOS */}
                <div className="bg-bg-card border border-border-main rounded-3xl p-5 shadow-xs relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-md">
                    Próximamente
                  </div>
                  <span className="text-2xl block mb-2">👥</span>
                  <h3 className="text-xs font-black text-brand-primary uppercase tracking-wider">Usuarios</h3>
                  <p className="text-[10px] text-text-muted font-semibold mt-1.5 leading-relaxed">
                    Administración de agentes inmobiliarios, asignación de roles de visualización y permisos de edición para colaboradores de la plataforma.
                  </p>
                </div>

                {/* MESSAGING */}
                <div className="bg-bg-card border border-border-main rounded-3xl p-5 shadow-xs relative overflow-hidden group">
                  <div className="absolute top-4 right-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[8px] font-black uppercase px-2 py-0.5 rounded-md">
                    Próximamente
                  </div>
                  <span className="text-2xl block mb-2">💬</span>
                  <h3 className="text-xs font-black text-brand-primary uppercase tracking-wider">Mensajería</h3>
                  <p className="text-[10px] text-text-muted font-semibold mt-1.5 leading-relaxed">
                    Centralización de consultas recibidas, historial de contactos y notificaciones directas para coordinar visitas físicas o virtuales a las viviendas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
