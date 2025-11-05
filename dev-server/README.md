# GrayJay Plugin Development Server

This directory contains documentation and specifications for the GrayJay Plugin Development Server.

## Overview

The GrayJay Plugin Development Server is a local testing environment that allows you to develop and test plugins before deploying them. It runs on `http://localhost:11337` (or `http://100.100.1.57:11337`).

## Features

- **Live Plugin Testing**: Load and test plugins in real-time
- **Remote Debugging**: Access plugin methods via RPC
- **Development Logs**: View plugin execution logs
- **Package Management**: Load required packages (Http, Dom, etc.)
- **Hot Reload**: Update plugins without restarting the server

## Getting Started

### 1. Start the Development Server

The development server should be running on port 11337. Access the portal at:

```
http://localhost:11337/dev
```

### 2. Load Your Plugin

Point the dev portal to your plugin configuration:

```
http://localhost:3000/YourPluginConfig.json
```

Or use a local file path to your plugin directory.

### 3. Test Your Plugin

The portal provides:

- **Reload Button**: Reload the plugin after making changes
- **Ref.js**: Reference documentation
- **Plugin.d.ts**: TypeScript definitions
- **Console Logs**: View plugin execution logs

## API Endpoints

See `openapi.yaml` for full API specification.

### Core Endpoints

#### Plugin Management

- `GET /plugin/isLoggedIn` - Check authentication status
- `POST /plugin/updateTestPlugin` - Update test plugin
- `POST /plugin/getWarnings` - Get plugin warnings
- `GET /plugin/packageGet?variable={name}` - Get package code
- `POST /plugin/remoteCall?id={uuid}&method={name}` - Execute RPC

#### Development

- `GET /plugin/getDevLogs?index={n}` - Get development logs
- `POST /get?CT={type}` - Generic GET with content type

#### Resources

- `GET /source.js` - Core plugin execution code
- `GET /dev_bridge.js` - Development bridge code
- `GET /source_docs.js` - Documentation code
- `GET /source_doc_urls.js` - Documentation URLs

## Plugin Configuration

When loading a plugin, the server expects a configuration JSON:

```json
{
  "name": "Plugin Name",
  "description": "Plugin description",
  "author": "Author Name",
  "scriptUrl": "./PluginScript.js",
  "version": 1,
  "iconUrl": "./PluginIcon.png",
  "packages": ["Http"],
  "allowUrls": ["example.com"]
}
```

## Package System

The dev server provides packages that plugins can use:

### Available Packages

1. **bridge** - Communication bridge between plugin and platform
2. **http** - HTTP client for making requests
3. **dom** - DOM parser (likely)

Request packages via:

```
GET /plugin/packageGet?variable=bridge
GET /plugin/packageGet?variable=http
```

## Remote Procedure Calls (RPC)

Execute plugin methods remotely:

```
POST /plugin/remoteCall?id=<plugin-uuid>&method=log
Content-Type: application/json

{
  "args": ["Log message"]
}
```

### Common RPC Methods

- `log(...args)` - Log messages from plugin
- `enable(config, settings, savedState)` - Enable plugin
- `getHome()` - Get home content
- `search(query, type, order, filters)` - Search content

## Development Workflow

### 1. Edit Plugin Code

Make changes to your plugin JavaScript file:

```javascript
// YourPluginScript.js
source.enable = function (conf, settings, savedState) {
  config = conf ?? {};
  log("Plugin enabled!");
};
```

### 2. Reload Plugin

Click the "Reload" button in the dev portal or use the API:

```
POST /plugin/updateTestPlugin
```

### 3. View Logs

Monitor the development logs:

```
GET /plugin/getDevLogs?index=-1
```

Or view them in the browser console.

### 4. Test Functionality

Use the portal to test plugin methods like:

- Search
- Get home content
- Get channel contents
- Get content details

## Debugging

### Console Messages

The dev portal logs helpful information:

```javascript
// Loading plugin
"Loading script (Abs):http://localhost:3000/YourScript.js";

// Required packages
"Required packages: bridge,http";

// Plugin loaded
"LOADED";

// RPC calls
"Remote Call on [uuid].method(...) RESULT";
```

### Error Handling

Common errors:

1. **404 on script URL**: Check that your script URL is accessible
2. **"Cannot read properties of null"**: Plugin config is missing required fields
3. **Package not found**: Requested package doesn't exist

