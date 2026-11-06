import type { Request, Response } from 'express';
import { CATEGORIES } from '../data/categories.js';
import { products } from '../data/products.js';
import { prisma } from '../lib/prisma.js';
import type { CategoryItem, ProductCategory } from '../types/index.js';

export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const dbCategories = await prisma.category.findMany();
    if (dbCategories.length > 0) {
      const allProducts = await prisma.product.findMany({ select: { categorySlug: true } });
      const totalCount = allProducts.length;

      const result: CategoryItem[] = [
        { id: '1', name: 'All Products', slug: 'all', icon: 'Sparkles', count: totalCount },
        ...dbCategories.map((c) => ({
          id: c.id,
          name: c.name,
          slug: c.slug as ProductCategory,
          icon: c.icon,
          count: allProducts.filter((p) => p.categorySlug === c.slug).length,
        })),
      ];

      res.json(result);
      return;
    }
  } catch (err) {
    console.warn('Database query failed for categories, falling back:', (err as Error).message);
  }

  // In-memory fallback
  const categoriesWithLiveCounts = CATEGORIES.map((cat) => {
    if (cat.slug === 'all') {
      return { ...cat, count: products.length };
    }
    const count = products.filter((p) => p.category === cat.slug).length;
    return { ...cat, count };
  });

  res.json(categoriesWithLiveCounts);
};

export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  const slug = String(req.params.slug);

  try {
    const dbCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (dbCategory) {
      const count = await prisma.product.count({
        where: { categorySlug: slug },
      });
      res.json({
        id: dbCategory.id,
        name: dbCategory.name,
        slug: dbCategory.slug,
        icon: dbCategory.icon,
        count,
      });
      return;
    }
  } catch (err) {
    console.warn('Database query failed for category slug:', (err as Error).message);
  }

  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) {
    res.status(404).json({ error: `Category "${slug}" not found` });
    return;
  }

  res.json(category);
};
