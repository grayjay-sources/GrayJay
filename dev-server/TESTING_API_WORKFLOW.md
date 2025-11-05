# GrayJay Plugin Testing - Direct API Workflow

This guide provides a compact workflow for testing GrayJay plugins using direct HTTP requests to the DevPortal API, without requiring browser interaction.

**⚠️ IMPORTANT:** This guide uses the **actual API endpoints** verified from browser network requests.

## Prerequisites

- Your plugin source files (config JSON and script JS) accessible via HTTP server
- HTTP client (curl, Postman, or any programming language HTTP library)
- DevPortal running at `http://100.100.1.57:11337`

## API Endpoints Overview

### Core Testing Endpoints

- **Load Plugin Config**: `POST /get?CT=text/json`
- **Load Plugin Script**: `POST /get?CT=application/js`
- **Update Test Plugin**: `POST /plugin/updateTestPlugin`
- **Test Methods (No Params)**: `POST /plugin/remoteTest?method={methodName}`
- **Remote Call (With Params)**: `POST /plugin/remoteCall?id={uuid}&method={methodName}`

### Monitoring Endpoints

- **Check Login Status**: `GET /plugin/isLoggedIn`
- **Get Development Logs**: `GET /plugin/getDevLogs?index={index}`
- **Get Warnings**: `POST /plugin/getWarnings`
- **Get Package**: `GET /plugin/packageGet?variable={packageName}`

## Step-by-Step API Workflow

### 1. Start Local Web Server

In your plugin source directory, start a local HTTP server:

```bash
cd P:\GrayJay\sources\your-plugin-folder
npx serve
```

### 2. Fetch Plugin Config

**Request:**

```http
POST http://100.100.1.57:11337/get?CT=text/json
Content-Type: application/json

"http://localhost:3000/YourPluginConfig.json"
```

**cURL Example:**

```bash
curl -X POST "http://100.100.1.57:11337/get?CT=text/json" \
  -H "Content-Type: application/json" \
  -d '"http://localhost:3000/YourPluginConfig.json"'
```

**Expected Response:** The JSON content of your config file

### 3. Fetch Plugin Script

**Request:**

```http
POST http://100.100.1.57:11337/get?CT=application/js
Content-Type: application/json

"http://localhost:3000/YourPluginScript.js"
```

**cURL Example:**

```bash
curl -X POST "http://100.100.1.57:11337/get?CT=application/js" \
  -H "Content-Type: application/json" \
  -d '"http://localhost:3000/YourPluginScript.js"'
```

**Expected Response:** The JavaScript content of your plugin script

### 4. Load Plugin

**Request:**

```http
POST http://100.100.1.57:11337/plugin/updateTestPlugin
Content-Type: application/json

{
  "url": "http://localhost:3000/YourPluginScript.js",
  "config": {
    "name": "YourPluginName",
    "description": "Your plugin description",
    "author": "Your Name",
    "authorUrl": "https://github.com/yourname",
    "platformUrl": "https://your-streaming-site.com",
    "sourceUrl": "http://localhost:3000/YourPluginConfig.json",
    "repositoryUrl": "https://github.com/yourname/your-plugin",
    "scriptUrl": "http://localhost:3000/YourPluginScript.js",
    "version": 1,
    "iconUrl": "http://localhost:3000/YourPluginIcon.png",
    "id": "your-unique-plugin-id",
    "scriptSignature": "",
    "scriptPublicKey": "",
    "packages": ["Http"],
    "allowEval": false,
    "allowUrls": ["your-streaming-site.com"],
    "supportedClaimTypes": [3]
  }
}
```

**cURL Example:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/updateTestPlugin" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "http://localhost:3000/YourPluginScript.js",
    "config": {
      "id": "your-unique-plugin-id",
      "name": "YourPluginName",
      "scriptUrl": "http://localhost:3000/YourPluginScript.js",
      "packages": ["Http"]
    }
  }'
