import React from 'react';
import { ShoppingBag, Heart, Search, X, Moon, Sun, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Product['category'] | 'all';
  setSelectedCategory: (cat: Product['category'] | 'all') => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  onWishlistClick: () => void;
  wishlistActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  isDarkMode,
  setIsDarkMode,
  onWishlistClick,
  wishlistActive,
}) => {
  const { cartCount, wishlist, setIsCartOpen } = useCart();

  return (
    <header className="navbar-container">
      {/* Top Announcement Bar */}
      <div className="announcement-bar">
        <p>
          <Sparkles size={14} className="announcement-icon" />
          <span>Complimentary worldwide express shipping on all orders over $150</span>
          <span className="announcement-code">CODE: <strong>AURA2026</strong></span>
        </p>
      </div>

      <nav className="navbar">
        <div className="nav-left">
          <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <span className="logo-symbol">◇</span>
            <span className="logo-text">AURA</span>
            <span className="logo-badge">STUDIO</span>
          </a>
        </div>

        {/* Global Search */}
        <div className="nav-center">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search audio, watches, electronics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search catalog"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="nav-right">
          <button
            type="button"
            className={`nav-icon-btn ${isDarkMode ? 'dark' : ''}`}
            onClick={() => setIsDarkMode(!isDarkMode)}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <button
            type="button"
            className={`nav-icon-btn ${wishlistActive ? 'active' : ''}`}
            onClick={onWishlistClick}
            title="Wishlist"
            aria-label="View Wishlist"
          >
            <Heart size={20} fill={wishlist.length > 0 ? 'currentColor' : 'none'} />
            {wishlist.length > 0 && (
              <span className="nav-badge wishlist-badge">{wishlist.length}</span>
            )}
          </button>

          <button
            type="button"
            className="cart-trigger-btn"
            onClick={() => setIsCartOpen(true)}
            aria-label="Open Cart"
          >
            <ShoppingBag size={19} />
            <span className="cart-btn-label">Bag</span>
            <span className="nav-badge cart-badge">{cartCount}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
