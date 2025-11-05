const fs = require("fs");
const path = require("path");

async function generateQRCode() {
  try {
    // Try to use qrcode package if available
    const QRCode = require("qrcode");
    const configPath = path.join(__dirname, "..", "config.json");

    if (!fs.existsSync(configPath)) {
      console.error("❌ config.json not found. Run 'npm run build' first.");
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    const installUrl = config.sourceUrl;

    if (!installUrl) {
      console.error("❌ sourceUrl not found in config.json");
      process.exit(1);
    }

    const grayjayUrl = `grayjay://plugin/${installUrl}`;
    console.log(`📱 Generating QR code for: ${grayjayUrl}`);

    const qrPath = path.join(__dirname, "..", "assets", "qrcode.png");

    await QRCode.toFile(qrPath, grayjayUrl, {
      width: 512,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });

    console.log(`✅ QR code generated: ${qrPath}`);

    // Get file size
    const stats = fs.statSync(qrPath);
    console.log(`📦 Size: ${(stats.size / 1024).toFixed(2)} KB`);
  } catch (error) {
    if (error.code === "MODULE_NOT_FOUND") {
      console.error("❌ qrcode package not found.");
      console.log("💡 Install it with: npm install --save-dev qrcode");
      process.exit(1);
    }
    throw error;
  }
}

generateQRCode().catch(console.error);
