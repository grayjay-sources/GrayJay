#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { SourceGenerator } from './generator';
import { promptForConfig } from './prompts';
import { SourceConfig } from './types';

const program = new Command();

program
  .name('grayjay-generate')
  .description('Generate a GrayJay source plugin skeleton')
  .version('1.0.0')
  .option('-n, --name <name>', 'Platform name')
  .option('-p, --platform-url <url>', 'Platform URL')
  .option('-d, --description <description>', 'Platform description')
  .option('-a, --author <author>', 'Author name')
  .option('--author-url <url>', 'Author URL')
  .option('-r, --repository-url <url>', 'Repository URL')
  .option('-b, --base-url <url>', 'Base API URL')
  .option('--logo-url <url>', 'Logo URL (optional, auto-resolves from favicon if not provided)')
  .option('--uses-api', 'Use REST API')
  .option('--uses-graphql', 'Use GraphQL API')
  .option('--uses-html', 'Use HTML parsing/scraping')
  .option('--uses-webscraping', 'Use web scraping')
  .option('--uses-auth', 'Enable authentication support')
  .option('--uses-live', 'Enable live streams support')
  .option('--uses-comments', 'Enable comments support')
  .option('--uses-playlists', 'Enable playlists support')
  .option('--uses-search', 'Enable search support')
  .option('-o, --output <directory>', 'Output directory', '.')
  .option('-i, --interactive', 'Interactive mode (prompt for all options)')
  .option('--js', 'Generate JavaScript project instead of TypeScript')
  .parse(process.argv);

async function main() {
  const options = program.opts();

  try {
    let config: SourceConfig;

    // If interactive mode or no arguments provided, prompt for configuration
    if (options.interactive || process.argv.length <= 2) {
      config = await promptForConfig();
    } else {
      // Validate required arguments
      const required = ['name', 'platformUrl', 'repositoryUrl', 'baseUrl'];
      const missing = required.filter(key => !options[key] && !options[toCamelCase(key)]);
      
      if (missing.length > 0) {
        console.error(chalk.red(`\n❌ Missing required options: ${missing.join(', ')}\n`));
        console.log('Use --interactive for a guided setup, or provide all required options.');
        console.log('Run with --help to see all options.\n');
        process.exit(1);
      }

      config = {
        name: options.name,
        platformUrl: options.platformUrl,
        description: options.description || `${options.name} source plugin for GrayJay`,
        author: options.author || 'Unknown',
        authorUrl: options.authorUrl,
        repositoryUrl: options.repositoryUrl,
        baseUrl: options.baseUrl,
        logoUrl: options.logoUrl,
        // Technology flags (default to API if none specified)
        usesApi: options.usesApi,
        usesGraphql: options.usesGraphql,
        usesHtml: options.usesHtml,
        usesWebscraping: options.usesWebscraping,
        // Feature flags (only enabled if explicitly requested)
        hasAuth: options.usesAuth,
        hasLiveStreams: options.usesLive,
        hasComments: options.usesComments,
        hasPlaylists: options.usesPlaylists,
        hasSearch: options.usesSearch,
        version: 1
      };
      
      // Default to API if no technology specified
      if (!config.usesApi && !config.usesGraphql && !config.usesHtml && !config.usesWebscraping) {
        config.usesApi = true;
      }
    }

    // Validate URLs
    try {
      new URL(config.platformUrl);
      new URL(config.repositoryUrl);
      new URL(config.baseUrl);
    } catch (error) {
      console.error(chalk.red('\n❌ Invalid URL provided. Please check your URLs.\n'));
      process.exit(1);
    }

    // Determine output directory
    const sanitizedName = config.name.toLowerCase().replace(/\s+/g, '-');
    const outputDir = path.resolve(process.cwd(), options.output === '.' ? sanitizedName : options.output);

    console.log(chalk.cyan('\n📦 Generating GrayJay Source Plugin...\n'));
    console.log(chalk.gray(`Name: ${config.name}`));
    console.log(chalk.gray(`Platform: ${config.platformUrl}`));
    console.log(chalk.gray(`Output: ${outputDir}`));
    console.log(chalk.gray(`Type: ${options.js ? 'JavaScript' : 'TypeScript'}\n`));

    const spinner = ora('Creating project structure...').start();

    const generator = new SourceGenerator({
      outputDir,
      config,
      typescript: !options.js
    });

    await generator.generate();

    spinner.succeed(chalk.green('Project generated successfully!'));

    console.log(chalk.cyan('\n✨ Your GrayJay source plugin is ready!\n'));
    console.log(chalk.white('Next steps:\n'));
    console.log(chalk.gray(`  1. cd ${path.basename(outputDir)}`));
    console.log(chalk.gray('  2. npm install'));
    console.log(chalk.gray('  3. npm run build'));
    console.log(chalk.gray('  4. Edit src/script.ts to implement your source logic\n'));
    
    console.log(chalk.white('Project structure:\n'));
    console.log(chalk.gray('  📁 src/          - Modular source code'));
    console.log(chalk.gray('  📁 assets/       - QR code for installation'));
    console.log(chalk.gray('  📁 scripts/      - Automation scripts'));
    console.log(chalk.gray('  📁 types/        - Type definitions'));
    console.log(chalk.gray('  📄 config.json   - Plugin configuration'));
    console.log(chalk.gray('  📄 README.md     - Documentation\n'));

    console.log(chalk.yellow('⚠️  Don\'t forget to:\n'));
    console.log(chalk.gray('  - Update the generated code with your actual API calls'));
    console.log(chalk.gray('  - Test your plugin in the GrayJay app'));
    console.log(chalk.gray('  - Add a LICENSE file to your project\n'));

  } catch (error) {
    console.error(chalk.red('\n❌ Error generating plugin:\n'));
    console.error(error);
    process.exit(1);
  }
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}

main();
