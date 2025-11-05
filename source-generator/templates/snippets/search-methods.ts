source.searchSuggestions = function (query: string): string[] {
  log('searchSuggestions called with query: ' + query);
  // Implement search suggestions
  return [];
};

source.search = function (query: string, type: string, order: string, filters: Map<any, any>): VideoPager {
  log('search called with query: ' + query);
  return new SearchPager(query, type);
};

source.searchChannels = function (query: string): ChannelPager {
  log('searchChannels called with query: ' + query);
  return new ChannelSearchPager(query);
};

