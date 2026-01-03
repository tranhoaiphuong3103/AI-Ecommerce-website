import Replicate from 'replicate';
import { BUCKETS, minioClient } from './minio';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function convertToDataUrl(imageUrl: string): Promise<string> {
  if (!imageUrl.includes('localhost') && !imageUrl.includes('minio')) return imageUrl;
  try {
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const bucketName = urlParts[urlParts.length - 2];

    const stream = await minioClient.getObject(bucketName, fileName);

    const chunks: Buffer[] = [];
    for await (const chunk of stream) chunks.push(chunk);

    const buffer = Buffer.concat(chunks);

    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return dataUrl;
  } catch (error) {
    throw new Error(
      `Failed to process user image: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
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
  )
    return 'lower_body';

  if (
    categoryLower.includes('pant') ||
    categoryLower.includes('short') ||
    categoryLower.includes('trouser') ||
    categoryLower.includes('jean') ||
    categoryLower.includes('skirt') ||
    categoryLower.includes('legging')
  )
    return 'lower_body';

  if (
    categoryLower.includes('dress') ||
    categoryLower.includes('gown') ||
    categoryLower.includes('jumpsuit')
  )
    return 'dresses';

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
    ? '⚠️ EXTREME PRIORITY - ULTRA-CRITICAL DETAIL REPRODUCTION: This garment has CLOSE-UP logo/badge detail views that DEMAND ABSOLUTE MAXIMUM CLARITY and PHOTOREALISTIC PRECISION. Every microscopic letter, line, curve, and graphic element MUST be reproduced with KNIFE-EDGE SHARPNESS, ULTRA-HIGH CONTRAST, and PERFECT LEGIBILITY. ZERO tolerance for blur, softness, or detail loss. '
    : '⚠️ MAXIMUM LOGO CLARITY MODE ACTIVATED: ALL logos and text MUST be ULTRA-SHARP with HIGH CONTRAST. ';

  if (
    categoryLower.includes('shoe') ||
    categoryLower.includes('sneaker') ||
    categoryLower.includes('boot') ||
    categoryLower.includes('sandal') ||
    categoryLower.includes('footwear')
  )
    return `${detailEmphasis}CRITICAL DISTINCTION - SHOES vs PANTS: The product to try on is FOOTWEAR (shoes/sneakers/boots) which goes on the FEET ONLY. PANTS are clothing on the LEGS - these are COMPLETELY DIFFERENT items. DO NOT CONFUSE SHOES WITH PANTS.

MANDATORY RULES:
1. IDENTIFY CORRECTLY: SHOES = footwear on FEET at bottom of image. PANTS = leg clothing covering LEGS from waist to ankles.
2. PANTS COLOR ABSOLUTE LOCK: The pants (leg clothing) color in the output MUST BE IDENTICAL to the pants color in the input human image. If input shows WHITE pants, output MUST show WHITE pants. If input shows BLACK pants, output MUST show BLACK pants. DO NOT apply the shoe color to the pants. PANTS and SHOES are separate items with separate colors.
3. REPLACE ONLY FEET AREA: Only modify the footwear on the person's FEET (bottom of legs). Do NOT modify anything on the LEGS (pants area).
4. PRESERVE PANTS COMPLETELY: Keep pants color, fabric, style, wrinkles, and all details EXACTLY as they appear in the input human image. ZERO changes to pants allowed.
5. PRESERVE UPPER BODY: Keep shirt, jacket, face, hands, hair unchanged.
6. NEW SHOE DETAILS: Apply the new shoe design (from garment image) ONLY to the feet area with accurate colors, logos, laces, and sole details.

VERIFICATION: After generation, check that pants color matches input image pants color, NOT the shoe color. Shoes are on feet, pants are on legs - completely different locations and items.`;

  if (categoryLower.includes('jersey'))
    return `${detailEmphasis}ULTRA-CRITICAL LOGO REPRODUCTION - HIGHEST QUALITY MODE: This is a sports jersey with multiple branding elements that MUST be reproduced with ABSOLUTE MAXIMUM SHARPNESS, ULTRA-HIGH CONTRAST, and PHOTOREALISTIC CLARITY.

SPONSOR TEXT & LOGOS - ABSOLUTE TOP PRIORITY - NO COMPROMISES:
1. MAIN SPONSOR TEXT (e.g., "Sportsbet.io", "TeamViewer", "Emirates", "Chevrolet"):
   - Text MUST have ULTRA-SHARP, KNIFE-EDGE borders with ZERO blur or softness
   - MAXIMUM HIGH CONTRAST between text and background - text should POP with extreme clarity
   - PERFECT letter spacing, kerning, and font weight EXACTLY matching original
   - Every single letter, dot, period MUST be CRYSTAL CLEAR and ULTRA-LEGIBLE at full resolution
   - Text edges must be CRISP and RAZOR-SHARP as if professionally screen-printed
   - NO fuzzy edges, NO blending, NO antialiasing artifacts - SHARP ONLY

2. TEAM CREST/BADGE (e.g., Manchester United devil, Arsenal cannon, Chelsea lion):
   - PHOTOGRAPHIC PRECISION with ULTRA-HIGH DETAIL - treat as if photographing a real badge
   - Every tiny element visible: colors, borders, inner emblems, motto text, stars, laurels, decorative flourishes
   - Reproduce fine lines, stitching patterns, metallic effects with MAXIMUM fidelity
   - NO blurring, NO loss of detail, NO simplification - FULL COMPLEXITY REQUIRED

3. BRAND MANUFACTURER LOGO (Adidas three stripes/Nike swoosh/Puma cat/Umbro diamond):
   - PIXEL-PERFECT accuracy with ULTRA-SHARP, CLEAN edges and EXACT proportions
   - Logo must be HIGH CONTRAST against jersey fabric
   - Reproduce any texture, stitching, or 3D effects with maximum clarity

4. SECONDARY SPONSORS/PATCHES (sleeve sponsors, back sponsors, competition badges):
   - Reproduce ALL additional logos with ULTRA-HIGH fidelity and FULLY READABLE text
   - Every small patch, badge, and sponsor element must be SHARP and CLEAR

FABRIC TEXTURE & DESIGN FIDELITY:
5. Maintain AUTHENTIC fabric texture (mesh, polyester weave) with OFFICIAL team colors and stripe patterns EXACTLY as shown
6. Preserve collar design (button-up, V-neck, crew), sleeve details, cuffs, and hem with PHOTOGRAPHIC accuracy
7. Reproduce any numbers, player names, or decorative elements with MAXIMUM clarity and SHARP edges

CRITICAL: Keep lower body clothing (pants/shorts) COMPLETELY UNCHANGED - do not modify color, style, or fit.

QUALITY INSTRUCTION: Generate at HIGHEST POSSIBLE DETAIL LEVEL with MAXIMUM SHARPNESS for all text and logos.`;

  if (
    categoryLower.includes('shirt') ||
    categoryLower.includes('tee') ||
    categoryLower.includes('t-shirt')
  )
    return `${detailEmphasis}ULTRA-CRITICAL LOGO & TEXT REPRODUCTION - HIGHEST QUALITY MODE: ALL logos, graphics, text prints, and brand details MUST be reproduced with ABSOLUTE MAXIMUM SHARPNESS, ULTRA-HIGH CONTRAST, and PHOTOREALISTIC CLARITY.

STRICT REQUIREMENTS - NO COMPROMISES:
1. BRAND LOGOS (Adidas/Nike/Puma/Supreme/Champion/etc.):
   - ULTRA-SHARP, KNIFE-EDGE borders with ZERO blur or softness
   - PIXEL-PERFECT accuracy in proportions, angles, and spacing
   - MAXIMUM HIGH CONTRAST - logos must POP against fabric
   - NO blurring, NO fuzzy edges, NO antialiasing artifacts

2. TEXT PRINTS AND TYPOGRAPHY (slogans, brand names, graphics text):
   - Every single letter, word, character MUST be CRYSTAL CLEAR and ULTRA-LEGIBLE at full resolution
   - Text edges CRISP and RAZOR-SHARP as if professionally screen-printed
   - PERFECT letter spacing, kerning, and alignment EXACTLY matching original
   - MAXIMUM contrast between text and background

3. GRAPHIC PRINTS AND ARTWORK (illustrations, photos, abstract designs):
   - ULTRA-HIGH FIDELITY reproduction - every line, curve, gradient, color transition must match the original EXACTLY
   - Fine details, thin lines, small elements reproduced with PHOTOGRAPHIC PRECISION
   - NO simplification, NO loss of detail, NO blending

4. SMALL DETAILS (tags, labels, neck prints, decorative elements):
   - Reproduce with MAXIMUM clarity and SHARP edges
   - Every tiny element must be visible and recognizable

Keep AUTHENTIC fabric texture, collar style, seam lines, and all construction details. Keep lower body clothing COMPLETELY UNCHANGED.

QUALITY INSTRUCTION: Generate at HIGHEST POSSIBLE DETAIL LEVEL with MAXIMUM SHARPNESS for all text and graphics.`;

  if (
    categoryLower.includes('jacket') ||
    categoryLower.includes('hoodie') ||
    categoryLower.includes('hoody') ||
    categoryLower.includes('sweatshirt') ||
    categoryLower.includes('sweater') ||
    categoryLower.includes('coat')
  )
    return `${detailEmphasis}ULTRA-CRITICAL LOGO & DETAIL REPRODUCTION - HIGHEST QUALITY MODE: ALL logos, badges, emblems, patches, and brand details MUST be reproduced with ABSOLUTE MAXIMUM SHARPNESS, ULTRA-HIGH CONTRAST, and PHOTOREALISTIC CLARITY.

BRANDING REQUIREMENTS - NO COMPROMISES:
1. BRAND MANUFACTURER LOGOS (Adidas three stripes/Nike swoosh/Puma cat/The North Face/Champion C/etc.):
   - PIXEL-PERFECT accuracy with ULTRA-SHARP, KNIFE-EDGE borders and EXACT proportions
   - MAXIMUM HIGH CONTRAST against fabric - logos must POP with extreme clarity
   - NO blurring, NO fuzzy edges, NO softness - CRISP ONLY
   - Reproduce any 3D effects, embossing, or texture with PHOTOGRAPHIC PRECISION

2. TEAM CRESTS, PATCHES, AND EMBROIDERY (sports teams, university logos, custom patches):
   - Reproduce EVERY microscopic detail - colors, stitching patterns, thread texture, borders, inner text, emblems, decorative elements
   - ULTRA-HIGH DETAIL as if photographing real embroidered patch
   - Fine lines, curved stitching, metallic threads ALL visible with MAXIMUM fidelity
   - NO loss of detail, NO simplification, NO blurring - FULL COMPLEXITY REQUIRED

3. TEXT PRINTS AND LABELS (brand names, slogans, size tags, care labels):
   - Every single letter, character MUST be CRYSTAL CLEAR, ULTRA-SHARP, and FULLY LEGIBLE at full resolution
   - Text edges RAZOR-SHARP as if professionally printed or embroidered
   - MAXIMUM contrast with PERFECT readability

4. SMALL HARDWARE DETAILS (zippers, zipper pulls, buttons, snaps, toggles, drawstring tips):
   - Reproduce with MAXIMUM clarity and SHARP edges
   - Metallic finishes, brand logos on zippers, button engravings ALL visible

MATERIAL & CONSTRUCTION FIDELITY:
5. Maintain AUTHENTIC material texture (windbreaker nylon/fleece/cotton/down puffer/leather) EXACTLY as shown with realistic fabric behavior
6. Preserve zipper tracks, pocket flaps, hood construction, drawstrings, and seam lines with PHOTOGRAPHIC accuracy
7. Keep collar shape, cuff ribbing, hem details, and all construction elements IDENTICAL to original

CRITICAL: Keep lower body pants and shoes COMPLETELY UNCHANGED - do not modify color, style, or fit.

QUALITY INSTRUCTION: Generate at HIGHEST POSSIBLE DETAIL LEVEL with MAXIMUM SHARPNESS for all logos, patches, and text elements.`;

  if (
    categoryLower.includes('pant') ||
    categoryLower.includes('trouser') ||
    categoryLower.includes('jean')
  )
    return 'Well-fitted pants with natural fabric draping and realistic seams. Keep upper body shirt and shoes unchanged.';

  if (categoryLower.includes('short'))
    return 'Comfortable shorts with authentic texture. Preserve original top clothing and footwear.';

  if (categoryLower.includes('skirt'))
    return 'Elegant skirt with natural fabric flow. Keep upper body clothing and shoes as is.';

  if (categoryLower.includes('dress') || categoryLower.includes('gown'))
    return 'Elegant dress with fine fabric details, natural draping, and authentic texture';

  if (category === 'upper_body')
    return '⚠️ ULTRA-CRITICAL LOGO CLARITY MODE: High-quality upper body garment with detailed texture. Reproduce ALL logos, text, and brand elements with ABSOLUTE MAXIMUM SHARPNESS - KNIFE-EDGE borders, ULTRA-HIGH CONTRAST, and PHOTOREALISTIC CLARITY. Every single letter, character, and graphic element must be CRYSTAL CLEAR, ULTRA-LEGIBLE, and RAZOR-SHARP. NO blur, NO softness, NO fuzzy edges. Preserve original pants, shoes, and lower body COMPLETELY unchanged.';

  if (category === 'lower_body') {
    if (
      productCategory &&
      (productCategory.toLowerCase().includes('shoe') ||
        productCategory.toLowerCase().includes('sneaker') ||
        productCategory.toLowerCase().includes('boot'))
    )
      return 'Premium footwear with authentic details. ONLY replace shoes. Keep all clothing, face, and accessories unchanged.';

    return 'Premium lower body garment with natural fit. Keep original shirt, upper body, and shoes unchanged.';
  }

  return '⚠️ ULTRA-CRITICAL LOGO CLARITY MODE ACTIVATED: Premium clothing item with authentic texture and realistic fabric details. Reproduce ALL logos, text, and brand elements with ABSOLUTE MAXIMUM SHARPNESS - KNIFE-EDGE borders, ULTRA-HIGH CONTRAST, PHOTOREALISTIC PRECISION. Every single letter, character, line, and graphic element must be CRYSTAL CLEAR, ULTRA-LEGIBLE, and RAZOR-SHARP at full resolution. NO blur, NO softness, NO fuzzy edges, NO detail loss. Generate at HIGHEST POSSIBLE QUALITY.';
}

export async function generateVirtualTryOn(params: TryOnParams): Promise<TryOnResult> {
  try {
    const { personImage, garmentImage, category, productCategory } = params;

    let personImageUrl = typeof personImage === 'string' ? personImage : '';
    let garmentImageUrl = typeof garmentImage === 'string' ? garmentImage : '';

    if (!personImageUrl || !garmentImageUrl)
      throw new Error('Both person image and garment image URLs are required');

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
      } else if (typeof lastItem === 'string') resultImageUrl = lastItem;
    } else if (typeof output === 'string') resultImageUrl = output;

    if (!resultImageUrl || typeof resultImageUrl !== 'string')
      throw new Error(
        'Invalid output from Replicate API. Unable to extract image URL from output.',
      );

    const imageBlob = await fetchImageAsBlob(resultImageUrl);
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { uploadFile } = await import('./minio');
    const fileName = `tryon-${Date.now()}.png`;
    const imageUrl = await uploadFile(BUCKETS.VIDEOS, fileName, buffer);

    return {
      imageUrl,
      status: 'success',
    };
  } catch (error) {
    console.error('[Replicate] generateVirtualTryOn error:', error);
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

export async function generateTryOnImage(params: TryOnParams): Promise<TryOnResult> {
  try {
    const tryOnResult = await generateVirtualTryOn(params);

    if (tryOnResult.status === 'failed') return tryOnResult;

    return tryOnResult;
  } catch (error) {
    return {
      imageUrl: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const generateTryOnVideo = generateTryOnImage;

async function fetchImageAsBlob(image: string | Blob): Promise<Blob> {
  if (image instanceof Blob) return image;

  const response = await fetch(image);
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);

  return await response.blob();
}

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

export async function healthCheck(): Promise<boolean> {
  try {
    if (!process.env.REPLICATE_API_TOKEN) return false;

    return true;
  } catch (_error) {
    return false;
  }
}
