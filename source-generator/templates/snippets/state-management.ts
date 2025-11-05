// Advanced state management pattern with token handling

interface PluginState {
  authToken: string;
  authTokenExpiration: number;
  userId: string;
  // Add platform-specific state here
}

const state: PluginState = {
  authToken: '',
  authTokenExpiration: 0,
  userId: ''
};

/**
 * Save plugin state (called by GrayJay)
 */
source.saveState = function (): string {
  return JSON.stringify({
    authToken: state.authToken,
    authTokenExpiration: state.authTokenExpiration,
    userId: state.userId
  });
};

/**
 * Load saved state on plugin enable
 */
function loadSavedState(saveStateStr: string): void {
  if (!saveStateStr) return;
  
  try {
    const savedState = JSON.parse(saveStateStr);
    state.authToken = savedState.authToken || '';
    state.authTokenExpiration = savedState.authTokenExpiration || 0;
    state.userId = savedState.userId || '';
    
    log('Loaded saved state');
  } catch (e) {
    log('Failed to parse saved state: ' + e);
  }
}

/**
 * Check if auth token is still valid
 */
function isTokenValid(): boolean {
  const currentTime = Date.now();
  return state.authToken && state.authTokenExpiration > currentTime;
}

/**
 * Refresh authentication token
 */
function refreshAuthToken(): void {
  try {
    // Example: Anonymous token endpoint
    const resp = http.POST(
      '{{BASE_URL_AUTH}}',
      JSON.stringify({}),
      { 'Content-Type': 'application/json' },
      false
    );
    
    if (!resp.isOk) {
      throw new ScriptException('Failed to get auth token: ' + resp.code);
    }
    
    const data = JSON.parse(resp.body);
    state.authToken = data.accessToken || data.token || '';
    state.userId = data.userId || data.user_id || '';
    
    // Token usually expires in 24 hours
    state.authTokenExpiration = Date.now() + (24 * 60 * 60 * 1000);
    
    log('Auth token refreshed');
  } catch (e) {
    log('Error refreshing token: ' + e);
  }
}

/**
 * Enhanced enable method with state management
 */
source.enable = function (conf: any, settings: any, saveStateStr: string): void {
  config = conf ?? {};
  log('Plugin enabled');
  
  // Load saved state
  if (saveStateStr) {
    loadSavedState(saveStateStr);
  }
  
  // Refresh token if needed
  if (!isTokenValid()) {
    refreshAuthToken();
  }
};
