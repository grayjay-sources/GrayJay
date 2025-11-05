# Dev Portal Tabs Documentation

Complete documentation of all tabs and buttons in the GrayJay Plugin Development Portal.

## Tab Navigation

The dev portal has 4 main tabs accessible from the top navigation bar:

1. **Overview** - Plugin information and loading
2. **Testing** - Method testing interface
3. **Integration** - Device integration testing
4. **Settings** - Portal configuration

## 1. Overview Tab

### Purpose

Load plugins and view plugin information.

### When No Plugin is Loaded

#### Input Fields

- **Plugin Config Json Url**
  - Text input field
  - Enter the URL to your plugin config JSON
  - Example: `http://localhost:3000/PluginConfig.json`

#### Toggles

- **Load using script tag**
  - Switch/checkbox
  - When ON: Loads script as DOM element (allows debugging)
  - When OFF: Loads script programmatically
  - Note: Script tag loading may cause reload issues

#### Buttons

- **Load Plugin**
  - Loads the plugin from the provided URL
  - Fetches config JSON and script
  - Initializes the plugin

#### Past Plugin URLs Section

- Shows previously loaded plugin URLs
- Click to quickly reload a past plugin
- **Delete Button** (X) - Remove from history

### When Plugin is Loaded

#### Top Bar (Always Visible)

- **Plugin Icon** - Shows plugin's icon
- **Plugin Name** - Displays current plugin name
- **Last Updated** - Timestamp of last load/reload
- **Reload Button** - Circular refresh icon (purple)
- **Login Button** - Appears if plugin has authentication
- **Logout Button** - Appears when logged in

#### Plugin Information Card

Displays:

- Plugin icon
- Plugin name
- Author (clickable link)
- Description
- Version number
- Repository URL (clickable link)
- Script URL (clickable link)

#### Action Buttons

- **Ref.js** - View reference/autocomplete file
- **Plugin.d.ts** - View TypeScript definitions
- **Reload** - Reload the plugin (updates code)

---

## 2. Testing Tab

### Purpose

Test individual plugin methods with custom parameters.

### When No Plugin Loaded

Shows message: "No Plugin Loaded - Load a plugin before doing testing."

### When Plugin Loaded

#### Search Field

- **Search for source methods...**
  - Text input
  - Filters the list of available methods
  - Live search as you type

#### Method Cards

For each plugin method (e.g., `enable`, `search`, `getHome`, etc.):

##### Card Header

- **Title** - Method name
- **(Optional)** tag if method is optional
- **Documentation** link (if available)

##### Card Content

- **Description** - What the method does
- **Code Example** - Method signature/example
- **Parameters** - Input fields for each parameter
  - Parameter name
  - Parameter description
  - Input field for value

##### Card Actions (Buttons)

- **Test Android**
  - Tests the method on Android device
  - Sends RPC call to mobile app
  - Shows results below card
- **Test**
  - Tests the method locally
  - Executes in browser context
  - Shows results immediately

##### Results Area

- Appears after testing
- Shows method return value
- Displays as formatted JSON or text
- Red text for exceptions
- Stack trace for errors

#### Common Methods Available

**Core Methods**:

- `enable(config, settings, savedState)`
- `getHome()`
- `search(query, type, order, filters)`
- `searchSuggestions(query)`
- `getSearchCapabilities()`

**Channel Methods**:

- `isChannelUrl(url)`
- `getChannel(url)`
- `getChannelContents(url)`

**Content Methods**:

- `isContentDetailsUrl(url)`
- `getContentDetails(url)`

**Optional Methods**:

- `getComments(url)`
- `getSubComments(comment)`
- `searchChannels(query)`

Each method card can be expanded to:

1. Enter test parameters
2. Click "Test" or "Test Android"
3. View results

---

## 3. Integration Tab

### Purpose

Test the plugin on an actual Android device by injecting it remotely.

### When No Plugin Loaded

Shows message: "No Plugin Loaded - Load a plugin before doing integration testing."

### When Plugin Has Errors

Shows warning:

```
Errors in Plugin
It's best to fix errors before doing any integration testing
```