## Dev Portal Interface

The dev portal provides 4 tabs for development:

### 1. Overview Tab

- Load plugins from URL
- View plugin information
- Reload plugins
- Access documentation files
- Login/logout (if auth required)

### 2. Testing Tab

- Test individual plugin methods
- Provide custom parameters
- View method results
- Test locally or on device
- Search for specific methods

**Quick Start Guides:**

- [UI-Based Testing Workflow](./TESTING_UI_WORKFLOW.md) - Step-by-step guide for testing plugins via the web interface
- [API-Based Testing Workflow](./TESTING_API_WORKFLOW.md) - Automated testing using direct HTTP requests
- [Real API Examples](./REAL_API_EXAMPLES.md) - Actual network requests captured from the browser with working scripts

### 3. Integration Tab

- Inject plugin to mobile device
- View real-time device logs
- Monitor plugin execution
- Debug production issues

### 4. Settings Tab

- Enable on Reload option
- Login on Reload option
- Save portal preferences

**See `TABS_DOCUMENTATION.md` for complete details on all buttons and features.**

## Testing Checklist

- [ ] Plugin loads without errors
- [ ] `source.enable()` executes successfully
- [ ] Required packages load correctly
- [ ] Search functionality works
- [ ] Content retrieval works
- [ ] Error handling is proper
- [ ] Logs are helpful and clear

## Port Configuration

The dev server uses multiple ports:

- **11337**: Main dev server API
- **3000**: Common port for serving plugin files (configurable)

## File Structure

```
dev-server/
├── openapi.yaml              # OpenAPI 3.0 specification
├── README.md                 # This file (main documentation)
├── TESTING_UI_WORKFLOW.md    # UI-based testing guide (NEW)
├── TESTING_API_WORKFLOW.md   # API-based testing guide (NEW)
├── REAL_API_EXAMPLES.md      # Real browser network requests (NEW)
├── TESTING_GUIDE.md          # Testing workflow guide
├── TABS_DOCUMENTATION.md     # Complete tabs & buttons documentation
├── INDEX.md                  # Documentation index
├── SUMMARY.md                # Documentation overview
├── QUICK_REFERENCE.md        # Quick reference guide
└── examples/                 # Example requests and responses
    ├── example-requests.md   # API request examples
    ├── testing-workflow-example.md  # Complete workflow example
    └── plugin-config-example.json  # Config template
```

## Network Protocol

The dev server uses HTTP with JSON payloads for most operations.

### Request Format

```http
POST /plugin/remoteCall?id=uuid&method=methodName
Content-Type: application/json

{
  "args": [...]
}
```

### Response Format

```json
{
  "success": true,
  "result": {...}
}
```

## Security Notes

⚠️ **Development Only**: This server is for development purposes only. Do not expose it to the internet.

- No authentication is required
- All endpoints are open
- CORS is likely disabled
- Use only on local network

## Common Use Cases

### 1. Load Plugin from Local Server

1. Start a local HTTP server serving your plugin files:

   ```bash
   python -m http.server 3000
   ```

2. Point the dev portal to your config:
   ```
   http://localhost:3000/PluginConfig.json
   ```

### 2. Test Plugin Changes

1. Modify your plugin script
2. Click "Reload" in the portal
3. View logs to verify changes

### 3. Debug Plugin Execution

1. Add `log()` calls in your plugin
2. View logs in browser console or via `/plugin/getDevLogs`
3. Check for warnings via `/plugin/getWarnings`

## Troubleshooting

### Plugin Won't Load

1. Check the script URL is accessible
2. Verify JSON config is valid
3. Check browser console for errors
4. Ensure required packages are specified

### 404 Errors

- Verify your HTTP server is running
- Check the script URL in the config
- Ensure CORS headers are set if needed

### "Identifier already declared" Errors

- Remove global enum object declarations
- Use `let` instead of `var` for mutable state
- Use string literals instead of enum references

## Resources

- **OpenAPI Spec**: See `openapi.yaml` for complete API documentation
- **Plugin Template**: See sample plugin in `/sample/`
- **Type Definitions**: See `plugin.d.ts` files in plugin repositories

## Support

For issues or questions about the dev server:

1. Check the browser console for errors
2. Review the OpenAPI specification
3. Check plugin documentation
4. Review sample plugins for examples

---

**Note**: This is a development tool. Production plugins should be deployed through proper channels and served from trusted sources.
