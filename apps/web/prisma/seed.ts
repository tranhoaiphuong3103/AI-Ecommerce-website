import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Cleaning database...');
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  // Create Categories
  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'T-Shirts',
        slug: 't-shirts',
        description: 'Classic and modern t-shirts for everyday wear',
        imageUrl: 'https://placehold.co/800x600/e0e7ff/6366f1?text=T-Shirts',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hoodies',
        slug: 'hoodies',
        description: 'Comfortable hoodies and sweatshirts',
        imageUrl: 'https://placehold.co/800x600/f3e8ff/a855f7?text=Hoodies',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dresses',
        slug: 'dresses',
        description: 'Elegant and casual dresses for all occasions',
        imageUrl: 'https://placehold.co/800x600/fce7f3/ec4899?text=Dresses',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pants',
        slug: 'pants',
        description: 'Comfortable pants and trousers',
        imageUrl: 'https://placehold.co/800x600/fef3c7/f59e0b?text=Pants',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Jackets',
        slug: 'jackets',
        description: 'Stylish jackets for any weather',
        imageUrl: 'https://placehold.co/800x600/d1fae5/10b981?text=Jackets',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sportswear',
        slug: 'sportswear',
        description: 'Athletic wear for active lifestyles',
        imageUrl: 'https://placehold.co/800x600/fee2e2/ef4444?text=Sportswear',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Product data
  const productsData = [
    {
      name: 'Classic Cotton T-Shirt',
      slug: 'classic-cotton-t-shirt',
      description:
        'Premium quality cotton t-shirt with a comfortable fit. Perfect for everyday wear, this classic piece features breathable fabric and a timeless design that never goes out of style.',
      price: 29.99,
      category: categories[0],
      images: [
        {
          url: 'https://placehold.co/800x800/e0e7ff/6366f1?text=Classic+T-Shirt',
          alt: 'Classic Cotton T-Shirt - Front View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://placehold.co/800x800/ddd6fe/8b5cf6?text=Back+View',
          alt: 'Classic Cotton T-Shirt - Back View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://placehold.co/800x800/cffafe/06b6d4?text=Side+View',
          alt: 'Classic Cotton T-Shirt - Side View',
          isPrimary: false,
          order: 3,
        },
      ],
      variants: [
        { size: 'XS', color: 'White', stock: 15, sku: 'CCT-WH-XS' },
        { size: 'S', color: 'White', stock: 25, sku: 'CCT-WH-S' },
        { size: 'M', color: 'White', stock: 30, sku: 'CCT-WH-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'CCT-WH-L' },
        { size: 'XL', color: 'White', stock: 20, sku: 'CCT-WH-XL' },
        { size: 'XS', color: 'Black', stock: 15, sku: 'CCT-BK-XS' },
        { size: 'S', color: 'Black', stock: 25, sku: 'CCT-BK-S' },
        { size: 'M', color: 'Black', stock: 30, sku: 'CCT-BK-M' },
        { size: 'L', color: 'Black', stock: 25, sku: 'CCT-BK-L' },
        { size: 'XL', color: 'Black', stock: 20, sku: 'CCT-BK-XL' },
      ],
    },
    {
      name: 'Urban Streetwear Hoodie',
      slug: 'urban-streetwear-hoodie',
      description:
        'Stay warm and stylish with this premium urban hoodie. Features a relaxed fit, adjustable drawstring hood, and kangaroo pocket. Made from soft cotton blend for maximum comfort.',
      price: 79.99,
      category: categories[1],
      images: [
        {
          url: 'https://placehold.co/800x800/f3e8ff/a855f7?text=Urban+Hoodie',
          alt: 'Urban Streetwear Hoodie - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://placehold.co/800x800/e0e7ff/6366f1?text=Side+View',
          alt: 'Urban Streetwear Hoodie - Side',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://placehold.co/800x800/cffafe/06b6d4?text=Detail',
          alt: 'Urban Streetwear Hoodie - Detail',
          isPrimary: false,
          order: 3,
        },
      ],
      variants: [
        { size: 'S', color: 'Gray', stock: 20, sku: 'USH-GR-S' },
        { size: 'M', color: 'Gray', stock: 25, sku: 'USH-GR-M' },
        { size: 'L', color: 'Gray', stock: 30, sku: 'USH-GR-L' },
        { size: 'XL', color: 'Gray', stock: 20, sku: 'USH-GR-XL' },
        { size: 'S', color: 'Navy', stock: 18, sku: 'USH-NV-S' },
        { size: 'M', color: 'Navy', stock: 22, sku: 'USH-NV-M' },
        { size: 'L', color: 'Navy', stock: 25, sku: 'USH-NV-L' },
        { size: 'XL', color: 'Navy', stock: 15, sku: 'USH-NV-XL' },
      ],
    },
    {
      name: 'Summer Floral Dress',
      slug: 'summer-floral-dress',
      description:
        'Beautiful floral print dress perfect for summer days. Features a flattering A-line silhouette, comfortable fit, and vibrant colors. Made from lightweight, breathable fabric.',
      price: 89.99,
      category: categories[2],
      images: [
        {
          url: 'https://placehold.co/800x800/fce7f3/ec4899?text=Summer+Dress',
          alt: 'Summer Floral Dress - Full',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://placehold.co/800x800/fbcfe8/db2777?text=Detail',
          alt: 'Summer Floral Dress - Detail',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://placehold.co/800x800/fce7f3/f472b6?text=Side+View',
          alt: 'Summer Floral Dress - Side',
          isPrimary: false,
          order: 3,
        },
      ],
      variants: [
        { size: 'XS', color: 'Floral Pink', stock: 12, sku: 'SFD-FP-XS' },
        { size: 'S', color: 'Floral Pink', stock: 18, sku: 'SFD-FP-S' },
        { size: 'M', color: 'Floral Pink', stock: 20, sku: 'SFD-FP-M' },
        { size: 'L', color: 'Floral Pink', stock: 15, sku: 'SFD-FP-L' },
        { size: 'XL', color: 'Floral Pink', stock: 10, sku: 'SFD-FP-XL' },
      ],
    },
    {
      name: 'Slim Fit Chino Pants',
      slug: 'slim-fit-chino-pants',
      description:
        'Modern slim-fit chino pants for a sharp, professional look. Crafted from premium stretch cotton for comfort and mobility. Features classic styling with modern cuts.',
      price: 69.99,
      category: categories[3],
      images: [
        {
          url: 'https://placehold.co/800x800/fef3c7/f59e0b?text=Chino+Pants',
          alt: 'Slim Fit Chino Pants - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://placehold.co/800x800/fde68a/eab308?text=Detail',
          alt: 'Slim Fit Chino Pants - Detail',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: '28', color: 'Khaki', stock: 15, sku: 'SFC-KH-28' },
        { size: '30', color: 'Khaki', stock: 25, sku: 'SFC-KH-30' },
        { size: '32', color: 'Khaki', stock: 30, sku: 'SFC-KH-32' },
        { size: '34', color: 'Khaki', stock: 25, sku: 'SFC-KH-34' },
        { size: '36', color: 'Khaki', stock: 20, sku: 'SFC-KH-36' },
        { size: '28', color: 'Navy', stock: 15, sku: 'SFC-NV-28' },
        { size: '30', color: 'Navy', stock: 25, sku: 'SFC-NV-30' },
        { size: '32', color: 'Navy', stock: 30, sku: 'SFC-NV-32' },
        { size: '34', color: 'Navy', stock: 25, sku: 'SFC-NV-34' },
        { size: '36', color: 'Navy', stock: 20, sku: 'SFC-NV-36' },
      ],
    },
    {
      name: 'All-Weather Performance Jacket',
      slug: 'all-weather-performance-jacket',
      description:
        'Versatile performance jacket designed for all weather conditions. Water-resistant outer shell with breathable lining. Features multiple pockets and adjustable hood for maximum functionality.',
      price: 129.99,
      category: categories[4],
      images: [
        {
          url: 'https://placehold.co/800x800/d1fae5/10b981?text=Performance+Jacket',
          alt: 'All-Weather Performance Jacket - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://placehold.co/800x800/a7f3d0/059669?text=Side+View',
          alt: 'All-Weather Performance Jacket - Side',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://placehold.co/800x800/6ee7b7/047857?text=Detail',
          alt: 'All-Weather Performance Jacket - Detail',
          isPrimary: false,
          order: 3,
        },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 15, sku: 'AWP-BK-S' },
        { size: 'M', color: 'Black', stock: 20, sku: 'AWP-BK-M' },
        { size: 'L', color: 'Black', stock: 25, sku: 'AWP-BK-L' },
        { size: 'XL', color: 'Black', stock: 15, sku: 'AWP-BK-XL' },
        { size: 'S', color: 'Olive', stock: 12, sku: 'AWP-OL-S' },
        { size: 'M', color: 'Olive', stock: 18, sku: 'AWP-OL-M' },
        { size: 'L', color: 'Olive', stock: 20, sku: 'AWP-OL-L' },
        { size: 'XL', color: 'Olive', stock: 12, sku: 'AWP-OL-XL' },
      ],
    },
    {
      name: 'Pro Athletic Training Set',
      slug: 'pro-athletic-training-set',
      description:
        'Complete athletic training set with moisture-wicking technology. Includes performance top and matching shorts. Designed for intense workouts with stretch fabric and ventilation zones.',
      price: 99.99,
      category: categories[5],
      images: [
        {
          url: 'https://placehold.co/800x800/fee2e2/ef4444?text=Athletic+Set',
          alt: 'Pro Athletic Training Set - Full',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://placehold.co/800x800/fecaca/dc2626?text=Detail',
          alt: 'Pro Athletic Training Set - Detail',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'S', color: 'Black/Red', stock: 20, sku: 'PAT-BR-S' },
        { size: 'M', color: 'Black/Red', stock: 25, sku: 'PAT-BR-M' },
        { size: 'L', color: 'Black/Red', stock: 30, sku: 'PAT-BR-L' },
        { size: 'XL', color: 'Black/Red', stock: 20, sku: 'PAT-BR-XL' },
        { size: 'S', color: 'Navy/White', stock: 18, sku: 'PAT-NW-S' },
        { size: 'M', color: 'Navy/White', stock: 22, sku: 'PAT-NW-M' },
        { size: 'L', color: 'Navy/White', stock: 28, sku: 'PAT-NW-L' },
        { size: 'XL', color: 'Navy/White', stock: 18, sku: 'PAT-NW-XL' },
      ],
    },
    {
      name: 'Vintage Graphic Tee',
      slug: 'vintage-graphic-tee',
      description:
        'Retro-inspired graphic t-shirt with vintage wash finish. Soft, pre-shrunk cotton with a relaxed fit. Features unique artwork that adds character to any casual outfit.',
      price: 34.99,
      category: categories[0],
      images: [
        {
          url: 'https://placehold.co/800x800/e5e7eb/6b7280?text=Vintage+Tee',
          alt: 'Vintage Graphic Tee - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://placehold.co/800x800/d1d5db/374151?text=Graphic+Detail',
          alt: 'Vintage Graphic Tee - Detail',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'S', color: 'Vintage Black', stock: 20, sku: 'VGT-VB-S' },
        { size: 'M', color: 'Vintage Black', stock: 30, sku: 'VGT-VB-M' },
        { size: 'L', color: 'Vintage Black', stock: 25, sku: 'VGT-VB-L' },
        { size: 'XL', color: 'Vintage Black', stock: 20, sku: 'VGT-VB-XL' },
      ],
    },
    {
      name: 'Oversized Comfort Hoodie',
      slug: 'oversized-comfort-hoodie',
      description:
        'Ultra-comfortable oversized hoodie with premium fleece lining. Perfect for lounging or casual outings. Features dropped shoulders and an extra roomy fit for ultimate comfort.',
      price: 69.99,
      category: categories[1],
      images: [
        {
          url: 'https://placehold.co/800x800/f5f3ff/8b5cf6?text=Comfort+Hoodie',
          alt: 'Oversized Comfort Hoodie - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://placehold.co/800x800/ede9fe/7c3aed?text=Side+View',
          alt: 'Oversized Comfort Hoodie - Side',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'S', color: 'Cream', stock: 15, sku: 'OCH-CR-S' },
        { size: 'M', color: 'Cream', stock: 25, sku: 'OCH-CR-M' },
        { size: 'L', color: 'Cream', stock: 30, sku: 'OCH-CR-L' },
        { size: 'XL', color: 'Cream', stock: 25, sku: 'OCH-CR-XL' },
        { size: 'S', color: 'Charcoal', stock: 18, sku: 'OCH-CH-S' },
        { size: 'M', color: 'Charcoal', stock: 28, sku: 'OCH-CH-M' },
        { size: 'L', color: 'Charcoal', stock: 32, sku: 'OCH-CH-L' },
        { size: 'XL', color: 'Charcoal', stock: 22, sku: 'OCH-CH-XL' },
      ],
    },
    {
      name: 'Elegant Evening Dress',
      slug: 'elegant-evening-dress',
      description:
        'Sophisticated evening dress with timeless elegance. Features a flattering silhouette, quality construction, and luxurious fabric. Perfect for special occasions and formal events.',
      price: 149.99,
      category: categories[2],
      images: [
        {
          url: 'https://placehold.co/800x800/dbeafe/3b82f6?text=Evening+Dress',
          alt: 'Elegant Evening Dress - Full',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://placehold.co/800x800/bfdbfe/2563eb?text=Detail',
          alt: 'Elegant Evening Dress - Detail',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'XS', color: 'Navy', stock: 10, sku: 'EED-NV-XS' },
        { size: 'S', color: 'Navy', stock: 15, sku: 'EED-NV-S' },
        { size: 'M', color: 'Navy', stock: 18, sku: 'EED-NV-M' },
        { size: 'L', color: 'Navy', stock: 12, sku: 'EED-NV-L' },
        { size: 'XS', color: 'Burgundy', stock: 10, sku: 'EED-BU-XS' },
        { size: 'S', color: 'Burgundy', stock: 15, sku: 'EED-BU-S' },
        { size: 'M', color: 'Burgundy', stock: 18, sku: 'EED-BU-M' },
        { size: 'L', color: 'Burgundy', stock: 12, sku: 'EED-BU-L' },
      ],
    },
    {
      name: 'Cargo Utility Pants',
      slug: 'cargo-utility-pants',
      description:
        'Functional cargo pants with modern styling. Features multiple utility pockets, durable fabric, and a comfortable fit. Perfect for both outdoor adventures and urban wear.',
      price: 79.99,
      category: categories[3],
      images: [
        {
          url: 'https://placehold.co/800x800/dcfce7/22c55e?text=Cargo+Pants',
          alt: 'Cargo Utility Pants - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://placehold.co/800x800/bbf7d0/16a34a?text=Detail',
          alt: 'Cargo Utility Pants - Detail',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: '28', color: 'Olive', stock: 15, sku: 'CUP-OL-28' },
        { size: '30', color: 'Olive', stock: 22, sku: 'CUP-OL-30' },
        { size: '32', color: 'Olive', stock: 28, sku: 'CUP-OL-32' },
        { size: '34', color: 'Olive', stock: 25, sku: 'CUP-OL-34' },
        { size: '36', color: 'Olive', stock: 18, sku: 'CUP-OL-36' },
        { size: '28', color: 'Black', stock: 15, sku: 'CUP-BK-28' },
        { size: '30', color: 'Black', stock: 22, sku: 'CUP-BK-30' },
        { size: '32', color: 'Black', stock: 28, sku: 'CUP-BK-32' },
        { size: '34', color: 'Black', stock: 25, sku: 'CUP-BK-34' },
        { size: '36', color: 'Black', stock: 18, sku: 'CUP-BK-36' },
      ],
    },
  ];

  // Create products with images and variants
  console.log('🛍️  Creating products...');
  for (const productData of productsData) {
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        categoryId: productData.category.id,
        images: {
          create: productData.images,
        },
        variants: {
          create: productData.variants,
        },
      },
      include: {
        images: true,
        variants: true,
      },
    });
    console.log(`  ✓ Created: ${product.name} (${product.variants.length} variants)`);
  }

  console.log('\n🎉 Seed completed successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${productsData.length} products`);
  console.log(
    `   - ${productsData.reduce((sum, p) => sum + p.images.length, 0)} product images`,
  );
  console.log(
    `   - ${productsData.reduce((sum, p) => sum + p.variants.length, 0)} product variants`,
  );
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
