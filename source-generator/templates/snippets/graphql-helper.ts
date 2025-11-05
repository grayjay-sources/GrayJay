function graphqlRequest(query: string, variables: any = {}): any {
  const response = http.POST(BASE_URL + '/graphql', JSON.stringify({
    query: query,
    variables: variables
  }), {
    'Content-Type': 'application/json',
    {{AUTH_HEADER}}
  }, false);

  if (!response.isOk) {
    throw new ScriptException('GraphQL request failed: ' + response.code);
  }

  const data = JSON.parse(response.body);
  if (data.errors) {
    throw new ScriptException('GraphQL errors: ' + JSON.stringify(data.errors));
  }

  return data.data;
}
