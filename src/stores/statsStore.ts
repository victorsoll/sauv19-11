import create from 'zustand';

interface Stats {
  profit: number;
  totalPurchases: number;
  revenue: number;
  averageMargin: number;
  target: number;
  gains: number;
  expenses: number;
  sneakersProfit: number;
  objectsProfit: number;
  clothingProfit: number;
  ticketsProfit: number;
  totalSalary: number;
}

interface StatsStore {
  stats: Stats;
  setStats: (stats: Partial<Stats>) => void;
}

export const useStatsStore = create<StatsStore>((set) => ({
  stats: {
    profit: 659,
    totalPurchases: 577,
    revenue: 1483,
    averageMargin: 44,
    target: 41,
    gains: 0,
    expenses: 0,
    sneakersProfit: 0,
    objectsProfit: 0,
    clothingProfit: 659,
    ticketsProfit: 0,
    totalSalary: 0,
  },
  setStats: (newStats) =>
    set((state) => ({
      stats: { ...state.stats, ...newStats },
    })),
}));