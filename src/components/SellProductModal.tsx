import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useProductStore } from '../stores/productStore';

const schema = z.object({
  salePrice: z.number().min(0, 'Le prix doit être positif'),
  saleDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface SellProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

function SellProductModal({ isOpen, onClose, productId }: SellProductModalProps) {
  const markAsSold = useProductStore(state => state.markAsSold);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      saleDate: new Date().toISOString().split('T')[0],
    }
  });

  if (!isOpen) return null;

  const onSubmit = (data: FormData) => {
    markAsSold(productId, data.salePrice, data.saleDate || new Date().toISOString());
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Marquer comme vendu</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
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
            <label className="block text-sm font-medium mb-1">Date de vente (optionnel)</label>
            <input
              type="date"
              {...register('saleDate')}
              className="w-full bg-gray-700 rounded-lg p-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
          >
            Confirmer la vente
          </button>
        </form>
      </div>
    </div>
  );
}

export default SellProductModal;