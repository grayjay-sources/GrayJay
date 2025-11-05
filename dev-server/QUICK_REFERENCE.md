# Dev Server Quick Reference

## 🚀 Quick Start

```bash
# 1. Start HTTP server
cd your-plugin-directory
python -m http.server 3000

# 2. Open dev portal
http://localhost:11337/dev

# 3. Load plugin
http://localhost:3000/YourPluginConfig.json
```

## 📡 API Endpoints

| Endpoint                   | Method | Purpose       | Example                                                         |
| -------------------------- | ------ | ------------- | --------------------------------------------------------------- |
| `/dev`                     | GET    | Dev portal UI | Browser                                                         |
| `/plugin/isLoggedIn`       | GET    | Check auth    | `curl http://localhost:11337/plugin/isLoggedIn`                 |
| `/plugin/getDevLogs`       | GET    | Get logs      | `curl http://localhost:11337/plugin/getDevLogs?index=-1`        |
| `/plugin/packageGet`       | GET    | Get package   | `curl http://localhost:11337/plugin/packageGet?variable=bridge` |
| `/plugin/remoteCall`       | POST   | Call method   | See examples                                                    |
| `/plugin/updateTestPlugin` | POST   | Update plugin | See examples                                                    |
| `/plugin/getWarnings`      | POST   | Get warnings  | See examples                                                    |

## 🔧 Common Commands

### Check Logs

```powershell
Invoke-RestMethod "http://localhost:11337/plugin/getDevLogs?index=-1" |
  Select-Object -ExpandProperty logs
```

### Check Login

```powershell
Invoke-RestMethod "http://localhost:11337/plugin/isLoggedIn"
```

### Get Package

```bash
curl "http://localhost:11337/plugin/packageGet?variable=http"
```

## 📦 Packages

| Package  | Purpose                |
| -------- | ---------------------- |
| `bridge` | Platform communication |
| `http`   | HTTP client            |
| `dom`    | DOM parser (likely)    |

Request in config:

```json
{
  "packages": ["Http"]
}
```

## 🐛 Debugging

### Add Logging

```javascript
function myFunction() {
  log("Starting myFunction");
  try {
    // your code
    log("Success!");
  } catch (e) {
    log("Error: " + e);
  }
}
```

### View Logs

- **Browser Console**: F12 → Console tab
- **API**: `GET /plugin/getDevLogs?index=-1`
- **Dev Portal**: Logs section

### Common Errors

| Error                   | Cause              | Fix                 |
| ----------------------- | ------------------ | ------------------- |
| 404 on script           | Server not running | Start HTTP server   |
| "Cannot read 'iconUrl'" | Invalid config     | Check JSON syntax   |
| "Already declared"      | Global enums       | Use string literals |

## 📊 Testing Checklist

### Basic Tests

- [ ] Plugin loads
- [ ] `enable()` works
- [ ] Search works
- [ ] Channel info loads
- [ ] Episodes list
- [ ] Details load

### Advanced Tests

- [ ] Error handling
- [ ] Edge cases
- [ ] Performance
- [ ] Multiple reloads
- [ ] Package loading
- [ ] RPC calls

## 🎯 Quick Fixes

### Plugin Won't Load

```powershell
# Check if server is running
Test-NetConnection -ComputerName localhost -Port 3000

# Check config is valid
Get-Content YourConfig.json | ConvertFrom-Json

# Check logs
Invoke-RestMethod "http://localhost:11337/plugin/getDevLogs?index=-1"
```

### Reload Plugin

1. Make changes to script
2. Click "Reload" in portal
3. Check console for "LOADED"

### Clear Errors

1. Fix the error in code
2. Reload plugin
3. Verify in logs

## 📝 Common Patterns

### Fetch HTML

```javascript
function fetchHTML(path) {
  const resp = http.GET(BASE_URL + path, {}, false);
  if (!resp.isOk) {
    throw new ScriptException(`HTTP failed: ${resp.code}`);
  }
  return domParser.parseFromString(resp.body);
}
```

### Parse Search Results

```javascript
function searchContent(query) {
  try {
    const dom = fetchHTML("/search?q=" + encodeURIComponent(query));
    const results = [];
    const links = dom.querySelectorAll("selector");
    // ... parse results
    return results;
  } catch (e) {
    log("Search error: " + e);
    return [];
  }
}
```

### Return Content

```javascript
source.search = function (query, type, order, filters) {
  const results = searchContent(query);
  return new ContentPager(results, false);
};
```

## 🔍 Monitoring

### Watch Logs (PowerShell)

```powershell
while ($true) {
  $logs = Invoke-RestMethod "http://localhost:11337/plugin/getDevLogs?index=-1"
  Clear-Host
  $logs.logs | ForEach-Object {
    Write-Host "[$($_.level)] $($_.message)" -ForegroundColor $(
      switch ($_.level) {
        'error' { 'Red' }
        'warning' { 'Yellow' }
        'debug' { 'Cyan' }
        default { 'White' }
      }
    )
  }
  Start-Sleep 2
}
```

### Watch Network (Browser)

1. F12 → Network tab
2. Filter: XHR
3. Watch requests to dev server

## 💡 Pro Tips

1. **Use Reload Button**: Don't refresh entire page
2. **Monitor Console**: Errors show immediately
3. **Log Everything**: Helps debugging
4. **Test Incrementally**: One method at a time
5. **Use Breakpoints**: Browser DevTools
6. **Check Network Tab**: See actual requests
7. **Validate JSON**: Before loading config

## 📚 Documentation Files

| File                                  | Purpose              |
| ------------------------------------- | -------------------- |
| `openapi.yaml`                        | Complete API spec    |
| `README.md`                           | Main documentation   |
| `TESTING_GUIDE.md`                    | Testing workflow     |
| `SUMMARY.md`                          | Overview (this file) |
| `examples/example-requests.md`        | Request examples     |
| `examples/plugin-config-example.json` | Config template      |

## 🎓 Learning Path

### Beginner

1. Read `README.md`
2. Follow Quick Start
3. Load example plugin
4. Check logs

### Intermediate

1. Read `TESTING_GUIDE.md`
2. Create custom plugin
3. Test all methods
4. Handle errors

### Advanced

1. Study `openapi.yaml`
2. Create automated tests
3. Optimize performance
4. Build complex features

## 🆘 Getting Help

### Debugging Steps

1. Check browser console
2. Check dev logs
3. Verify config JSON
4. Test HTTP server
5. Review OpenAPI spec

### Resources

- **Local Docs**: `dev-server/` directory
- **Plugin Samples**: `/sources/` directory
- **Type Defs**: `plugin.d.ts` files

---

## Summary

The dev server provides:

✅ **Complete API** for plugin testing  
✅ **Real-time debugging** via logs and RPC  
✅ **Package management** for plugin dependencies  
✅ **Hot reload** for rapid development  
✅ **Full documentation** in OpenAPI format

Everything you need to develop GrayJay plugins efficiently! 🎉
