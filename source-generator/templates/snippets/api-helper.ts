function apiRequest(endpoint: string, method: string = 'GET', body: any = null): any {
  const headers: any = {
    'Content-Type': 'application/json',
    {{AUTH_HEADER}}
  };

  let response;
  if (method === 'GET') {
    response = http.GET(BASE_URL + endpoint, headers, false);
  } else if (method === 'POST') {
    response = http.POST(BASE_URL + endpoint, body ? JSON.stringify(body) : '', headers, false);
  } else {
    response = http.request(method, BASE_URL + endpoint, body ? JSON.stringify(body) : '', headers, false);
  }

  if (!response.isOk) {
    throw new ScriptException('API request failed: ' + response.code);
  }

  return JSON.parse(response.body);
}

