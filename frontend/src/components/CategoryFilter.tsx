import React from 'react';
import { CATEGORIES } from '../data/mockProducts';
import type { Product } from '../types';
import { SlidersHorizontal, Check } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: Product['category'] | 'all';
  onSelectCategory: (category: Product['category'] | 'all') => void;
  sortBy: string;
  onSortChange: (sort: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc') => void;
  inStockOnly: boolean;
  onToggleInStock: () => void;
  productsCount: number;
  totalProductsCount: number;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  inStockOnly,
  onToggleInStock,
  productsCount,
  totalProductsCount,
}) => {
  return (
    <div className="filter-wrapper" id="products-catalog">
      <div className="filter-header">
        <div className="category-tabs" role="tablist">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                className={`category-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.slug)}
              >
                <span>{cat.name}</span>
                <span className="cat-count">
                  {cat.slug === 'all' ? totalProductsCount : cat.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="filter-controls">
          {/* In-stock toggle */}
          <button
            type="button"
            className={`stock-filter-pill ${inStockOnly ? 'active' : ''}`}
            onClick={onToggleInStock}
          >
            <span className={`custom-checkbox ${inStockOnly ? 'checked' : ''}`}>
              {inStockOnly && <Check size={12} strokeWidth={3} />}
            </span>
            <span>In Stock Only</span>
          </button>

          {/* Sort dropdown */}
          <div className="sort-select-wrapper">
            <SlidersHorizontal size={15} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) =>
                onSortChange(
                  e.target.value as 'featured' | 'price-asc' | 'price-desc' | 'rating-desc'
                )
              }
              className="sort-select"
              aria-label="Sort products"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="catalog-meta">
        <p className="results-count">
          Showing <strong>{productsCount}</strong> curated items
        </p>
      </div>
    </div>
  );
};
