import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthStore {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: true, // Temporairement à true pour le développement
  user: null,
  login: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      set({ isAuthenticated: true, user: data.user });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  },
  logout: async () => {
    try {
      await supabase.auth.signOut();
      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  },
}));