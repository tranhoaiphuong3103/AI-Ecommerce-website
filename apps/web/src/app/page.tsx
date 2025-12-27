import HomeContent from '@/components/HomeContent';
import { prisma } from '@/lib/prisma';

export default async function HomePage() {
  const products = await prisma.product.findMany({
    take: 3,
    include: {
      images: {
        select: {
          id: true,
          url: true,
          alt: true,
          isPrimary: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const badges: Array<'AI Ready' | 'Trending' | 'New'> = ['AI Ready', 'Trending', 'New'];

  const featuredProducts = products.map((product, index) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    images: product.images,
    badge: badges[index % 3],
  }));

  return <HomeContent featuredProducts={featuredProducts} />;
}
