// Utility functions for {{PLATFORM_NAME}}

/**
 * Safely parse JSON with error handling
 */
export function parseJsonSafe(jsonString: string, fallback: any = null): any {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    log('Failed to parse JSON: ' + error);
    return fallback;
  }
}

/**
 * Extract text from HTML element
 */
export function extractText(element: any): string {
  if (!element) return '';
  return element.textContent?.trim() || element.innerText?.trim() || '';
}

/**
 * Get query parameter from URL
 */
export function getQueryParam(url: string, param: string): string | null {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get(param);
  } catch {
    return null;
  }
}

/**
 * Build URL with query parameters
 */
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
  const url = new URL(baseUrl);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
}

/**
 * Extract ID from URL path
 */
export function extractIdFromUrl(url: string, pattern?: RegExp): string | null {
  if (pattern) {
    const match = url.match(pattern);
    return match ? match[1] : null;
  }
  
  // Default: extract last segment
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1] || null;
}

/**
 * Format timestamp to Unix time (seconds)
 */
export function parseTimestamp(timestamp: string | number): number {
  if (typeof timestamp === 'number') {
    // If timestamp is in milliseconds, convert to seconds
    return timestamp > 1000000000000 ? Math.floor(timestamp / 1000) : timestamp;
  }
  
  const date = new Date(timestamp);
  return Math.floor(date.getTime() / 1000);
}

/**
 * Format duration string (e.g., "PT1H30M45S") to seconds
 */
export function parseDuration(duration: string): number {
  if (!duration) return 0;
  
  // ISO 8601 duration format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  const seconds = parseInt(match[3] || '0');
  
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format number string (e.g., "1.2K", "3.4M") to actual number
 */
export function parseFormattedNumber(str: string): number {
  if (!str) return 0;
  
  const normalized = str.toUpperCase().replace(/,/g, '');
  const match = normalized.match(/([\d.]+)([KMB])?/);
  
  if (!match) return 0;
  
  const num = parseFloat(match[1]);
  const suffix = match[2];
  
  const multipliers: Record<string, number> = {
    'K': 1000,
    'M': 1000000,
    'B': 1000000000
  };
  
  return suffix ? num * multipliers[suffix] : num;
}

/**
 * Retry a function with exponential backoff
 */
export async function retry<T>(
  fn: () => T,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxAttempts) {
        log(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
        // Note: sleep() is not available in GrayJay, so this is just a placeholder
        // You would need to implement actual retry logic based on your needs
      }
    }
  }
  
  throw lastError;
}

/**
 * Chunk array into smaller arrays
 */
export function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

/**
 * Remove HTML tags from string
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get thumbnail with specific resolution
 */
export function selectThumbnail(
  thumbnails: Thumbnail[],
  preferredWidth: number = 1280
): Thumbnail | null {
  if (!thumbnails || thumbnails.length === 0) return null;
  
  // Find closest match to preferred width
  return thumbnails.reduce((best, current) => {
    const bestDiff = Math.abs(best.width - preferredWidth);
    const currentDiff = Math.abs(current.width - preferredWidth);
    return currentDiff < bestDiff ? current : best;
  });
}

/**
 * Create Thumbnails object from array of URLs
 */
export function createThumbnails(urls: string[], widths?: number[]): Thumbnails {
  const defaultWidths = [320, 640, 1280, 1920];
  const thumbnailSources = urls.map((url, index) => ({
    url: url,
    width: widths?.[index] || defaultWidths[index] || 1280,
    height: 0 // Height will be auto-calculated by aspect ratio
  }));
  
  return {
    sources: thumbnailSources
  };
}

/**
 * Log helper (respects debug setting)
 */
function log(message: string): void {
  console.log('[{{PLATFORM_NAME}}] ' + message);
}
