export interface SourceConfig {
  name: string;
  platformUrl: string;
  description: string;
  author: string;
  authorUrl?: string;
  repositoryUrl: string;
  baseUrl: string;
  logoUrl?: string; // Logo URL (auto-resolved from favicon if not provided)
  // Technology flags
  usesApi?: boolean;
  usesGraphql?: boolean;
  usesHtml?: boolean;
  usesWebscraping?: boolean;
  // Feature flags (all optional, only enabled if explicitly requested)
  hasAuth?: boolean;
  hasLiveStreams?: boolean;
  hasComments?: boolean;
  hasPlaylists?: boolean;
  hasSearch?: boolean;
  version?: number;
}

export interface GeneratorOptions {
  outputDir: string;
  config: SourceConfig;
  typescript?: boolean;
  interactive?: boolean;
}

export interface PluginCapabilities {
  useGraphQL: boolean;
  useAPI: boolean;
  useHTML: boolean;
  useWebScraping: boolean;
  hasAuth: boolean;
  hasLiveStreams: boolean;
  hasComments: boolean;
  hasPlaylists: boolean;
  hasSearch: boolean;
}
