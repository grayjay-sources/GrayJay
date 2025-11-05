# Testing Generated Plugins

## Generated Plugin is Functional! ✅

The source generator creates **fully functional skeleton plugins** that:

- ✅ Compile without errors
- ✅ Implement all required methods
- ✅ Return valid empty data structures (no crashes)
- ✅ Can be loaded in GrayJay app immediately
- ✅ Include helper functions based on selected technologies
- ✅ Have comprehensive utility library

## How to Test Your Generated Plugin

### Prerequisites

1. **GrayJay Android App** installed on your device
2. **Developer Mode** enabled in the app
3. **Computer and phone** on the same network

### Step 1: Enable Developer Mode

1. Open GrayJay app
2. Go to **More** tab → **Settings**
3. Scroll to bottom and tap **Version Code** multiple times
4. **Developer Settings** button will appear

### Step 2: Start the Dev Server

1. Tap **Developer Settings**
2. Tap **Start Server** button
3. Note your phone's IP address (Settings → Network)

### Step 3: Serve Your Plugin

In your generated plugin directory:

```powershell
# Navigate to your plugin's dist folder
cd test-platform/dist

# Start HTTP server on port 3000
python -m http.server 3000
```

Or use Node.js:

```bash
npx http-server -p 3000
```

### Step 4: Load Plugin in Dev Portal

1. Open `http://<phone-ip>:11337/dev` in your browser
2. Enter plugin URL: `http://<computer-ip>:3000/config.json`
3. Click **Load Plugin**
4. Wait for "LOADED" in console

### Step 5: Test Plugin Methods

Click the **Testing** tab and test each method:

#### Test getHome()

1. Find `getHome` in the method list
2. Click **Test** button
3. **Expected**: Returns empty array (no crash!)

#### Test getChannel()

1. Find `getChannel` in the method list
2. Enter URL: `https://yourplatform.com/channel/test`
3. Click **Test**
4. **Expected**: Returns placeholder channel object

#### Test getContentDetails()

1. Find `getContentDetails` in the method list
2. Enter URL: `https://yourplatform.com/video/test`
3. Click **Test**
4. **Expected**: Returns complete video object with all fields

#### Test search()

1. Find `search` in the method list
2. Enter query: `test`
3. Click **Test**
4. **Expected**: Returns empty search results (no crash!)

## What Makes Generated Plugins Work

### 1. No Crashes - Returns Valid Data

**Before (old templates):**

```typescript
source.getChannel = function (url: string) {
  throw new ScriptException("Not implemented yet"); // ❌ CRASH!
};
```

**After (our generator):**

```typescript
source.getChannel = function (url: string) {
  // TODO: Implement actual channel fetching
  return {
    id: "placeholder-channel",
    name: "Channel",
    thumbnail: "",
    banner: "",
    subscribers: 0,
    description: "Channel description not yet implemented",
    url: url,
  }; // ✅ Works!
};
```

### 2. Smart URL Detection

Case-insensitive and flexible:

```typescript
source.isChannelUrl = function (url: string): boolean {
  const urlLower = url.toLowerCase();
  return (
    urlLower.includes("example.com") &&
    (urlLower.includes("channel") ||
      urlLower.includes("user") ||
      urlLower.includes("@"))
  );
};
```

Works with:

- ✅ `https://example.com/channel/123`
- ✅ `https://example.com/c/mychannel`
- ✅ `https://example.com/@username`
- ✅ `https://EXAMPLE.COM/Channel/Test` (any case!)

### 3. Helper Functions Based on --uses

**With `--uses "api"`:**

```typescript
function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: any = null
): any {
  // Complete REST API helper ready to use!
}
```

**With `--uses "graphql"`:**

```typescript
function graphqlRequest(query: string, variables: any = {}): any {
  // Complete GraphQL helper ready to use!
}
```

**With `--uses "html"`:**

```typescript
function fetchHtml(url: string): string {}
function parseHtml(html: string): any {}
```

### 4. Comprehensive Utils Library

Every generated plugin includes `src/utils.ts` with:

- `parseJsonSafe()` - Safe JSON parsing
- `getQueryParam()` - URL parameter extraction
- `buildUrl()` - URL building with params
- `parseTimestamp()` - Date/time handling
- `parseDuration()` - Duration parsing (PT1H30M)
- `parseFormattedNumber()` - Parse "1.2K", "3.4M"
- `stripHtml()` - Remove HTML tags
- `selectThumbnail()` - Get best thumbnail
- And more!

## Next Steps After Testing

Once you've verified the plugin loads correctly:

1. **Implement API Calls**

   - Edit `src/Script.ts`
   - Replace `TODO` comments with actual API calls
   - Use the helper functions (apiRequest, graphqlRequest, etc.)

2. **Map Data**

   - Convert API responses to PlatformVideo objects
   - Use the utilities in `src/utils.ts`

3. **Test Again**

   - Reload plugin in dev portal
   - Verify real data appears
   - Check error handling

4. **Polish**
   - Add better error messages
   - Optimize performance
   - Add more settings if needed

## Example: Implementing getHome()

```typescript
source.getHome = function (): VideoPager {
  log("getHome called");

  try {
    // Make API call using helper
    const data = apiRequest("/feed/trending", "GET");

    // Map to PlatformVideo objects
    const videos = data.items.map((item) => ({
      id: item.id,
      name: item.title,
      thumbnails: createThumbnails([item.thumbnail]),
      author: {
        id: item.channel.id,
        name: item.channel.name,
        url: item.channel.url,
        thumbnail: item.channel.avatar,
      },
      uploadDate: parseTimestamp(item.published_at),
      duration: parseDuration(item.duration),
      viewCount: parseFormattedNumber(item.views),
      url: item.url,
      isLive: item.is_live || false,
    }));

    return new HomePager(videos);
  } catch (error) {
    log("Error in getHome: " + error);
    return new HomePager([]); // Return empty on error
  }
};
```

## Troubleshooting

### Plugin Won't Load

**Error: "Failed to load plugin"**

- Check HTTP server is running
- Verify config.json URL is accessible
- Check file permissions

**Error: "Package not found"**

- Ensure packages in config.json match what you use
- Add "DOMParser" if using HTML parsing

### Methods Don't Work

**Check:**

1. Plugin is enabled (shows in Overview tab)
2. Method exists in Testing tab
3. Console shows no errors
4. Parameters are correct format

## Summary

✅ **Generated plugins are production-ready skeletons!**

They:

- Load without errors
- Don't crash when called
- Return valid (empty) data
- Include all necessary helpers
- Have comprehensive documentation
- Are ready for API implementation

Just add your actual API calls and you're done! 🎉
