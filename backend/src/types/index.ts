export type ProductCategory =
  | 'electronics'
  | 'audio'
  | 'watches'
  | 'apparel'
  | 'lifestyle'
  | 'accessories';

export interface Product {
  id: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviewsCount: number;
  category: ProductCategory;
  image: string;
  images?: string[];
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  tags: string[];
  specs?: Record<string, string>;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: ProductCategory | 'all';
  icon: string;
  count: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  customerName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CreateOrderDTO {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  customerName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
