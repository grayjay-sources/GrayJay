// Helper for GraphQL APIs that use persisted queries (like Joyn, GitHub, etc.)
// Persisted queries use SHA256 hashes instead of sending full query strings

import { BASE_URL_API } from './constants';

interface PersistedQuery {
  operationName: string;
  persistedQuery: {
    version: number;
    sha256Hash: string;
  };
}

interface GraphQLRequestOptions extends PersistedQuery {
  variables?: Record<string, any>;
  headers?: Record<string, string>;
  requiresAuth?: boolean;
}

/**
 * Execute a persisted GraphQL query
 * @param requestOptions Query options with operation name and hash
 * @returns [error, data] tuple
 */
function executePersistedGqlQuery(requestOptions: GraphQLRequestOptions): [any, any] {
  const headers = {
    'Content-Type': 'application/json',
    ...requestOptions.headers
  };
  
  // Add auth token if needed
  if (requestOptions.requiresAuth && state.authToken) {
    headers['Authorization'] = `Bearer ${state.authToken}`;
  }
  
  // Build query parameters
  const params = new URLSearchParams();
  params.set('operationName', requestOptions.operationName);
  
  if (requestOptions.variables) {
    params.set('variables', JSON.stringify(requestOptions.variables));
  }
  
  params.set('extensions', JSON.stringify({
    persistedQuery: requestOptions.persistedQuery
  }));
  
  const url = `${BASE_URL_API}?${params.toString()}`;
  
  try {
    const res = http.GET(url, headers, requestOptions.requiresAuth || false);
    
    if (!res.isOk) {
      return [{
        code: res.code,
        status: `HTTP ${res.code}`,
        operationName: requestOptions.operationName,
        body: res.body
      }, null];
    }
    
    let body;
    try {
      body = JSON.parse(res.body);
    } catch (parseError) {
      return [{
        code: 'PARSE_ERROR',
        status: 'Failed to parse response',
        operationName: requestOptions.operationName,
        error: String(parseError)
      }, null];
    }
    
    // Check for GraphQL errors
    if (body.errors) {
      const message = body.errors.map((e: any) => e.message).join(', ');
      return [{
        code: 'GQL_ERROR',
        status: message,
        operationName: requestOptions.operationName,
        errors: body.errors
      }, body.data || null];
    }
    
    return [null, body.data];
  } catch (error) {
    return [{
      code: 'EXCEPTION',
      status: error instanceof Error ? error.message : String(error),
      operationName: requestOptions.operationName
    }, null];
  }
}

/**
 * Execute a traditional GraphQL query (sends full query string)
 * Use this if the API doesn't support persisted queries
 */
function executeGqlQuery(query: string, variables?: Record<string, any>): [any, any] {
  const body = JSON.stringify({
    query,
    variables
  });
  
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (state.authToken) {
    headers['Authorization'] = `Bearer ${state.authToken}`;
  }
  
  try {
    const res = http.POST(BASE_URL_API, body, headers, false);
    
    if (!res.isOk) {
      return [{ code: res.code, message: `HTTP ${res.code}` }, null];
    }
    
    const data = JSON.parse(res.body);
    
    if (data.errors) {
      return [{ code: 'GQL_ERROR', errors: data.errors }, data.data || null];
    }
    
    return [null, data.data];
  } catch (error) {
    return [{ code: 'EXCEPTION', message: String(error) }, null];
  }
}

function log(message: string) {
  console.log(`[${PLATFORM}] ${message}`);
}
