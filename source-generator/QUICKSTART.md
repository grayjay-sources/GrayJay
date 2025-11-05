# Quick Start Guide

Get up and running with @grayjay/source-generator in minutes!

## Installation

Install globally to use anywhere:

```bash
npm install -g @grayjay/source-generator
```

Or use with npx (no installation required):

```bash
npx @grayjay/source-generator
```

## Usage Examples

### Interactive Mode (Easiest)

Just run the command and answer the prompts:

```bash
grayjay-generate
```

Or use the short alias:

```bash
gjsg
```

### Command Line Mode

Generate a plugin with all options specified:

```bash
grayjay-generate \
  --name "My Platform" \
  --platform-url "https://example.com" \
  --description "My platform description" \
  --author "Your Name" \
  --repository-url "https://github.com/username/my-platform" \
  --base-url "https://api.example.com" \
  --uses "api,graphql" \
  --auth \
  --comments \
  --playlists \
  --search
```

### Common Use Cases

#### 1. Simple REST API Platform

```bash
gjsg \
  -n "Simple Video Site" \
  -p "https://videos.example.com" \
  -r "https://github.com/me/simple-video" \
  -b "https://api.videos.example.com" \
  -u "api"
```

#### 2. GraphQL Platform with Auth

```bash
gjsg \
  -n "GraphQL Video Platform" \
  -p "https://gqlvideos.com" \
  -r "https://github.com/me/gql-videos" \
  -b "https://api.gqlvideos.com" \
  -u "graphql" \
  --auth
```

#### 3. Web Scraping Platform

```bash
gjsg \
  -n "Legacy Video Site" \
  -p "https://oldvideos.com" \
  -r "https://github.com/me/old-videos" \
  -b "https://oldvideos.com" \
  -u "html,webscraping"
```

#### 4. JavaScript Project

```bash
gjsg -i --js
```

## After Generation

Once your plugin is generated:

1. **Navigate to the project:**
   ```bash
   cd my-platform
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Edit the source:**
   Open `src/Script.ts` and implement your plugin logic

4. **Build the plugin:**
   ```bash
   npm run build
   ```

5. **Test in GrayJay:**
   - Scan the `qrcode.png` with GrayJay app
   - Or manually load from the `dist/` folder

## Development Workflow

### Watch Mode

Keep this running while you develop:

```bash
npm run dev
```

This will automatically rebuild when you save changes.

### Project Structure

```
my-platform/
├── src/
│   ├── Script.ts      # Edit this - main plugin code
│   └── constants.ts   # Edit this - add your constants
├── assets/
│   └── icon.png       # Replace with your icon
├── dist/              # Build output - don't edit
├── config.json        # Plugin config - edit if needed
└── README.md          # Documentation
```

## Common Options

| Short | Long | Description |
|-------|------|-------------|
| `-n` | `--name` | Platform name |
| `-p` | `--platform-url` | Platform URL |
| `-r` | `--repository-url` | Repository URL |
| `-b` | `--base-url` | Base API URL |
| `-u` | `--uses` | Technologies (api,graphql,html,webscraping) |
| `-o` | `--output` | Output directory |
| `-i` | `--interactive` | Interactive mode |
| | `--js` | Generate JavaScript instead of TypeScript |
| | `--auth` | Enable authentication |
| | `--live` | Enable live streams |
| | `--comments` | Enable comments |
| | `--playlists` | Enable playlists |
| | `--search` | Enable search |

## Tips

1. **Use interactive mode** when starting out
2. **Keep the generated README** - it has helpful information
3. **Test frequently** in the GrayJay app
4. **Check the Dailymotion plugin** for a real-world example
5. **Update the icon** in `assets/icon.png` with your platform's logo

## Getting Help

- Run `grayjay-generate --help` for all options
- Check the [README.md](README.md) for full documentation
- Report issues at: https://github.com/grayjay-sources/source-generator/issues

## Next Steps

1. Implement the `getHome()` method to fetch videos
2. Implement the `getContentDetails()` method for video details
3. Add search functionality if your platform supports it
4. Test all features in the GrayJay app
5. Share your plugin with the community!

Happy coding! 🚀
