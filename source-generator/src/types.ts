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
  logoUrl?: string; // Optional URL to logo (will auto-resolve from favicon if not provided)
  resolvedLogoUrl?: string; // The final resolved logo URL (from logoUrl or favicon)
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
