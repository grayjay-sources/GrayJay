# {{PLATFORM_NAME}} Plugin - Deployment Guide

## 📦 Installation

### For Users

**Via URL:**
```
{{INSTALL_URL}}
```

**Via grayjay-sources.github.io:**
- Visit https://grayjay-sources.github.io
- Find "{{PLATFORM_NAME}}" in the list
- Click "Install"

### For Developers

**Clone and Build:**
```bash
git clone {{REPOSITORY_URL}}
cd {{REPOSITORY_NAME}}
npm install
npm run build
```

**Output:** `build/` folder contains:
- `{{PLATFORM_NAME}}Config.json` - Plugin configuration
- `{{PLATFORM_NAME}}Script.js` - Compiled plugin code
- `{{PLATFORM_NAME}}Icon.png` - Plugin icon (512x512)

## 🔧 Development Setup

### Prerequisites
- Node.js >= 14
- npm >= 6.14.4

### Project Structure
```
{{REPOSITORY_NAME}}/
├── src/                    # TypeScript source files
│   ├── {{PLATFORM_NAME}}Script.ts      # Main plugin logic
│   ├── constants.ts        # API URLs and constants
{{#if USE_GRAPHQL}}│   ├── gqlQueries.ts       # GraphQL queries{{/if}}
│   ├── util.ts             # Helper functions
│   ├── Mappers.ts          # Data converters
│   └── Pagers.ts           # Pagination classes
├── types/                  # Type definitions
│   ├── plugin.d.ts         # GrayJay API types
│   └── types.d.ts          # Platform-specific types
├── assets/                 # Source assets
│   ├── {{PLATFORM_NAME}}Icon.svg        # Icon source
│   └── {{PLATFORM_NAME}}Icon.png        # Generated icon
├── build/                  # Build output (deployed)
│   ├── {{PLATFORM_NAME}}Config.json     # ← Entry point
│   ├── {{PLATFORM_NAME}}Script.js       # Compiled code
│   └── {{PLATFORM_NAME}}Icon.png        # Icon
├── scripts/                # Build scripts
│   └── generate-icon.js    # SVG → PNG converter
├── {{PLATFORM_NAME}}Config.json         # Source config
├── package.json
├── tsconfig.json
└── rollup.config.js
```

### Build Commands

```bash
# Development (watch mode)
npm run dev

# Production build
npm run build

# Generate icon from SVG
npm run generate-icon

# Format code
npm run prettier
```

### Testing Locally

```bash
# 1. Build the plugin
npm run build

# 2. Serve the build folder
cd build
npx serve -p 8080

# 3. Load in GrayJay DevPortal
# Navigate to: http://YOUR_DEV_SERVER:11337/dev
# Config URL: http://YOUR_IP:8080/{{PLATFORM_NAME}}Config.json
```

## 🚀 Deployment

### Automatic (GitHub Actions)
- Builds automatically on push to `main`
- Updates `build/` folder
- Commits build output

### Manual
```bash
git add build/
git commit -m "chore: Update build output"
git push
```

### CDN URLs (after deployment)
- **Config:** `{{INSTALL_URL}}`
- **Script:** `{{SCRIPT_URL}}`
- **Icon:** `{{ICON_URL}}`

## 📋 Release Checklist

Before releasing a new version:

- [ ] Update version number in `{{PLATFORM_NAME}}Config.json`
- [ ] Update changelog in `{{PLATFORM_NAME}}Config.json`
- [ ] Run `npm run build`
- [ ] Test in dev portal
- [ ] Update `README.md` if needed
- [ ] Commit and push
- [ ] Create GitHub release
- [ ] Update `sources.json` (if major changes)

## 🔐 Signing (Optional)

To sign the plugin:

```bash
# Generate keys
# (requires GrayJay signing tools)

# Update config
# - Set scriptSignature
# - Set scriptPublicKey
```

## 📞 Support

- **Issues:** {{REPOSITORY_URL}}/issues
- **Discussions:** {{REPOSITORY_URL}}/discussions
- **Pull Requests:** Welcome!

## 📄 License

MIT License - See `LICENSE` file

