import React, { useState } from 'react';
import { useProductStore } from '../stores/productStore';
import { useTranslation } from 'react-i18next';
import MonthYearPicker from '../components/MonthYearPicker';
import StatsCard from '../components/StatsCard';
import { DollarSign, TrendingUp, ShoppingCart, Percent, Target } from 'lucide-react';

function Dashboard() {
  const products = useProductStore(state => state.products);
  const { t } = useTranslation();
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Filtrer les produits en fonction du mois et de l'année sélectionnés
  const filteredProducts = products.filter(product => {
    if (!selectedMonth && !selectedYear) return true;
    const productDate = new Date(product.status === 'sold' ? product.saleDate! : product.purchaseDate);
    const monthMatch = !selectedMonth || months[productDate.getMonth()] === selectedMonth;
    const yearMatch = productDate.getFullYear() === selectedYear;
    return monthMatch && yearMatch;
  });

  // Calcul des statistiques avec les produits filtrés
  const soldProducts = filteredProducts.filter(product => product.status === 'sold');
  const totalSales = Math.round(soldProducts.reduce((sum, product) => sum + (product.salePrice || 0), 0));
  const totalPurchases = Math.round(filteredProducts.reduce((sum, product) => sum + product.purchasePrice, 0));
  const profit = totalSales - totalPurchases;
  const averageMargin = totalPurchases > 0 
    ? Math.round((profit / totalPurchases) * 100) 
    : 0;

  // Calcul des bénéfices par catégorie
  const profitByCategory = soldProducts.reduce((acc, product) => {
    const profit = Math.round((product.salePrice || 0) - product.purchasePrice);
    acc[product.category] = Math.round((acc[product.category] || 0) + profit);
    return acc;
  }, {} as Record<string, number>);

  const target = 1000;
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  return (
    <div className="pt-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">{t('dashboard.title')}</h1>
      
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

      <div className="grid grid-cols-2 gap-4">
        <StatsCard
          title={t('dashboard.stats.profit')}
          value={`${profit}€`}
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatsCard
          title={t('dashboard.stats.totalPurchases')}
          value={`${totalPurchases}€`}
          icon={<ShoppingCart className="h-6 w-6" />}
        />
        <StatsCard
          title={t('dashboard.stats.revenue')}
          value={`${totalSales}€`}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatsCard
          title={t('dashboard.stats.averageMargin')}
          value={`${averageMargin}%`}
          icon={<Percent className="h-6 w-6" />}
        />
      </div>

      <div className="bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('dashboard.target')} ({target}€)
          </h3>
          <span className="text-sm text-gray-400">{Math.round((profit / target) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div 
            className="h-full bg-red-500 rounded-full transition-all duration-500"
            style={{ width: `${Math.min((profit / target) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('dashboard.details')}:</h3>
        {[
          { label: t('dashboard.financial.gains'), value: totalSales },
          { label: t('dashboard.financial.expenses'), value: totalPurchases },
          { label: t('dashboard.categories.sneakers'), value: profitByCategory.sneakers || 0 },
          { label: t('dashboard.categories.objects'), value: profitByCategory.objects || 0 },
          { label: t('dashboard.categories.clothing'), value: profitByCategory.clothing || 0 },
          { label: t('dashboard.categories.tickets'), value: profitByCategory.tickets || 0 },
        ].map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700/80 transition-colors">
            <span className="text-gray-400">{label}</span>
            <span className="font-medium">{value}€</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;