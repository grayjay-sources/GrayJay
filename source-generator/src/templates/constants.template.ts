import { SourceConfig } from '../types';

export function generateConstants(config: SourceConfig): string {
  return `// Constants for ${config.name}

export const BASE_URL = '${config.baseUrl}';
export const PLATFORM_URL = '${config.platformUrl}';
export const PLATFORM = '${config.name}';

export const ERROR_TYPES = {
  NETWORK: 'NetworkError',
  AUTH: 'AuthenticationError',
  NOT_FOUND: 'NotFoundError',
  INVALID_DATA: 'InvalidDataError'
};

// Add your custom constants here
`;
}
