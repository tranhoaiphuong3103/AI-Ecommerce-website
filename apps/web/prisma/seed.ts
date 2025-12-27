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
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Hoodies',
        slug: 'hoodies',
        description: 'Comfortable hoodies and sweatshirts',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dresses',
        slug: 'dresses',
        description: 'Elegant and casual dresses for all occasions',
        imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pants',
        slug: 'pants',
        description: 'Comfortable pants and trousers',
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Jackets',
        slug: 'jackets',
        description: 'Stylish jackets for any weather',
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sportswear',
        slug: 'sportswear',
        description: 'Athletic wear for active lifestyles',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Shoes',
        slug: 'shoes',
        description: 'Premium sneakers and athletic footwear',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&fit=crop',
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
          url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&fit=crop',
          alt: 'Classic Cotton T-Shirt - Front View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&fit=crop',
          alt: 'Classic Cotton T-Shirt - Back View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&fit=crop',
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
          url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&fit=crop',
          alt: 'Urban Streetwear Hoodie - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1620799140188-3b2a7c2e0e27?q=80&w=800&fit=crop',
          alt: 'Urban Streetwear Hoodie - Side',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?q=80&w=800&fit=crop',
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
          url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&fit=crop',
          alt: 'Summer Floral Dress - Full',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&fit=crop',
          alt: 'Summer Floral Dress - Detail',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?q=80&w=800&fit=crop',
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
          url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&fit=crop',
          alt: 'Slim Fit Chino Pants - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&fit=crop',
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
          url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&fit=crop',
          alt: 'All-Weather Performance Jacket - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&fit=crop',
          alt: 'All-Weather Performance Jacket - Side',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=800&fit=crop',
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
          url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&fit=crop',
          alt: 'Pro Athletic Training Set - Full',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1623874514711-0f321325f318?q=80&w=800&fit=crop',
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
          url: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=800&fit=crop',
          alt: 'Vintage Graphic Tee - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&fit=crop',
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
          url: 'https://images.unsplash.com/photo-1620799140234-025b89c49c3e?q=80&w=800&fit=crop',
          alt: 'Oversized Comfort Hoodie - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1620799140195-e5e7944d1116?q=80&w=800&fit=crop',
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
          url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=800&fit=crop',
          alt: 'Elegant Evening Dress - Full',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800&fit=crop',
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
      name: 'Classic Leather Sneakers',
      slug: 'classic-leather-sneakers-black-white',
      description:
        'Born on the court, perfected on the streets. These classic sneakers feature premium leather construction, iconic three-stripe design, and a timeless silhouette. The low-profile design with suede overlays and gum rubber sole makes them a versatile essential for any wardrobe.',
      price: 100.0,
      category: categories[6],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&fit=crop',
          alt: 'Classic Leather Sneakers Black/White - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&fit=crop',
          alt: 'Classic Leather Sneakers Black/White - Front View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=800&fit=crop',
          alt: 'Classic Leather Sneakers Black/White - Detail',
          isPrimary: false,
          order: 3,
        },
      ],
      variants: [
        { size: 'US 7', color: 'Black/White', stock: 15, sku: 'CLS-BW-07' },
        { size: 'US 8', color: 'Black/White', stock: 25, sku: 'CLS-BW-08' },
        { size: 'US 9', color: 'Black/White', stock: 30, sku: 'CLS-BW-09' },
        { size: 'US 10', color: 'Black/White', stock: 35, sku: 'CLS-BW-10' },
        { size: 'US 11', color: 'Black/White', stock: 30, sku: 'CLS-BW-11' },
        { size: 'US 12', color: 'Black/White', stock: 20, sku: 'CLS-BW-12' },
      ],
    },
    {
      name: 'Classic Leather Sneakers',
      slug: 'classic-leather-sneakers-white-green',
      description:
        'Born on the court, perfected on the streets. These classic sneakers feature premium leather construction, iconic three-stripe design, and a timeless silhouette. The low-profile design with suede overlays and gum rubber sole makes them a versatile essential for any wardrobe.',
      price: 100.0,
      category: categories[6],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800&fit=crop',
          alt: 'Classic Leather Sneakers White/Green - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&fit=crop',
          alt: 'Classic Leather Sneakers White/Green - Front View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=800&fit=crop',
          alt: 'Classic Leather Sneakers White/Green - Detail',
          isPrimary: false,
          order: 3,
        },
      ],
      variants: [
        { size: 'US 7', color: 'White/Green', stock: 15, sku: 'CLS-WG-07' },
        { size: 'US 8', color: 'White/Green', stock: 25, sku: 'CLS-WG-08' },
        { size: 'US 9', color: 'White/Green', stock: 30, sku: 'CLS-WG-09' },
        { size: 'US 10', color: 'White/Green', stock: 35, sku: 'CLS-WG-10' },
        { size: 'US 11', color: 'White/Green', stock: 30, sku: 'CLS-WG-11' },
        { size: 'US 12', color: 'White/Green', stock: 20, sku: 'CLS-WG-12' },
      ],
    },
    {
      name: 'Running Performance Shoes',
      slug: 'running-performance-shoes-blue',
      description:
        'Engineered for runners who demand the best. These performance running shoes feature advanced cushioning technology, breathable mesh upper, and responsive sole for maximum energy return. Designed to help you go the distance in comfort.',
      price: 120.0,
      category: categories[6],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=800&fit=crop',
          alt: 'Running Performance Shoes Blue - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=800&fit=crop',
          alt: 'Running Performance Shoes Blue - Top View',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'US 7', color: 'Blue/White', stock: 12, sku: 'RPS-BW-07' },
        { size: 'US 8', color: 'Blue/White', stock: 20, sku: 'RPS-BW-08' },
        { size: 'US 9', color: 'Blue/White', stock: 25, sku: 'RPS-BW-09' },
        { size: 'US 10', color: 'Blue/White', stock: 30, sku: 'RPS-BW-10' },
        { size: 'US 11', color: 'Blue/White', stock: 25, sku: 'RPS-BW-11' },
        { size: 'US 12', color: 'Blue/White', stock: 15, sku: 'RPS-BW-12' },
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