```

**Expected Response:** `200 OK`

### 5. Get Warnings

**Request:**

```http
POST http://100.100.1.57:11337/plugin/getWarnings
```

**cURL Example:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/getWarnings"
```

**Expected Response:**

```json
[]
```

or array of warning strings if there are issues.

### 6. Test: Enable Method

**Request:**

```http
POST http://100.100.1.57:11337/plugin/remoteTest?method=enable
Content-Type: application/json

{}
```

**cURL Example:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/remoteTest?method=enable" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**

```json
{
  "result": null,
  "error": null
}
```

### 7. Test: Get Home Method

**Request:**

```http
POST http://100.100.1.57:11337/plugin/remoteTest?method=getHome
Content-Type: application/json

{}
```

**cURL Example:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/remoteTest?method=getHome" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**

```json
{
  "result": {
    "results": [...],
    "hasMore": false
  },
  "error": null
}
```

### 8. Test: Get Channel Method

**Request:**

```http
POST http://100.100.1.57:11337/plugin/remoteTest?method=getChannel
Content-Type: application/json

{
  "url": "https://your-streaming-site.com/channel/example"
}
```

**Note:** For methods that require parameters, you can include them in the request body.

**cURL Example:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/remoteTest?method=getChannel" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-streaming-site.com/channel/example"}'
```

### 9. Test: Is Content Details URL

**Request:**

```http
POST http://100.100.1.57:11337/plugin/remoteTest?method=isContentDetailsUrl
Content-Type: application/json

{
  "url": "https://your-streaming-site.com/stream/example-content"
}
```

**cURL Example:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/remoteTest?method=isContentDetailsUrl" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-streaming-site.com/stream/example-content"}'
```

**Expected Response:**

```json
{
  "result": true,
  "error": null
}
```

### 10. Test: Get Content Details

**Request:**

```http
POST http://100.100.1.57:11337/plugin/remoteTest?method=getContentDetails
Content-Type: application/json

{
  "url": "https://your-streaming-site.com/stream/example-content"
}
```

**cURL Example:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/remoteTest?method=getContentDetails" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-streaming-site.com/stream/example-content"}'
```

**Expected Response:**

```json
{
  "result": {
    "id": {...},
    "name": "Content Title",
    "description": "Content description",
    "duration": 1200,
    "author": {...},
    "video": {...},
    ...
  },
  "error": null
}
```

### 11. Check Development Logs

**Request:**

```http
GET http://100.100.1.57:11337/plugin/getDevLogs?index=-1
```

**cURL Example:**

```bash
curl "http://100.100.1.57:11337/plugin/getDevLogs?index=-1"
```

**Expected Response:**

```json
[
  {
    "id": 1,
    "devId": "session-id",
    "type": "LOG",
    "message": "Log message",
    "timestamp": 1699123456789
  },
  ...
]
```

**Note:** Use `index=-1` for initial fetch, then use the last log ID for subsequent requests.

### 12. Check Login Status

**Request:**

```http
GET http://100.100.1.57:11337/plugin/isLoggedIn
```

**cURL Example:**

```bash
curl "http://100.100.1.57:11337/plugin/isLoggedIn"
```

**Expected Response:**

```json
true
```

or

```json
false
```

## Complete Testing Script (Bash)

```bash
#!/bin/bash

# Configuration
DEVPORTAL_URL="http://100.100.1.57:11337"
PLUGIN_SERVER="http://localhost:3000"
PLUGIN_CONFIG="$PLUGIN_SERVER/YourPluginConfig.json"
PLUGIN_SCRIPT="$PLUGIN_SERVER/YourPluginScript.js"
TEST_URL="https://your-streaming-site.com/stream/example-content"

echo "=== Step 1: Fetch Plugin Config ==="
curl -X POST "$DEVPORTAL_URL/get?CT=text/json" \
  -H "Content-Type: application/json" \
  -d "\"$PLUGIN_CONFIG\""

