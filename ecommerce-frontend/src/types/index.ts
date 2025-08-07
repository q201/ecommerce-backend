// User Types
export interface User {
  id: string;
  email: string;
  username?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  dateOfBirth?: Date;
  gender?: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  SELLER = 'seller',
}

// Product Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  currency: string;
  sku: string;
  stock: number;
  isActive: boolean;
  brand?: string;
  category: Category;
  images: ProductImage[];
  reviews: Review[];
  variants: Variant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  image?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Variant {
  id: string;
  name: string;
  value: string;
  price?: number;
  stock?: number;
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  comment: string;
  user: User;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

// Order Types
export interface Order {
  id: string;
  status: OrderStatus;
  currency_code?: string;
  email?: string;
  billing_address_id?: string;
  shipping_address_id?: string;
  payment_status?: string;
  fulfillment_status?: string;
  discount_total?: number;
  shipping_total?: number;
  tax_total?: number;
  total?: number;
  created_at: Date;
  updated_at: Date;
  items: OrderItem[];
  billing_address?: OrderAddress;
  shipping_address?: OrderAddress;
  user?: User;
  customer?: User;
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface OrderAddress {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// Cart Types
export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  variant?: Variant;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Address Types
export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
  type: 'billing' | 'shipping';
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Additional utility types
export type CreateProductData = Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProductData = Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>;
export type CreateAddressData = Omit<Address, 'id'>;
export type UpdateAddressData = Partial<Omit<Address, 'id'>>;

// Notification Types
export interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'security';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  actionText?: string;
}