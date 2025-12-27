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
        name: 'Sweatshirt',
        slug: 'sweatshirt',
        description: 'Comfortable sweatshirts',
        imageUrl: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/97a0eecf59814157a979c89f28d26339_9366/Ao_Sweatshirt_Phong_Cach_DJap_Xe_Co_DJien_Mau_vang_JW0147_01_laydown.jpg',
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
          url: 'https://cdn.shopify.com/s/files/1/0123/5065/2473/files/BM11049.549WHT_FIELD-SPECCOTTONHEAVYTEE.jpg?v=1700168512&format=webp&width=1800&height=1800',
          alt: 'Classic Cotton T-Shirt - Front View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://cdn.shopify.com/s/files/1/0123/5065/2473/files/BM11049.549BLK_FIELD-SPECCOTTONHEAVYTEE_605aa1f2-ff8a-4dcd-bf71-90a2d0212443.jpg?v=1695841871&format=webp&width=1800&height=1800',
          alt: 'Classic Cotton T-Shirt - Back View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://cdn.shopify.com/s/files/1/0123/5065/2473/files/BM11049.583_Field-Spec-Cotton-Heavy-Tee_SPECKLE-GREY.jpg?v=1740423798&format=webp&width=1800&height=1800',
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
        { size: 'L', color: 'Grey', stock: 25, sku: 'CCT-GR-L' },
        { size: 'XL', color: 'Grey', stock: 20, sku: 'CCT-GR-XL' },
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
      name: `Men's Graphic Tees Funny Letter Print Vintage Oversize T Shirts Acid Wash Shirt Streetwear Rapper Casual Tee Top`,
      slug: 'zoemghc-graphic-vintage-oversize-streetwear',
      description:
        'Retro-inspired graphic t-shirt with vintage wash finish. Soft, pre-shrunk cotton with a relaxed fit. Features unique artwork that adds character to any casual outfit.',
      price: 18.99,
      category: categories[0],
      images: [
        {
          url: 'https://m.media-amazon.com/images/I/71mG6Wii7aL._AC_SX679_.jpg',
          alt: 'Vintage Graphic Black - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://m.media-amazon.com/images/I/71fD0aBaXZL._AC_SX679_.jpg',
          alt: 'Vintage Graphic Apricot - Detail',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'S', color: 'Vintage Graphic Black', stock: 20, sku: 'VGT-VB-S' },
        { size: 'M', color: 'Vintage Graphic Black', stock: 30, sku: 'VGT-VB-M' },
        { size: 'L', color: 'Vintage Graphic Black', stock: 25, sku: 'VGT-VB-L' },
        { size: 'XL', color: 'Vintage Graphic Black', stock: 20, sku: 'VGT-VB-XL' },
        { size: 'S', color: 'Vintage Graphic Apricot', stock: 20, sku: 'VGT-VA-S' },
        { size: 'M', color: 'Vintage Graphic Apricot', stock: 30, sku: 'VGT-VA-M' },
        { size: 'L', color: 'Vintage Graphic Apricot', stock: 25, sku: 'VGT-VA-L' },
        { size: 'XL', color: 'Vintage Graphic Apricot', stock: 20, sku: 'VGT-VA-XL' },
      ],
    },
    {
      name: 'Archive Cycling Sweatshirt',
      slug: 'archive-cycling-sweatshirt',
      description:
        `This adidas sweatshirt is a must-have addition to your wardrobe. Whether you're heading out for the day or curling up on the couch, its soft French terry build keeps you in comfort. It has a loose, oversized shape, with bold colourblocking and bold graphics inspired by vintage cycling.`,
      price: 148.33,
      category: categories[1],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/97a0eecf59814157a979c89f28d26339_9366/Ao_Sweatshirt_Phong_Cach_DJap_Xe_Co_DJien_Mau_vang_JW0147_01_laydown.jpg',
          alt: 'Oversized Comfort Hoodie - Front',
          isPrimary: true,
          order: 1,
        },
      ],
      variants: [
        { size: 'M', color: 'Eqt Yellow', stock: 25, sku: 'OCH-CR-M' },
        { size: 'L', color: 'Eqt Yellow', stock: 30, sku: 'OCH-CR-L' },
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
      name: 'Samba OG Shoes',
      slug: 'samba-og-shoes',
      description:
        `Born on the pitch, the Samba is a timeless icon of street style. This silhouette stays true to its legacy with a tasteful, low-profile, soft leather upper, suede overlays and gum sole, making it a staple in everyone's closet - on and off the pitch.`,
      price: 100.0,
      category: categories[6],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3bbecbdf584e40398446a8bf0117cf62_9366/Samba_OG_Shoes_White_B75806_01_00_standard.jpg',
          alt: 'Cloud White - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg',
          alt: 'Core Black - Side View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/7b283df1eb6c4c9ab4a3afb200f9876a_9366/Samba_OG_Shoes_White_IG1025_01_00_standard.jpg',
          alt: 'Wonder White - Side View',
          isPrimary: false,
          order: 3,
        },
      ],
      variants: [
        { size: 'US 7', color: 'Cloud White', stock: 15, sku: 'SOG-CW-07' },
        { size: 'US 8', color: 'Cloud White', stock: 25, sku: 'SOG-CW-08' },
        { size: 'US 9', color: 'Cloud White', stock: 30, sku: 'SOG-CW-09' },
        { size: 'US 10', color: 'Cloud White', stock: 35, sku: 'SOG-CW-10' },
        { size: 'US 11', color: 'Cloud White', stock: 30, sku: 'SOG-CW-11' },
        { size: 'US 12', color: 'Cloud White', stock: 20, sku: 'SOG-CW-12' },
        { size: 'US 7', color: 'Core Black', stock: 15, sku: 'SOG-CB-07' },
        { size: 'US 8', color: 'Core Black', stock: 25, sku: 'SOG-CB-08' },
        { size: 'US 9', color: 'Core Black', stock: 30, sku: 'SOG-CB-09' },
        { size: 'US 10', color: 'Core Black', stock: 35, sku: 'SOG-CB-10' },
        { size: 'US 11', color: 'Core Black', stock: 30, sku: 'SOG-CB-11' },
        { size: 'US 12', color: 'Core Black', stock: 20, sku: 'SOG-CB-12' },
        { size: 'US 7', color: 'Wonder White', stock: 15, sku: 'SOG-WW-07' },
        { size: 'US 8', color: 'Wonder White', stock: 25, sku: 'SOG-WW-08' },
        { size: 'US 9', color: 'Wonder White', stock: 30, sku: 'SOG-WW-09' },
        { size: 'US 10', color: 'Wonder White', stock: 35, sku: 'SOG-WW-10' },
        { size: 'US 11', color: 'Wonder White', stock: 30, sku: 'SOG-WW-11' },
        { size: 'US 12', color: 'Wonder White', stock: 20, sku: 'SOG-WW-12' },
      ],
    },
    {
      name: `Nike Air Force 1 '07 LV8`,
      slug: 'air-force-1-07-lv8-shoes',
      description:
        `Comfortable, durable and timeless—it's number one for a reason. The suede edition pairs metallic accents with a stacked Swoosh logo for style that tracks whether you're on court or on the go.`,
      price: 135.0,
      category: categories[6],
      images: [
        {
          url: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/ab49cd62-e261-4dee-8511-242148604889/AIR+FORCE+1+%2707+LV8.png',
          alt: 'Desert Ochre - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/cf3bbe46-da7a-4c83-8d6a-24c8a40b1773/AIR+FORCE+1+%2707+LV8.png',
          alt: 'Desert Ochre - Front View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0bb49c64-6fe5-4fe0-af40-fe1a3ee37d74/AIR+FORCE+1+%2707.png',
          alt: 'Light Smoke Grey - Side View',
          isPrimary: false,
          order: 3,
        },
        {
          url: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/67f59c02-6c0b-49ba-b1de-ccc14d1e1a99/AIR+FORCE+1+%2707.png',
          alt: 'Light Smoke Grey - Front View',
          isPrimary: false,
          order: 4,
        },
      ],
      variants: [
        { size: 'US 7', color: 'Desert Ochre', stock: 15, sku: 'NAF-DO-07' },
        { size: 'US 8', color: 'Desert Ochre', stock: 25, sku: 'NAF-DO-08' },
        { size: 'US 9', color: 'Desert Ochre', stock: 30, sku: 'NAF-DO-09' },
        { size: 'US 10', color: 'Desert Ochre', stock: 35, sku: 'NAF-DO-10' },
        { size: 'US 11', color: 'Desert Ochre', stock: 30, sku: 'NAF-DO-11' },
        { size: 'US 12', color: 'Desert Ochre', stock: 20, sku: 'NAF-DO-12' },
        { size: 'US 7', color: 'Light Smoke Grey', stock: 15, sku: 'NAF-LS-07' },
        { size: 'US 8', color: 'Light Smoke Grey', stock: 25, sku: 'NAF-LS-08' },
        { size: 'US 9', color: 'Light Smoke Grey', stock: 30, sku: 'NAF-LS-09' },
        { size: 'US 10', color: 'Light Smoke Grey', stock: 35, sku: 'NAF-LS-10' },
        { size: 'US 11', color: 'Light Smoke Grey', stock: 30, sku: 'NAF-LS-11' },
        { size: 'US 12', color: 'Light Smoke Grey', stock: 20, sku: 'NAF-LS-12' },
      ],
    },
    {
      name: 'F50 Club Turf Boots',
      slug: 'f50-club-turf-boots',
      description:
        `Free the fast with the adidas F50. Created to unlock the full potential of your acceleration, movement and speed. These adidas Club football boots keep you comfortable with a textured Fiberskin upper and perforated tongue. Underneath, a lug rubber outsole ensures you stay ahead of the competition on artificial turf courts`,
      price: 61.0,
      category: categories[6],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9e8626b5baef4ce9bea9e2b9428dc123_9366/F50_Club_Turf_Boots_White_IF1348_01_standard_hover.jpg',
          alt: 'Blue - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/e0843e6d7e714f948c22add400f4f5f3_9366/F50_Club_Turf_Boots_White_IF1348_02_standard_hover.jpg',
          alt: 'Blue - Front View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/8da705ae83f148f993ce04ebd6cf91a1_9366/F50_Club_Turf_Boots_Black_JI0025_22_model.jpg',
          alt: 'Black - Side View',
          isPrimary: false,
          order: 3,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9f5cfab4740f4e22915badd40102c6a3_9366/F50_Club_Turf_Boots_Black_JI0025_01_standard.jpg',
          alt: 'Black - Front View',
          isPrimary: false,
          order: 4,
        },
      ],
      variants: [
        { size: 'US 7', color: 'Blue', stock: 12, sku: 'F50-BL-07' },
        { size: 'US 8', color: 'Blue', stock: 20, sku: 'F50-BL-08' },
        { size: 'US 9', color: 'Blue', stock: 25, sku: 'F50-BL-09' },
        { size: 'US 10', color: 'Blue', stock: 30, sku: 'F50-BL-10' },
        { size: 'US 11', color: 'Blue', stock: 25, sku: 'F50-BL-11' },
        { size: 'US 12', color: 'Blue', stock: 15, sku: 'F50-BL-12' },
        { size: 'US 7', color: 'Black', stock: 12, sku: 'F50-BK-07' },
        { size: 'US 8', color: 'Black', stock: 20, sku: 'F50-BK-08' },
        { size: 'US 9', color: 'Black', stock: 25, sku: 'F50-BK-09' },
        { size: 'US 10', color: 'Black', stock: 30, sku: 'F50-BK-10' },
        { size: 'US 11', color: 'Black', stock: 25, sku: 'F50-BK-11' },
        { size: 'US 12', color: 'Black', stock: 15, sku: 'F50-BK-12' },
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
