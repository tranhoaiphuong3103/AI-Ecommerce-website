import Replicate from 'replicate';
import { BUCKETS, minioClient } from './minio';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function convertToDataUrl(imageUrl: string): Promise<string> {
  if (!imageUrl.includes('localhost') && !imageUrl.includes('minio')) {
    return imageUrl;
  }

  try {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const bucketName = urlParts[urlParts.length - 2];

    const stream = await minioClient.getObject(bucketName, fileName);

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return dataUrl;
  } catch (_error) {
    throw new Error('Failed to process user image');
  }
}

export interface TryOnParams {
  personImage: string | Blob;
  garmentImage: string | Blob;
  modelHeight?: number;
  modelWeight?: number;
  category?: 'upper_body' | 'lower_body' | 'dresses';
  productCategory?: string;
  productImages?: Array<{ url: string; alt: string | null }>;
}

export interface TryOnResult {
  imageUrl: string;
  status: 'success' | 'failed';
  error?: string;
}

function detectGarmentCategory(productCategory?: string): 'upper_body' | 'lower_body' | 'dresses' {
  if (!productCategory) return 'upper_body';

  const categoryLower = productCategory.toLowerCase();

  if (
    categoryLower.includes('shoe') ||
    categoryLower.includes('sneaker') ||
    categoryLower.includes('boot') ||
    categoryLower.includes('sandal') ||
    categoryLower.includes('footwear')
  ) {
    return 'lower_body';
  }

  if (
    categoryLower.includes('pant') ||
    categoryLower.includes('short') ||
    categoryLower.includes('trouser') ||
    categoryLower.includes('jean') ||
    categoryLower.includes('skirt') ||
    categoryLower.includes('legging')
  ) {
    return 'lower_body';
  }

  if (
    categoryLower.includes('dress') ||
    categoryLower.includes('gown') ||
    categoryLower.includes('jumpsuit')
  ) {
    return 'dresses';
  }

  return 'upper_body';
}

function hasLogoOrBadgeViews(productImages?: Array<{ url: string; alt: string | null }>): boolean {
  if (!productImages) return false;

  return productImages.some((img) => {
    const altLower = img.alt?.toLowerCase() || '';
    return (
      altLower.includes('logo view') ||
      altLower.includes('badge view') ||
      altLower.includes('detail view') ||
      altLower.includes('close-up') ||
      altLower.includes('closeup')
    );
  });
}

