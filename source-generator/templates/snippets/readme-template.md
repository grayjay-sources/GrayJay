# {{PLATFORM_NAME}} Plugin for GrayJay

{{DESCRIPTION}}

## Installation

Scan this QR code with the GrayJay app to install the plugin:

![QR Code]({{QR_PATH}})

Or click [here]({{REPOSITORY_URL}}) to install manually.

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

This will generate the plugin files in the `dist/` directory.

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
│   ├── icon.png          # Plugin icon
│   └── qrcode.png        # QR code for installation
├── dist/
│   ├── config.json       # Plugin configuration (generated)
│   ├── Script.js         # Compiled script (generated)
│   └── assets/           # Assets (copied)
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

## Support

For issues and questions, please use the [GitHub Issues]({{REPOSITORY_URL}}/issues) page.

## Acknowledgments

- Built for [GrayJay](https://grayjay.app/)
- Generated using [@grayjay/source-generator](https://www.npmjs.com/package/@grayjay/source-generator)
