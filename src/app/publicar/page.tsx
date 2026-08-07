'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { PropertyStatus, PROPERTY_TYPE_OPTIONS } from '@/lib/types';
import Link from 'next/link';

// SHARED COMPONENTS
import PropertyLocationCard from '@/components/property-form/PropertyLocationCard';
import PropertyStructuralCard from '@/components/property-form/PropertyStructuralCard';
import PropertyAmenitiesCard from '@/components/property-form/PropertyAmenitiesCard';
import PropertyDescriptionCard from '@/components/property-form/PropertyDescriptionCard';
import PropertyGalleryCard from '@/components/property-form/PropertyGalleryCard';
import Toast from '@/components/property-form/Toast';

// WIZARD EXCLUSIVE COMPONENTS
import WizardStepper from './components/WizardStepper';
import WizardNavigation from './components/WizardNavigation';
import ReviewStep from './components/ReviewStep';

// TELEGRAM LAYER DECOUPLED
import { triggerTelegramNotification } from '@/lib/notifications';

const TOTAL_STEPS = 8;
const LOCAL_STORAGE_KEY = 'tucasita_wizard_draft_v1';

export default function PublicWizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // TOAST NOTIFICATIONS
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'info' | 'error' | 'warning'>('info');

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    setToastMessage(message);
    setToastType(type);
  }, []);

  // STEP SPECIFIC VALIDATION ERRORS STATE
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // FORM DATA STATE
  const [formData, setFormData] = useState({
    status: 'sale' as PropertyStatus,
    property_type: '',
    title: '',
    price: '',
    currency: 'USD',
    province: 'Camagüey',
    municipality: '',
    neighborhood: '',
    latitude: '',
    longitude: '',
    address: '',

    // STRUCTURAL
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

    // AMENITIES
    amenities: [] as string[],

    // DESCRIPTION
    description: '',

    // CONTACT
    owner_name: '',
    contact: '',
    admin_comment: '',
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [draftRecoveryVisible, setDraftRecoveryVisible] = useState(false);

  // DETECT DRAFT ON LOAD
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.title || parsed.owner_name || parsed.municipality || parsed.status)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setDraftRecoveryVisible(true);
        }
      } catch (err) {
        console.error('Error parsing draft:', err);
      }
    }
  }, []);

  // AUTO-SAVE PROGRESS ON INPUT CHANGE
  useEffect(() => {
    if (!submitSuccess) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, submitSuccess]);

  // LOAD DRAFT
  const handleRecoverDraft = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
        showToast('🚀 Borrador restaurado con éxito', 'success');
      } catch (e) {
        console.error(e);
      }
    }
    setDraftRecoveryVisible(false);
  };

  // REJECT DRAFT
  const handleDiscardDraft = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setDraftRecoveryVisible(false);
    showToast('Borrador descartado', 'info');
  };

  // CHANGE HANDLER
  const handleFormChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when field is changed
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // IMAGE FILE SELECTION
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);
      showToast(`Imágenes seleccionadas (${filesArray.length})`, 'info');
    }
  };

  // REMOVE FILE
  const handleRemoveSelectedFile = (idx: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
    showToast('Imagen quitada', 'warning');
  };

  // WEBP COMPRESSION
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

  // UPLOAD IMAGES TO SUPABASE
  const uploadImages = async (): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of selectedFiles) {
      try {
        const compressedBlob = await compressImage(file);
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;

        const { data, error } = await supabase.storage
          .from('properties')
          .upload(fileName, compressedBlob, {
            contentType: 'image/webp',
          });

        if (error) {
          console.error('Error subiendo imagen:', error, data);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from('properties')
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

  // STEP BY STEP VALIDATION LOGIC
  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.status) {
        errors.status = 'Por favor selecciona qué deseas publicar.';
      }
    }

    if (step === 2) {
      if (!formData.property_type) {
        errors.property_type = 'El tipo de propiedad es obligatorio.';
      }
      if (!formData.title.trim()) {
        errors.title = 'El título de la publicación es obligatorio.';
      } else if (formData.title.trim().length < 5) {
        errors.title = 'El título debe tener al menos 5 caracteres.';
      }
      if (!formData.price) {
        errors.price = 'El precio es obligatorio.';
      } else if (Number(formData.price) <= 0) {
        errors.price = 'El precio debe ser un número positivo.';
      }
    }

    if (step === 3) {
      if (!formData.municipality) {
        errors.municipality = 'El municipio es obligatorio.';
      }
      if (!formData.neighborhood.trim()) {
        errors.neighborhood = 'El reparto o barrio es obligatorio.';
      }
    }

    if (step === 4) {
      const isTerrenoOrSolar = formData.property_type === 'Terreno' || formData.property_type === 'Solar';
      if (isTerrenoOrSolar) {
        if (!formData.land_area) {
          errors.land_area = 'Para un terreno o solar, el área de terreno es obligatoria.';
        } else if (Number(formData.land_area) <= 0) {
          errors.land_area = 'El área debe ser un número positivo.';
        }
      }
    }

    if (step === 6) {
      if (!formData.description.trim()) {
        errors.description = 'La descripción es obligatoria.';
      } else if (formData.description.trim().length < 15) {
        errors.description = 'Por favor, escribe una descripción de al menos 15 caracteres.';
      }
    }

    if (step === 7) {
      if (!formData.owner_name.trim()) {
        errors.owner_name = 'El nombre del propietario es obligatorio.';
      }
      if (!formData.contact.trim()) {
        errors.contact = 'El teléfono o WhatsApp de contacto es obligatorio.';
      } else {
        // Simple Cuban/International phone pattern check
        const cleanPhone = formData.contact.replace(/[\s\-\+]/g, '');
        if (cleanPhone.length < 8) {
          errors.contact = 'Por favor, ingresa un número de teléfono válido de al menos 8 dígitos.';
        }
      }
    }

    setValidationErrors(errors);

    const isValid = Object.keys(errors).length === 0;
    if (!isValid) {
      // Find first error message and show in toast
      const firstError = Object.values(errors)[0];
      showToast(firstError, 'error');
    }

    return isValid;
  };

  // NAVIGATION ACTIONS
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Last step - Submit!
        handleSubmit();
      }
    }
  };

  const triggerPropertyNotification = async (
    propertyId: number,
  ) => {
    const { data, error } =
      await supabase.functions.invoke(
        'clever-task',
        {
          body: {
            propertyId,
          },
        },
      );

    if (error) {
      throw error;
    }

    if (!data?.success) {
      throw new Error(
        data?.error || 'Notification failed',
      );
    }

    return data;
  };

  // SUBMIT HANDLER
  const handleSubmit = async () => {
    setIsProcessing(true);
    showToast('Subiendo y optimizando imágenes...', 'info');

    try {
      const uploadedImageUrls = await uploadImages();

      // Format full description to append admin comment & owner name
      const formattedDescription = `${formData.description}\n\n---\n👤 Propietario: ${formData.owner_name}\n💬 Nota de revisión: ${formData.admin_comment || 'Ninguna'}`;

      // Construct address
      const constructedAddress = `${formData.neighborhood}, ${formData.municipality}, Camagüey`;

            const propertyData = {
        title: formData.title,
        description: formattedDescription,
        price: Number(formData.price) || 0,
        currency: formData.currency,
        address: constructedAddress,
        contact: formData.contact,
        status: [formData.status],
        latitude: formData.latitude ? Number(formData.latitude) : null,
        longitude: formData.longitude ? Number(formData.longitude) : null,
        is_sold: false,
        priority: 4,

        province: 'Camagüey',
        municipality: formData.municipality || null,
        neighborhood: formData.neighborhood || null,

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

        amenities: formData.amenities,

        is_published: false,
      };

      const { data, error } = await supabase
        .from('properties')
        .insert([propertyData])
        .select();

      if (error) throw error;

      // GUARDAR IMÁGENES EN LA TABLA property_images
      if (data && data.length > 0) {
        const propertyId = data[0].id;

        if (uploadedImageUrls.length > 0) {
          const imageRecords = uploadedImageUrls.map((url, index) => ({
            property_id: propertyId,
            image_url: url,
            display_order: index,
            is_cover: index === 0,
          }));

                    const { error: imgError } = await supabase
            .from('property_images')
            .insert(imageRecords);

          if (imgError) throw imgError;
        }
      }

      // Triggers Telegram notification layer (loosely coupled)
      if (data && data.length > 0) {
        try {
          await triggerPropertyNotification(data[0].id);
        } catch (notificationError) {
          console.error(
            'La propiedad fue guardada, pero falló la notificación:',
            notificationError,
          );
        }
      }

      // Success! Clear drafts
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSubmitSuccess(true);
      showToast('🎉 ¡Solicitud enviada para revisión!', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Error submitting property request:', err);
      const msg = err instanceof Error ? err.message : String(err);
      showToast(`Error al enviar: ${msg}`, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-slate-800 antialiased selection:bg-brand-primary/10 selection:text-brand-primary pb-16">

      {/* HEADER PRINCIPAL */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 shrink-0 flex items-center justify-center bg-[#F2ECE1] rounded-2xl border border-[#E2D8C7] overflow-hidden">
              <img src="/logo.png" alt="TuCasita Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline text-xl font-extrabold tracking-tight leading-none">
                <span className="text-brand-primary">Tu</span>
                <span className="text-[#C8976C] relative">
                  Casita
                  <span className="absolute -top-1 right-3.5 text-[8px] text-brand-primary">♥</span>
                </span>
              </div>
              <span className="text-[8px] font-black text-brand-primary tracking-[0.2em] uppercase mt-0.5">
                Publicar Propiedad
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="px-4 py-2 bg-[#F2ECE1] hover:bg-[#E2D8C7] text-brand-primary border border-[#E2D8C7] text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
          >
            🏠 Volver al Inicio
          </Link>
        </div>
      </header>

      {/* RECOVERY MODAL / OVERLAY FOR DRAFTS */}
      {draftRecoveryVisible && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-[#E2D8C7] shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <span className="text-4xl">💾</span>
              <h3 className="text-lg font-black text-[#5A5245] tracking-tight">¡Borrador Detectado!</h3>
              <p className="text-xs text-[#5A5245]/80 font-semibold leading-relaxed">
                Hemos encontrado una solicitud anterior guardada localmente en tu dispositivo. ¿Deseas continuar editando tu borrador o comenzar un formulario nuevo?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-4 py-3 border border-[#E2D8C7] bg-[#FBF9F5] hover:bg-[#F2ECE1] text-[#5A5245] text-xs font-black rounded-xl uppercase tracking-wider transition active:scale-95 cursor-pointer"
              >
                Comenzar Nuevo
              </button>
              <button
                type="button"
                onClick={handleRecoverDraft}
                className="px-4 py-3 bg-linear-to-r from-brand-primary to-emerald-700 text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-md transition hover:opacity-95 active:scale-95 cursor-pointer"
              >
                Continuar Borrador
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTENEDOR CENTRAL */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">

        {submitSuccess ? (
          /* PÁGINA DE ÉXITO */
          <div className="bg-white rounded-3xl p-8 border border-[#E2D8C7] shadow-md text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center text-3xl mx-auto shadow-inner animate-pulse">
              🎉
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-[#5A5245] tracking-tight">
                ¡Solicitud Recibida Correctamente!
              </h2>
              <p className="text-xs text-[#5A5245]/80 font-semibold leading-relaxed max-w-md mx-auto">
                Tu solicitud de publicación ha sido registrada con éxito en el sistema. Ahora pasará a revisión por nuestro equipo administrativo para comprobar los datos.
              </p>
            </div>
            <div className="p-4 bg-[#F2ECE1]/40 border border-[#E2D8C7] rounded-2xl max-w-md mx-auto flex gap-3 items-start text-left">
              <span className="text-lg">🕒</span>
              <p className="text-[11px] text-[#5A5245] leading-relaxed font-semibold">
                La revisión suele completarse en un plazo menor a 24 horas. Recibirás un contacto de verificación mediante el teléfono de contacto/WhatsApp que has proporcionado.
              </p>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="px-6 py-3 border border-[#E2D8C7] text-slate-700 text-xs font-black uppercase rounded-xl hover:bg-[#FBF9F5] transition tracking-widest active:scale-95 cursor-pointer"
              >
                Volver a la Página Principal
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitSuccess(false);
                  setCurrentStep(1);
                  setSelectedFiles([]);
                  setFormData({
                    status: 'sale',
                    property_type: '',
                    title: '',
                    price: '',
                    currency: 'USD',
                    province: 'Camagüey',
                    municipality: '',
                    neighborhood: '',
                    latitude: '',
                    longitude: '',
                    address: '',
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
                    description: '',
                    owner_name: '',
                    contact: '',
                    admin_comment: '',
                  });
                }}
                className="px-6 py-3 bg-linear-to-r from-brand-primary to-emerald-700 text-white text-xs font-black uppercase rounded-xl hover:opacity-95 shadow-md transition tracking-widest active:scale-95 cursor-pointer"
              >
                Publicar otra propiedad
              </button>
            </div>
          </div>
        ) : (
          /* ASISTENTE WIZARD ACTIVO */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2D8C7] shadow-md space-y-8">

            {/* ENCABEZADO DEL STEPPER */}
            <WizardStepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />

            {/* CONTENIDO DINÁMICO DE PASOS */}
            <div className="mt-8">

              {/* PASO 1: ¿QUÉ DESEAS PUBLICAR? */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-[#E8E2D8] pb-4">
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-wider flex items-center gap-2">
                      <span>🏷️</span> ¿Qué deseas publicar?
                    </h3>
                    <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
                      Elige la clasificación principal para la publicación de tu propiedad. Todo el formulario se adaptará según tu elección.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      { value: 'sale', label: '🏷️ Venta', desc: 'Pon en venta tu inmueble con máxima visibilidad.' },
                      { value: 'swap', label: '🔄 Permuta', desc: 'Intercambio directo de propiedades.' },
                      { value: 'long_term', label: '📅 Alquiler Larga Estadía', desc: 'Rentas estables mensuales o de larga estancia.' },
                    ].map((opt) => {
                      const isSelected = formData.status === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleFormChange('status', opt.value as PropertyStatus)}
                          className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-36 transition-all duration-300 group cursor-pointer ${
                            isSelected
                              ? 'border-brand-primary bg-[#F2ECE1]/40 text-brand-primary shadow-xs scale-[0.98]'
                              : 'border-[#E2D8C7] bg-white text-[#5A5245] hover:bg-[#FBF9F5] hover:border-brand-primary/50 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-2xl">{opt.label.split(' ')[0]}</span>
                            <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-[#E2D8C7] bg-white'
                            }`}>
                              {isSelected && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                            </span>
                          </div>
                          <div>
                            <h4 className={`text-xs font-black tracking-tight mt-2 ${isSelected ? 'text-brand-primary' : 'text-[#5A5245]'}`}>
                              {opt.label.substring(opt.label.indexOf(' ') + 1)}
                            </h4>
                            <p className="text-[10px] text-[#5A5245]/60 font-semibold mt-1 leading-snug line-clamp-2">
                              {opt.desc}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* PASO 2: INFORMACIÓN BÁSICA */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-[#E8E2D8] pb-4">
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-wider flex items-center gap-2">
                      <span>✨</span> Información de la Propiedad
                    </h3>
                    <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
                      Elige el tipo de inmueble e ingresa el título comercial y el precio sugerido.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* TIPO DE PROPIEDAD */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
                        Tipo de Propiedad <span className="text-brand-primary">*</span>
                      </label>
                      <select
                        value={formData.property_type}
                        required
                        onChange={(e) => handleFormChange('property_type', e.target.value)}
                        className={`w-full text-xs p-3.5 bg-[#FBF9F5] border rounded-xl text-[#5A5245] font-semibold focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all cursor-pointer ${
                          validationErrors.property_type ? 'border-rose-400' : 'border-[#E2D8C7]'
                        }`}
                      >
                        <option value="">Selecciona una opción</option>
                        {PROPERTY_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      {validationErrors.property_type && (
                        <p className="text-[10px] text-rose-600 font-bold">{validationErrors.property_type}</p>
                      )}
                    </div>

                    {/* TÍTULO DE PUBLICACIÓN */}
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
                        Título de la publicación <span className="text-brand-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Hermosa casa con piscina y jardín en reparto Simoni"
                        value={formData.title}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        className={`w-full text-xs p-3.5 bg-[#FBF9F5] border rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all ${
                          validationErrors.title ? 'border-rose-400' : 'border-[#E2D8C7]'
                        }`}
                      />
                      {validationErrors.title ? (
                        <p className="text-[10px] text-rose-600 font-bold">{validationErrors.title}</p>
                      ) : (
                        <p className="text-[9px] text-[#5A5245]/50 font-bold">Un título descriptivo y atractivo ayuda a captar el interés de los clientes.</p>
                      )}
                    </div>

                    {/* PRECIO Y MONEDA */}
                    <div className="grid grid-cols-3 gap-3 sm:col-span-2">
                      <div className="col-span-2 space-y-1.5">
                        <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
                          Precio Solicitado <span className="text-brand-primary">*</span>
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="Ej. 15000"
                          value={formData.price}
                          onChange={(e) => handleFormChange('price', e.target.value)}
                          className={`w-full text-xs p-3.5 bg-[#FBF9F5] border rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all ${
                            validationErrors.price ? 'border-rose-400' : 'border-[#E2D8C7]'
                          }`}
                        />
                        {validationErrors.price && (
                          <p className="text-[10px] text-rose-600 font-bold">{validationErrors.price}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
                          Moneda
                        </label>
                        <select
                          value={formData.currency}
                          onChange={(e) => handleFormChange('currency', e.target.value)}
                          className="w-full text-xs p-[13.5px] bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-brand-primary font-bold focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all cursor-pointer"
                        >
                          <option value="USD">USD</option>
                          <option value="CUP">CUP</option>
                          <option value="EUR">EUR</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 3: UBICACIÓN REUTILIZADO */}
              {currentStep === 3 && (
                <PropertyLocationCard
                  province={formData.province}
                  municipality={formData.municipality}
                  neighborhood={formData.neighborhood}
                  latitude={formData.latitude}
                  longitude={formData.longitude}
                  onFormChange={handleFormChange}
                  isPublicWizard={true}
                />
              )}

              {/* PASO 4: CARACTERÍSTICAS INTELIGENTE Y CONDICIONAL */}
              {currentStep === 4 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Bloque estructural inteligente */}
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
                    category={formData.status}
                  />
                </div>
              )}

              {/* PASO 5: AMENIDADES REUTILIZADO */}
              {currentStep === 5 && (
                <PropertyAmenitiesCard
                  amenities={formData.amenities}
                  onChange={(newAmenities) => handleFormChange('amenities', newAmenities)}
                />
              )}

              {/* PASO 6: DESCRIPCIÓN Y FOTOS */}
              {currentStep === 6 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  <PropertyDescriptionCard
                    description={formData.description}
                    onFormChange={handleFormChange}
                  />

                  <PropertyGalleryCard
                    existingImages={[]} // Always start with no existing images for a new public submission
                    selectedFiles={selectedFiles}
                    onFileChange={handleFileChange}
                    onRemoveExistingImage={() => {}}
                    onRemoveSelectedFile={handleRemoveSelectedFile}
                  />
                </div>
              )}

              {/* PASO 7: DATOS DE CONTACTO */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="border-b border-[#E8E2D8] pb-4">
                    <h3 className="text-sm font-black text-brand-primary uppercase tracking-wider flex items-center gap-2">
                      <span>📞</span> Información de Contacto
                    </h3>
                    <p className="text-[11px] text-[#5A5245] font-semibold mt-1">
                      Proporciona tus datos para que los interesados puedan contactarte, y agrega notas opcionales para la revisión administrativa.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* NOMBRE DEL PROPIETARIO */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
                        Nombre Completo del Propietario / Solicitante <span className="text-brand-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Juan Pérez"
                        value={formData.owner_name}
                        onChange={(e) => handleFormChange('owner_name', e.target.value)}
                        className={`w-full text-xs p-3.5 bg-[#FBF9F5] border rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all ${
                          validationErrors.owner_name ? 'border-rose-400' : 'border-[#E2D8C7]'
                        }`}
                      />
                      {validationErrors.owner_name && (
                        <p className="text-[10px] text-rose-600 font-bold">{validationErrors.owner_name}</p>
                      )}
                    </div>

                    {/* TELÉFONO DE CONTACTO */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-black text-[#5A5245] uppercase tracking-wider">
                        Teléfono / WhatsApp de Contacto <span className="text-brand-primary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. +53 51234567 o 51234567"
                        value={formData.contact}
                        onChange={(e) => handleFormChange('contact', e.target.value)}
                        className={`w-full text-xs p-3.5 bg-[#FBF9F5] border rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all ${
                          validationErrors.contact ? 'border-rose-400' : 'border-[#E2D8C7]'
                        }`}
                      />
                      {validationErrors.contact && (
                        <p className="text-[10px] text-rose-600 font-bold">{validationErrors.contact}</p>
                      )}
                    </div>

                    {/* COMENTARIO PARA EL ADMINISTRADOR */}
                    <div className="space-y-1.5 sm:col-span-2 pt-2 border-t border-[#E8E2D8]/50">
                      <label className="block text-[11px] font-black text-amber-800 uppercase tracking-wider">
                        Comentario Opcional para el Administrador
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Ej. Solo puedo atender llamadas de tarde. Tengo todos los papeles listos para la permuta."
                        value={formData.admin_comment}
                        onChange={(e) => handleFormChange('admin_comment', e.target.value)}
                        className="w-full text-xs p-4 bg-[#FBF9F5] border border-[#E2D8C7] rounded-xl text-[#5A5245] font-semibold placeholder:text-[#5A5245]/30 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:bg-white transition-all resize-none leading-relaxed"
                      />
                      <p className="text-[10px] text-amber-800/70 font-bold">⚠️ Este comentario es confidencial. No aparecerá de forma pública en tu anuncio.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 8: REVISIÓN DE DETALLES */}
              {currentStep === 8 && (
                <ReviewStep
                  formData={formData}
                  existingImages={[]}
                  selectedFiles={selectedFiles}
                  onGoToStep={(step) => {
                    setCurrentStep(step);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}

            </div>

            {/* BOTONES DE NAVEGACIÓN DEL ASISTENTE */}
            <WizardNavigation
              currentStep={currentStep}
              totalSteps={TOTAL_STEPS}
              onPrev={handlePrev}
              onNext={handleNext}
              isProcessing={isProcessing}
            />

          </div>
        )}

      </div>

      {/* TOAST NOTIFICACIONES */}
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
