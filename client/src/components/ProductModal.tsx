import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Star, Shield, Truck, RotateCcw, Plus, Minus, ShoppingBag, Heart } from 'lucide-react';

export const ProductModal: React.FC = () => {
  const {
    activeProduct,
    setActiveProduct,
    addToCart,
    isWishlisted,
    toggleWishlist,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!activeProduct) return null;

  const wishlisted = isWishlisted(activeProduct.id);
  const images = activeProduct.images && activeProduct.images.length > 0
    ? activeProduct.images
    : [activeProduct.image];

  const handleClose = () => {
    setActiveProduct(null);
    setQuantity(1);
    setActiveImageIndex(0);
  };

  const handleAddToCart = () => {
    addToCart(activeProduct, quantity);
    handleClose();
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(activeProduct, quantity);
    handleClose();
    setIsCheckoutOpen(true);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="product-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        <div className="modal-body-grid">
          {/* Gallery View */}
          <div className="modal-gallery">
            <div className="modal-main-image-wrap">
              <img
                src={images[activeImageIndex]}
                alt={activeProduct.title}
                className="modal-main-image"
              />
            </div>
            {images.length > 1 && (
              <div className="modal-thumbnail-row">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="modal-details">
            <div className="modal-brand-tag">{activeProduct.brand}</div>
            <h2 className="modal-product-title">{activeProduct.title}</h2>

            <div className="modal-rating-row">
              <div className="stars-wrap">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    className="star-icon"
                    fill={i < Math.floor(activeProduct.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="modal-rating-score">{activeProduct.rating} / 5.0</span>
              <span className="dot-sep">•</span>
              <span className="modal-reviews-count">{activeProduct.reviewsCount} customer reviews</span>
            </div>

            <div className="modal-price-row">
              <span className="modal-price">${activeProduct.price.toFixed(2)}</span>
              {activeProduct.originalPrice && (
                <span className="modal-original-price">
                  ${activeProduct.originalPrice.toFixed(2)}
                </span>
              )}
              {activeProduct.discountPercentage && (
                <span className="modal-save-pill">
                  Save {activeProduct.discountPercentage}%
                </span>
              )}
            </div>

            <p className="modal-description">{activeProduct.description}</p>

            {/* Specifications list */}
            {activeProduct.specs && (
              <div className="modal-specs-box">
                <h4 className="specs-title">Technical Specifications</h4>
                <dl className="specs-list">
                  {Object.entries(activeProduct.specs).map(([key, val]) => (
                    <div key={key} className="spec-row">
                      <dt>{key}</dt>
                      <dd>{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* Quantity Selector & Actions */}
            <div className="modal-actions-wrapper">
              <div className="quantity-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="qty-number">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(activeProduct.stockCount, q + 1))}
                  disabled={quantity >= activeProduct.stockCount}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>

              <button
                type="button"
                className="btn-primary modal-add-cart-btn"
                onClick={handleAddToCart}
              >
                <ShoppingBag size={18} />
                <span>Add to Bag • ${(activeProduct.price * quantity).toFixed(2)}</span>
              </button>

              <button
                type="button"
                className={`modal-wishlist-btn ${wishlisted ? 'active' : ''}`}
                onClick={() => toggleWishlist(activeProduct.id)}
                title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            <button
              type="button"
              className="btn-secondary modal-buy-now-btn"
              onClick={handleBuyNow}
            >
              Instant Express Checkout
            </button>

            {/* Guarantees */}
            <div className="modal-guarantees">
              <div className="guarantee-item">
                <Truck size={16} />
                <span>Express Dispatch (24h)</span>
              </div>
              <div className="guarantee-item">
                <Shield size={16} />
                <span>2-Year Full Warranty</span>
              </div>
              <div className="guarantee-item">
                <RotateCcw size={16} />
                <span>30-Day Hassle-Free Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
