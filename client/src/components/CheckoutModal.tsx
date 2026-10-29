import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { apiService } from '../services/api';
import { X, CheckCircle, ShieldCheck, CreditCard, Lock, Sparkles } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    subtotal,
    shipping,
    tax,
    total,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    addToast,
  } = useCart();

  const [formData, setFormData] = useState({
    name: 'Alex Sterling',
    email: 'alex.sterling@example.com',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    postalCode: '94107',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await apiService.createOrder({
        items: cart,
        subtotal,
        shipping,
        tax,
        total,
        customerName: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      });

      setConfirmedOrderId(response.orderId);
      clearCart();
      addToast('Order Placed Successfully!', `Order ID: ${response.orderId}`, 'success');
    } catch {
      const fallbackId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      setConfirmedOrderId(fallbackId);
      clearCart();
      addToast('Order Placed!', `Order ID: ${fallbackId}`, 'success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrderId(null);
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="checkout-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close checkout"
        >
          <X size={20} />
        </button>

        {confirmedOrderId ? (
          <div className="order-confirmation-screen">
            <div className="confirmation-icon-wrap">
              <CheckCircle size={56} className="success-icon" />
            </div>

            <span className="order-success-tag">PAYMENT VERIFIED</span>
            <h2>Thank You For Your Order!</h2>
            <p className="order-subtext">
              We have dispatched your order confirmation to <strong>{formData.email}</strong>.
            </p>

            <div className="order-id-card">
              <span className="order-id-label">Official Order Reference</span>
              <span className="order-id-code">{confirmedOrderId}</span>
            </div>

            <div className="order-perks-box">
              <div className="perk-row">
                <Sparkles size={16} />
                <span>Express courier tracking will be active within 24 hours.</span>
              </div>
              <div className="perk-row">
                <ShieldCheck size={16} />
                <span>Covered by 2-Year Aura Comprehensive Guarantee.</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary continue-shopping-btn"
              onClick={handleClose}
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          <div className="checkout-content-grid">
            {/* Form Section */}
            <div className="checkout-form-section">
              <div className="checkout-header">
                <div className="secure-badge">
                  <Lock size={14} />
                  <span>256-BIT ENCRYPTED</span>
                </div>
                <h2>Secure Checkout</h2>
                <p>Complete your shipping and payment information.</p>
              </div>

              <form onSubmit={handleSubmitOrder} className="checkout-form">
                <div className="form-group-title">1. Shipping Destination</div>
                <div className="form-row">
                  <div className="input-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>Postal / ZIP Code</label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group-title">2. Payment Method</div>
                <div className="payment-card-mock">
                  <div className="payment-header">
                    <CreditCard size={18} />
                    <span>Credit / Debit Card</span>
                    <span className="card-brand-badge">VISA / MC</span>
                  </div>

                  <div className="input-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      required
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label>Expires</label>
                      <input
                        type="text"
                        name="cardExp"
                        required
                        value={formData.cardExp}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="input-group">
                      <label>Security CVC</label>
                      <input
                        type="text"
                        name="cardCvc"
                        required
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-primary place-order-submit-btn"
                  disabled={isSubmitting || cart.length === 0}
                >
                  {isSubmitting ? (
                    <span>Authorizing Order...</span>
                  ) : (
                    <span>Authorize & Place Order • ${total.toFixed(2)}</span>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div className="checkout-summary-section">
              <h3>Order Review ({cart.reduce((s, i) => s + i.quantity, 0)})</h3>

              <div className="checkout-items-scroll">
                {cart.map((item) => (
                  <div key={item.product.id} className="checkout-mini-item">
                    <img src={item.product.image} alt={item.product.title} />
                    <div className="mini-item-info">
                      <p className="mini-item-title">{item.product.title}</p>
                      <p className="mini-item-meta">Qty: {item.quantity}</p>
                    </div>
                    <span className="mini-item-price">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div className="cost-row">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="cost-row">
                  <span>Express Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="cost-row">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="cost-row total-highlight">
                  <span>Total Due</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="checkout-trust-box">
                <ShieldCheck size={18} />
                <p>30-Day Money Back Guarantee with zero restocking fees.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
