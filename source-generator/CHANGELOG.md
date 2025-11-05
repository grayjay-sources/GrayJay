# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-05

### Added
- Initial release of @grayjay/source-generator
- Interactive CLI for generating GrayJay source plugins
- Command-line argument support for non-interactive usage
- TypeScript and JavaScript project generation
- Automatic icon generation with platform initials
- QR code generation for easy plugin installation
- Complete project scaffolding with:
  - package.json
  - tsconfig.json
  - rollup.config.js
  - .gitignore
  - README.md
  - Plugin type definitions
- Template-based script generation with support for:
  - REST API integration
  - GraphQL support
  - HTML parsing
  - Web scraping
  - Authentication
  - Live streams
  - Comments
  - Playlists
  - Search functionality
- Pre-configured build system using Rollup
- Comprehensive documentation
- MIT License

### Features
- Generate GrayJay source plugins in seconds
- Support for multiple technologies (API, GraphQL, HTML, WebScraping)
- Optional features (auth, live streams, comments, playlists, search)
- Beautiful CLI with chalk and ora
- Smart defaults based on Dailymotion plugin structure
- Automatic dependency installation
- Ready-to-use project structure

### Technical Details
- Built with TypeScript
- Uses commander for CLI argument parsing
- Uses inquirer for interactive prompts
- Uses sharp for image generation
- Uses qrcode for QR code generation
- Includes comprehensive type definitions
- Full ESM and CommonJS support
