# GrayJay Plugin Testing - UI Workflow

This guide provides a compact workflow for testing GrayJay plugins using the DevPortal web interface.

## Prerequisites

- Your plugin source files (config JSON and script JS) accessible via HTTP server
- DevPortal accessible at `http://100.100.1.57:11337/dev`

## Step-by-Step Testing Workflow

### 1. Start Local Web Server

In your plugin source directory, start a local HTTP server:

```bash
cd P:\GrayJay\sources\your-plugin-folder
npx serve
```

**Note:** The server typically starts on port 3000. If you see a different port, note it for step 3.

### 2. Navigate to DevPortal

Open your browser and navigate to:

```
http://100.100.1.57:11337/dev
```

You should see the DevPortal interface with an "Overview" tab selected by default.

### 3. Load Your Plugin

1. In the **"Plugin Config Json Url"** text field (labeled as `input-4` in the HTML), enter your plugin's config URL:
   ```
   http://localhost:3000/YourPluginConfig.json
   ```
2. Click the **"Load Plugin"** button

3. Wait for the plugin to load. You should see confirmation or error messages in the interface.

### 4. Navigate to Testing Tab

Click on the **"Testing"** tab in the navigation menu (located in the header).

### 5. Test: Enable

1. Locate the **"enable"** method card
2. Click the **"Test"** button (NOT "Test Android") on the enable card
3. Check the result displayed below the button

### 6. Test: Get Home

1. Locate the **"getHome"** method card
2. Click the **"Test"** button on the getHome card
3. Verify the results (should return a list of content items)

### 7. Test: Is Content Details URL

1. Locate the **"isContentDetailsUrl"** method card
2. In the **"url value"** input field, enter an example URL from your source:
   ```
   https://your-streaming-site.com/stream/example-content
   ```
3. Click the **"Test"** button
4. Verify the result (should return true/false)

### 8. Test: Get Content Details

1. Locate the **"getContentDetails"** method card
2. In the **"url value"** input field, enter the same URL you used in step 7
3. Click the **"Test"** button
4. Verify the detailed content information is returned

## Additional Testing Options

### Test on Android Device

- Use the **"Test Android"** button instead of "Test" to run tests directly on a connected Android device

### Search for Specific Methods

- Use the **"Search for source methods.."** text box at the top of the Testing tab to filter methods

### Integration Tab

Navigate to the **"Integration"** tab to:

- **Inject Plugin**: Load the plugin into the GrayJay app
- **Clear Logs**: Clear the development log display
- View development logs and HTTP requests

### Settings Tab

Navigate to the **"Settings"** tab to:

- **Enable on Reload**: Automatically enable the plugin when page reloads
- **Login on Reload**: Automatically login when page reloads
- Click **"Save"** to persist these settings

## Troubleshooting

1. **Plugin fails to load:**

   - Check that your HTTP server is running
   - Verify the config URL is correct and accessible
   - Check browser console for errors

2. **Test fails with error:**

   - Verify your plugin script implements the required method
   - Check the development logs in the Integration tab
   - Ensure your source URL format matches what the plugin expects

3. **Can't find a method:**
   - Use the search box to filter methods
   - Check that your plugin script exports the method

## Next Steps

Once basic testing passes:

1. Test additional methods (search, getChannel, etc.)
2. Use the Integration tab to inject the plugin into the GrayJay app
3. Test the plugin with real user scenarios
4. Monitor logs for any runtime errors

---

**Related Documentation:**

- [Testing via API Requests](./TESTING_API_WORKFLOW.md)
- [DevPortal Tabs Documentation](./TABS_DOCUMENTATION.md)
- [OpenAPI Specification](./openapi.yaml)
