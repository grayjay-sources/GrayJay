# Dev Server Documentation Summary

Complete documentation for the GrayJay Plugin Development Server.

## What You'll Find Here

### 1. OpenAPI Specification (`openapi.yaml`)

- **Full API documentation** in OpenAPI 3.0 format
- **All endpoints** documented with parameters and responses
- **Schema definitions** for plugin configs and data structures
- **Can be used** with Swagger UI, Postman, or other OpenAPI tools

### 2. README (`README.md`)

- **Quick start guide** for using the dev server
- **API endpoint overview**
- **Package system** explanation
- **Workflow examples**
- **Troubleshooting tips**

### 3. Testing Guide (`TESTING_GUIDE.md`)

- **Complete testing workflow**
- **Testing checklist**
- **Performance benchmarks**
- **Example test scenarios**
- **Automated testing scripts**

### 4. Example Requests (`examples/example-requests.md`)

- **cURL examples** for all endpoints
- **PowerShell examples**
- **JavaScript/fetch examples**
- **Expected responses**
- **Testing scripts**

## Quick Reference

### Server Info

- **Base URL**: `http://localhost:11337`
- **Portal**: `http://localhost:11337/dev`
- **Default Plugin Port**: `3000`

### Key Endpoints

| Endpoint                   | Method | Purpose           |
| -------------------------- | ------ | ----------------- |
| `/plugin/isLoggedIn`       | GET    | Check auth status |
| `/plugin/updateTestPlugin` | POST   | Update plugin     |
| `/plugin/getWarnings`      | POST   | Get warnings      |
| `/plugin/packageGet`       | GET    | Get package code  |
| `/plugin/remoteCall`       | POST   | Execute RPC       |
| `/plugin/getDevLogs`       | GET    | Get dev logs      |

### Available Packages

- **bridge** - Platform communication
- **http** - HTTP client
- **dom** - DOM parser (likely)

### Testing Workflow

1. **Start HTTP server** on port 3000
2. **Open dev portal** at `/dev`
3. **Load plugin** config JSON
4. **Monitor console** for logs
5. **Test functionality** via portal
6. **Iterate and reload**

## Using the Documentation

### For Plugin Development

1. Start with `README.md` for overview
2. Use `TESTING_GUIDE.md` for testing workflow
3. Reference `openapi.yaml` for API details
4. Check `examples/` for request samples

### For API Integration

1. Load `openapi.yaml` in your API client
2. Use example requests as templates
3. Monitor network requests in browser
4. Test endpoints one by one

### For Automated Testing

1. Use `TESTING_GUIDE.md` test scripts
2. Adapt `examples/` to your needs
3. Create custom test suites
4. Automate regression testing

## File Structure

```
dev-server/
├── openapi.yaml                  # OpenAPI 3.0 specification
├── README.md                     # Main documentation
├── TESTING_GUIDE.md              # Testing workflow guide
├── SUMMARY.md                    # This file
└── examples/
    └── example-requests.md       # API request examples
```

## Key Concepts

### Plugin Loading

Plugins are loaded from URLs:

```
http://localhost:3000/PluginConfig.json
```

Config points to script:

```json
{
  "scriptUrl": "./PluginScript.js"
}
```

### Package System

Plugins request packages they need:

```javascript
// In config
"packages": ["Http"]

// Server provides
GET /plugin/packageGet?variable=http
```

### Remote Calls

Execute plugin methods remotely:

```
POST /plugin/remoteCall?id={uuid}&method={name}
Body: { "args": [...] }
```

### Development Logs

View plugin output:

```
GET /plugin/getDevLogs?index=-1
```

## Common Patterns

### 1. Plugin Lifecycle

```
Load Config → Load Script → Load Packages → Call enable() → Ready
```

### 2. Testing Cycle

```
Edit Code → Reload Plugin → Test → Check Logs → Repeat
```

### 3. Debugging Flow

```
Error Occurs → Check Console → Check Logs → Add Debug Logs → Reload
```

## Best Practices

### Development

- ✅ Use `log()` for debugging
- ✅ Handle all errors gracefully
- ✅ Test each method individually
- ✅ Validate input parameters
- ✅ Return proper data structures

### Testing

- ✅ Test with real data
- ✅ Test error conditions
- ✅ Test edge cases
- ✅ Monitor performance
- ✅ Check all console messages

### Deployment

- ✅ Remove debug logs
- ✅ Test thoroughly
- ✅ Update version
- ✅ Document changes
- ✅ Commit clean code

## Additional Resources

### In This Repo

- `/sample/SampleScript.js` - Plugin template
- `/sample/plugin.d.ts` - TypeScript definitions
- `/sources/` - Example plugins

### External

- **GrayJay**: https://grayjay.app/
- **Documentation**: Check plugin repositories for docs
- **Community**: Plugin developer community resources

## Quick Start Command

Start testing in 30 seconds:

```powershell
# Terminal 1: Start HTTP server
cd P:\GrayJay\sources\grayjay-sources-grayjay-source-aniworld
python -m http.server 3000

# Terminal 2: Open dev portal
start http://localhost:11337/dev

# Terminal 3: Monitor logs
while ($true) {
  Invoke-RestMethod "http://localhost:11337/plugin/getDevLogs?index=-1" |
    Select-Object -ExpandProperty logs |
    Format-Table
  Start-Sleep 5
}
```

---

## Summary

This documentation provides:

- ✅ **Complete API specification** (OpenAPI 3.0)
- ✅ **Testing guide** with examples
- ✅ **Example requests** for all endpoints
- ✅ **Best practices** for development
- ✅ **Troubleshooting** tips

Everything you need to develop and test GrayJay plugins! 🎉
