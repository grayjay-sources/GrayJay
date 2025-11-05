export interface SourceConfig {
  name: string;
  platformUrl: string;
  description: string;
  author: string;
  authorUrl?: string;
  repositoryUrl: string;
  baseUrl: string;
  uses: string[]; // e.g., ['graphql', 'api', 'html', 'webscraping']
  hasAuth?: boolean;
  hasLiveStreams?: boolean;
  hasComments?: boolean;
  hasPlaylists?: boolean;
  hasSearch?: boolean;
  version?: number;
  logoUrl?: string; // Optional URL to fetch logo from
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
