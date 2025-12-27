import ProductDetail from '@/components/ProductDetail';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await prisma.product.findUnique({
    where: {
      slug: params.slug,
    },
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
      variants: {
        select: {
          id: true,
          size: true,
          color: true,
          sku: true,
          stock: true,
        },
        orderBy: {
          size: 'asc',
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}
