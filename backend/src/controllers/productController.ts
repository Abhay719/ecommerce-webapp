import type { Request, Response } from 'express';
import { products } from '../data/products.js';
import type { Product, ProductCategory } from '../types/index.js';

export const getProducts = (req: Request, res: Response): void => {
  const { category, search, sortBy, inStockOnly, featured } = req.query;

  let result = [...products];

  // Category filter
  if (category && typeof category === 'string' && category !== 'all') {
    result = result.filter(
      (p) => p.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  // Stock filter
  if (inStockOnly === 'true') {
    result = result.filter((p) => p.inStock && p.stockCount > 0);
  }

  // Featured filter
  if (featured === 'true') {
    result = result.filter((p) => p.isFeatured);
  }

  // Search query (title, brand, description, tags)
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

  // Sorting
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

  // Returns array directly to support seamless frontend deserialization
  res.json(result);
};

export const getProductById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    res.status(404).json({ error: `Product with id "${id}" not found` });
    return;
  }

  res.json(product);
};

export const createProduct = (req: Request, res: Response): void => {
  const body = req.body as Partial<Product>;

  if (!body.title || !body.price || !body.category) {
    res.status(400).json({
      error: 'Missing required product fields: title, price, and category are mandatory',
    });
    return;
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

  products.push(newProduct);
  res.status(201).json(newProduct);
};

export const updateProduct = (req: Request, res: Response): void => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: `Product with id "${id}" not found` });
    return;
  }

  products[index] = {
    ...products[index],
    ...req.body,
    id: products[index].id, // Prevent overriding ID
  };

  res.json(products[index]);
};

export const deleteProduct = (req: Request, res: Response): void => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) {
    res.status(404).json({ error: `Product with id "${id}" not found` });
    return;
  }

  const removed = products.splice(index, 1);
  res.json({ message: 'Product deleted successfully', product: removed[0] });
};
