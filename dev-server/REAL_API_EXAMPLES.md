# Real API Examples from Browser Network Requests

This document contains actual API requests captured from the GrayJay DevPortal browser interface.

## Overview

The DevPortal uses different endpoints for different purposes:

- `/plugin/remoteTest?method={name}` - Testing plugin methods via the UI
- `/plugin/remoteCall?id={uuid}&method={name}` - Direct remote procedure calls
- `/get?CT={contentType}` - Generic GET with content type specification

## Complete Plugin Loading Sequence

### Step 1: Fetch Plugin Config

```http
POST http://100.100.1.57:11337/get?CT=text/json
Content-Type: application/json

"http://100.69.27.52:3000/AniworldConfig.json"
```

### Step 2: Fetch Plugin Script

```http
POST http://100.100.1.57:11337/get?CT=application/js
Content-Type: application/json

"http://100.69.27.52:3000/AniworldScript.js"
```

### Step 3: Update Test Plugin

```http
POST http://100.100.1.57:11337/plugin/updateTestPlugin
Content-Type: application/json

{
  "url": "http://100.69.27.52:3000/AniworldScript.js",
  "config": {
    "name": "Aniworld",
    "description": "Aniworld.to integration for Grayjay",
    "author": "Zerophire, Bluscream, Cursor.AI",
    "authorUrl": "https://github.com/Bluscream",
    "platformUrl": "https://aniworld.to",
    "sourceUrl": "https://github.com/Hoell08/Grayjay-Aniworld-plugin/blob/main/AniworldConfig.json",
    "repositoryUrl": "https://github.com/Hoell08/Grayjay-Aniworld-plugin",
    "scriptUrl": "./AniworldScript.js",
    "version": 1,
    "iconUrl": "./AniworldIcon.png",
    "id": "ac3f49ee-f398-5cf4-ac1b-ca1aace76c83",
    "scriptSignature": "",
    "scriptPublicKey": "",
    "packages": ["Http"],
    "allowEval": false,
    "allowUrls": ["aniworld.to"],
    "supportedClaimTypes": [3]
  }
}
```

### Step 4: Get Warnings

```http
POST http://100.100.1.57:11337/plugin/getWarnings
```

### Step 5: Load Bridge Package

```http
GET http://100.100.1.57:11337/plugin/packageGet?variable=bridge
```

**Response:** JavaScript code for the bridge package

### Step 6: Initial Log Call

```http
POST http://100.100.1.57:11337/plugin/remoteCall?id=2bdd3b70-53d3-488f-a4c4-b356eff7ed7a&method=log
Content-Type: application/json

{
  "args": ["Plugin loaded"]
}
```

## Testing Methods

### Test: enable

```http
POST http://100.100.1.57:11337/plugin/remoteTest?method=enable
Content-Type: application/json

{}
```

**cURL:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/remoteTest?method=enable"
```

### Test: disable

```http
POST http://100.100.1.57:11337/plugin/remoteTest?method=disable
Content-Type: application/json

{}
```

### Test: saveState

```http
POST http://100.100.1.57:11337/plugin/remoteTest?method=saveState
Content-Type: application/json

{}
```

### Test: getHome

```http
POST http://100.100.1.57:11337/plugin/remoteTest?method=getHome
Content-Type: application/json

{}
```

**During execution, this triggers:**

1. Load HTTP package:

```http
GET http://100.100.1.57:11337/plugin/packageGet?variable=http
```

2. HTTP GET call via bridge:

```http
POST http://100.100.1.57:11337/plugin/remoteCall?id=fb7fd038-31a8-4f95-a0a7-47ed59a79f77&method=GET
Content-Type: application/json

{
  "args": ["https://aniworld.to/"]
}
```

3. Log results:

```http
POST http://100.100.1.57:11337/plugin/remoteCall?id=2bdd3b70-53d3-488f-a4c4-b356eff7ed7a&method=log
Content-Type: application/json

{
  "args": ["Fetched home page"]
}
```

## Monitoring Endpoints

### Check Login Status (Polled every ~2-3 seconds)

```http
GET http://100.100.1.57:11337/plugin/isLoggedIn
```

**Response:**

```json
true
```

or

```json
false
```

### Get Development Logs (Polled every ~1 second)

```http
GET http://100.100.1.57:11337/plugin/getDevLogs?index=7
```

**Response:**

```json
[
  {
    "id": 8,
    "devId": "2bdd3b70-53d3-488f-a4c4-b356eff7ed7a",
    "type": "LOG",
    "message": "Plugin loaded successfully",
    "timestamp": 1762292805846
  },
  {
    "id": 9,
    "devId": "2bdd3b70-53d3-488f-a4c4-b356eff7ed7a",
    "type": "LOG",
    "message": "Fetching home page",
    "timestamp": 1762292819620
  }
]
```

**Parameters:**

- `index`: Last log index received (use -1 to get all logs, or specify last received index)

## Direct Remote Calls

For methods with parameters, use `/plugin/remoteCall`:

### Remote Call with Parameters

```http
POST http://100.100.1.57:11337/plugin/remoteCall?id={pluginId}&method={methodName}
Content-Type: application/json

{
  "args": [param1, param2, ...]
}
```

**Example - Call HTTP.GET:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/remoteCall?id=fb7fd038-31a8-4f95-a0a7-47ed59a79f77&method=GET" \
  -H "Content-Type: application/json" \
  -d '{"args": ["https://aniworld.to/"]}'
```

