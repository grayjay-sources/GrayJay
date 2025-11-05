import QRCode from 'qrcode';
import sharp from 'sharp';
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

export async function generatePlaceholderIcon(outputPath: string, platformName: string): Promise<void> {
  try {
    // Create a simple placeholder icon with the first letter of the platform name
    const letter = platformName.charAt(0).toUpperCase();
    const size = 512;
    
    // Create SVG
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" fill="url(#grad1)" rx="64"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="256" 
              font-weight="bold" fill="white" text-anchor="middle" 
              dominant-baseline="central">${letter}</text>
      </svg>
    `;
    
    // Convert SVG to PNG
    await sharp(Buffer.from(svg))
      .png()
      .toFile(outputPath);
  } catch (error) {
    throw new Error(`Failed to generate placeholder icon: ${error}`);
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
 * Fetch and convert favicon to PNG logo
 */
export async function fetchAndConvertLogo(
  platformUrl: string,
  outputPath: string,
  customLogoUrl?: string
): Promise<boolean> {
  try {
    const logoUrl = customLogoUrl || await findFaviconUrl(platformUrl);
    
    if (!logoUrl) {
      console.log('❌ No favicon found, will use placeholder');
      return false;
    }
    
    console.log(`📥 Downloading logo from ${logoUrl}...`);
    const imageBuffer = await downloadFile(logoUrl);
    
    // Convert to PNG and resize to 512x512
    console.log('🎨 Converting to PNG (512x512)...');
    await sharp(imageBuffer)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(outputPath);
    
    console.log(`✅ Logo saved to ${outputPath}`);
    return true;
    
  } catch (error) {
    console.warn(`⚠️  Failed to fetch/convert logo: ${error}`);
    console.log('ℹ️  Will use placeholder instead');
    return false;
  }
}
