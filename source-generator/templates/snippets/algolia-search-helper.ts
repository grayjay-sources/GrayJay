// Helper for Algolia-powered search (used by platforms like Joyn, Twitch, etc.)

import { ALGOLIA_APP_ID, BASE_URL_ALGOLIA } from './constants';

/**
 * Get Algolia API key from platform's API
 * Some platforms expose this via a GraphQL query or REST endpoint
 */
function refreshAlgoliaApiKey(): void {
  try {
    // Example: Query platform's API for Algolia credentials
    // Adjust this based on your platform's API
    const [error, data] = executeGqlQuery({
      operationName: 'AlgoliaApiKey',
      persistedQuery: {
        version: 1,
        sha256Hash: 'YOUR_HASH_HERE'
      },
      variables: {}
    });
    
    if (error) {
      throw new ScriptException('Failed to get Algolia API key: ' + error.status);
    }
    
    if (data && data.algoliaApiKey) {
      state.algoliaApiKey = data.algoliaApiKey.key || '';
      // API keys usually have expiration timestamps
      state.algoliaApiKeyExpiration = Date.now() + (24 * 60 * 60 * 1000);
      log('Algolia API key refreshed');
    }
  } catch (e) {
    log('Error refreshing Algolia key: ' + e);
  }
}

/**
 * Check if Algolia API key is still valid
 */
function isAlgoliaKeyValid(): boolean {
  const currentTime = Date.now();
  return state.algoliaApiKey && state.algoliaApiKeyExpiration > currentTime;
}

/**
 * Search using Algolia
 * @param query Search query string
 * @param page Page number (0-indexed)
 * @param hitsPerPage Results per page
 * @returns [error, results] tuple
 */
function searchWithAlgolia(
  query: string,
  page: number = 0,
  hitsPerPage: number = 20
): [any, any] {
  // Refresh API key if needed
  if (!isAlgoliaKeyValid()) {
    refreshAlgoliaApiKey();
  }
  
  if (!state.algoliaApiKey) {
    return [{ code: 'NO_API_KEY', message: 'No Algolia API key available' }, null];
  }
  
  // Build Algolia search request
  const algoliaRequest = {
    requests: [
      {
        indexName: '{{ALGOLIA_INDEX_NAME}}', // e.g., 'joyn_prod', 'twitch_streams'
        params: `query=${encodeURIComponent(query)}&hitsPerPage=${hitsPerPage}&page=${page}`
      }
    ]
  };
  
  const headers = {
    'x-algolia-application-id': ALGOLIA_APP_ID,
    'x-algolia-api-key': state.algoliaApiKey,
    'Content-Type': 'application/json'
  };
  
  try {
    const resp = http.POST(
      BASE_URL_ALGOLIA,
      JSON.stringify(algoliaRequest),
      headers,
      false
    );
    
    if (!resp.isOk) {
      return [{ code: resp.code, message: `Search failed: ${resp.code}` }, null];
    }
    
    const data = JSON.parse(resp.body);
    const hits = data.results?.[0]?.hits || [];
    const nbPages = data.results?.[0]?.nbPages || 0;
    const totalHits = data.results?.[0]?.nbHits || 0;
    
    return [null, {
      hits,
      page,
      nbPages,
      totalHits,
      hasMore: (page + 1) < nbPages
    }];
  } catch (error) {
    return [{ code: 'EXCEPTION', message: String(error) }, null];
  }
}
