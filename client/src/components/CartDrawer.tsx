import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    shipping,
    tax,
    total,
    freeShippingThreshold,
    freeShippingProgress,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="drawer-backdrop" onClick={() => setIsCartOpen(false)}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-wrap">
            <ShoppingBag size={20} />
            <h3 className="drawer-title">Shopping Bag</h3>
            <span className="drawer-badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close shopping bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="shipping-progress-box">
          <div className="shipping-progress-text">
            {amountNeededForFreeShipping > 0 ? (
              <span>
                Add <strong>${amountNeededForFreeShipping.toFixed(2)}</strong> more for{' '}
                <strong>FREE Worldwide Shipping</strong>
              </span>
            ) : (
              <span className="free-shipping-unlocked">
                <Sparkles size={15} />
                <strong>You qualify for FREE Worldwide Express Shipping!</strong>
              </span>
            )}
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${freeShippingProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Items List */}
        <div className="drawer-items-list">
          {cart.length === 0 ? (
            <div className="drawer-empty-state">
              <div className="empty-cart-icon-wrap">
                <ShoppingBag size={38} strokeWidth={1.5} />
              </div>
              <h4>Your bag is currently empty</h4>
              <p>Explore our flagship releases and add items to your collection.</p>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsCartOpen(false)}
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="cart-item-row">
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="cart-item-image"
                />

                <div className="cart-item-details">
                  <div className="cart-item-top">
                    <div>
                      <span className="cart-item-brand">{item.product.brand}</span>
                      <h4 className="cart-item-title">{item.product.title}</h4>
                    </div>
                    <button
                      type="button"
                      className="cart-item-remove-btn"
                      onClick={() => removeFromCart(item.product.id)}
                      title="Remove item"
                      aria-label={`Remove ${item.product.title}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="cart-item-bottom">
                    <div className="cart-qty-controls">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>

                    <div className="cart-item-pricing">
                      <span className="cart-item-total-price">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer / Totals */}
        {cart.length > 0 && (
          <div className="drawer-footer">
            <div className="cost-breakdown">
              <div className="cost-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="cost-row">
                <span>Estimated Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <strong className="free-tag">FREE</strong>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="cost-row">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="cost-row cost-total">
                <span>Estimated Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary checkout-trigger-btn"
              onClick={handleCheckoutClick}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <p className="checkout-guarantee-note">
              🔒 256-bit SSL encrypted checkout. Fast & risk-free returns.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};