**Example - Log message:**

```bash
curl -X POST "http://100.100.1.57:11337/plugin/remoteCall?id=2bdd3b70-53d3-488f-a4c4-b356eff7ed7a&method=log" \
  -H "Content-Type: application/json" \
  -d '{"args": ["Test message"]}'
```

## Complete Testing Script (Bash)

```bash
#!/bin/bash

# Configuration
DEVPORTAL="http://100.100.1.57:11337"
PLUGIN_SERVER="http://localhost:3000"
PLUGIN_CONFIG="$PLUGIN_SERVER/YourPluginConfig.json"
PLUGIN_SCRIPT="$PLUGIN_SERVER/YourPluginScript.js"

echo "=== Step 1: Fetch Plugin Config ==="
curl -X POST "$DEVPORTAL/get?CT=text/json" \
  -H "Content-Type: application/json" \
  -d "\"$PLUGIN_CONFIG\""

echo -e "\n\n=== Step 2: Fetch Plugin Script ==="
curl -X POST "$DEVPORTAL/get?CT=application/js" \
  -H "Content-Type: application/json" \
  -d "\"$PLUGIN_SCRIPT\""

echo -e "\n\n=== Step 3: Update Test Plugin ==="
curl -X POST "$DEVPORTAL/plugin/updateTestPlugin" \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"$PLUGIN_SCRIPT\",\"config\":{\"id\":\"test-plugin-id\"}}"

echo -e "\n\n=== Step 4: Get Warnings ==="
curl -X POST "$DEVPORTAL/plugin/getWarnings"

echo -e "\n\n=== Step 5: Test enable ==="
curl -X POST "$DEVPORTAL/plugin/remoteTest?method=enable"

echo -e "\n\n=== Step 6: Check Login Status ==="
curl "$DEVPORTAL/plugin/isLoggedIn"

echo -e "\n\n=== Step 7: Test getHome ==="
curl -X POST "$DEVPORTAL/plugin/remoteTest?method=getHome"

echo -e "\n\n=== Step 8: Get Development Logs ==="
curl "$DEVPORTAL/plugin/getDevLogs?index=-1"

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

def step(name, func):
    print(f"\n{'='*60}")
    print(f"=== {name}")
    print('='*60)
    result = func()
    print(json.dumps(result, indent=2) if isinstance(result, (dict, list)) else result)
    time.sleep(0.5)
    return result

# Step 1: Fetch config
step("Step 1: Fetch Plugin Config",
     lambda: requests.post(f"{DEVPORTAL}/get?CT=text/json",
                          json=PLUGIN_CONFIG).text)

# Step 2: Fetch script
step("Step 2: Fetch Plugin Script",
     lambda: requests.post(f"{DEVPORTAL}/get?CT=application/js",
                          json=PLUGIN_SCRIPT).text[:200] + "...")

# Step 3: Update plugin
step("Step 3: Update Test Plugin",
     lambda: requests.post(f"{DEVPORTAL}/plugin/updateTestPlugin",
                          json={"url": PLUGIN_SCRIPT,
                               "config": {"id": "test-plugin-id"}}).text)

# Step 4: Get warnings
step("Step 4: Get Warnings",
     lambda: requests.post(f"{DEVPORTAL}/plugin/getWarnings").json())

# Step 5: Test enable
step("Step 5: Test enable",
     lambda: requests.post(f"{DEVPORTAL}/plugin/remoteTest?method=enable").json())

# Step 6: Check login
step("Step 6: Check Login Status",
     lambda: requests.get(f"{DEVPORTAL}/plugin/isLoggedIn").json())

# Step 7: Test getHome
step("Step 7: Test getHome",
     lambda: requests.post(f"{DEVPORTAL}/plugin/remoteTest?method=getHome").json())

# Step 8: Get logs
step("Step 8: Get Development Logs",
     lambda: requests.get(f"{DEVPORTAL}/plugin/getDevLogs?index=-1").json())

print("\n" + "="*60)
print("=== Testing Complete!")
print("="*60)
```

## Key Observations

### API Design Patterns

1. **Two Types of Method Calls:**

   - `remoteTest` - For testing via UI, no parameters needed
   - `remoteCall` - For direct calls with parameters and specific IDs

2. **Package Loading:**

   - Packages (bridge, http) are loaded on-demand
   - First call to a package triggers `packageGet` request

3. **Polling:**

   - Login status checked every 2-3 seconds
   - Dev logs fetched every 1 second
   - Index-based log retrieval prevents duplicate logs

4. **Content Type Handling:**

   - Generic `/get` endpoint uses query param `CT` for content type
   - Supports `text/json` and `application/js`

5. **Plugin IDs:**
   - Each plugin instance gets a unique session ID
   - Package instances (like http) have their own IDs
   - IDs are used in `remoteCall` for routing

### Best Practices

1. **Always fetch warnings** after loading a plugin
2. **Use `index=-1`** for initial log fetch, then track last index
3. **Wait for packages** to load before testing methods that need them
4. **Poll login status** if your plugin requires authentication
5. **Use `remoteTest`** for simple method testing
6. **Use `remoteCall`** when you need to pass specific parameters

---

**Related Documentation:**

- [UI-Based Testing Workflow](./TESTING_UI_WORKFLOW.md)
- [API-Based Testing Workflow](./TESTING_API_WORKFLOW.md)
- [OpenAPI Specification](./openapi.yaml)
