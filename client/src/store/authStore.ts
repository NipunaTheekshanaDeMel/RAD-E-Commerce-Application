import { create } from 'zustand';
import { User } from '../types';
import { authApi } from '../services/api';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.login(email, password);
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to login',
        isLoading: false
      });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token } = await authApi.register(name, email, password);
      localStorage.setItem('token', token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to register',
        isLoading: false
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    console.log("Starting auth check, setting isLoading: true");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No token found, setting isAuthenticated: false");
        set({ isAuthenticated: false, user: null, isLoading: false });
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          console.log("Token expired, clearing auth state");
          localStorage.removeItem("token");
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        console.log("Token valid, fetching user data");
        const { user } = await authApi.getCurrentUser();

        if (!user) {
          console.error("No user returned from API");
          set({ isAuthenticated: false, user: null, isLoading: false });
          return;
        }

        console.log("User data received, setting isAuthenticated: true", user);
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        console.error("Error during token validation or user fetch:", error);
        localStorage.removeItem("token");
        set({ isAuthenticated: false, user: null, isLoading: false });
      }
    } catch (error) {
      console.error("Unexpected error during auth check:", error);
      set({ isAuthenticated: false, user: null, isLoading: false });
    }
  }


}));
