import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useCart();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      addToast('Subscribed to Private Drops', 'You will receive exclusive access to early product launches.');
      setEmail('');
    }
  };

  return (
    <footer className="footer-container">
      <div className="footer-top-grid">
        <div className="footer-brand-col">
          <div className="brand-logo footer-logo">
            <span className="logo-symbol">◇</span>
            <span className="logo-text">AURA</span>
          </div>
          <p className="footer-tagline">
            Pioneering the intersection of industrial precision and acoustic clarity.
            Designed in California. Crafted globally.
          </p>
          <div className="footer-status-badge">
            <span className="status-dot"></span>
            <span>All Global Hubs Operating Normally</span>
          </div>
        </div>

        <div className="footer-links-col">
          <h4>Explore</h4>
          <ul>
            <li><a href="#products-catalog">All Products</a></li>
            <li><a href="#featured">Bestsellers</a></li>
            <li><a href="#products-catalog">Acoustic Audio</a></li>
            <li><a href="#products-catalog">Precision Horology</a></li>
            <li><a href="#products-catalog">Mechanical Gear</a></li>
          </ul>
        </div>

        <div className="footer-links-col">
          <h4>Client Care</h4>
          <ul>
            <li><a href="#care">Order Tracking</a></li>
            <li><a href="#care">Worldwide Shipping</a></li>
            <li><a href="#care">Warranty & Repairs</a></li>
            <li><a href="#care">Authenticity Verification</a></li>
            <li><a href="#care">Contact Support</a></li>
          </ul>
        </div>

        <div className="footer-newsletter-col">
          <h4>Private Access</h4>
          <p>Subscribe to receive invitation-only private drops and engineering deep-dives.</p>

          {subscribed ? (
            <div className="newsletter-subscribed-box">
              <Check size={18} />
              <span>You are on the VIP registry.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" aria-label="Subscribe">
                <ArrowRight size={18} />
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom-bar">
        <p>© 2026 AURA Studio Inc. All rights reserved.</p>
        <div className="footer-legal-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#cookies">Cookie Settings</a>
          <a href="#security">Security</a>
        </div>
      </div>
    </footer>
  );
};
