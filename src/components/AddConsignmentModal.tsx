{/* Même mise à jour que pour AddProductModal avec la gestion des photos */}
import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useConsignmentStore } from '../stores/consignmentStore';
import { uploadImage } from '../utils/upload';
import { v4 as uuidv4 } from 'uuid';

const schema = z.object({
  itemName: z.string().min(1, 'Le nom est requis'),
  askingPrice: z.number().min(0, 'Le prix doit être positif'),
  commission: z.number().min(0).max(100, 'La commission doit être entre 0 et 100'),
  clientName: z.string().min(1, 'Le nom du client est requis'),
  clientPhone: z.string().min(1, 'Le téléphone est requis'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddConsignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddConsignmentModal({ isOpen, onClose }: AddConsignmentModalProps) {
  const addConsignment = useConsignmentStore(state => state.addConsignment);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      commission: 20,
    },
  });

  if (!isOpen) return null;

  const handleImageSelect = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      const publicUrl = await uploadImage(file);
      setSelectedImage(publicUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedImage) {
      setUploadError('Veuillez sélectionner une image');
      return;
    }

    addConsignment({
      ...data,
      id: uuidv4(),
      imageUrl: selectedImage,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

    setSelectedImage(null);
    setUploadError(null);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 sticky top-0 bg-gray-800">
          <h2 className="text-lg font-semibold">Ajouter une consignation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div className="space-y-4">
            {selectedImage ? (
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-red-500 p-1 rounded-full hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <Camera className="h-8 w-8" />
                  )}
                  <span>Prendre une photo</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <ImageIcon className="h-8 w-8" />
                  )}
                  <span>Galerie</span>
                </button>
              </div>
            )}

            {uploadError && (
              <p className="text-red-500 text-sm mt-1 bg-red-500/10 p-2 rounded">
                {uploadError}
              </p>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />
            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nom de l'article</label>
            <input
              {...register('itemName')}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            {errors.itemName && (
              <p className="text-red-500 text-sm mt-1">{errors.itemName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prix demandé</label>
            <input
              type="number"
              step="0.01"
              {...register('askingPrice', { valueAsNumber: true })}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            {errors.askingPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.askingPrice.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Commission (%)</label>
            <input
              type="number"
              {...register('commission', { valueAsNumber: true })}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            {errors.commission && (
              <p className="text-red-500 text-sm mt-1">{errors.commission.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nom du client</label>
            <input
              {...register('clientName')}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            {errors.clientName && (
              <p className="text-red-500 text-sm mt-1">{errors.clientName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone du client</label>
            <input
              {...register('clientPhone')}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
            {errors.clientPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.clientPhone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <textarea
              {...register('notes')}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              rows={3}
            />
          </div>

          <button
            type="submit"
            disabled={isUploading}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Upload en cours...
              </span>
            ) : (
              'Ajouter'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddConsignmentModal;