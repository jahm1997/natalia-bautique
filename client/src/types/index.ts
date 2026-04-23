export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sort_order: number;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  category_id: string | null;
  cover_image: string;
  description: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  category?: Category;
}

export interface Product {
  id: string;
  brand_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  brand?: Brand;
}

export interface CartItem {
  product: Product;
  brand: Brand;
  quantity: number;
}

export type AppPage = 'landing' | 'catalog' | 'brand' | 'admin';
