import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  authApi,
  getToken,
  setToken,
  removeToken,
  getStoredUser,
  setStoredUser,
} from '../lib/api';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Al montar, verificar si hay un token guardado
  useEffect(() => {
    const token = getToken();
    if (!token) {
      // Sin token → intentar restaurar user guardado (offline)
      const stored = getStoredUser();
      if (stored) setUser(stored);
      setLoading(false);
      return;
    }

    // Validar token con el backend
    authApi
      .session()
      .then(({ user }) => {
        setUser(user);
        setStoredUser(user);
      })
      .catch(() => {
        // Token inválido → limpiar
        removeToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { token, user } = await authApi.login(email, password);
      setToken(token);
      setStoredUser(user);
      setUser(user);
      return { error: null };
    } catch (err: any) {
      return { error: err.message || 'Error al iniciar sesión' };
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignorar error de logout — siempre limpiar local
    }
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
