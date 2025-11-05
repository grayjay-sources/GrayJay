const sharp = require("sharp");
const fs = require("fs");

async function generateIcon() {
  const svgPath = "assets/{{PLATFORM_NAME}}Icon.svg";
  const pngPath = "assets/{{PLATFORM_NAME}}Icon.png";

  if (!fs.existsSync(svgPath)) {
    console.error(`❌ SVG not found: ${svgPath}`);
    console.log("💡 Create an SVG icon first, then run this script");
    process.exit(1);
  }

  console.log("📝 Reading SVG...");
  const svgBuffer = fs.readFileSync(svgPath);

  console.log("🎨 Converting to PNG (512x512)...");
  await sharp(svgBuffer).resize(512, 512).png().toFile(pngPath);

  console.log(`✅ Icon generated: ${pngPath}`);

  // Get file size
  const stats = fs.statSync(pngPath);
  console.log(`📦 Size: ${(stats.size / 1024).toFixed(2)} KB`);
}

generateIcon().catch(console.error);
