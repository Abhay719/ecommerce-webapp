import { useState, useEffect, useMemo } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ToastContainer } from './components/ToastContainer';
import { Footer } from './components/Footer';
import { apiService } from './services/api';
import type { Product } from './types';
import { useCart } from './context/CartContext';
import { Heart, SearchX, RotateCcw } from 'lucide-react';
import './index.css';

function EcommerceStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Product['category'] | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating-desc'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [wishlistActive, setWishlistActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('aura_theme') !== 'light';
  });

  const { wishlist } = useCart();

  useEffect(() => {
    localStorage.setItem('aura_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark-theme');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
      document.documentElement.classList.remove('dark-theme');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setIsLoading(true);
      const data = await apiService.getProducts();
      setProducts(data);
      setIsLoading(false);
    };
    fetchCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // In stock only
        if (inStockOnly && !p.inStock) {
          return false;
        }
        // Wishlist view only
        if (wishlistActive && !wishlist.includes(p.id)) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitle || matchBrand || matchDesc || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        // Default featured
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [products, selectedCategory, inStockOnly, wishlistActive, wishlist, searchQuery, sortBy]);

  const scrollToCatalog = () => {
    const el = document.getElementById('products-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setInStockOnly(false);
    setWishlistActive(false);
    setSortBy('featured');
  };

  return (
    <div className="store-layout">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        onWishlistClick={() => setWishlistActive(!wishlistActive)}
        wishlistActive={wishlistActive}
      />

      <main className="main-content">
        {!wishlistActive && !searchQuery && (
          <HeroBanner onShopClick={scrollToCatalog} />
        )}

        {/* Wishlist Active Bar */}
        {wishlistActive && (
          <div className="wishlist-banner-notice">
            <div className="wishlist-notice-content">
              <Heart size={20} fill="currentColor" />
              <span>Viewing your saved wishlist ({wishlist.length} items)</span>
            </div>
            <button
              type="button"
              className="btn-text-underline"
              onClick={() => setWishlistActive(false)}
            >
              View Full Collection
            </button>
          </div>
        )}

        <div className="catalog-container">
          <CategoryFilter
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              setWishlistActive(false);
            }}
            sortBy={sortBy}
            onSortChange={setSortBy}
            inStockOnly={inStockOnly}
            onToggleInStock={() => setInStockOnly(!inStockOnly)}
            productsCount={filteredProducts.length}
            totalProductsCount={products.length}
          />

          {isLoading ? (
            <div className="catalog-loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-product-card">
                  <div className="skeleton-box skeleton-img"></div>
                  <div className="skeleton-box skeleton-line-title"></div>
                  <div className="skeleton-box skeleton-line-desc"></div>
                  <div className="skeleton-box skeleton-line-price"></div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-catalog-box">
              <SearchX size={48} className="empty-icon" />
              <h3>No matching products found</h3>
              <p>
                {wishlistActive
                  ? "You haven't saved any products to your wishlist yet. Click the heart icon on any product to save it here."
                  : "We couldn't find any products matching your current filters and search query."}
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={handleResetFilters}
              >
                <RotateCcw size={16} />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <ProductModal />
      <CheckoutModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <EcommerceStore />
    </CartProvider>
  );
}
