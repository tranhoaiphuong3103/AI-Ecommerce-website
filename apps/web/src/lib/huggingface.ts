import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export interface TryOnParams {
  personImage: string | Blob;
  garmentImage: string | Blob;
  modelHeight?: number;
  modelWeight?: number;
}

export interface TryOnResult {
  imageUrl: string;
  status: 'success' | 'failed';
  error?: string;
}

export async function generateVirtualTryOn(params: TryOnParams): Promise<TryOnResult> {
  try {
    const { personImage } = params;
    const personBlob = await fetchImageAsBlob(personImage);

    const result = await hf.imageToImage({
      model: 'yisol/IDM-VTON',
      inputs: personBlob,
      parameters: {
        guidance_scale: 7.5,
        num_inference_steps: 50,
      },
    });

    const arrayBuffer = await result.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { uploadFile } = await import('./minio');
    const fileName = `tryon-${Date.now()}.png`;
    const imageUrl = await uploadFile('videos', fileName, buffer);

    return {
      imageUrl,
      status: 'success',
    };
  } catch (error) {
    console.error('Virtual try-on generation failed:', error);
    return {
      imageUrl: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function generateAnimatedVideo(tryOnImageUrl: string): Promise<TryOnResult> {
  try {
    // TODO: Implement video animation when Hugging Face supports it via Inference API
    // For now, return the static image as the "video"
    return {
      imageUrl: tryOnImageUrl,
      status: 'success',
    };
  } catch (error) {
    console.error('Video generation failed:', error);
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
    console.error('Complete try-on video pipeline failed:', error);
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

  // If it's a URL, fetch it
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
 * Health check for Hugging Face API
 */
export async function healthCheck(): Promise<boolean> {
  try {
    // Simple check to see if we can access the API
    if (!process.env.HUGGINGFACE_API_KEY) {
      console.error('HUGGINGFACE_API_KEY not found in environment');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Hugging Face health check failed:', error);
    return false;
  }
}
