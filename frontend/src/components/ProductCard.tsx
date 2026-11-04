import React from 'react';
import type { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Star, Heart, Eye, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isWishlisted, setActiveProduct } = useCart();
  const wishlisted = isWishlisted(product.id);

  const handleCardClick = () => {
    setActiveProduct(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article className="product-card" onClick={handleCardClick}>
      <div className="product-image-container">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="product-badges">
          {product.discountPercentage && (
            <span className="badge badge-discount">-{product.discountPercentage}%</span>
          )}
          {product.isTrending && (
            <span className="badge badge-trending">Trending</span>
          )}
          {product.stockCount <= 15 && product.stockCount > 0 && (
            <span className="badge badge-low-stock">Low Stock</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          className={`wishlist-btn ${wishlisted ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-label="Wishlist toggle"
        >
          <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>

        {/* Quick View Overlay on Hover */}
        <div className="image-overlay">
          <button
            type="button"
            className="quick-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              setActiveProduct(product);
            }}
          >
            <Eye size={16} />
            <span>Quick Specs</span>
          </button>
        </div>
      </div>

      <div className="product-info">
        <div className="product-brand-row">
          <span className="product-brand">{product.brand}</span>
          <div className="product-rating">
            <Star size={13} className="star-icon" fill="currentColor" />
            <span className="rating-value">{product.rating}</span>
            <span className="reviews-count">({product.reviewsCount})</span>
          </div>
        </div>

        <h3 className="product-title">{product.title}</h3>

        <p className="product-desc-snippet">{product.description}</p>

        <div className="product-footer">
          <div className="product-pricing">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <button
            type="button"
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to bag`}
          >
            <Plus size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </article>
  );
};