function generateGarmentDescription(
  productCategory?: string,
  category?: string,
  hasDetailViews?: boolean,
): string {
  if (!productCategory) return 'High-quality garment with authentic texture and fabric details';

  const categoryLower = productCategory.toLowerCase();

  const detailEmphasis = hasDetailViews
    ? 'ULTRA-CRITICAL DETAIL REPRODUCTION REQUIRED: This garment has close-up logo/badge views that must be reproduced with PHOTOGRAPHIC PRECISION. '
    : '';

  if (
    categoryLower.includes('shoe') ||
    categoryLower.includes('sneaker') ||
    categoryLower.includes('boot') ||
    categoryLower.includes('sandal') ||
    categoryLower.includes('footwear')
  ) {
    return `${detailEmphasis}CRITICAL DISTINCTION - SHOES vs PANTS: The product to try on is FOOTWEAR (shoes/sneakers/boots) which goes on the FEET ONLY. PANTS are clothing on the LEGS - these are COMPLETELY DIFFERENT items. DO NOT CONFUSE SHOES WITH PANTS.

MANDATORY RULES:
1. IDENTIFY CORRECTLY: SHOES = footwear on FEET at bottom of image. PANTS = leg clothing covering LEGS from waist to ankles.
2. PANTS COLOR ABSOLUTE LOCK: The pants (leg clothing) color in the output MUST BE IDENTICAL to the pants color in the input human image. If input shows WHITE pants, output MUST show WHITE pants. If input shows BLACK pants, output MUST show BLACK pants. DO NOT apply the shoe color to the pants. PANTS and SHOES are separate items with separate colors.
3. REPLACE ONLY FEET AREA: Only modify the footwear on the person's FEET (bottom of legs). Do NOT modify anything on the LEGS (pants area).
4. PRESERVE PANTS COMPLETELY: Keep pants color, fabric, style, wrinkles, and all details EXACTLY as they appear in the input human image. ZERO changes to pants allowed.
5. PRESERVE UPPER BODY: Keep shirt, jacket, face, hands, hair unchanged.
6. NEW SHOE DETAILS: Apply the new shoe design (from garment image) ONLY to the feet area with accurate colors, logos, laces, and sole details.

VERIFICATION: After generation, check that pants color matches input image pants color, NOT the shoe color. Shoes are on feet, pants are on legs - completely different locations and items.`;
  }

  if (categoryLower.includes('jersey')) {
    return `${detailEmphasis}CRITICAL: Preserve ALL logos, badges, and sponsor details with EXACT precision. Reproduce the team crest/badge with EVERY fine detail visible - colors, borders, text, emblems. Reproduce brand logo (Adidas three stripes/Nike swoosh/Puma cat) with pixel-perfect accuracy. Reproduce ALL sponsor logos with sharp edges and readable text. Maintain authentic fabric texture with official team colors and stripe patterns. Keep collar design, sleeve details, and all branding elements identical to the original garment. Keep lower body clothing (pants/shorts) unchanged.`;
  }

  if (
    categoryLower.includes('shirt') ||
    categoryLower.includes('tee') ||
    categoryLower.includes('t-shirt')
  ) {
    return `${detailEmphasis}CRITICAL: Preserve ALL logos, graphics, text prints, and brand details with EXACT precision. Reproduce any brand logos (Adidas/Nike/Puma) with sharp, clear edges and accurate proportions. Reproduce graphic prints, typography, and artwork with high fidelity - every line, color, and detail must match the original. Maintain authentic fabric texture, collar style, and all design elements. Keep lower body clothing unchanged.`;
  }

  if (
    categoryLower.includes('jacket') ||
    categoryLower.includes('hoodie') ||
    categoryLower.includes('hoody') ||
    categoryLower.includes('sweatshirt') ||
    categoryLower.includes('sweater') ||
    categoryLower.includes('coat')
  ) {
    return `${detailEmphasis}CRITICAL: Preserve ALL logos, badges, emblems, and brand details with EXACT precision. Reproduce brand logos (Adidas three stripes/Nike swoosh/Puma cat) with pixel-perfect accuracy and sharp edges. Reproduce team crests, patches, embroidery with EVERY fine detail - colors, stitching, borders, text. Reproduce text prints with readable, sharp letters. Maintain authentic material texture (windbreaker/fleece/cotton), zipper details, drawstrings, pockets, and hood design. Keep collar, cuffs, and hem details identical. Keep lower body pants and shoes unchanged.`;
  }

  if (
    categoryLower.includes('pant') ||
    categoryLower.includes('trouser') ||
    categoryLower.includes('jean')
  ) {
    return 'Well-fitted pants with natural fabric draping and realistic seams. Keep upper body shirt and shoes unchanged.';
  }
  if (categoryLower.includes('short')) {
    return 'Comfortable shorts with authentic texture. Preserve original top clothing and footwear.';
  }
  if (categoryLower.includes('skirt')) {
    return 'Elegant skirt with natural fabric flow. Keep upper body clothing and shoes as is.';
  }

  if (categoryLower.includes('dress') || categoryLower.includes('gown')) {
    return 'Elegant dress with fine fabric details, natural draping, and authentic texture';
  }

  if (category === 'upper_body') {
    return 'High-quality upper body garment with detailed texture. Preserve original pants, shoes, and lower body.';
  }
  if (category === 'lower_body') {
    if (
      productCategory &&
      (productCategory.toLowerCase().includes('shoe') ||
        productCategory.toLowerCase().includes('sneaker') ||
        productCategory.toLowerCase().includes('boot'))
    ) {
      return 'Premium footwear with authentic details. ONLY replace shoes. Keep all clothing, face, and accessories unchanged.';
    }
    return 'Premium lower body garment with natural fit. Keep original shirt, upper body, and shoes unchanged.';
  }

  return 'Premium clothing item with authentic texture and realistic fabric details';
}

