# Example API Requests

Collection of example API requests for the GrayJay Plugin Development Server.

## Plugin Management

### Check Login Status

```bash
curl http://localhost:11337/plugin/isLoggedIn
```

**Response**:

```json
{
  "isLoggedIn": false
}
```

### Get Plugin Warnings

```bash
curl -X POST http://localhost:11337/plugin/getWarnings \
  -H "Content-Type: application/json" \
  -d '{
    "pluginId": "38668428-4fbd-4bc6-80a3-fb37eeb13f0f"
  }'
```

**Response**:

```json
{
  "warnings": []
}
```

### Update Test Plugin

```bash
curl -X POST http://localhost:11337/plugin/updateTestPlugin \
  -H "Content-Type: application/json" \
  -d '{
    "pluginId": "test-plugin-uuid",
    "config": { ... },
    "script": "source.enable = function() { log(\"Updated!\"); };"
  }'
```

**Response**:

```json
{
  "success": true
}
```

## Package Management

### Get Bridge Package

```bash
curl "http://localhost:11337/plugin/packageGet?variable=bridge"
```

**Response**: JavaScript code for the bridge package

### Get HTTP Package

```bash
curl "http://localhost:11337/plugin/packageGet?variable=http"
```

**Response**: JavaScript code for the HTTP client package

## Remote Procedure Calls

### Call Plugin Log Method

```bash
curl -X POST "http://localhost:11337/plugin/remoteCall?id=38668428-4fbd-4bc6-80a3-fb37eeb13f0f&method=log" \
  -H "Content-Type: application/json" \
  -d '{
    "args": ["Test log message"]
  }'
```

**Response**:

```json
{
  "success": true,
  "result": undefined
}
```

### Call Plugin Search Method

```bash
curl -X POST "http://localhost:11337/plugin/remoteCall?id=38668428-4fbd-4bc6-80a3-fb37eeb13f0f&method=search" \
  -H "Content-Type: application/json" \
  -d '{
    "args": ["naruto", "Mixed", "Chronological", {}]
  }'
```

**Response**:

```json
{
  "success": true,
  "result": {
    "results": [...],
    "hasMore": false
  }
}
```

## Development Logs

### Get All Logs

```bash
curl "http://localhost:11337/plugin/getDevLogs?index=-1"
```

**Response**:

```json
{
  "logs": [
    {
      "timestamp": 1762291760770,
      "level": "info",
      "message": "LOADED"
    },
    {
      "timestamp": 1762291760834,
      "level": "debug",
      "message": "Plugin enabled"
    }
  ],
  "nextIndex": 2
}
```

### Get Logs After Index

```bash
curl "http://localhost:11337/plugin/getDevLogs?index=7"
```

Gets only logs after index 7.

## Generic GET Operations

### Get JSON Data

```bash
curl -X POST "http://localhost:11337/get?CT=text/json" \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Get JavaScript Code

```bash
curl -X POST "http://localhost:11337/get?CT=application/js" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Resource Loading

### Get Source Code

```bash
curl http://localhost:11337/source.js
```

Returns the core plugin execution JavaScript.

### Get Development Bridge

```bash
curl http://localhost:11337/dev_bridge.js
```

Returns the bridge code for dev portal communication.

### Get Documentation

```bash
curl http://localhost:11337/source_docs.js
```

Returns plugin development documentation.

## Testing with PowerShell

### Check Login Status

```powershell
Invoke-RestMethod -Uri "http://localhost:11337/plugin/isLoggedIn"
```

### Get Dev Logs

```powershell
$response = Invoke-RestMethod -Uri "http://localhost:11337/plugin/getDevLogs?index=-1"
$response.logs | ForEach-Object {
  Write-Host "[$($_.level)] $($_.message)"
}
```

### Call Plugin Method

```powershell
$body = @{
  args = @("Test message")
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:11337/plugin/remoteCall?id=uuid&method=log" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

## Testing with JavaScript (Browser Console)

### Call Plugin Method

```javascript
fetch("http://localhost:11337/plugin/remoteCall?id=uuid&method=search", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    args: ["naruto", "Mixed", "Chronological", {}],
  }),
})
  .then((r) => r.json())
  .then((data) => console.log("Results:", data.result));
```

### Get Logs

```javascript
fetch("http://localhost:11337/plugin/getDevLogs?index=-1")
  .then((r) => r.json())
  .then((data) => {
    data.logs.forEach((log) => {
      console.log(`[${log.level}] ${log.message}`);
    });
  });
```

## Automated Testing Script

### PowerShell Test Script

```powershell
# test-plugin.ps1
$baseUrl = "http://localhost:11337"

Write-Host "Testing Plugin API..." -ForegroundColor Green

# Test 1: Check login
$login = Invoke-RestMethod "$baseUrl/plugin/isLoggedIn"
Write-Host "Login Status: $($login.isLoggedIn)" -ForegroundColor Cyan

# Test 2: Get logs
$logs = Invoke-RestMethod "$baseUrl/plugin/getDevLogs?index=-1"
Write-Host "Log Count: $($logs.logs.Count)" -ForegroundColor Cyan

# Test 3: Load package
$bridge = Invoke-RestMethod "$baseUrl/plugin/packageGet?variable=bridge"
Write-Host "Bridge Package Length: $($bridge.Length) chars" -ForegroundColor Cyan

Write-Host "All tests passed!" -ForegroundColor Green
```

## Expected Responses

### Success Response

```json
{
  "success": true,
  "result": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message"
}
```

### Log Response

```json
{
  "logs": [
    {
      "timestamp": 1762291760770,
      "level": "warning",
      "message": "LOADED"
    }
  ],
  "nextIndex": 1
}
```

## Tips

1. **Use `-1` for all logs**: `?index=-1` gets all logs
2. **Monitor network tab**: Watch XHR requests in browser
3. **Check console**: JavaScript errors appear in browser console
4. **Test incrementally**: Test one method at a time
5. **Log everything**: Use `log()` liberally during development

---

**Note**: Replace UUIDs and URLs with actual values from your plugin.
