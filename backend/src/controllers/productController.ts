import type { Request, Response } from 'express';
import { prisma } from '../lib/prisma.js';
import { products as inMemoryProducts } from '../data/products.js';
import type { Product, ProductCategory } from '../types/index.js';

function formatDbProduct(p: any): Product {
  return {
    id: p.id,
    title: p.title,
    brand: p.brand,
    description: p.description,
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    discountPercentage: p.discountPercentage ? Number(p.discountPercentage) : undefined,
    rating: Number(p.rating),
    reviewsCount: p.reviewsCount,
    category: p.categorySlug as ProductCategory,
    image: p.image,
    images: Array.isArray(p.images) ? p.images : [p.image],
    inStock: p.inStock,
    stockCount: p.stockCount,
    isFeatured: p.isFeatured,
    isTrending: p.isTrending,
    tags: Array.isArray(p.tags) ? p.tags : [],
    specs: (p.specs as Record<string, string>) || {},
  };
}

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const { category, search, sortBy, inStockOnly, featured } = req.query;

  try {
    const where: any = {};

    if (category && typeof category === 'string' && category !== 'all') {
      where.categorySlug = { equals: category.toLowerCase(), mode: 'insensitive' };
    }

    if (inStockOnly === 'true') {
      where.inStock = true;
      where.stockCount = { gt: 0 };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { has: q } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sortBy === 'price-asc') {
      orderBy = { price: 'asc' };
    } else if (sortBy === 'price-desc') {
      orderBy = { price: 'desc' };
    } else if (sortBy === 'rating-desc') {
      orderBy = { rating: 'desc' };
    }

    const dbProducts = await prisma.product.findMany({
      where,
      orderBy,
    });

    if (dbProducts.length > 0 || Object.keys(where).length > 0) {
      res.json(dbProducts.map(formatDbProduct));
      return;
    }
  } catch (err) {
    console.warn('Database query failed, falling back to in-memory store:', (err as Error).message);
  }

  // Graceful fallback to in-memory store
  let result = [...inMemoryProducts];

  if (category && typeof category === 'string' && category !== 'all') {
    result = result.filter(
      (p) => p.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (inStockOnly === 'true') {
    result = result.filter((p) => p.inStock && p.stockCount > 0);
  }

  if (featured === 'true') {
    result = result.filter((p) => p.isFeatured);
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      const matchTags = p.tags.some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchBrand || matchDesc || matchTags;
    });
  }

  if (sortBy && typeof sortBy === 'string') {
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'featured') {
      result.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
    }
  }

  res.json(result);
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  try {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (product) {
      res.json(formatDbProduct(product));
      return;
    }
  } catch (err) {
    console.warn('Database query failed for product ID:', (err as Error).message);
  }

  const fallbackProduct = inMemoryProducts.find((p) => p.id === id);
  if (!fallbackProduct) {
    res.status(404).json({ error: `Product with id "${id}" not found` });
    return;
  }

  res.json(fallbackProduct);
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const body = req.body as Partial<Product>;

  if (!body.title || !body.price || !body.category) {
    res.status(400).json({
      error: 'Missing required product fields: title, price, and category are mandatory',
    });
    return;
  }

  try {
    const created = await prisma.product.create({
      data: {
        id: body.id,
        title: body.title,
        brand: body.brand || 'AURA Collection',
        description: body.description || '',
        price: Number(body.price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        discountPercentage: body.discountPercentage ? Number(body.discountPercentage) : null,
        rating: body.rating ?? 5.0,
        reviewsCount: body.reviewsCount ?? 0,
        categorySlug: body.category.toLowerCase(),
        image: body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        images: body.images || [],
        inStock: body.inStock ?? true,
        stockCount: body.stockCount ?? 10,
        isFeatured: body.isFeatured ?? false,
        isTrending: body.isTrending ?? false,
        tags: Array.isArray(body.tags) ? body.tags : [],
        specs: body.specs || {},
      },
    });

    res.status(201).json(formatDbProduct(created));
    return;
  } catch (err) {
    console.warn('Prisma create failed, creating in-memory:', (err as Error).message);
  }

  const newProduct: Product = {
    id: body.id || `prod-${Date.now()}`,
    title: body.title,
    brand: body.brand || 'AURA Collection',
    description: body.description || '',
    price: Number(body.price),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : undefined,
    discountPercentage: body.discountPercentage ? Number(body.discountPercentage) : undefined,
    rating: body.rating ?? 5.0,
    reviewsCount: body.reviewsCount ?? 0,
    category: body.category as ProductCategory,
    image: body.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    images: body.images || [],
    inStock: body.inStock ?? true,
    stockCount: body.stockCount ?? 10,
    isFeatured: body.isFeatured ?? false,
    isTrending: body.isTrending ?? false,
    tags: Array.isArray(body.tags) ? body.tags : [],
    specs: body.specs || {},
  };

  inMemoryProducts.push(newProduct);
  res.status(201).json(newProduct);
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  try {
    const updated = await prisma.product.update({
      where: { id },
      data: req.body,
    });
    res.json(formatDbProduct(updated));
    return;
  } catch (err) {
    console.warn('Prisma update failed, updating in-memory:', (err as Error).message);
  }

  const index = inMemoryProducts.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: `Product with id "${id}" not found` });
    return;
  }

  inMemoryProducts[index] = {
    ...inMemoryProducts[index],
    ...req.body,
    id: inMemoryProducts[index].id,
  };

  res.json(inMemoryProducts[index]);
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const id = String(req.params.id);

  try {
    const deleted = await prisma.product.delete({
      where: { id },
    });
    res.json({ message: 'Product deleted successfully', product: formatDbProduct(deleted) });
    return;
  } catch (err) {
    console.warn('Prisma delete failed, deleting from in-memory:', (err as Error).message);
  }

  const index = inMemoryProducts.findIndex((p) => p.id === id);
  if (index === -1) {
    res.status(404).json({ error: `Product with id "${id}" not found` });
    return;
  }

  const removed = inMemoryProducts.splice(index, 1);
  res.json({ message: 'Product deleted successfully', product: removed[0] });
};
