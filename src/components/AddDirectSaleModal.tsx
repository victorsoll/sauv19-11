import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useProductStore } from '../stores/productStore';
import { uploadImage } from '../utils/upload';
import { v4 as uuidv4 } from 'uuid';

const schema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  brand: z.string().min(1, 'La marque est requise'),
  purchasePrice: z.number().min(0, 'Le prix doit être positif'),
  purchaseDate: z.string(),
  salePrice: z.number().min(0, 'Le prix doit être positif'),
  saleDate: z.string(),
  category: z.enum(['sneakers', 'clothing', 'objects', 'tickets']),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface AddDirectSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddDirectSaleModal({ isOpen, onClose }: AddDirectSaleModalProps) {
  const addProduct = useProductStore(state => state.addProduct);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      purchaseDate: new Date().toISOString().split('T')[0],
      saleDate: new Date().toISOString().split('T')[0],
    }
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

    addProduct({
      ...data,
      id: uuidv4(),
      imageUrl: selectedImage,
      status: 'sold',
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
          <h2 className="text-lg font-semibold">Ajouter une vente directe</h2>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                {...register('name')}
                className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Nom de l'article"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Marque</label>
              <input
                {...register('brand')}
                className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="Marque"
              />
              {errors.brand && (
                <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prix d'achat</label>
              <input
                type="number"
                step="0.01"
                {...register('purchasePrice', { valueAsNumber: true })}
                className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="0.00"
              />
              {errors.purchasePrice && (
                <p className="text-red-500 text-sm mt-1">{errors.purchasePrice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date d'achat</label>
              <input
                type="date"
                {...register('purchaseDate')}
                className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prix de vente</label>
              <input
                type="number"
                step="0.01"
                {...register('salePrice', { valueAsNumber: true })}
                className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
                placeholder="0.00"
              />
              {errors.salePrice && (
                <p className="text-red-500 text-sm mt-1">{errors.salePrice.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date de vente</label>
              <input
                type="date"
                {...register('saleDate')}
                className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select
              {...register('category')}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="sneakers">Sneakers</option>
              <option value="clothing">Vêtements</option>
              <option value="objects">Objets</option>
              <option value="tickets">Billeterie</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              {...register('description')}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              rows={3}
              placeholder="Description de l'article (optionnel)"
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
              'Ajouter la vente'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDirectSaleModal;