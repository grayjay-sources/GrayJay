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
  .option('-u, --uses <technologies>', 'Comma-separated list of technologies (api,graphql,html,webscraping)')
  .option('--auth', 'Enable authentication support')
  .option('--live', 'Enable live streams support')
  .option('--comments', 'Enable comments support')
  .option('--playlists', 'Enable playlists support')
  .option('--search', 'Enable search support')
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

      // Parse uses
      const uses = options.uses ? options.uses.split(',').map((s: string) => s.trim()) : ['api'];

      config = {
        name: options.name,
        platformUrl: options.platformUrl,
        description: options.description || `${options.name} source plugin for GrayJay`,
        author: options.author || 'Unknown',
        authorUrl: options.authorUrl,
        repositoryUrl: options.repositoryUrl,
        baseUrl: options.baseUrl,
        uses: uses,
        hasAuth: options.auth || false,
        hasLiveStreams: options.live || false,
        hasComments: options.comments !== false,
        hasPlaylists: options.playlists !== false,
        hasSearch: options.search !== false,
        version: 1
      };
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
    console.log(chalk.gray('  4. Edit src/Script.ts to implement your source logic\n'));
    
    console.log(chalk.white('Project structure:\n'));
    console.log(chalk.gray('  📁 src/          - Source code'));
    console.log(chalk.gray('  📁 assets/       - Icons and images'));
    console.log(chalk.gray('  📁 types/        - Type definitions'));
    console.log(chalk.gray('  📄 config.json   - Plugin configuration'));
    console.log(chalk.gray('  📄 README.md     - Documentation'));
    console.log(chalk.gray('  🖼️  qrcode.png    - Installation QR code\n'));

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
