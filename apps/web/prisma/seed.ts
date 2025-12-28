import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('🌱 Starting seed...');
  console.log('🗑️  Cleaning database...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.generatedVideo.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log('📁 Creating categories...');
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'T-Shirts',
        slug: 't-shirts',
        description: 'Classic and modern t-shirts for everyday wear',
        imageUrl:
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Sweatshirt',
        slug: 'sweatshirt',
        description: 'Comfortable sweatshirts',
        imageUrl:
          'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/97a0eecf59814157a979c89f28d26339_9366/Ao_Sweatshirt_Phong_Cach_DJap_Xe_Co_DJien_Mau_vang_JW0147_01_laydown.jpg',
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
        imageUrl:
          'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&fit=crop',
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
    prisma.category.create({
      data: {
        name: 'Pants',
        slug: 'pants',
        description: 'High-quality pants',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Jersey',
        slug: 'jersey',
        description: 'Authentic and elite performance jersey',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Dress',
        slug: 'dress',
        description: 'Beautiful and elegant dress',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&fit=crop',
      },
    }),
  ]);
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
          alt: 'White - Front View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://cdn.shopify.com/s/files/1/0123/5065/2473/files/BM11049.549BLK_FIELD-SPECCOTTONHEAVYTEE_605aa1f2-ff8a-4dcd-bf71-90a2d0212443.jpg?v=1695841871&format=webp&width=1800&height=1800',
          alt: 'Black - Front View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://cdn.shopify.com/s/files/1/0123/5065/2473/files/BM11049.583_Field-Spec-Cotton-Heavy-Tee_SPECKLE-GREY.jpg?v=1740423798&format=webp&width=1800&height=1800',
          alt: 'Grey - Front View',
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
      name: 'PUFFTECH Quilted Jacket | With Hood',
      slug: 'quilted-hood-jacket',
      description:
        'Versatile performance jacket designed for all weather conditions. Water-resistant outer shell with breathable lining. Features multiple pockets and adjustable hood for maximum functionality.',
      price: 129.99,
      category: categories[2],
      images: [
        {
          url: 'https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/469871/sub/goods_469871_sub14_3x4.jpg?width=423',
          alt: 'All-Weather Performance Jacket - Front',
          isPrimary: true,
          order: 1,
        },
      ],
      variants: [
        { size: 'S', color: 'Red', stock: 15, sku: 'PUFF-BK-S' },
        { size: 'M', color: 'Red', stock: 20, sku: 'PUFF-BK-M' },
        { size: 'L', color: 'Red', stock: 25, sku: 'PUFF-BK-L' },
        { size: 'XL', color: 'Red', stock: 15, sku: 'PUFF-BK-XL' },
      ],
    },
    {
      name: 'FUTURE ICONS WOVEN THREE STRIPE T SHIRT',
      slug: 'future-icons-woven-three-stripe-t-shirt',
      description:
        'Versatile performance jacket designed for all weather conditions. Water-resistant outer shell with breathable lining. Features multiple pockets and adjustable hood for maximum functionality.',
      price: 39.94,
      category: categories[3],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/82b8aeb3a07540d0af33f8cd5a075612_9366/FUTURE_ICONS_WOVEN_THREE_STRIPE_T_SHIRT_Black_JZ9289_01_laydown.jpg',
          alt: 'FUTURE ICONS WOVEN THREE STRIPE T SHIRT - Front',
          isPrimary: true,
          order: 1,
        },
      ],
      variants: [
        { size: 'S', color: 'Black', stock: 15, sku: 'FUT-WOV-S' },
        { size: 'M', color: 'Black', stock: 20, sku: 'FUT-WOV-M' },
        { size: 'L', color: 'Black', stock: 25, sku: 'FUT-WOV-L' },
        { size: 'XL', color: 'Black', stock: 15, sku: 'FUT-WOV-XL' },
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
      description: `This adidas sweatshirt is a must-have addition to your wardrobe. Whether you're heading out for the day or curling up on the couch, its soft French terry build keeps you in comfort. It has a loose, oversized shape, with bold colourblocking and bold graphics inspired by vintage cycling.`,
      price: 148.33,
      category: categories[1],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/97a0eecf59814157a979c89f28d26339_9366/Ao_Sweatshirt_Phong_Cach_DJap_Xe_Co_DJien_Mau_vang_JW0147_01_laydown.jpg',
          alt: 'Oversized Comfort Hoodie - Front',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/c_crop,f_auto,fl_lossy,g_north,h_840,q_auto,y_40/h_2000/97a0eecf59814157a979c89f28d26339_9366/Archive_Cycling_Sweatshirt_Yellow_JW0147_01_laydown.jpg',
          alt: 'Oversized Comfort Hoodie - Detail',
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
      name: 'Samba OG Shoes',
      slug: 'samba-og-shoes',
      description: `Born on the pitch, the Samba is a timeless icon of street style. This silhouette stays true to its legacy with a tasteful, low-profile, soft leather upper, suede overlays and gum sole, making it a staple in everyone's closet - on and off the pitch.`,
      price: 100.0,
      category: categories[4],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3bbecbdf584e40398446a8bf0117cf62_9366/Samba_OG_Shoes_White_B75806_01_00_standard.jpg',
          alt: 'Cloud White - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/b067d21288bc43ec8298a8bf01180400_9366/Samba_OG_Shoes_White_B75806_04_standard.jpg',
          alt: 'Cloud White - Front View',
          isPrimary: true,
          order: 2,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/4c70105150234ac4b948a8bf01187e0c_9366/Samba_OG_Shoes_Black_B75807_01_standard.jpg',
          alt: 'Core Black - Side View',
          isPrimary: false,
          order: 3,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/a766df52607e42858ddba8bf0118c6cb_9366/Samba_OG_Shoes_Black_B75807_04_standard.jpg',
          alt: 'Core Black - Front View',
          isPrimary: false,
          order: 4,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/7b283df1eb6c4c9ab4a3afb200f9876a_9366/Samba_OG_Shoes_White_IG1025_01_00_standard.jpg',
          alt: 'Wonder White - Side View',
          isPrimary: false,
          order: 5,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3d22ad048e2d41e4ab61afb200f9b333_9366/Samba_OG_Shoes_White_IG1025_04_standard.jpg',
          alt: 'Wonder White - Front View',
          isPrimary: false,
          order: 6,
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
      description: `Comfortable, durable and timeless—it's number one for a reason. The suede edition pairs metallic accents with a stacked Swoosh logo for style that tracks whether you're on court or on the go.`,
      price: 135.0,
      category: categories[4],
      images: [
        {
          url: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/ab49cd62-e261-4dee-8511-242148604889/AIR+FORCE+1+%2707+LV8.png',
          alt: 'Desert Ochre - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/e0a06185-1311-414b-84ad-4339070a5e72/AIR+FORCE+1+%2707+LV8.png',
          alt: 'Desert Ochre - Front View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/a6bd4b85-8582-48a2-ae44-21e6025f5f0d/AIR+FORCE+1+%2707+LV8.png',
          alt: 'Desert Ochre - Back View',
          isPrimary: false,
          order: 3,
        },
        {
          url: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/cf3bbe46-da7a-4c83-8d6a-24c8a40b1773/AIR+FORCE+1+%2707+LV8.png',
          alt: 'Light Smoke Grey - Side View',
          isPrimary: false,
          order: 4,
        },
        {
          url: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/d55f8b00-f761-484e-9974-4acfd428678f/AIR+FORCE+1+%2707+LV8.png',
          alt: 'Light Smoke Grey - Front View',
          isPrimary: false,
          order: 5,
        },
        {
          url: 'https://static.nike.com/a/images/t_web_pdp_535_v2/f_auto/32c40bed-def4-4eb0-a32a-d2508c5c8ef7/AIR+FORCE+1+%2707+LV8.png',
          alt: 'Light Smoke Grey - Back View',
          isPrimary: false,
          order: 6,
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
        'Free the fast with the adidas F50. Created to unlock the full potential of your acceleration, movement and speed. These adidas Club football boots keep you comfortable with a textured Fiberskin upper and perforated tongue. Underneath, a lug rubber outsole ensures you stay ahead of the competition on artificial turf courts',
      price: 61.0,
      category: categories[4],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6ad48909f8574459b8bf560303ccbd48_9366/F50_Club_Turf_Boots_White_IF1348_22_model.jpg',
          alt: 'Blue - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9c0e1069370d4cc2958e5fe3f17509d3_9366/F50_Club_Turf_Boots_White_IF1348_02_standard.jpg',
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
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/047cd04d5040452086c569d1ccd8f055_9366/F50_Club_Turf_Boots_Black_JI0025_02_standard.jpg',
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
    {
      name: 'Argentina 26 Home Authentic Jersey',
      slug: 'argentina-26-home-authentic-jersey',
      description: `The Argentina 26 Home Authentic Jersey is more than just a piece of clothing; it's a celebration of the nation’s football legacy. Wherever you wear this jersey with its prestigious third star, it embodies the spirit of champions.

Designed for action, the jersey features Climacool+ technology. ADVANCED COOLING. Superior engineering and advanced materials unite for a cool, dry and distraction-free performance.

The special collar construction adds a classic touch, while body mapping creates a tailored, locked-in fit. The transfer knit jacquard fabric and Performance materials help to transfer heat through the garment and provide ventilation.

With its bold 3-Stripes and team crest, this adidas jersey is a symbol of pride and excellence. Whether you're on the pitch or cheering from the stands, it expresses your passion for the Argentinian national team.`,
      price: 114.1,
      category: categories[6],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/c80a44b3f32149d1b756429003181b62_9366/Argentina_26_Home_Authentic_Jersey_White_JM5897_HM5.jpg',
          alt: 'Icey Blue - Front View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/715cbc9455fe4e5bba1cf71dff18cb9f_9366/Argentina_26_Home_Authentic_Jersey_White_JM5897_HM6.jpg',
          alt: 'Icey Blue - Back View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/18fcebda447f4728a0b6e2ec796ca48c_9366/Argentina_26_Home_Authentic_Jersey_White_JM5897_HM4.jpg',
          alt: 'Icey Blue - Logo View',
          isPrimary: false,
          order: 3,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/941d215ecaee4141b923ea509d1802a3_9366/Argentina_26_Home_Authentic_Jersey_White_JM5897_HM12.jpg',
          alt: 'Icey Blue - Badge View',
          isPrimary: false,
          order: 4,
        },
      ],
      variants: [
        { size: 'XS', color: 'White', stock: 15, sku: 'ARG-JEY-XS' },
        { size: 'S', color: 'White', stock: 25, sku: 'ARG-JEY-S' },
        { size: 'M', color: 'White', stock: 30, sku: 'ARG-JEY-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'ARG-JEY-L' },
        { size: 'XL', color: 'White', stock: 20, sku: 'ARG-JEY-XL' },
        { size: '2XL', color: 'White', stock: 20, sku: 'ARG-JEY-2XL' },
      ],
    },
    {
      name: 'Manchester United 25/26 Home Jersey',
      slug: 'manchester-united-25-26-home-jersey',
      description: `Few sporting stages can match the drama Manchester United's iconic home ground has generated over the years. So this adidas jersey pays tribute to the stadium in which it will be starring in 25/26 with a "Theatre of Dreams" sign-off and abstract Old Trafford-inspired graphics on the sleeves. Built for comfortable football fandom, it also features moisture-managing AEROREADY and a woven club badge.`,
      price: 114.1,
      category: categories[6],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/341ec36583354390854e7ad4fd2a02dd_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_01_laydown.jpg',
          alt: 'Mufc Red - Front View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/9c2483f0d6df44f194ea9d1ae06f611a_9366/Manchester_United_25-26_Home_Jersey_Red_JI7428_02_laydown.jpg',
          alt: 'Mufc Red - Back View',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'XS', color: 'White', stock: 15, sku: 'MU-JEY-XS' },
        { size: 'S', color: 'White', stock: 25, sku: 'MU-JEY-S' },
        { size: 'M', color: 'White', stock: 30, sku: 'MU-JEY-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'MU-JEY-L' },
        { size: 'XL', color: 'White', stock: 20, sku: 'MU-JEY-XL' },
        { size: '2XL', color: 'White', stock: 20, sku: 'MU-JEY-2XL' },
      ],
    },
    {
      name: 'Real Madrid LFSTLR Jersey',
      slug: 'real-madrid-lfstlr-jersey',
      description: `Introducing the Real Madrid LFSTLR Jersey, where fashion meets football. Crafted for those who value form and function, this jersey pays homage to football heritage while embracing modern trends.

Its interlock fabric provides durability and comfort, while the loose fit offers a relaxed vibe that blends seamlessly into your wardrobe. The V-neck design adds a touch of elegance, making it suitable for both match days and casual outings.

The iconic club crest on the left chest and the embroidered adidas Trefoil logo on the right chest are not just symbols; they are statements of allegiance and style. Be it cheering from the stands or a night out with friends, this jersey has got you covered.`,
      price: 95.08,
      category: categories[6],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/64ce7c41f89e4c989eb23790ba807283_9366/Real_Madrid_LFSTLR_Jersey_Purple_JN3055_HM30.jpg',
          alt: 'RealMadrid Red - Front View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/7b93e7b2305c4a009e61bfa8529865c1_9366/Real_Madrid_LFSTLR_Jersey_Purple_JN3055_HM31.jpg',
          alt: 'RealMadrid - Back View',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'XS', color: 'White', stock: 15, sku: 'REA-JEY-XS' },
        { size: 'S', color: 'White', stock: 25, sku: 'REA-JEY-S' },
        { size: 'M', color: 'White', stock: 30, sku: 'REA-JEY-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'REA-JEY-L' },
        { size: 'XL', color: 'White', stock: 20, sku: 'REA-JEY-XL' },
        { size: '2XL', color: 'White', stock: 20, sku: 'REA-JEY-2XL' },
      ],
    },
    {
      name: 'ALL SZN French Terry Regular Tapered Pants',
      slug: 'all-szn-french-terry-regular-tapered-pants',
      description: `Comfort that's in it for the long haul. These adidas pants are your go-to for lazy mornings, busy afternoons and everything in between. The soft cotton French terry fabric keeps you cosy whether you're lounging at home or running errands around town. The tapered cut with elastic cuffs is relaxed yet refined and finished with a drawcord waist for a customised fit. Pair these pants with a hoodie for a laid-back look or mix and match with your favourite tee. Whatever the mood, these pants have you covered.`,
      price: 61.0,
      category: categories[5],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/3503c1b18e9d4da1bf6843581cef1acc_9366/ALL_SZN_French_Terry_Regular_Tapered_Pants_Black_IV5216_01_laydown.jpg',
          alt: 'Black - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/42cb44f500e44f3d86d8cf506b958789_9366/ALL_SZN_French_Terry_Regular_Tapered_Pants_Grey_IY6558_01_laydown.jpg',
          alt: 'Medium Grey Heather - Front View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/23b7e735d4f34a1c82cf08409125a7f0_9366/ALL_SZN_French_Terry_Regular_Tapered_Pants_Purple_JX5127_01_laydown.jpg',
          alt: 'Preloved Violet - Front View',
          isPrimary: false,
          order: 4,
        },
      ],
      variants: [
        { size: 'US 7', color: 'Medium Grey Heather', stock: 12, sku: 'SZN-FRA-GR-07' },
        { size: 'US 8', color: 'Medium Grey Heather', stock: 20, sku: 'SZN-FRA-GR-08' },
        { size: 'US 9', color: 'Medium Grey Heather', stock: 25, sku: 'SZN-FRA-GR-09' },
        { size: 'US 10', color: 'Medium Grey Heather', stock: 30, sku: 'SZN-FRA-GR-10' },
        { size: 'US 11', color: 'Medium Grey Heather', stock: 25, sku: 'SZN-FRA-GR-11' },
        { size: 'US 12', color: 'Medium Grey Heather', stock: 15, sku: 'SZN-FRA-GR-12' },
        { size: 'US 7', color: 'Black', stock: 12, sku: 'SZN-FRA-BL-07' },
        { size: 'US 8', color: 'Black', stock: 20, sku: 'SZN-FRA-BL-08' },
        { size: 'US 9', color: 'Black', stock: 25, sku: 'SZN-FRA-BL-09' },
        { size: 'US 10', color: 'Black', stock: 30, sku: 'SZN-FRA-BL-10' },
        { size: 'US 11', color: 'Black', stock: 25, sku: 'SZN-FRA-BL-11' },
        { size: 'US 12', color: 'Black', stock: 15, sku: 'SZN-FRA-BL-12' },
        { size: 'US 7', color: 'Preloved Violet', stock: 15, sku: 'SZN-FRA-PV-07' },
        { size: 'US 8', color: 'Preloved Violet', stock: 15, sku: 'SZN-FRA-PV-08' },
        { size: 'US 10', color: 'Preloved Violet', stock: 15, sku: 'SZN-FRA-PV-10' },
        { size: 'US 11', color: 'Preloved Violet', stock: 15, sku: 'SZN-FRA-PV-11' },
        { size: 'US 12', color: 'Preloved Violet', stock: 15, sku: 'SZN-FRA-PV-12' },
      ],
    },
    {
      name: 'Anthony Edwards Schematic Hoody',
      slug: 'anthony-edwards-schematic-hoody',
      description: `Bring the schematics to the court in the Anthony Edwards Schematic Hoodie from adidas. This basketball hoodie takes inspiration from the technical drawings used to design the game's strategies and plays. French terry fabric and a regular fit provide comfortable warmth during pickup games or cold-weather hoops sessions.`,
      price: 60.85,
      category: categories[2],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/00226ba40c4f4e34a9d7e7238c75ca0b_9366/Anthony_Edwards_Schematic_Hoody_Black_JM2675_HM5.jpg',
          alt: 'Black - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/13cae4691419401cacf84cec9544182d_9366/Anthony_Edwards_Schematic_Hoody_Black_JM2675_HM10.jpg',
          alt: 'Black - Back View',
          isPrimary: false,
          order: 2,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/724de485010f4489b93677270f59cee0_9366/Anthony_Edwards_Schematic_Hoody_Black_JM2675_HM6.jpg',
          alt: 'Black - Logo View',
          isPrimary: false,
          order: 3,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/8be70b1a135b42a5b0c684a11decf4e4_9366/Anthony_Edwards_Schematic_Hoody_Black_JM2675_HM9.jpg',
          alt: 'Black - Details View',
          isPrimary: false,
          order: 4,
        },
      ],
      variants: [
        { size: 'XS', color: 'White', stock: 15, sku: 'AE-HD-XS' },
        { size: 'S', color: 'White', stock: 25, sku: 'AE-HD-S' },
        { size: 'M', color: 'White', stock: 30, sku: 'AE-HD-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'AE-HD-L' },
      ],
    },
    {
      name: 'Liverpool FC Terrace Icons Dress',
      slug: 'liverpool-fc-terrace-icons-dress',
      description: `This Liverpool FC dress from adidas lets you take your support for your club everywhere you go. Inspired by iconic '80s football fashion, it reimagines a classic pinstriped match jersey in a polo dress silhouette. On the chest, an embroidered team crest and Trefoil logo proudly display your allegiance to the Reds and your sporty style.`,
      price: 68.46,
      category: categories[7],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/6f6738f796844d6fb87bb46bf704f65c_9366/Liverpool_FC_Terrace_Icons_Dress_Green_JW8008_HM30.jpg',
          alt: 'Sea Green with White stripe - Front View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/2a55a139d0fd4071a52bf53e77dd825f_9366/Liverpool_FC_Terrace_Icons_Dress_Green_JW8008_HM6.jpg',
          alt: 'Sea Green with White stripe - Icon View',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'XS', color: 'White', stock: 15, sku: 'LIV-DRE-XS' },
        { size: 'S', color: 'White', stock: 25, sku: 'LIV-DRE-S' },
        { size: 'M', color: 'White', stock: 30, sku: 'LIV-DRE-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'LIV-DRE-L' },
      ],
    },
    {
      name: 'City Escape Summer Dress',
      slug: 'city-escape-summer-dress',
      description: `Functional and flattering, this lightweight adidas dress is ready when adventure calls. The relaxed shape keeps you comfortable whether you're exploring a new city or enjoying a picnic in the park. A water-repellent finish helps you stay dry in warm-weather showers.

This product is made with 100% recycled materials. By reusing materials that have already been created, we help to reduce waste and our reliance on finite resources and reduce the footprint of the products we make.`,
      price: 41.08,
      category: categories[7],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/aa014a04049245b38987c48d8f51107d_9366/City_Escape_Summer_Dress_Purple_JC5822_01_laydown.jpg',
          alt: 'Bliss Lilac - Front View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/f1b1a1ba075e436090cd823fe7baab8f_9366/City_Escape_Summer_Dress_Purple_JC5822_23_hover_model.jpg',
          alt: 'Bliss Lilac - Icon View',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'XS', color: 'White', stock: 15, sku: 'SUM-DRE-XS' },
        { size: 'S', color: 'White', stock: 25, sku: 'SUM-DRE-S' },
        { size: 'M', color: 'White', stock: 30, sku: 'SUM-DRE-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'SUM-DRE-L' },
      ],
    },
    {
      name: 'Terrex Multi Printed Wind Jacket',
      slug: 'terrex-multi-printed-wind-jacket',
      description: `Exposed ridge or changing weather, this versatile Terrex windbreaker is a lightweight running jacket that lets you push into the alpine or cover up as the weather changes. Lightweight ripstop material blocks the wind and holds in heat. The lightweight design packs into its own pocket for compact storage in a vest or pack. Side pockets keep your phone, snacks and other small stuff handy.

This product is made with 100% recycled materials. By reusing materials that have already been created, we help to reduce waste and our reliance on finite resources and reduce the footprint of the products we make.`,
      price: 95.08,
      category: categories[2],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/966bb623bd96482abfb1c53f0687a99a_9366/Terrex_Multi_Printed_Wind_Jacket_Green_JL9767_01_laydown.jpg',
          alt: 'Pure Teal - Front View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/7fcc236ff6ba49e6824e0931fc021614_9366/Terrex_Multi_Printed_Wind_Jacket_Green_JL9767_23_hover_model.jpg',
          alt: 'Pure Teal - Back View',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'M', color: 'White', stock: 30, sku: 'TER-JK-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'TER-JK-L' },
        { size: 'XL', color: 'White', stock: 25, sku: 'TER-JK-XL' },
      ],
    },
    {
      name: 'MENS HYBRID COLD RDY FULL ZIP JACKET',
      slug: 'mens-hybrid-cold-rdy-full-zip-jacket',
      description: `The adidas Hybrid Cold.RDY Full Zip Jacket is built to give you an edge against the elements—to help you stay locked in on every shot, whatever the weather.

The jacket’s comfortable regular fit gives it a modern silhouette and allows a full range of motion, to help your swing movement be as fluid as possible. Layering is made easy thanks to the zip closure, letting you adapt your look on the move.

Insulated using advanced materials, Cold.RDY technology helps hold in warmth when the temperature dips—ideal for early tee times and brisk afternoon rounds.

Dialled in for performance and refined in style, this is a layer made for the long game—not just the back nine.`,
      price: 117.91,
      category: categories[2],
      images: [
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/7af56593f9674fafa2d84679db023ae8_9366/MENS_HYBRID_COLD_RDY_FULL_ZIP_JACKET_Beige_JM2935_01_laydown.jpg',
          alt: 'Alumina - Side View',
          isPrimary: true,
          order: 1,
        },
        {
          url: 'https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/49d7db414d584cf3854da8f3ceede3fa_9366/MENS_HYBRID_COLD_RDY_FULL_ZIP_JACKET_Black_JL7947_01_laydown.jpg',
          alt: 'Black - Front View',
          isPrimary: false,
          order: 2,
        },
      ],
      variants: [
        { size: 'XS', color: 'White', stock: 15, sku: 'RDY-JK-XS' },
        { size: 'S', color: 'White', stock: 25, sku: 'RDY-JK-S' },
        { size: 'M', color: 'White', stock: 30, sku: 'RDY-JK-M' },
        { size: 'L', color: 'White', stock: 25, sku: 'RDY-JK-L' },
      ],
    },
  ];

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
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
