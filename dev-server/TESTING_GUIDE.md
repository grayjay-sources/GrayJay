# GrayJay Plugin Testing Guide

Complete guide for testing GrayJay plugins using the development server.

## Quick Start

### 1. Setup Local Server

Serve your plugin files on port 3000:

```bash
# Using Python
cd P:\GrayJay\sources\grayjay-sources-grayjay-source-aniworld
python -m http.server 3000

# Using Node.js
npx http-server -p 3000

# Using PHP
php -S localhost:3000
```

### 2. Access Dev Portal

Open: `http://localhost:11337/dev`

### 3. Load Plugin

Enter your plugin URL:

```
http://localhost:3000/AniworldConfig.json
```

## Testing Workflow

### Step 1: Initial Load

1. **Start Dev Server**: `http://localhost:11337/dev`
2. **Load Plugin**: Point to your config JSON
3. **Check Logs**: Verify "LOADED" message appears
4. **Check Packages**: Ensure required packages load

**Expected Console Output**:

```
Loading script (Abs):http://localhost:3000/YourScript.js
Required packages: bridge,http
LOADED
```

### Step 2: Test Basic Functionality

#### Test Enable Method

```javascript
// In your plugin
source.enable = function (conf, settings, savedState) {
  config = conf ?? {};
  log("Plugin enabled successfully!");
};
```

**Verify**:

- No errors in console
- "Plugin enabled successfully!" appears in logs

#### Test Search

```javascript
source.search = function (query, type, order, filters) {
  log("Search called with query: " + query);
  const results = searchContent(query);
  return new ContentPager(results, false);
};
```

**Test via Dev Portal**:

1. Click search button
2. Enter test query
3. Check results

### Step 3: Test Error Handling

#### Intentional Error Test

```javascript
source.getHome = function () {
  try {
    const dom = fetchHTML("/");
    log("Successfully fetched home page");
    // ... rest of code
  } catch (e) {
    log("Error in getHome: " + e);
    return new ContentPager([], false);
  }
};
```

**Verify**:

- Errors are logged properly
- Plugin doesn't crash
- Graceful fallback occurs

### Step 4: Test Package Loading

#### HTTP Package

```javascript
function fetchHTML(path) {
  log("Fetching: " + BASE_URL + path);
  const resp = http.GET(BASE_URL + path, {}, false);

  if (!resp.isOk) {
    log("HTTP Error: " + resp.code);
    throw new ScriptException("HTTP request failed: " + resp.code);
  }

  log("HTTP Success: " + resp.code);
  return domParser.parseFromString(resp.body);
}
```

**Verify**:

- HTTP requests log correctly
- Error codes are reported
- Success responses work

## Testing Checklist

### Core Functionality

- [ ] `source.enable()` executes without errors
- [ ] `source.getHome()` returns content
- [ ] `source.search()` returns results
- [ ] `source.isChannelUrl()` validates URLs correctly
- [ ] `source.getChannel()` returns channel info
- [ ] `source.getChannelContents()` returns episodes
- [ ] `source.isContentDetailsUrl()` validates URLs
- [ ] `source.getContentDetails()` returns video details

### Error Handling

- [ ] Invalid URLs are handled gracefully
- [ ] Network errors don't crash plugin
- [ ] Missing content returns empty results
- [ ] All errors are logged

### Performance

- [ ] Search is reasonably fast (<2s)
- [ ] Channel loading is efficient
- [ ] Episode listing doesn't timeout
- [ ] No memory leaks on reload

### Package Integration

- [ ] `http` package loads correctly
- [ ] `bridge` package loads correctly
- [ ] `domParser` works for HTML
- [ ] `log()` function outputs to dev logs

## Common Test Scenarios

### Test 1: Search Functionality

```javascript
// Dev Portal → Search Tab
Query: "one punch"
Type: Mixed
Order: Chronological

Expected:
- Results appear
- Each result has title, URL, thumbnail
- No errors in console
```

### Test 2: Browse Series

```javascript
// Dev Portal → Enter series URL
URL: https://aniworld.to/anime/stream/one-punch-man

Expected:
- Channel info loads
- Series title appears
- Description shows
- Banner/thumbnail loads
```

### Test 3: Episode Listing

```javascript
// After loading a series
Action: View episodes

Expected:
- Episodes listed by season
- S01E01, S01E02 format
- Episode titles show
- Click episode opens details
```

### Test 4: Error Recovery

```javascript
// Test with invalid URL
URL: https://aniworld.to/anime/stream/nonexistent

Expected:
- "Series not found" error logged
- No crash
- User-friendly error message
```

## Debug Output Examples

### Successful Load

```
[INFO] Loading plugin: Aniworld
[INFO] Required packages: bridge,http
[INFO] LOADED
[INFO] Plugin enabled successfully!
```

### HTTP Request

```
[DEBUG] Fetching: https://aniworld.to/search?q=naruto
[DEBUG] HTTP Success: 200
[INFO] Found 5 search results
```

