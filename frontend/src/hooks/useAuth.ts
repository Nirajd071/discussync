import create from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    email: string;
    name: string;
  };
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email: string, password: string) => {
    // TODO: Implement actual login logic
    set({ isAuthenticated: true, user: { id: '1', email, name: 'User' } });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
})); 