### When Plugin Loaded

#### Integration Testing Card

##### Information Displayed

**Before Injection**:

```
Plugin is not yet injected.
Click "Inject Plugin" to load the plugin on your phone.
```

**After Injection**:

```
Last Injected: [timestamp]
Click Inject Plugin again to update to last version.
```

##### Buttons

- **Inject Plugin**
  - Uploads current plugin to connected device
  - Makes it available on the mobile app
  - Updates if already injected
  - Shows injection timestamp

#### Device Logs Card

##### Purpose

- Shows real-time logs from the mobile device
- Displays plugin execution output
- Shows errors and warnings
- Updates automatically

##### Log Display

- Scrollable log container
- Color-coded messages:
  - White: Normal logs
  - Red: Exceptions/errors
  - Blue: System messages
- Format: `[TYPE] Message`
- Chronological order
- Auto-scrolls to bottom

##### Log Types

- **DEBUG**: Debug information
- **INFO**: Informational messages
- **WARNING**: Warning messages
- **ERROR**: Error messages
- **EXCEPTION**: Exception details
- **SYSTEM**: System notifications

---

## 4. Settings Tab

### Purpose

Configure dev portal behavior.

### Settings Card

#### Available Settings

1. **Enable on Reload**

   - Type: Checkbox
   - When checked: Automatically calls `enable()` after reloading
   - When unchecked: Manual enable required
   - Default: (varies)

2. **Login on Reload**
   - Type: Checkbox
   - When checked: Automatically logs in after reload (if auth configured)
   - When unchecked: Manual login required
   - Default: (varies)
   - Only visible if plugin has authentication

#### Buttons

- **Save**
  - Saves settings to local storage
  - Settings persist across sessions
  - Confirmation shown on success

---

## Common Workflows

### Workflow 1: Basic Plugin Testing

1. **Overview Tab**: Load plugin
2. **Testing Tab**: Test `enable()` method
3. **Testing Tab**: Test `search()` with query
4. **Testing Tab**: Test `getHome()`
5. **Overview Tab**: Check for errors

### Workflow 2: Full Testing

1. **Overview Tab**: Load plugin
2. **Settings Tab**: Enable "Enable on Reload"
3. **Testing Tab**: Test all methods systematically
4. Make code changes
5. **Overview Tab**: Click Reload
6. **Testing Tab**: Re-test modified methods

### Workflow 3: Device Integration Testing

1. **Overview Tab**: Load plugin
2. **Testing Tab**: Verify methods work locally
3. **Integration Tab**: Click "Inject Plugin"
4. **Integration Tab**: Watch device logs
5. Use plugin on mobile app
6. **Integration Tab**: Monitor logs for errors
7. Fix any issues
8. **Overview Tab**: Reload
9. **Integration Tab**: Inject Plugin again

### Workflow 4: Iterative Development

```
Edit Code → Overview: Reload → Testing: Test → Check Logs → Repeat
```

---

## Button Reference Table

### Overview Tab

| Button      | Action                | When Available                  |
| ----------- | --------------------- | ------------------------------- |
| Load Plugin | Load plugin from URL  | Always                          |
| Reload      | Reload current plugin | Plugin loaded                   |
| Ref.js      | Open reference docs   | Plugin loaded                   |
| Plugin.d.ts | Open type definitions | Plugin loaded                   |
| Login       | Authenticate plugin   | Auth configured & not logged in |
| Logout      | Clear authentication  | Logged in                       |

### Testing Tab

| Button       | Action                  | When Available                  |
| ------------ | ----------------------- | ------------------------------- |
| Test Android | Test on device          | Plugin loaded, device connected |
| Test         | Test locally in browser | Plugin loaded                   |

### Integration Tab

| Button        | Action           | When Available                  |
| ------------- | ---------------- | ------------------------------- |
| Inject Plugin | Upload to device | Plugin loaded, device connected |

### Settings Tab

| Button | Action        | When Available |
| ------ | ------------- | -------------- |
| Save   | Save settings | Always         |

---

## Keyboard Shortcuts