### Error

```
[ERROR] Error in getHome: HTTP request failed: 404
[DEBUG] Returning empty ContentPager
```

## Performance Benchmarks

### Target Metrics

- **Plugin Load**: < 500ms
- **Search**: < 2s
- **Channel Info**: < 1s
- **Episode List**: < 3s (multiple seasons)
- **Episode Details**: < 1s

### Measuring Performance

```javascript
function getHome() {
  const startTime = Date.now();
  try {
    // ... your code
    log("getHome took: " + (Date.now() - startTime) + "ms");
  } catch (e) {
    log("Error after: " + (Date.now() - startTime) + "ms");
    throw e;
  }
}
```

## Testing Tools

### 1. Browser DevTools

- **Console**: View all logs
- **Network**: Monitor HTTP requests
- **Sources**: Debug JavaScript code
- **Application**: View storage

### 2. API Testing

Use curl or Postman to test endpoints:

```bash
# Get dev logs
curl http://localhost:11337/plugin/getDevLogs?index=-1

# Check login status
curl http://localhost:11337/plugin/isLoggedIn

# Get warnings
curl -X POST http://localhost:11337/plugin/getWarnings \
  -H "Content-Type: application/json" \
  -d '{"pluginId":"your-uuid"}'
```

### 3. Automated Testing

Create test scripts:

```javascript
// test.js
const tests = [
  { query: "naruto", expectedMin: 1 },
  { query: "one piece", expectedMin: 1 },
  { query: "nonexistent", expectedMin: 0 },
];

tests.forEach((test) => {
  const results = source.search(test.query);
  console.assert(
    results.length >= test.expectedMin,
    `Search failed for: ${test.query}`
  );
});
```

## Common Issues

### Issue: "Failed to get plugin"

**Cause**: Script URL returns 404

**Solution**:

1. Check HTTP server is running
2. Verify script URL is correct
3. Check file exists at path

### Issue: "Cannot read properties of null (reading 'iconUrl')"

**Cause**: Plugin config is invalid

**Solution**:

1. Validate JSON syntax
2. Ensure all required fields exist
3. Check icon file exists

### Issue: "Identifier 'X' has already been declared"

**Cause**: Global declarations conflict on reload

**Solution**:

1. Remove global enum objects
2. Use `let` instead of `var`
3. Use string literals directly

## Best Practices

### 1. Logging

```javascript
// Always log important operations
log("Starting search for: " + query);
log("Found " + results.length + " results");
log("Error in fetchHTML: " + error);
```

### 2. Error Handling

```javascript
try {
  const dom = fetchHTML(path);
  return parseResults(dom);
} catch (e) {
  log("Error: " + e);
  return new ContentPager([], false);
}
```

### 3. Defensive Coding

```javascript
// Check for null/undefined
const title = element ? element.textContent.trim() : "";

// Validate before use
if (!url) return null;

// Safe array operations
const items = Array.from(nodeList || []);
```

## Advanced Testing

### Testing Search Pagination

```javascript
const pager = source.search("test");
log("First page: " + pager.results.length + " results");

if (pager.hasMore) {
  const nextPage = pager.nextPage();
  log("Second page: " + nextPage.results.length + " results");
}
```

### Testing Episode Iteration

```javascript
for (let season = 1; season <= 10; season++) {
  const episodes = getEpisodesFromSeason(titlePath, season);
  log(`Season ${season}: ${episodes.length} episodes`);
  if (episodes.length === 0) break;
}
```

### Testing Error Conditions

```javascript
// Test with invalid input
try {
  source.getChannel("invalid-url");
  log("ERROR: Should have thrown exception");
} catch (e) {
  log("Correctly threw exception: " + e);
}
```

## Performance Optimization

### 1. Cache Frequently Used Data

```javascript
let cachedSeriesInfo = {};

function getSeriesInfo(titlePath) {
  if (cachedSeriesInfo[titlePath]) {
    log("Using cached series info");
    return cachedSeriesInfo[titlePath];
  }

  const info = fetchSeriesInfo(titlePath);
  cachedSeriesInfo[titlePath] = info;
  return info;
}
```

### 2. Batch Requests

```javascript
// Instead of multiple individual requests
// Fetch multiple seasons in one operation if API supports it
```

### 3. Lazy Loading

```javascript
// Only fetch data when needed
source.getChannelContents = function (url) {
  // Don't fetch all seasons immediately
  // Let paging handle it
};
```

## Deployment Checklist

Before deploying your plugin:

- [ ] Remove all debug logging
- [ ] Test with real data
- [ ] Verify all methods work
- [ ] Check error handling
- [ ] Test edge cases
- [ ] Verify performance
- [ ] Update version number
- [ ] Update changelog

## Resources

- **OpenAPI Spec**: See `openapi.yaml`
- **Plugin Template**: See `/sample/`
- **Type Definitions**: See `plugin.d.ts`
- **Example Plugins**: See `/sources/` directory

---

**Happy Testing!** 🚀
