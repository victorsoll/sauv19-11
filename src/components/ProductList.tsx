import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Product } from '../types';
import SellProductModal from './SellProductModal';
import { useTranslation } from 'react-i18next';

interface ProductListProps {
  products: Product[];
}

function ProductList({ products }: ProductListProps) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { t } = useTranslation();

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {products.map(product => (
          <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold mb-1">{product.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{product.brand}</p>
              {product.description && (
                <p className="text-sm text-gray-300 mb-3 border-b border-gray-700 pb-3">
                  {product.description}
                </p>
              )}
              <div className="space-y-1 text-sm">
                <p className="text-gray-400">
                  {t('product.purchasePrice')}: <span className="text-white">{Math.round(product.purchasePrice)}€</span>
                </p>
                <p className="text-gray-400">
                  {t('product.purchaseDate')}: <span className="text-white">
                    {format(new Date(product.purchaseDate), 'dd/MM/yyyy', { locale: fr })}
                  </span>
                </p>
                <div className={`inline-block px-2 py-1 rounded-full text-xs ${
                  product.status === 'in_stock' 
                    ? 'bg-green-500/20 text-green-500' 
                    : 'bg-red-500/20 text-red-500'
                }`}>
                  {product.status === 'in_stock' ? t('product.status.inStock') : t('product.status.sold')}
                </div>
                {product.status === 'sold' && (
                  <p className="text-gray-400">
                    {t('product.salePrice')}: <span className="text-white">{Math.round(product.salePrice || 0)}€</span>
                  </p>
                )}
                {product.status === 'in_stock' && (
                  <button
                    onClick={() => setSelectedProductId(product.id)}
                    className="mt-2 w-full bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
                  >
                    {t('product.status.sold')}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <SellProductModal
        isOpen={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
        productId={selectedProductId || ''}
      />
    </>
  );
}

export default ProductList;