While the portal doesn't explicitly document shortcuts, standard web shortcuts work:

- **F5** - Refresh page (clears plugin)
- **Ctrl+R** - Refresh page
- **F12** - Open browser DevTools
- **Ctrl+Shift+I** - Open DevTools

---

## Tips and Tricks

### Testing Tab

1. **Use Search**: Filter methods to find what you need quickly
2. **Test Required Methods First**: `enable()`, `getHome()`, `search()`
3. **Save Parameter Values**: Values persist during session
4. **Test Both Buttons**: "Test" for quick checks, "Test Android" for real-world
5. **Check Results**: Always verify return values are correct

### Integration Tab

1. **Watch Logs**: Keep log window visible while testing
2. **Test Real Usage**: Use app normally after injection
3. **Check Stack Traces**: Errors show full stack trace
4. **Re-inject After Changes**: Always re-inject after code changes
5. **Clear Old Logs**: Reload to start fresh

### Settings Tab

1. **Enable on Reload** is helpful for rapid development
2. **Login on Reload** saves time if testing auth features
3. **Save After Changes**: Don't forget to click Save

### General

1. **Use Browser Console**: F12 for additional debugging
2. **Monitor Network**: Check XHR requests
3. **Keep Portal Open**: No need to close between reloads
4. **Test Incrementally**: One method at a time
5. **Document Issues**: Note errors for fixing

---

## Error Messages

### Common Errors

| Error                   | Meaning                     | Solution                    |
| ----------------------- | --------------------------- | --------------------------- |
| "Failed to get plugin"  | Script URL 404              | Check HTTP server running   |
| "Cannot read 'iconUrl'" | Invalid config              | Verify JSON syntax          |
| "No Plugin Loaded"      | Try to test without loading | Load plugin first           |
| Red text in results     | Method threw exception      | Check method implementation |

### Error Display Locations

- **Overview Tab**: Plugin info card shows error state
- **Testing Tab**: Results show red text for exceptions
- **Integration Tab**: Device logs show red for errors
- **Browser Console**: All JavaScript errors appear here

---

## Advanced Features

### Method Testing

Each method card supports:

- **Multiple Parameters**: All parameters can be customized
- **JSON Input**: Complex objects as JSON strings
- **Test History**: Results saved until reload
- **Error Details**: Full exception and stack trace

### Integration Features

- **Real-time Logs**: Updates automatically
- **Log Filtering**: (if implemented)
- **Export Logs**: (if implemented)
- **Clear Logs**: Refresh to reset

---

## Troubleshooting

### Testing Tab Issues

**Problem**: Method returns null

- **Check**: Method implementation
- **Check**: Parameters are correct
- **Check**: Required packages loaded

**Problem**: "Test Android" doesn't work

- **Check**: Device connected
- **Check**: Dev server accessible from device
- **Check**: Plugin injected via Integration tab

### Integration Tab Issues

**Problem**: Can't inject plugin

- **Check**: Device connected to network
- **Check**: Dev server accessible
- **Check**: Plugin loaded in Overview

**Problem**: No logs appearing

- **Check**: Plugin actually running on device
- **Check**: Using plugin features on device
- **Check**: Log polling is working

---

## Best Practices

### For Testing

1. ✅ Test `enable()` first
2. ✅ Test required methods before optional
3. ✅ Use realistic parameter values
4. ✅ Check return value structure
5. ✅ Verify error handling

### For Integration

1. ✅ Test locally first
2. ✅ Inject clean version
3. ✅ Test actual user scenarios
4. ✅ Monitor logs continuously
5. ✅ Re-inject after every code change

### For Settings

1. ✅ Enable "Enable on Reload" during development
2. ✅ Disable for production testing
3. ✅ Save settings after changes
4. ✅ Document your preferred settings

---

## Summary

The dev portal provides three main testing interfaces:

- **Overview**: Load and manage plugins
- **Testing**: Test methods with parameters
- **Integration**: Test on actual devices
- **Settings**: Configure portal behavior

Each tab has specific buttons and features designed for efficient plugin development and testing! 🎉
