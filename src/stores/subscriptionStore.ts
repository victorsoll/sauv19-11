import { create } from 'zustand';

interface Subscription {
  status: 'active' | 'canceled';
  plan: 'premium';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod: {
    brand: string;
    last4: string;
  };
}

interface SubscriptionStore {
  subscription: Subscription;
  cancelSubscription: () => void;
  reactivateSubscription: () => void;
}

export const useSubscriptionStore = create<SubscriptionStore>((set) => ({
  subscription: {
    status: 'active',
    plan: 'premium',
    currentPeriodEnd: '2024-04-15',
    cancelAtPeriodEnd: false,
    paymentMethod: {
      brand: 'visa',
      last4: '4242',
    },
  },
  cancelSubscription: () =>
    set((state) => ({
      subscription: {
        ...state.subscription,
        cancelAtPeriodEnd: true,
      },
    })),
  reactivateSubscription: () =>
    set((state) => ({
      subscription: {
        ...state.subscription,
        cancelAtPeriodEnd: false,
      },
    })),
}));