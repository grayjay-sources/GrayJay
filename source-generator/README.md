# @grayjay/source-generator

A powerful CLI tool to generate GrayJay source plugin skeleton projects with TypeScript or JavaScript.

## Features

- 🎯 Interactive CLI for easy setup
- 📦 Complete project scaffolding
- 🔧 TypeScript or JavaScript support
- 🖼️ Automatic icon and QR code generation
- 📝 Pre-configured build system with Rollup
- 🎨 Beautiful, modern project structure
- ⚡ Ready-to-use template based on Dailymotion plugin

## Installation

### Global Installation (Recommended)

```bash
npm install -g @grayjay/source-generator
```

### Local Usage with npx

```bash
npx @grayjay/source-generator
```

## Usage

### Interactive Mode (Recommended)

Simply run the command and follow the prompts:

```bash
grayjay-generate
```

Or use the short alias:

```bash
gjsg
```

### Command Line Arguments

```bash
grayjay-generate \
  --name "My Platform" \
  --platform-url "https://example.com" \
  --description "My platform description" \
  --author "Your Name" \
  --repository-url "https://github.com/username/repo" \
  --base-url "https://api.example.com" \
  --uses-api \
  --uses-graphql \
  --uses-auth \
  --uses-comments \
  --uses-playlists \
  --uses-search
```

### Options

| Option | Alias | Description | Required |
|--------|-------|-------------|----------|
| `--name <name>` | `-n` | Platform name | Yes |
| `--platform-url <url>` | `-p` | Platform URL (e.g., https://example.com) | Yes |
| `--repository-url <url>` | `-r` | Repository URL | Yes |
| `--base-url <url>` | `-b` | Base API URL | Yes |
| `--description <text>` | `-d` | Platform description | No |
| `--author <name>` | `-a` | Author name | No |
| `--author-url <url>` | | Author URL | No |
| `--logo-url <url>` | | Logo URL (auto-resolves from favicon if omitted) | No |
| `--uses-api` | | Use REST API | No |
| `--uses-graphql` | | Use GraphQL API | No |
| `--uses-html` | | Use HTML parsing | No |
| `--uses-webscraping` | | Use web scraping | No |
| `--uses-auth` | | Enable authentication support | No |
| `--uses-live` | | Enable live streams support | No |
| `--uses-comments` | | Enable comments support | No |
| `--uses-playlists` | | Enable playlists support | No |
| `--uses-search` | | Enable search support | No |
| `--output <dir>` | `-o` | Output directory | No |
| `--interactive` | `-i` | Force interactive mode | No |
| `--js` | | Generate JavaScript instead of TypeScript | No |

## Examples

### Example 1: Complete Command Line

```bash
grayjay-generate \
  --name "Vimeo" \
  --platform-url "https://vimeo.com" \
  --description "Vimeo video platform" \
  --author "Bluscream" \
  --repository-url "https://github.com/grayjay-sources/vimeo" \
  --base-url "https://api.vimeo.com" \
  --uses-api \
  --uses-graphql \
  --uses-auth \
  --uses-comments \
  --uses-playlists
```

### Example 2: Minimal Command (Interactive Prompts for Rest)

```bash
grayjay-generate -i
```

### Example 3: JavaScript Project

```bash
grayjay-generate --js -i
```

## Generated Project Structure

```
my-platform/
├── src/
│   ├── Script.ts          # Main plugin implementation
│   └── constants.ts       # Constants and configuration
├── assets/
│   └── icon.png          # Auto-generated platform icon
├── types/
│   └── plugin.d.ts       # GrayJay plugin type definitions
├── dist/                 # Build output (created after npm run build)
│   ├── config.json
│   ├── Script.js
│   └── assets/
├── config.json           # Plugin configuration
├── package.json
├── tsconfig.json
├── rollup.config.js
├── README.md
├── .gitignore
└── qrcode.png           # QR code for installation
```

## Development Workflow

After generating your plugin:

1. **Install dependencies:**
   ```bash
   cd my-platform
   npm install
   ```

2. **Implement your plugin logic:**
   Edit `src/Script.ts` and add your API calls and data mapping

3. **Build the plugin:**
   ```bash
   npm run build
   ```

4. **Development mode (watch for changes):**
   ```bash
   npm run dev
   ```

5. **Test in GrayJay:**
   - Open GrayJay app
   - Scan the QR code in `qrcode.png`
   - Or manually import the plugin from the `dist/` folder

## Plugin Capabilities

The generator supports various platform capabilities:

- **REST API**: Standard HTTP REST API integration
- **GraphQL**: GraphQL query support
- **HTML Parsing**: DOM parsing for web scraping
- **Web Scraping**: Advanced web scraping capabilities
- **Authentication**: User login and session management
- **Live Streams**: Real-time video streaming
- **Comments**: User comments and discussions
- **Playlists**: Video playlists and collections
- **Search**: Content search functionality

## Programmatic Usage

You can also use the generator programmatically:

```typescript
import { SourceGenerator } from '@grayjay/source-generator';

const generator = new SourceGenerator({
  outputDir: './my-plugin',
  config: {
    name: 'My Platform',
    platformUrl: 'https://example.com',
    description: 'My platform description',
    author: 'Your Name',
    repositoryUrl: 'https://github.com/username/repo',
    baseUrl: 'https://api.example.com',
    uses: ['api', 'graphql'],
    hasAuth: true,
    hasComments: true,
    hasPlaylists: true,
    hasSearch: true,
    version: 1
  },
  typescript: true
});

await generator.generate();
```

## Requirements

- Node.js >= 14
- npm >= 6.14.4

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Links

- [GrayJay](https://grayjay.app/)
- [GrayJay Plugin Documentation](https://github.com/futo-org/grayjay)
- [NPM Package](https://www.npmjs.com/package/@grayjay/source-generator)
- [GitHub Repository](https://github.com/grayjay-sources/source-generator)

## Support

For issues and questions:
- GitHub Issues: https://github.com/grayjay-sources/source-generator/issues
- GrayJay Discord: https://discord.gg/grayjay

## Acknowledgments

This generator is based on the official GrayJay plugin templates and the Dailymotion plugin structure.
