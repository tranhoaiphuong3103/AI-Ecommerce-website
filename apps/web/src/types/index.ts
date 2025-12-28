export interface User {
  id: string;
  name: string | null;
  email: string;
}

export interface UserMeasurements {
  height: number;
  weight: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  photoUrl?: string;
  skinTone?: string;
  hairColor?: string;
  gender?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  order: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string | null;
  sku: string;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: Category;
  images: ProductImage[];
  variants: ProductVariant[];
}

export interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: ProductImage[];
  badge?: 'AI Ready' | 'Trending' | 'New';
}
