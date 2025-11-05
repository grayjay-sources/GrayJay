import QRCode from 'qrcode';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

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
