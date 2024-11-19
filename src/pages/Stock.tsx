import React, { useState } from 'react';
import { useProductStore } from '../stores/productStore';
import AddProductModal from '../components/AddProductModal';
import ProductList from '../components/ProductList';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import EmptyState from '../components/EmptyState';
import { Package } from 'lucide-react';

function Stock() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const products = useProductStore(state => state.products);
  const { t } = useTranslation();

  const filteredProducts = products.filter(product => {
    const matchesSearch = (
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || 
      (selectedStatus === 'in_stock' && product.status === 'in_stock') ||
      (selectedStatus === 'sold' && product.status === 'sold');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    { id: 'all', label: t('stock.categories.all') },
    { id: 'sneakers', label: t('stock.categories.sneakers') },
    { id: 'clothing', label: t('stock.categories.clothing') },
    { id: 'objects', label: t('stock.categories.objects') },
    { id: 'tickets', label: t('stock.categories.tickets') },
  ];

  const statuses = [
    { id: 'all', label: t('stock.filters.all') },
    { id: 'in_stock', label: t('stock.filters.inStock') },
    { id: 'sold', label: t('stock.filters.sold') },
  ];

  return (
    <div className="pt-6 pb-20">
      <PageHeader 
        title={t('stock.title')} 
        onAdd={() => setIsModalOpen(true)} 
      />

      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t('stock.searchPlaceholder')}
        />

        <FilterTabs
          tabs={statuses}
          selectedTab={selectedStatus}
          onChange={setSelectedStatus}
        />

        <FilterTabs
          tabs={categories}
          selectedTab={selectedCategory}
          onChange={setSelectedCategory}
        />

        {filteredProducts.length > 0 ? (
          <ProductList products={filteredProducts} />
        ) : (
          <EmptyState
            title="Aucun article trouvé"
            description="Ajoutez des articles à votre stock ou modifiez vos filtres"
            icon={<Package className="h-12 w-12" />}
          />
        )}
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Stock;