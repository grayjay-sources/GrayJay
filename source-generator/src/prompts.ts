import inquirer from 'inquirer';
import { SourceConfig } from './types';

export async function promptForConfig(): Promise<SourceConfig> {
  console.log('\n🎨 GrayJay Source Generator\n');
  console.log('Let\'s create your source plugin!\n');

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Platform name:',
      default: 'My Platform',
      validate: (input) => input.length > 0 || 'Platform name is required'
    },
    {
      type: 'input',
      name: 'platformUrl',
      message: 'Platform URL (e.g., https://example.com):',
      validate: (input) => {
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      }
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      default: 'A GrayJay source plugin'
    },
    {
      type: 'input',
      name: 'author',
      message: 'Author name:',
      default: 'Bluscream'
    },
    {
      type: 'input',
      name: 'authorUrl',
      message: 'Author URL (optional):',
      default: ''
    },
    {
      type: 'input',
      name: 'repositoryUrl',
      message: 'Repository URL:',
      validate: (input) => {
        if (!input) return 'Repository URL is required';
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      }
    },
    {
      type: 'input',
      name: 'baseUrl',
      message: 'Base API URL (e.g., https://api.example.com):',
      validate: (input) => {
        try {
          new URL(input);
          return true;
        } catch {
          return 'Please enter a valid URL';
        }
      }
    },
    {
      type: 'checkbox',
      name: 'uses',
      message: 'What technologies does this source use?',
      choices: [
        { name: 'REST API', value: 'api', checked: true },
        { name: 'GraphQL', value: 'graphql' },
        { name: 'HTML Parsing', value: 'html' },
        { name: 'Web Scraping', value: 'webscraping' }
      ],
      validate: (input) => input.length > 0 || 'Please select at least one technology'
    },
    {
      type: 'confirm',
      name: 'hasAuth',
      message: 'Does this source support authentication?',
      default: false
    },
    {
      type: 'confirm',
      name: 'hasLiveStreams',
      message: 'Does this source support live streams?',
      default: false
    },
    {
      type: 'confirm',
      name: 'hasComments',
      message: 'Does this source support comments?',
      default: true
    },
    {
      type: 'confirm',
      name: 'hasPlaylists',
      message: 'Does this source support playlists?',
      default: true
    },
    {
      type: 'confirm',
      name: 'hasSearch',
      message: 'Does this source support search?',
      default: true
    },
    {
      type: 'input',
      name: 'logoUrl',
      message: 'Logo URL (optional, will fetch favicon from platform URL if not provided):',
      default: ''
    }
  ]);

  return {
    name: answers.name,
    platformUrl: answers.platformUrl,
    description: answers.description,
    author: answers.author,
    authorUrl: answers.authorUrl || undefined,
    repositoryUrl: answers.repositoryUrl,
    baseUrl: answers.baseUrl,
    logoUrl: answers.logoUrl || undefined,
    // Convert uses array to individual flags
    usesApi: answers.uses.includes('api'),
    usesGraphql: answers.uses.includes('graphql'),
    usesHtml: answers.uses.includes('html'),
    usesWebscraping: answers.uses.includes('webscraping'),
    // Feature flags
    hasAuth: answers.hasAuth,
    hasLiveStreams: answers.hasLiveStreams,
    hasComments: answers.hasComments,
    hasPlaylists: answers.hasPlaylists,
    hasSearch: answers.hasSearch,
    version: 1
  };
}
