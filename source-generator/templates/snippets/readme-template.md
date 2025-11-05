# {{PLATFORM_NAME}} Plugin for GrayJay

{{DESCRIPTION}}

## Installation

### Quick Install

Click this link to install in GrayJay:

**[Install Plugin](grayjay://plugin/https://github.com/{{GITHUB_USER}}/{{REPO_NAME}}/releases/latest/download/config.json)**

Or use this URL:

```
grayjay://plugin/https://github.com/{{GITHUB_USER}}/{{REPO_NAME}}/releases/latest/download/config.json
```

### QR Code

Scan this QR code with the GrayJay app:

![QR Code](assets/qrcode.png)

## Features

- [{{HAS_SEARCH}}] Search
- [{{HAS_AUTH}}] Authentication
- [{{HAS_LIVE_STREAMS}}] Live Streams
- [{{HAS_COMMENTS}}] Comments
- [{{HAS_PLAYLISTS}}] Playlists
- [x] Home Feed
- [x] Channel Details
- [x] Video Details

## Technology Stack

{{TECH_STACK}}

## Development

### Prerequisites

- Node.js >= 14
- npm >= 6.14.4

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

This will generate the minified plugin files in the `dist/` directory.

### Build and Publish

```bash
npm run build:publish [version]
```

This will build the plugin and trigger a GitHub release. Requires `GITHUB_TOKEN` environment variable.

### Development Mode

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

## Project Structure

```
.
├── src/
│   ├── script.ts         # Main plugin entry point
│   ├── constants.ts      # Constants and configuration
│   ├── utils.ts          # Utility functions
│   ├── graphql/          # GraphQL module (if applicable)
│   │   └── queries.ts
│   ├── api/              # API client module (if applicable)
│   │   └── client.ts
│   ├── mappers/          # Data mapping (if applicable)
│   │   └── index.ts
│   ├── pagers/           # Pagination classes (if applicable)
│   │   └── index.ts
│   └── state/            # State management (if applicable)
│       └── index.ts
├── assets/
│   └── qrcode.png        # QR code for installation (generated once)
├── dist/                 # Build output (gitignored)
│   ├── config.json       # Minified plugin configuration
│   └── script.js         # Minified and compiled script
├── .secrets/             # Private keys (gitignored)
│   └── signing_key.pem   # RSA private key for signing
├── scripts/
│   ├── sign.js           # Plugin signing script
│   └── publish.js        # Publishing automation script
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## Configuration

The plugin can be configured through the GrayJay app settings:

- **Enable Debug Logging**: Show detailed logs for debugging

## Platform Information

- **Platform URL**: {{PLATFORM_URL}}
- **Base API URL**: {{BASE_URL}}
  {{AUTHOR_INFO}}
- **Repository**: {{REPOSITORY_URL}}

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Releases

## 🚀 Publishing

```bash
# Publish a new version (auto-bumps patch version)
npm run publish

# Publish with specific version
npm run publish 5

# Or build, sign, and publish in one command
npm run build:publish
```

The publish script will:
1. ✅ Bump the version (or set to specified version)
2. ✅ Build the plugin
3. ✅ Sign the plugin (generate signature and public key)
4. ✅ Generate a QR code for installation
5. ✅ Commit changes
6. ✅ Create a git tag
7. ✅ Push to GitHub (triggers release workflow)

### Prerequisites

- **OpenSSL**: Required for signing (usually pre-installed on Linux/Mac, available via Git Bash on Windows)
- **Git**: With configured remote repository

## Support

For issues and questions, please use the [GitHub Issues]({{REPOSITORY_URL}}/issues) page.

## Acknowledgments

- Built for [GrayJay](https://grayjay.app/)
- Generated using [@grayjay/source-generator](https://www.npmjs.com/package/@grayjay/source-generator)
