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
  category: 'electronics' | 'audio' | 'watches' | 'apparel' | 'lifestyle' | 'accessories';
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
  slug: Product['category'] | 'all';
  icon: string;
  count: number;
}

export interface FilterState {
  category: Product['category'] | 'all';
  searchQuery: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';
  inStockOnly: boolean;
  maxPrice: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
}

export interface OrderDetails {
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
  createdAt: string;
}
