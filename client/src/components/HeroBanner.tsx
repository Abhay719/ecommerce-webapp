import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Award, Star } from 'lucide-react';

interface HeroBannerProps {
  onShopClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopClick }) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-tag">
          <span className="hero-tag-dot"></span>
          <span>AUTUMN 2026 EDITION — FLAGSHIP ARRIVALS</span>
        </div>

        <h1 className="hero-title">
          Curated Engineering. <br />
          <span className="hero-title-gradient">Refined Aesthetics.</span>
        </h1>

        <p className="hero-subtitle">
          Experience precision acoustic instruments, CNC-milled gear, and heirloom lifestyle
          objects crafted for those who notice every single millimeter of detail.
        </p>

        <div className="hero-actions">
          <button type="button" className="btn-primary hero-cta-btn" onClick={onShopClick}>
            <span>Explore Collection</span>
            <ArrowRight size={18} />
          </button>
          <a href="#featured" className="btn-secondary">
            View Bestsellers
          </a>
        </div>

        {/* Highlight Metrics */}
        <div className="hero-highlights">
          <div className="highlight-item">
            <div className="highlight-icon-box">
              <ShieldCheck size={20} />
            </div>
            <div>
              <strong>2-Year Warranty</strong>
              <p>Full replacement guarantee</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon-box">
              <Zap size={20} />
            </div>
            <div>
              <strong>Express Global</strong>
              <p>Free delivery over $150</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon-box">
              <Award size={20} />
            </div>
            <div>
              <strong>Design Certified</strong>
              <p>Red Dot 2026 Winner</p>
            </div>
          </div>

          <div className="highlight-item">
            <div className="highlight-icon-box">
              <Star size={20} />
            </div>
            <div>
              <strong>4.9 / 5.0 Rating</strong>
              <p>Over 14,000+ reviews</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
