import { prisma } from '../src/lib/prisma.js';
import { CATEGORIES } from '../src/data/categories.js';
import { INITIAL_PRODUCTS } from '../src/data/products.js';

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Seed Categories
  console.log('Seeding categories...');
  for (const cat of CATEGORIES) {
    if (cat.slug === 'all') continue; // 'all' is a virtual frontend filter
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        icon: cat.icon,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
      },
    });
  }

  // 2. Seed Products
  console.log('Seeding products...');
  for (const prod of INITIAL_PRODUCTS) {
    await prisma.product.upsert({
      where: { id: prod.id },
      update: {
        title: prod.title,
        brand: prod.brand,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice ?? null,
        discountPercentage: prod.discountPercentage ?? null,
        rating: prod.rating,
        reviewsCount: prod.reviewsCount,
        categorySlug: prod.category,
        image: prod.image,
        images: prod.images ?? [prod.image],
        inStock: prod.inStock,
        stockCount: prod.stockCount,
        isFeatured: prod.isFeatured ?? false,
        isTrending: prod.isTrending ?? false,
        tags: prod.tags ?? [],
        specs: prod.specs ?? {},
      },
      create: {
        id: prod.id,
        title: prod.title,
        brand: prod.brand,
        description: prod.description,
        price: prod.price,
        originalPrice: prod.originalPrice ?? null,
        discountPercentage: prod.discountPercentage ?? null,
        rating: prod.rating,
        reviewsCount: prod.reviewsCount,
        categorySlug: prod.category,
        image: prod.image,
        images: prod.images ?? [prod.image],
        inStock: prod.inStock,
        stockCount: prod.stockCount,
        isFeatured: prod.isFeatured ?? false,
        isTrending: prod.isTrending ?? false,
        tags: prod.tags ?? [],
        specs: prod.specs ?? {},
      },
    });
  }

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
