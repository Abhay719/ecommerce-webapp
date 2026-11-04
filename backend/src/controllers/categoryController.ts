import type { Request, Response } from 'express';
import { CATEGORIES } from '../data/categories.js';
import { products } from '../data/products.js';

export const getCategories = (_req: Request, res: Response): void => {
  // Compute up-to-date counts based on current products catalog
  const categoriesWithLiveCounts = CATEGORIES.map((cat) => {
    if (cat.slug === 'all') {
      return { ...cat, count: products.length };
    }
    const count = products.filter((p) => p.category === cat.slug).length;
    return { ...cat, count };
  });

  res.json(categoriesWithLiveCounts);
};

export const getCategoryBySlug = (req: Request, res: Response): void => {
  const { slug } = req.params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    res.status(404).json({ error: `Category "${slug}" not found` });
    return;
  }

  res.json(category);
};
