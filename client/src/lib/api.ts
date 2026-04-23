/**
 * Cliente HTTP para la API de Natalia Boutique.
 * Reemplaza todas las llamadas a Supabase.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const TOKEN_KEY = 'natalia_auth_token';
const USER_KEY = 'natalia_auth_user';

// ── Token Management ────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): { id: string; email: string; role: string } | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: { id: string; email: string; role: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// ── HTTP Client ─────────────────────────────────────────

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
}

async function request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {}, auth = false } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (auth) {
    const token = getToken();
    if (token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  if (body) {
    config.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, config);

  if (!res.ok) {
    const data = await res.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(data.error || `Error ${res.status}`);
  }

  return res.json();
}

// ── Auth API ────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; role: string } }>(
      '/auth/login',
      { method: 'POST', body: { email, password } }
    ),

  session: () =>
    request<{ user: { id: string; email: string; role: string } }>(
      '/auth/session',
      { auth: true }
    ),

  logout: () =>
    request<{ message: string }>('/auth/logout', { method: 'POST', auth: true }),
};

// ── Categories API ──────────────────────────────────────

export const categoriesApi = {
  list: () =>
    request<Category[]>('/categories'),

  create: (data: Omit<Category, 'id' | 'created_at'>) =>
    request<Category>('/categories', { method: 'POST', body: data, auth: true }),

  update: (id: string, data: Partial<Category>) =>
    request<Category>(`/categories/${id}`, { method: 'PUT', body: data, auth: true }),

  delete: (id: string) =>
    request<{ message: string }>(`/categories/${id}`, { method: 'DELETE', auth: true }),
};

// ── Brands API ──────────────────────────────────────────

export const brandsApi = {
  list: () =>
    request<Brand[]>('/brands'),

  listAll: () =>
    request<Brand[]>('/brands/all', { auth: true }),

  getBySlug: (slug: string) =>
    request<Brand>(`/brands/${slug}`),

  create: (data: Omit<Brand, 'id' | 'created_at'>) =>
    request<Brand>('/brands', { method: 'POST', body: data, auth: true }),

  update: (id: string, data: Partial<Brand>) =>
    request<Brand>(`/brands/${id}`, { method: 'PUT', body: data, auth: true }),

  toggle: (id: string) =>
    request<Brand>(`/brands/${id}/toggle`, { method: 'PATCH', auth: true }),

  delete: (id: string) =>
    request<{ message: string }>(`/brands/${id}`, { method: 'DELETE', auth: true }),
};

// ── Products API ────────────────────────────────────────

export const productsApi = {
  list: (brandId?: string) =>
    request<Product[]>(`/products${brandId ? `?brand_id=${brandId}` : ''}`),

  listAll: (brandId?: string) =>
    request<Product[]>(`/products/all${brandId ? `?brand_id=${brandId}` : ''}`, { auth: true }),

  create: (data: Omit<Product, 'id' | 'created_at'>) =>
    request<Product>('/products', { method: 'POST', body: data, auth: true }),

  update: (id: string, data: Partial<Product>) =>
    request<Product>(`/products/${id}`, { method: 'PUT', body: data, auth: true }),

  toggle: (id: string) =>
    request<Product>(`/products/${id}/toggle`, { method: 'PATCH', auth: true }),

  bulkPrice: (brandId: string, price: number) =>
    request<{ message: string }>('/products/bulk-price', {
      method: 'PATCH',
      body: { brand_id: brandId, price },
      auth: true,
    }),

  delete: (id: string) =>
    request<{ message: string }>(`/products/${id}`, { method: 'DELETE', auth: true }),
};

// ── Upload API ──────────────────────────────────────────

export const uploadApi = {
  image: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const token = getToken();
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData, // No se pone Content-Type, el browser lo genera con boundary
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: 'Error al subir imagen' }));
      throw new Error(data.error || 'Error al subir imagen');
    }

    const data = await res.json();
    return data.url;
  },
};

// ── Re-export types for convenience ─────────────────────
import type { Category, Brand, Product } from '../types';
