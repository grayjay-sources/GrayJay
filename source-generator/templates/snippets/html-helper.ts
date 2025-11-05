function fetchHtml(url: string): string {
  const response = http.GET(url, {}, false);
  if (!response.isOk) {
    throw new ScriptException('Failed to fetch HTML: ' + response.code);
  }
  return response.body;
}

function parseHtml(html: string): any {
  return domParser.parseFromString(html, 'text/html');
}

