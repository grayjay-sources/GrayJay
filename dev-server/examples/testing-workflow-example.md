# Testing Workflow Example

Step-by-step example of testing a plugin using the dev portal.

## Scenario: Testing the Aniworld Plugin

### Step 1: Start Local Server

```powershell
cd P:\GrayJay\sources\grayjay-sources-grayjay-source-aniworld
python -m http.server 3000
```

### Step 2: Open Dev Portal

Navigate to: `http://localhost:11337/dev`

### Step 3: Load Plugin (Overview Tab)

1. Click on **Overview** tab (should be default)
2. Enter in "Plugin Config Json Url":
   ```
   http://localhost:3000/AniworldConfig.json
   ```
3. Optionally check "Load using script tag" for debugging
4. Click **Load Plugin** button

**Expected Result**:

```
✅ Plugin card appears
✅ Shows "Aniworld" name
✅ Shows authors
✅ Shows repository URL
✅ Reload button appears
✅ Console shows "LOADED"
```

### Step 4: Test Enable (Testing Tab)

1. Click **Testing** tab
2. Scroll to find `enable` method card
3. Leave parameters as default
4. Click **Test** button

**Expected Result**:

```
✅ No errors in console
✅ Result shows "undefined" (normal)
✅ Logs show plugin enabled
```

### Step 5: Test Search

1. In Testing tab, find `search` method card
2. Fill in parameters:
   - **query**: `naruto`
   - **type**: `Mixed`
   - **order**: `Chronological`
   - **filters**: `{}`
3. Click **Test** button

**Expected Result**:

```json
{
  "results": [
    {
      "id": {...},
      "name": "Naruto",
      "thumbnails": {...},
      "author": {...},
      "url": "https://aniworld.to/anime/stream/naruto"
    }
  ],
  "hasMore": false
}
```

### Step 6: Test Get Home

1. Find `getHome` method card
2. No parameters needed
3. Click **Test** button

**Expected Result**:

```json
{
  "results": [
    // Array of PlatformVideo objects
  ],
  "hasMore": false
}
```

### Step 7: Test Channel Detection

1. Find `isChannelUrl` method card
2. Enter parameter:
   - **url**: `https://aniworld.to/anime/stream/one-punch-man`
3. Click **Test**

**Expected Result**:

```
true
```

### Step 8: Test Get Channel

1. Find `getChannel` method card
2. Enter parameter:
   - **url**: `https://aniworld.to/anime/stream/one-punch-man`
3. Click **Test**

**Expected Result**:

```json
{
  "id": {...},
  "name": "One Punch Man",
  "thumbnail": "...",
  "banner": "...",
  "description": "...",
  "url": "https://aniworld.to/anime/stream/one-punch-man"
}
```

### Step 9: Test Get Channel Contents

1. Find `getChannelContents` method card
2. Enter parameter:
   - **url**: `https://aniworld.to/anime/stream/one-punch-man`
3. Click **Test**

**Expected Result**:

```json
{
  "results": [
    {
      "id": {...},
      "name": "S01E01: Episode Title",
      "url": "https://aniworld.to/anime/stream/one-punch-man/staffel-1/episode-1"
    },
    // More episodes...
  ],
  "hasMore": false
}
```

### Step 10: Make a Code Change

1. Edit `AniworldScript.js`
2. Add debug logging:
   ```javascript
   source.search = function (query, type, order, filters) {
     log("Search called with query: " + query); // Added
     const results = searchContent(query);
     return new ContentPager(results, false);
   };
   ```
3. Save file

### Step 11: Reload Plugin (Overview Tab)

1. Click **Overview** tab
2. Click **Reload** button (circular purple icon)

**Expected Result**:

```
✅ Console shows "Loading script..."
✅ Console shows "LOADED"
✅ "Last updated" timestamp changes
```

### Step 12: Verify Change (Testing Tab)

1. Click **Testing** tab
2. Test `search` again with query `naruto`
3. Check console

**Expected Result**:

```
✅ Console shows: "Search called with query: naruto"
✅ Results still work correctly
```

### Step 13: Device Integration (Integration Tab)

1. **Connect Android device** to same network
2. **Open GrayJay app** on device
3. Click **Integration** tab in portal
4. Click **Inject Plugin** button

**Expected Result**:

```
✅ Shows "Last Injected: [timestamp]"
✅ Plugin appears in GrayJay app
```

### Step 14: Test on Device

1. Open GrayJay app on device
2. Navigate to plugin
3. Try searching for "naruto"

