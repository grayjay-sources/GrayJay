import QRCode from 'qrcode';
import { promises as fs } from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

export async function generateQRCode(url: string, outputPath: string): Promise<void> {
  try {
    await QRCode.toFile(outputPath, url, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error}`);
  }
}


export async function ensureAssetsDirectory(baseDir: string): Promise<string> {
  const assetsDir = path.join(baseDir, 'assets');
  await fs.mkdir(assetsDir, { recursive: true });
  return assetsDir;
}

/**
 * Download a file from a URL
 */
async function downloadFile(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Handle redirects
        if (response.headers.location) {
          downloadFile(response.headers.location).then(resolve).catch(reject);
        } else {
          reject(new Error('Redirect without location header'));
        }
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      const chunks: Buffer[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
      response.on('error', reject);
    }).on('error', reject);
  });
}

/**
 * Fetch HTML and parse for favicon links
 */
async function findFaviconUrl(platformUrl: string): Promise<string | null> {
  try {
    console.log(`🔍 Searching for favicon on ${platformUrl}...`);
    
    // Try to fetch the homepage HTML
    const html = (await downloadFile(platformUrl)).toString('utf-8');
    
    // Parse for various favicon formats
    const faviconPatterns = [
      /<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]+href=["']([^"']+)["']/i,
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:icon|shortcut icon)["']/i,
      /<link[^>]+rel=["']apple-touch-icon["'][^>]+href=["']([^"']+)["']/i,
    ];
    
    for (const pattern of faviconPatterns) {
      const match = html.match(pattern);
      if (match && match[1]) {
        let faviconUrl = match[1];
        
        // Handle relative URLs
        if (faviconUrl.startsWith('//')) {
          faviconUrl = 'https:' + faviconUrl;
        } else if (faviconUrl.startsWith('/')) {
          const baseUrl = new URL(platformUrl);
          faviconUrl = `${baseUrl.protocol}//${baseUrl.host}${faviconUrl}`;
        } else if (!faviconUrl.startsWith('http')) {
          const baseUrl = new URL(platformUrl);
          faviconUrl = `${baseUrl.protocol}//${baseUrl.host}/${faviconUrl}`;
        }
        
        console.log(`✅ Found favicon: ${faviconUrl}`);
        return faviconUrl;
      }
    }
    
    // Fallback to /favicon.ico
    const baseUrl = new URL(platformUrl);
    const defaultFavicon = `${baseUrl.protocol}//${baseUrl.host}/favicon.ico`;
    console.log(`ℹ️  No favicon link found, trying default: ${defaultFavicon}`);
    return defaultFavicon;
    
  } catch (error) {
    console.warn(`⚠️  Could not fetch favicon: ${error}`);
    return null;
  }
}

/**
 * Resolve logo URL from custom URL or favicon detection
 * Returns the URL without downloading to avoid DMCA issues
 * Falls back to GrayJay default logo if resolution fails
 */
export async function resolveLogoUrl(
  platformUrl: string,
  customLogoUrl?: string
): Promise<string> {
  const DEFAULT_LOGO_URL = 'https://grayjay.app/images/webclip.png';
  
  try {
    // If custom URL is empty string or whitespace, use default
    if (customLogoUrl && customLogoUrl.trim()) {
      console.log(`✅ Using provided logo URL: ${customLogoUrl}`);
      return customLogoUrl;
    }
    
    // Try to find favicon from platform
    const faviconUrl = await findFaviconUrl(platformUrl);
    
    if (!faviconUrl) {
      console.log(`ℹ️  No favicon found, using GrayJay default logo`);
      return DEFAULT_LOGO_URL;
    }
    
    console.log(`✅ Resolved logo URL: ${faviconUrl}`);
    return faviconUrl;
    
  } catch (error) {
    console.warn(`⚠️  Failed to resolve logo URL: ${error}`);
    console.log(`ℹ️  Using GrayJay default logo`);
    return DEFAULT_LOGO_URL;
  }
}
