import axios from 'axios';
import { 
  User, 
  Product, 
  Order, 
  Cart, 
  Address, 
  Category,
  Review,
  Notification,
  LoginCredentials, 
  RegisterData, 
  AuthResponse,
  ApiResponse,
  PaginatedResponse,
  CreateProductData,
  UpdateProductData,
  CreateAddressData,
  UpdateAddressData
} from '../types';

class ApiService {
  private api: any;
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
      (config: any) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
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
    const response: any = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response: any = await this.api.post('/auth/register', userData);
    return response.data;
  }

  // User endpoints
  async getCurrentUser(): Promise<User> {
    const response: any = await this.api.get('/users/profile');
    return response.data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const response: any = await this.api.patch(`/users/${id}`, userData);
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
    const response: any = await this.api.get('/products', { params });
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response: any = await this.api.get(`/products/${id}`);
    return response.data;
  }

  async getProductBySlug(slug: string): Promise<Product> {
    const response: any = await this.api.get(`/products/slug/${slug}`);
    return response.data;
  }

  // Cart endpoints
  async getCart(): Promise<Cart> {
    const response: any = await this.api.get('/cart');
    return response.data;
  }

  async addToCart(productId: string, quantity: number, variantId?: string): Promise<Cart> {
    const response: any = await this.api.post('/cart/items', {
      productId,
      quantity,
      variantId,
    });
    return response.data;
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    const response: any = await this.api.patch(`/cart/items/${itemId}`, { quantity });
    return response.data;
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    const response: any = await this.api.delete(`/cart/items/${itemId}`);
    return response.data;
  }

  // Order endpoints
  async createOrder(orderData: {
    items: Array<{ productId: string; quantity: number; variantId?: string }>;
    billingAddressId: string;
    shippingAddressId: string;
    paymentMethod: string;
  }): Promise<Order> {
    const response: any = await this.api.post('/orders', orderData);
    return response.data;
  }

  async getOrders(): Promise<Order[]> {
    const response: any = await this.api.get('/orders');
    return response.data;
  }

  async getOrder(id: string): Promise<Order> {
    const response: any = await this.api.get(`/orders/${id}`);
    return response.data;
  }

  // Address endpoints
  async getAddresses(): Promise<Address[]> {
    const response: any = await this.api.get('/address');
    return response.data;
  }

  async createAddress(addressData: CreateAddressData): Promise<Address> {
    const response: any = await this.api.post('/address', addressData);
    return response.data;
  }

  async updateAddress(id: string, addressData: UpdateAddressData): Promise<Address> {
    const response: any = await this.api.patch(`/address/${id}`, addressData);
    return response.data;
  }

  async deleteAddress(id: string): Promise<void> {
    await this.api.delete(`/address/${id}`);
  }

  // Search endpoints
  async searchProducts(query: string): Promise<Product[]> {
    const response: any = await this.api.get(`/search?q=${encodeURIComponent(query)}`);
    return response.data;
  }

  // Wishlist endpoints
  async getWishlist(): Promise<Product[]> {
    const response: any = await this.api.get('/wishlist');
    return response.data;
  }

  async addToWishlist(productId: string): Promise<void> {
    await this.api.post('/wishlist', { productId });
  }

  async removeFromWishlist(productId: string): Promise<void> {
    await this.api.delete(`/wishlist/${productId}`);
  }

  // Review endpoints
  async getUserReviews(): Promise<Review[]> {
    const response: any = await this.api.get('/reviews/user');
    return response.data;
  }

  async updateReview(reviewId: string, reviewData: { rating: number; title: string; comment: string }): Promise<Review> {
    const response: any = await this.api.patch(`/reviews/${reviewId}`, reviewData);
    return response.data;
  }

  async deleteReview(reviewId: string): Promise<void> {
    await this.api.delete(`/reviews/${reviewId}`);
  }

  // Password change endpoint
  async changePassword(passwordData: { currentPassword: string; newPassword: string }): Promise<void> {
    await this.api.post('/auth/change-password', passwordData);
  }

  // Admin endpoints
  async getAllUsers(): Promise<User[]> {
    const response: any = await this.api.get('/users');
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await this.api.delete(`/users/${userId}`);
  }

  async getAllOrders(): Promise<Order[]> {
    const response: any = await this.api.get('/orders/all');
    return response.data;
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const response: any = await this.api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    const response: any = await this.api.post('/products', productData);
    return response.data;
  }

  async updateProduct(productId: string, productData: UpdateProductData): Promise<Product> {
    const response: any = await this.api.patch(`/products/${productId}`, productData);
    return response.data;
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.api.delete(`/products/${productId}`);
  }

  async getCategories(): Promise<Category[]> {
    const response: any = await this.api.get('/categories');
    return response.data;
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    const response: any = await this.api.get(`/categories/slug/${slug}`);
    return response.data;
  }

  // Notification endpoints
  async getNotifications(): Promise<Notification[]> {
    const response: any = await this.api.get('/notifications');
    return response.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await this.api.patch(`/notifications/${notificationId}/read`);
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.api.patch('/notifications/read-all');
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await this.api.delete(`/notifications/${notificationId}`);
  }

  async clearAllNotifications(): Promise<void> {
    await this.api.delete('/notifications');
  }
}

export const apiService = new ApiService();
export default apiService;