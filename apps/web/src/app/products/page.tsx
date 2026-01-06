import ProductsList from '@/components/ProductsList';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
            isPrimary: true,
            order: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
        variants: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
  ]);

  return <ProductsList initialProducts={products} categories={categories} />;
}
