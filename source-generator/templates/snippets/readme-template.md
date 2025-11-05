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
│   ├── Script.ts          # Main plugin script
│   ├── constants.ts       # Constants and configuration
│   └── ...               # Additional source files
├── assets/
│   └── qrcode.png        # QR code for installation (generated)
├── dist/                 # Build output (gitignored)
│   ├── config.json       # Minified plugin configuration
│   └── script.js         # Minified and compiled script
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

### Automated Publishing (Recommended)

```bash
# Set your GitHub token once
export GITHUB_TOKEN=your_github_personal_access_token

# Build and publish a new version
npm run build:publish [version]
```

The script will:
1. Build the plugin with `npm run build`
2. Trigger the GitHub release workflow with the specified version
3. The workflow will update config.json, build, generate QR code, and create a release

### Manual Publishing

1. Go to Actions → Release Plugin
2. Click "Run workflow"
3. Enter the new version number
4. The workflow will build, update the version, generate QR code, and create a GitHub release

**Note:** Get a GitHub Personal Access Token at https://github.com/settings/tokens with `repo` permissions.

## Support

For issues and questions, please use the [GitHub Issues]({{REPOSITORY_URL}}/issues) page.

## Acknowledgments

- Built for [GrayJay](https://grayjay.app/)
- Generated using [@grayjay/source-generator](https://www.npmjs.com/package/@grayjay/source-generator)