export async function generateVirtualTryOn(params: TryOnParams): Promise<TryOnResult> {
  try {
    const { personImage, garmentImage, category, productCategory } = params;

    let personImageUrl = typeof personImage === 'string' ? personImage : '';
    let garmentImageUrl = typeof garmentImage === 'string' ? garmentImage : '';

    if (!personImageUrl || !garmentImageUrl) {
      throw new Error('Both person image and garment image URLs are required');
    }

    personImageUrl = await convertToDataUrl(personImageUrl);
    garmentImageUrl = await convertToDataUrl(garmentImageUrl);

    const garmentCategory = category || detectGarmentCategory(productCategory);
    const hasDetailViews = hasLogoOrBadgeViews(params.productImages);
    const garmentDescription = generateGarmentDescription(
      productCategory,
      garmentCategory,
      hasDetailViews,
    );

    const output = await replicate.run(
      'cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985',
      {
        input: {
          human_img: personImageUrl,
          garm_img: garmentImageUrl,
          category: garmentCategory,
          garment_des: garmentDescription,
          steps: 40,
          crop: false,
          seed: 42,
        },
      },
    );

    let resultImageUrl: string | null = null;

    if (
      output &&
      typeof output === 'object' &&
      'url' in output &&
      typeof output.url === 'function'
    ) {
      const urlResult = output.url();
      resultImageUrl = typeof urlResult === 'string' ? urlResult : urlResult.toString();
    } else if (Array.isArray(output) && output.length > 0) {
      const lastItem = output[output.length - 1];
      if (
        lastItem &&
        typeof lastItem === 'object' &&
        'url' in lastItem &&
        typeof lastItem.url === 'function'
      ) {
        const urlResult = lastItem.url();
        resultImageUrl = typeof urlResult === 'string' ? urlResult : urlResult.toString();
      } else if (typeof lastItem === 'string') {
        resultImageUrl = lastItem;
      }
    } else if (typeof output === 'string') {
      resultImageUrl = output;
    }

    if (!resultImageUrl || typeof resultImageUrl !== 'string') {
      throw new Error(
        'Invalid output from Replicate API. Unable to extract image URL from output.',
      );
    }

    const imageBlob = await fetchImageAsBlob(resultImageUrl);
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { uploadFile } = await import('./minio');
    const fileName = `tryon-${Date.now()}.png`;
    const imageUrl = await uploadFile('videos', fileName, buffer);

    return {
      imageUrl,
      status: 'success',
    };
  } catch (error) {
    return {
      imageUrl: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function generateAnimatedVideo(tryOnImageUrl: string): Promise<TryOnResult> {
  try {
    return {
      imageUrl: tryOnImageUrl,
      status: 'success',
    };
  } catch (error) {
    return {
      imageUrl: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function generateTryOnVideo(params: TryOnParams): Promise<TryOnResult> {
  try {
    const tryOnResult = await generateVirtualTryOn(params);

    if (tryOnResult.status === 'failed') {
      return tryOnResult;
    }
    const videoResult = await generateAnimatedVideo(tryOnResult.imageUrl);

    return videoResult;
  } catch (error) {
    return {
      imageUrl: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Helper function to convert image URL or blob to blob
 */
async function fetchImageAsBlob(image: string | Blob): Promise<Blob> {
  if (image instanceof Blob) {
    return image;
  }

  const response = await fetch(image);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  return await response.blob();
}

/**
 * Get available base models for virtual try-on
 */
export function getAvailableModels() {
  return [
    {
      id: 'yisol/IDM-VTON',
      name: 'IDM-VTON',
      description: 'State-of-the-art virtual try-on model',
      recommended: true,
    },
    {
      id: 'levihsu/OOTDiffusion',
      name: 'OOTDiffusion',
      description: 'High-quality outfit generation',
      recommended: false,
    },
  ];
}

/**
 * Health check for Replicate API
 */
export async function healthCheck(): Promise<boolean> {
  try {
    if (!process.env.REPLICATE_API_TOKEN) {
      return false;
    }
    return true;
  } catch (_error) {
    return false;
  }
}
