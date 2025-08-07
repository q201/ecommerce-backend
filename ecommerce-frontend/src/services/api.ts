import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  User, 
  Product, 
  Order, 
  Cart, 
  Address, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  ApiResponse,
  PaginatedResponse 
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL = 'http://localhost:3000'; // Your NestJS backend URL

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await this.api.get('/users/profile');
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response: AxiosResponse<User> = await this.api.patch(`/users/${id}`, userData);
    return response.data;
  }

  // Product endpoints
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<PaginatedResponse<Product>> {
    const response: AxiosResponse<PaginatedResponse<Product>> = await this.api.get('/products', { params });
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const response: AxiosResponse<Product> = await this.api.get(`/products/slug/${slug}`);
    return response.data;
  }

  // Cart endpoints
  async getCart(): Promise<Cart> {
    const response: AxiosResponse<Cart> = await this.api.get('/cart');
    return response.data;
  }

  async addToCart(productId: string, quantity: number, variantId?: string): Promise<Cart> {
    const response: AxiosResponse<Cart> = await this.api.post('/cart/items', {
      productId,
      quantity,
      variantId,
    });
    return response.data;
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const response: AxiosResponse<Cart> = await this.api.patch(`/cart/items/${itemId}`, { quantity });
    return response.data;
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    const response: AxiosResponse<Cart> = await this.api.delete(`/cart/items/${itemId}`);
    return response.data;
  }

  // Order endpoints
  async createOrder(orderData: {
    items: Array<{ productId: string; quantity: number; variantId?: string }>;
    billingAddressId: string;
    shippingAddressId: string;
    paymentMethod: string;
  }): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.post('/orders', orderData);
    return response.data;
  }

  async getOrders(): Promise<Order[]> {
    const response: AxiosResponse<Order[]> = await this.api.get('/orders');
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response: AxiosResponse<Order> = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  // Address endpoints
  async getAddresses(): Promise<Address[]> {
    const response: AxiosResponse<Address[]> = await this.api.get('/address');
    return response.data;
  }

  async createAddress(addressData: Omit<Address, 'id'>): Promise<Address> {
    const response: AxiosResponse<Address> = await this.api.post('/address', addressData);
    return response.data;
  }

  async updateAddress(id: string, addressData: Partial<Address>): Promise<Address> {
    const response: AxiosResponse<Address> = await this.api.patch(`/address/${id}`, addressData);
    return response.data;
  }

  async deleteAddress(id: string): Promise<void> {
    await this.api.delete(`/address/${id}`);
  }

  // Search endpoints
  async searchProducts(query: string): Promise<Product[]> {
    const response: AxiosResponse<Product[]> = await this.api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }
}

export const apiService = new ApiService();
export default apiService;