echo -e "\n\n=== Step 2: Fetch Plugin Script ==="
curl -X POST "$DEVPORTAL_URL/get?CT=application/js" \
  -H "Content-Type: application/json" \
  -d "\"$PLUGIN_SCRIPT\""

echo -e "\n\n=== Step 3: Load Plugin ==="
curl -X POST "$DEVPORTAL_URL/plugin/updateTestPlugin" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"$PLUGIN_SCRIPT\",\"config\":{\"id\":\"test-plugin-id\",\"scriptUrl\":\"$PLUGIN_SCRIPT\",\"packages\":[\"Http\"]}}"

echo -e "\n\n=== Step 4: Get Warnings ==="
curl -X POST "$DEVPORTAL_URL/plugin/getWarnings"

echo -e "\n\n=== Step 5: Test enable ==="
curl -X POST "$DEVPORTAL_URL/plugin/remoteTest?method=enable" \
  -H "Content-Type: application/json" \
  -d '{}'

echo -e "\n\n=== Step 6: Check Login Status ==="
curl "$DEVPORTAL_URL/plugin/isLoggedIn"

echo -e "\n\n=== Step 7: Test getHome ==="
curl -X POST "$DEVPORTAL_URL/plugin/remoteTest?method=getHome" \
  -H "Content-Type: application/json" \
  -d '{}'

echo -e "\n\n=== Step 8: Test isContentDetailsUrl ==="
curl -X POST "$DEVPORTAL_URL/plugin/remoteTest?method=isContentDetailsUrl" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"$TEST_URL\"}"

echo -e "\n\n=== Step 9: Test getContentDetails ==="
curl -X POST "$DEVPORTAL_URL/plugin/remoteTest?method=getContentDetails" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"$TEST_URL\"}"

echo -e "\n\n=== Step 10: Get Development Logs ==="
curl "$DEVPORTAL_URL/plugin/getDevLogs?index=-1"

echo -e "\n\n=== Done ==="
```

## Complete Testing Script (Python)

```python
import requests
import json
import time

# Configuration
DEVPORTAL = "http://100.100.1.57:11337"
PLUGIN_SERVER = "http://localhost:3000"
PLUGIN_CONFIG = f"{PLUGIN_SERVER}/YourPluginConfig.json"
PLUGIN_SCRIPT = f"{PLUGIN_SERVER}/YourPluginScript.js"
TEST_URL = "https://your-streaming-site.com/stream/example-content"

def step(name, func):
    print(f"\n{'='*60}")
    print(f"=== {name}")
    print('='*60)
    try:
        result = func()
        if isinstance(result, (dict, list)):
            print(json.dumps(result, indent=2))
        else:
            print(result)
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(0.5)
    return result

# Step 1: Fetch config
step("Step 1: Fetch Plugin Config",
     lambda: requests.post(f"{DEVPORTAL}/get?CT=text/json",
                          json=PLUGIN_CONFIG).text[:200] + "...")

# Step 2: Fetch script
step("Step 2: Fetch Plugin Script",
     lambda: requests.post(f"{DEVPORTAL}/get?CT=application/js",
                          json=PLUGIN_SCRIPT).text[:200] + "...")

# Step 3: Load plugin
step("Step 3: Load Plugin",
     lambda: requests.post(f"{DEVPORTAL}/plugin/updateTestPlugin",
                          json={
                              "url": PLUGIN_SCRIPT,
                              "config": {
                                  "id": "test-plugin-id",
                                  "scriptUrl": PLUGIN_SCRIPT,
                                  "packages": ["Http"]
                              }
                          }).text)

# Step 4: Get warnings
step("Step 4: Get Warnings",
     lambda: requests.post(f"{DEVPORTAL}/plugin/getWarnings").json())

# Step 5: Test enable
step("Step 5: Test enable",
     lambda: requests.post(f"{DEVPORTAL}/plugin/remoteTest?method=enable",
                          json={}).json())

# Step 6: Check login
step("Step 6: Check Login Status",
     lambda: requests.get(f"{DEVPORTAL}/plugin/isLoggedIn").json())

