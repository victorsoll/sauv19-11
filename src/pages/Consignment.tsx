import React, { useState } from 'react';
import { Plus, Search, Trash2, Check, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AddOrderModal from '../components/AddOrderModal';
import { useOrderStore } from '../stores/orderStore';
import { useProductStore } from '../stores/productStore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();
  const { orders, updateOrderStatus, deleteOrder } = useOrderStore();
  const addProduct = useProductStore(state => state.addProduct);

  const filteredOrders = orders.filter(order =>
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleReceived = (order: any) => {
    // Créer un nouveau produit à partir de la commande
    const newProduct = {
      id: order.id,
      name: order.name,
      brand: order.brand,
      purchasePrice: order.purchasePrice,
      purchaseDate: order.purchaseDate,
      imageUrl: order.imageUrl,
      category: order.category,
      description: order.description,
      status: 'in_stock'
    };

    // Ajouter au stock
    addProduct(newProduct);
    
    // Supprimer de la liste des commandes
    deleteOrder(order.id);
  };

  return (
    <div className="pt-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('nav.consignment')}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-500 p-2 rounded-full"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder={t('stock.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="flex gap-4 p-4">
                <img
                  src={order.imageUrl}
                  alt={order.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{order.name}</h3>
                      <p className="text-sm text-gray-400">{order.brand}</p>
                    </div>
                    <div className="flex gap-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'ordered')}
                          className="p-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30"
                          title="Marquer comme commandé"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                      )}
                      {order.status === 'ordered' && (
                        <button
                          onClick={() => handleReceived(order)}
                          className="p-2 bg-blue-500/20 text-blue-500 rounded-lg hover:bg-blue-500/30"
                          title="Marquer comme reçu"
                        >
                          <Package className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30"
                        title="Supprimer"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-400">
                      Prix d'achat: <span className="text-white">{Math.round(order.purchasePrice)}€</span>
                    </p>
                    <p className="text-gray-400">
                      Date: <span className="text-white">
                        {format(new Date(order.purchaseDate), 'dd/MM/yyyy', { locale: fr })}
                      </span>
                    </p>
                    <p className="text-gray-400">
                      Statut: <span className={`${
                        order.status === 'ordered' 
                          ? 'text-green-500' 
                          : 'text-yellow-500'
                      }`}>
                        {order.status === 'ordered' ? 'Commandé' : 'En attente'}
                      </span>
                    </p>
                    <p className="text-gray-400">
                      Catégorie: <span className="text-white">
                        {t(`stock.categories.${order.category}`)}
                      </span>
                    </p>
                  </div>

                  {order.description && (
                    <p className="mt-2 text-sm text-gray-300">{order.description}</p>
                  )}

                  {(order.sellerName || order.sellerPhone || order.sellerEmail) && (
                    <div className="mt-2 pt-2 border-t border-gray-700 text-sm">
                      <h4 className="font-medium mb-1">Informations vendeur:</h4>
                      {order.sellerName && (
                        <p className="text-gray-400">
                          Nom: <span className="text-white">{order.sellerName}</span>
                        </p>
                      )}
                      {order.sellerPhone && (
                        <p className="text-gray-400">
                          Téléphone: <span className="text-white">{order.sellerPhone}</span>
                        </p>
                      )}
                      {order.sellerEmail && (
                        <p className="text-gray-400">
                          Email: <span className="text-white">{order.sellerEmail}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              Aucune commande trouvée
            </div>
          )}
        </div>
      </div>

      <AddOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Orders;