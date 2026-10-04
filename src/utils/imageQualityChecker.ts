export interface ImageQualityResult {
  isAcceptable: boolean;
  brightnessScore: number; // 0 to 100
  brightnessStatus: 'too_dark' | 'optimal' | 'too_bright';
  sharpnessScore: number; // 0 to 100
  sharpnessStatus: 'blurry' | 'moderate' | 'sharp';
  resolutionStatus: 'low' | 'adequate' | 'high';
  suggestions: string[];
}

/**
 * Analyzes an image base64 data URL for brightness, sharpness/blur, and resolution.
 * Provides instant feedback before sending to Gemini multimodal vision.
 */
export async function analyzeImageQuality(dataUrl: string): Promise<ImageQualityResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(getDefaultPassResult());
          return;
        }

        // Downscale for rapid analysis
        const width = Math.min(img.width, 320);
        const height = Math.round((img.height / img.width) * width);
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // 1. Calculate Average Luminance
        let totalLuminance = 0;
        const pixelCount = width * height;
        const grays = new Float32Array(pixelCount);

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Standard perceived luminance formula
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += lum;
          grays[i / 4] = lum;
        }

        const avgLuminance = totalLuminance / pixelCount;
        let brightnessStatus: 'too_dark' | 'optimal' | 'too_bright' = 'optimal';
        let brightnessScore = 85;

        if (avgLuminance < 48) {
          brightnessStatus = 'too_dark';
          brightnessScore = Math.max(10, Math.round((avgLuminance / 48) * 45));
        } else if (avgLuminance > 218) {
          brightnessStatus = 'too_bright';
          brightnessScore = Math.max(20, Math.round(((255 - avgLuminance) / 37) * 45));
        } else {
          brightnessStatus = 'optimal';
          brightnessScore = 95;
        }

        // 2. Calculate Laplacian / Edge Variance for Sharpness
        let varianceSum = 0;
        let edgeCount = 0;

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = y * width + x;
            // Simple Laplacian kernel: [0, 1, 0, 1, -4, 1, 0, 1, 0]
            const laplacian =
              grays[idx - width] +
              grays[idx + width] +
              grays[idx - 1] +
              grays[idx + 1] -
              4 * grays[idx];

            varianceSum += laplacian * laplacian;
            edgeCount++;
          }
        }

        const variance = edgeCount > 0 ? varianceSum / edgeCount : 0;
        let sharpnessStatus: 'blurry' | 'moderate' | 'sharp' = 'sharp';
        let sharpnessScore = 88;

        if (variance < 65) {
          sharpnessStatus = 'blurry';
          sharpnessScore = Math.max(15, Math.round((variance / 65) * 50));
        } else if (variance < 140) {
          sharpnessStatus = 'moderate';
          sharpnessScore = 72;
        } else {
          sharpnessStatus = 'sharp';
          sharpnessScore = 94;
        }

        // 3. Resolution Status
        let resolutionStatus: 'low' | 'adequate' | 'high' = 'high';
        if (img.width < 400 || img.height < 400) {
          resolutionStatus = 'low';
        } else if (img.width < 800 || img.height < 800) {
          resolutionStatus = 'adequate';
        }

        // Suggestions
        const suggestions: string[] = [];
        if (brightnessStatus === 'too_dark') {
          suggestions.push('Move to a sunny or well-lit spot, or step outdoors into open daylight.');
        } else if (brightnessStatus === 'too_bright') {
          suggestions.push('Avoid direct harsh glare or flashlight flare bouncing off glossy leaves.');
        }

        if (sharpnessStatus === 'blurry') {
          suggestions.push('Hold your smartphone steady with both hands and tap the screen on the infected leaf to focus.');
        }

        if (resolutionStatus === 'low') {
          suggestions.push('Get closer to the leaf or lesion rather than zooming in digitally from far away.');
        }

        const isAcceptable = brightnessStatus !== 'too_dark' && sharpnessStatus !== 'blurry';

        resolve({
          isAcceptable,
          brightnessScore,
          brightnessStatus,
          sharpnessScore,
          sharpnessStatus,
          resolutionStatus,
          suggestions,
        });
      } catch (err) {
        console.warn('Image quality analysis error, defaulting to pass:', err);
        resolve(getDefaultPassResult());
      }
    };

    img.onerror = () => {
      resolve(getDefaultPassResult());
    };

    img.src = dataUrl;
  });
}

function getDefaultPassResult(): ImageQualityResult {
  return {
    isAcceptable: true,
    brightnessScore: 85,
    brightnessStatus: 'optimal',
    sharpnessScore: 85,
    sharpnessStatus: 'sharp',
    resolutionStatus: 'adequate',
    suggestions: [],
  };
}