**Monitoring**:

- Watch **Integration Tab** device logs
- Should see log messages appear
- Should see search results load

### Step 15: Check Device Logs

In Integration tab, device logs should show:

```
[INFO] Plugin enabled successfully
[DEBUG] Search called with query: naruto
[INFO] Found 5 search results
```

### Step 16: Fix Any Issues

If errors appear:

1. Note the error message
2. Switch to code editor
3. Fix the issue
4. **Overview Tab**: Reload
5. **Integration Tab**: Inject Plugin
6. **Test again** on device

### Step 17: Settings Configuration (Settings Tab)

1. Click **Settings** tab
2. Check **Enable on Reload**
3. Check **Login on Reload** (if auth configured)
4. Click **Save**

**Result**: Next reload will auto-enable and auto-login

---

## Complete Test Matrix

### Core Functionality Tests

| Method                  | Parameters   | Expected Result   | Status |
| ----------------------- | ------------ | ----------------- | ------ |
| `enable()`              | (auto)       | Returns undefined | ✅     |
| `getHome()`             | None         | Array of videos   | ✅     |
| `search()`              | query:"test" | Search results    | ✅     |
| `isChannelUrl()`        | valid URL    | true              | ✅     |
| `getChannel()`          | channel URL  | Channel object    | ✅     |
| `getChannelContents()`  | channel URL  | Episodes          | ✅     |
| `isContentDetailsUrl()` | episode URL  | true              | ✅     |
| `getContentDetails()`   | episode URL  | Video details     | ✅     |

### Error Handling Tests

| Test           | Parameters | Expected Result  | Status |
| -------------- | ---------- | ---------------- | ------ |
| Invalid URL    | bad URL    | Error thrown     | ✅     |
| Missing param  | null/empty | Graceful failure | ✅     |
| Network error  | timeout    | Error logged     | ✅     |
| Invalid search | gibberish  | Empty results    | ✅     |

---

## Debugging Example

### Problem: Search Returns Empty

**Steps to Debug**:

1. **Testing Tab**: Test `search("naruto")`
2. **Result**: Empty array
3. **Check Logs**: No errors
4. **Add Debug Logging**:
   ```javascript
   function searchContent(query) {
     log("Searching for: " + query);
     try {
       const dom = fetchHTML("/search?q=" + encodeURIComponent(query));
       log("Fetched HTML successfully");

       const links = dom.querySelectorAll("li > a");
       log("Found " + links.length + " links");

       // ... parse results
     } catch (e) {
       log("Error in searchContent: " + e);
     }
   }
   ```
5. **Reload** plugin
6. **Test** again
7. **Check Console**: See where it fails
8. **Fix** the issue
9. **Test** again

### Problem: Integration Logs Not Showing

**Steps to Debug**:

1. Check device is connected to network
2. Verify dev server accessible from device:
   ```
   http://[computer-ip]:11337/dev
   ```
3. Re-inject plugin
4. Use plugin feature on device
5. Check Integration tab logs
6. If still no logs, check browser network tab

---

## Pro Tips

### Speed Up Testing

1. **Use Tab Order**: Overview → Testing → Integration
2. **Keep Portal Open**: No need to refresh
3. **Save Parameters**: Testing tab remembers values
4. **Use Search**: Filter methods quickly
5. **Multiple Windows**: Portal in one, code in another

### Efficient Debugging

1. **Add Logs Early**: Log at function entry/exit
2. **Log Parameters**: See what's actually passed
3. **Log Results**: Verify return values
4. **Catch Errors**: Log exceptions properly
5. **Check All Tabs**: Errors may show differently

### Best Development Flow

```
1. Edit code
2. Overview: Reload
3. Testing: Quick test method
4. Integration: Inject to device
5. Test on device
6. Check device logs
7. Fix issues
8. Repeat from step 1
```

---

## Expected Timeline

| Task             | Time    | Notes                 |
| ---------------- | ------- | --------------------- |
| Load plugin      | 5s      | Initial load          |
| Reload plugin    | 2s      | Subsequent reloads    |
| Test method      | 1-5s    | Depends on complexity |
| Inject to device | 3s      | Upload and install    |
| View logs        | Instant | Real-time updates     |

---

## Conclusion

This workflow example demonstrates:

✅ Complete plugin testing cycle  
✅ Local testing workflow  
✅ Device integration testing  
✅ Debugging methodology  
✅ Settings configuration

Follow this pattern for efficient plugin development! 🚀
