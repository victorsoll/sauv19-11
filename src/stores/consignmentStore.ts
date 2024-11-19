import create from 'zustand';
import { supabase } from '../lib/supabase';

interface Consignment {
  id: string;
  itemName: string;
  askingPrice: number;
  commission: number;
  clientName: string;
  clientPhone: string;
  imageUrl: string;
  notes?: string;
  status: 'pending' | 'sold';
  createdAt: string;
  soldAt?: string;
}

interface ConsignmentStore {
  consignments: Consignment[];
  addConsignment: (consignment: Consignment) => Promise<void>;
  markAsSold: (id: string) => Promise<void>;
  fetchConsignments: () => Promise<void>;
}

export const useConsignmentStore = create<ConsignmentStore>((set, get) => ({
  consignments: [],
  
  addConsignment: async (consignment) => {
    const { data, error } = await supabase
      .from('consignments')
      .insert([consignment])
      .select()
      .single();

    if (error) throw error;

    set(state => ({
      consignments: [...state.consignments, data],
    }));
  },

  markAsSold: async (id) => {
    const { error } = await supabase
      .from('consignments')
      .update({ 
        status: 'sold',
        soldAt: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) throw error;

    set(state => ({
      consignments: state.consignments.map(consignment =>
        consignment.id === id
          ? { ...consignment, status: 'sold', soldAt: new Date().toISOString() }
          : consignment
      ),
    }));
  },

  fetchConsignments: async () => {
    const { data, error } = await supabase
      .from('consignments')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;

    set({ consignments: data });
  },
}));