# Step 7: Test getHome
step("Step 7: Test getHome",
     lambda: requests.post(f"{DEVPORTAL}/plugin/remoteTest?method=getHome",
                          json={}).json())

# Step 8: Test isContentDetailsUrl
step("Step 8: Test isContentDetailsUrl",
     lambda: requests.post(f"{DEVPORTAL}/plugin/remoteTest?method=isContentDetailsUrl",
                          json={"url": TEST_URL}).json())

# Step 9: Test getContentDetails
step("Step 9: Test getContentDetails",
     lambda: requests.post(f"{DEVPORTAL}/plugin/remoteTest?method=getContentDetails",
                          json={"url": TEST_URL}).json())

# Step 10: Get logs
step("Step 10: Get Development Logs",
     lambda: requests.get(f"{DEVPORTAL}/plugin/getDevLogs?index=-1").json())

print("\n" + "="*60)
print("=== Testing Complete!")
print("="*60)
```

## Advanced: Direct Remote Calls

For more control, you can use `/plugin/remoteCall` with specific IDs:

### Remote Call with Package Methods

**Example - HTTP GET via bridge:**

```http
POST http://100.100.1.57:11337/plugin/remoteCall?id=fb7fd038-31a8-4f95-a0a7-47ed59a79f77&method=GET
Content-Type: application/json

{
  "args": ["https://aniworld.to/"]
}
```

**cURL Example:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/remoteCall?id=fb7fd038-31a8-4f95-a0a7-47ed59a79f77&method=GET" \
  -H "Content-Type: application/json" \
  -d '{"args": ["https://aniworld.to/"]}'
```

**Note:** The ID is obtained from package loading. You'll see it in the network requests after calling `/plugin/packageGet?variable=http`.

## Troubleshooting

### 1. Connection Refused

- Verify DevPortal is running at `http://100.100.1.57:11337`
- Check firewall settings
- Try accessing `/dev` in browser first

### 2. Plugin Load Fails (404)

- Verify HTTP server is running (`npx serve`)
- Check that config and script URLs are accessible
- Verify port number (default is 3000 for npx serve)

### 3. Method Test Returns 500 Error

- Check development logs: `GET /plugin/getDevLogs?index=-1`
- Verify method is implemented in your script
- Check that method signature matches GrayJay API

### 4. Empty or Null Results

- Check plugin implementation
- Verify source URL format matches your site
- Review development logs for errors
- Use `POST /plugin/getWarnings` to check for warnings

### 5. Package Not Found

- Ensure `packages` array in config includes required packages (`Http`, etc.)
- Packages are loaded on-demand; first use triggers loading

## API Design Notes

### Two Types of Method Calls

1. **`/plugin/remoteTest?method={name}`**

   - For testing plugin methods via UI or API
   - Simplified interface
   - Parameters can be included in request body
   - Used by DevPortal UI

2. **`/plugin/remoteCall?id={uuid}&method={name}`**
   - For direct calls to specific instances
   - Used internally by packages
   - Requires instance ID
   - More control over execution

### Polling Strategy

The DevPortal uses polling for monitoring:

- **Login Status**: Every ~2-3 seconds
- **Dev Logs**: Every ~1 second with index tracking
- Use last received index to avoid duplicate logs

### Package Loading

Packages are loaded on-demand:

- First method call triggers `GET /plugin/packageGet?variable={name}`
- Each package instance gets a unique ID
- Subsequent calls use the package ID

## Next Steps

1. Automate testing with continuous integration
2. Test all plugin methods systematically
3. Monitor logs for warnings and errors
4. Test edge cases and error handling
5. Set up automated regression testing

---

**Related Documentation:**

- [UI-Based Testing Workflow](./TESTING_UI_WORKFLOW.md) - Manual testing via web interface
- [Real API Examples](./REAL_API_EXAMPLES.md) - Actual network requests from browser
- [OpenAPI Specification](./openapi.yaml) - Complete API specification
