import React, { useState } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useProductStore } from '../stores/productStore';
import AddDirectSaleModal from '../components/AddDirectSaleModal';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/PageHeader';
import MonthYearPicker from '../components/MonthYearPicker';
import StatsCard from '../components/StatsCard';
import EmptyState from '../components/EmptyState';
import { DollarSign, TrendingUp, ShoppingCart, Percent } from 'lucide-react';

function Sales() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const products = useProductStore(state => state.products);
  const { t } = useTranslation();

  // Filtrer les produits vendus pour le mois sélectionné
  const soldProducts = products.filter(product => {
    if (product.status !== 'sold' || !product.saleDate) return false;
    const saleDate = new Date(product.saleDate);
    const monthMatch = !selectedMonth || months[saleDate.getMonth()] === selectedMonth;
    const yearMatch = saleDate.getFullYear() === selectedYear;
    return monthMatch && yearMatch;
  });

  // Calcul des statistiques
  const totalSales = Math.round(soldProducts.reduce((sum, product) => sum + (product.salePrice || 0), 0));
  const totalPurchases = Math.round(soldProducts.reduce((sum, product) => sum + product.purchasePrice, 0));
  const profit = totalSales - totalPurchases;
  const averageMargin = totalPurchases > 0 
    ? Math.round((profit / totalPurchases) * 100) 
    : 0;

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div className="pt-6 pb-20">
      <PageHeader 
        title={t('nav.sales')} 
        onAdd={() => setIsModalOpen(true)} 
      />

      <MonthYearPicker
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onReset={() => {
          setSelectedMonth(null);
          setSelectedYear(new Date().getFullYear());
        }}
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatsCard
          title="Bénéfice"
          value={`${profit}€`}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatsCard
          title="Total achats"
          value={`${totalPurchases}€`}
          icon={<ShoppingCart className="h-6 w-6" />}
        />
        <StatsCard
          title="Total ventes (CA)"
          value={`${totalSales}€`}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatsCard
          title="Marge moyenne"
          value={`${averageMargin}%`}
          icon={<Percent className="h-6 w-6" />}
        />
      </div>

      <div className="space-y-4">
        {soldProducts.length > 0 ? (
          soldProducts.map(product => (
            <div key={product.id} className="bg-gray-800 rounded-lg p-4">
              <div className="flex gap-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p className="text-gray-400">
                      Prix d'achat: <span className="text-white">{Math.round(product.purchasePrice)}€</span>
                    </p>
                    <p className="text-gray-400">
                      Prix de vente: <span className="text-white">{Math.round(product.salePrice || 0)}€</span>
                    </p>
                    <p className="text-gray-400">
                      Bénéfice: <span className="text-green-500">
                        {Math.round((product.salePrice || 0) - product.purchasePrice)}€
                      </span>
                    </p>
                    <p className="text-gray-400">
                      Date de vente: <span className="text-white">
                        {format(new Date(product.saleDate!), 'dd/MM/yyyy', { locale: fr })}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            title="Aucune vente"
            description="Aucune vente n'a été enregistrée pour cette période"
            icon={<DollarSign className="h-12 w-12" />}
          />
        )}
      </div>

      <AddDirectSaleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Sales;