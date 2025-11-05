import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GeneratorOptions, PluginCapabilities } from './types';
import { generateConfigJson } from './templates/config.template';
import { generateQRCode, ensureAssetsDirectory, resolveLogoUrl } from './assets';

export class SourceGenerator {
  private options: GeneratorOptions;

  constructor(options: GeneratorOptions) {
    this.options = options;
  }

  private getCapabilities(): PluginCapabilities {
    const { 
      usesApi, usesGraphql, usesHtml, usesWebscraping,
      hasAuth, hasLiveStreams, hasComments, hasPlaylists, hasSearch 
    } = this.options.config;
    
    return {
      useGraphQL: usesGraphql || false,
      useAPI: usesApi || false,
      useHTML: usesHtml || false,
      useWebScraping: usesWebscraping || false,
      hasAuth: hasAuth || false,
      hasLiveStreams: hasLiveStreams || false,
      hasComments: hasComments || false,
      hasPlaylists: hasPlaylists || false,
      hasSearch: hasSearch || false,
    };
  }

  async generate(): Promise<void> {
    const { outputDir, config, typescript = true } = this.options;

    // Create base directory
    await fs.mkdir(outputDir, { recursive: true });

    // Resolve logo URL first (before generating config)
    console.log('\n📷 Resolving logo URL...');
    config.logoUrl = await resolveLogoUrl(config.platformUrl, config.logoUrl);

    // Generate package.json
    await this.generatePackageJson();

    // Generate config.json for dist
    await this.generateConfig();

    // Generate source files
    if (typescript) {
      await this.generateTypeScriptProject();
    } else {
      await this.generateJavaScriptProject();
    }

    // Generate README
    await this.generateReadmeFile();

    // Generate .gitignore
    await this.generateGitignore();

    // Generate assets
    await this.generateAssets();

    // Generate rollup config (for TypeScript projects)
    if (typescript) {
      await this.generateRollupConfig();
      await this.generateTsConfig();
    }

    // Generate constants file
    await this.generateConstants();

    // Generate utils file
    await this.generateUtilsFile();

    // Generate plugin types
    await this.generatePluginTypes();
    
    // Generate scripts directory
    await this.generateScripts();
    
    // Generate GitHub workflows
    await this.generateWorkflows();
  }

  private async generatePackageJson(): Promise<void> {
    const { config } = this.options;
    const sanitizedName = config.name.toLowerCase().replace(/\s+/g, '-');
    
    const packageJson = {
      name: `grayjay-${sanitizedName}-plugin`,
      version: '1.0.0',
      description: config.description,
      main: 'dist/script.js',
      scripts: {
        build: 'rollup -c',
        sign: 'node scripts/sign.js',
        'build:sign': 'npm run build && npm run sign',
        'build:publish': 'npm run build:sign && npm run publish',
        dev: 'rollup -c -w',
        prettier: 'npx prettier --write ./src/**/*.ts',
        publish: 'node scripts/publish.js'
      },
      engines: {
        node: '>=14',
        npm: '>=6.14.4'
      },
      keywords: ['grayjay', 'plugin', sanitizedName, 'video'],
      author: config.author,
      license: 'MIT',
      repository: {
        type: 'git',
        url: config.repositoryUrl
      },
      devDependencies: {
        '@rollup/plugin-commonjs': '25.0.8',
        '@rollup/plugin-node-resolve': '15.2.3',
        '@rollup/plugin-terser': '0.4.4',
        '@rollup/plugin-typescript': '11.1.6',
        'rollup': '4.18.0',
        'rollup-plugin-copy': '3.5.0',
        'rollup-plugin-delete': '2.0.0',
        'tslib': '2.6.2',
        'typescript': '5.4.5'
      }
    };

    await fs.writeFile(
      path.join(this.options.outputDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );
  }

  private async generateConfig(): Promise<void> {
    const configJson = generateConfigJson(this.options.config);
    await fs.writeFile(
      path.join(this.options.outputDir, 'config.json'),
      configJson
    );
  }

  private async generateTypeScriptProject(): Promise<void> {
    const srcDir = path.join(this.options.outputDir, 'src');
    await fs.mkdir(srcDir, { recursive: true });

    const capabilities = this.getCapabilities();
    
    // Generate modular file structure
    await this.generateModularStructure(capabilities);
    
    // Generate main script that imports from modules
    const script = await this.assembleMainScript(capabilities);
    
    await fs.writeFile(
      path.join(srcDir, 'script.ts'),
      script
    );
  }

  private async generateJavaScriptProject(): Promise<void> {
    const srcDir = path.join(this.options.outputDir, 'src');
    await fs.mkdir(srcDir, { recursive: true });

    const capabilities = this.getCapabilities();
    const script = await this.assembleScript(capabilities);
    
    // Remove TypeScript type annotations for JavaScript
    const jsScript = script
      .replace(/: string/g, '')
      .replace(/: number/g, '')
      .replace(/: boolean/g, '')
      .replace(/: any/g, '')
      .replace(/: Config/g, '')
      .replace(/: VideoPager/g, '')
      .replace(/: ChannelPager/g, '')
      .replace(/: CommentPager/g, '')
      .replace(/: PlatformChannel/g, '')
      .replace(/: PlatformVideoDetails/g, '')
      .replace(/: PlatformPlaylistDetails/g, '')
      .replace(/: PlatformVideo\[\]/g, '')
      .replace(/: PlatformChannel\[\]/g, '')
      .replace(/: Comment\[\]/g, '')
      .replace(/: Comment/g, '')
      .replace(/: string\[\]/g, '')
      .replace(/: ResultCapabilities/g, '')
      .replace(/: Map<any, any>/g, '')
      .replace(/interface Config \{[\s\S]*?\}/g, '');
    
    await fs.writeFile(
      path.join(srcDir, 'script.js'),
      jsScript
    );
  }

  private async generateReadmeFile(): Promise<void> {
    const { config } = this.options;
    const githubUserMatch = config.repositoryUrl.match(/github\.com\/([^\/]+)/);
    const githubUser = githubUserMatch ? githubUserMatch[1] : 'username';
    const repoNameMatch = config.repositoryUrl.match(/github\.com\/[^\/]+\/([^\/]+)/);
    const repoName = repoNameMatch ? repoNameMatch[1].replace(/\.git$/, '') : 'repo';
    
    // Build tech stack list from flags
    const techStack: string[] = [];
    if (config.usesApi) techStack.push('- REST API');
    if (config.usesGraphql) techStack.push('- GRAPHQL');
    if (config.usesHtml) techStack.push('- HTML');
    if (config.usesWebscraping) techStack.push('- WEB SCRAPING');
    
    const readme = await this.getFormattedTemplate('snippets/readme-template.md', {
      PLATFORM_NAME: config.name,
      DESCRIPTION: config.description,
      GITHUB_USER: githubUser,
      REPO_NAME: repoName,
      REPOSITORY_URL: config.repositoryUrl,
      HAS_SEARCH: config.hasSearch ? 'x' : ' ',
      HAS_AUTH: config.hasAuth ? 'x' : ' ',
      HAS_LIVE_STREAMS: config.hasLiveStreams ? 'x' : ' ',
      HAS_COMMENTS: config.hasComments ? 'x' : ' ',
      HAS_PLAYLISTS: config.hasPlaylists ? 'x' : ' ',
      TECH_STACK: techStack.join('\n') || '- API',
      PLATFORM_URL: config.platformUrl,
      BASE_URL: config.baseUrl,
      AUTHOR_INFO: config.authorUrl 
        ? `- **Author**: [${config.author}](${config.authorUrl})`
        : `- **Author**: ${config.author}`
    });
    
    await fs.writeFile(
      path.join(this.options.outputDir, 'README.md'),
      readme
    );
  }

  private async generateGitignore(): Promise<void> {
    const gitignore = await this.getRawTemplate('.gitignore');
    await fs.writeFile(
      path.join(this.options.outputDir, '.gitignore'),
      gitignore
    );
  }

  private async generateAssets(): Promise<void> {
    const assetsDir = await ensureAssetsDirectory(this.options.outputDir);
    const { config } = this.options;

    // Generate QR code in assets directory
    const qrUrl = `grayjay://plugin/${config.repositoryUrl}/releases/latest/download/config.json`;
    const qrPath = path.join(assetsDir, 'qrcode.png');
    
    console.log('\n📱 Generating QR code...');
    await generateQRCode(qrUrl, qrPath);
  }

  private async generateRollupConfig(): Promise<void> {
    const rollupConfig = await this.getRawTemplate('rollup.config.js');
    await fs.writeFile(
      path.join(this.options.outputDir, 'rollup.config.js'),
      rollupConfig
    );
  }

  private async generateTsConfig(): Promise<void> {
    const tsConfig = await this.getRawTemplate('tsconfig.json');
    await fs.writeFile(
      path.join(this.options.outputDir, 'tsconfig.json'),
      tsConfig
    );
  }

  private async generateConstants(): Promise<void> {
    const srcDir = path.join(this.options.outputDir, 'src');
    const { config } = this.options;
    
    const constants = await this.getFormattedTemplate('snippets/constants-template.ts', {
      PLATFORM_NAME: config.name,
      BASE_URL: config.baseUrl,
      PLATFORM_URL: config.platformUrl
    });

    await fs.writeFile(
      path.join(srcDir, 'constants.ts'),
      constants
    );
  }

  private async generateUtilsFile(): Promise<void> {
    const srcDir = path.join(this.options.outputDir, 'src');
    const { config } = this.options;
    
    const utils = await this.getFormattedTemplate('snippets/utils-template.ts', {
      PLATFORM_NAME: config.name
    });
    
    await fs.writeFile(
      path.join(srcDir, 'utils.ts'),
      utils
    );
  }

  private async generatePluginTypes(): Promise<void> {
    const typesDir = path.join(this.options.outputDir, 'types');
    await fs.mkdir(typesDir, { recursive: true });

    const pluginTypes = await this.getRawTemplate('plugin.d.ts');

    await fs.writeFile(
      path.join(typesDir, 'plugin.d.ts'),
      pluginTypes
    );
  }

  private async generateScripts(): Promise<void> {
    const scriptsDir = path.join(this.options.outputDir, 'scripts');
    await fs.mkdir(scriptsDir, { recursive: true });

    // Only generate publish script (QR is generated once during project creation)
    const publishScript = await this.getRawTemplate('scripts/publish.js');
    await fs.writeFile(
      path.join(scriptsDir, 'publish.js'),
      publishScript
    );
  }

  private async generateWorkflows(): Promise<void> {
    const workflowsDir = path.join(this.options.outputDir, '.github', 'workflows');
    await fs.mkdir(workflowsDir, { recursive: true });

    // Generate release workflow
    const releaseWorkflow = await this.getRawTemplate('.github/workflows/release.yml');
    await fs.writeFile(
      path.join(workflowsDir, 'release.yml'),
      releaseWorkflow
    );
  }

  /**
   * Get the path to a template file, handling both dev and production builds
   */
  private async getTemplatePath(filename: string): Promise<string> {
    // Try multiple possible locations for the template
    const possiblePaths = [
      // In production (after npm install), templates are in the package root
      path.join(__dirname, '..', 'templates', filename),
      // During development, templates are in the repo root
      path.join(__dirname, '..', '..', 'templates', filename),
      // Alternative for dist build
      path.join(__dirname, 'templates', filename),
    ];

    for (const templatePath of possiblePaths) {
      try {
        await fs.access(templatePath);
        return templatePath;
      } catch {
        // Try next path
      }
    }

    throw new Error(`Template file not found: ${filename}. Tried: ${possiblePaths.join(', ')}`);
  }

  /**
   * Read a raw template file without any processing
   */
  private async getRawTemplate(filename: string, encoding: BufferEncoding = 'utf-8'): Promise<string> {
    const templatePath = await this.getTemplatePath(filename);
    return await fs.readFile(templatePath, encoding);
  }

  /**
   * Read a template file and replace placeholders with values
   * Supports simple {{key}} style placeholders
   */
  private async getFormattedTemplate(
    filename: string,
    replacements: Record<string, string> = {},
    encoding: BufferEncoding = 'utf-8'
  ): Promise<string> {
    let content = await this.getRawTemplate(filename, encoding);
    
    // Replace {{key}} with values from replacements object
    for (const [key, value] of Object.entries(replacements)) {
      const placeholder = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(placeholder, value);
    }
    
    return content;
  }

  /**
   * Read a snippet file (partial template)
   */
  private async getSnippet(name: string, replacements: Record<string, string> = {}): Promise<string> {
    return await this.getFormattedTemplate(`snippets/${name}.ts`, replacements);
  }

  /**
   * Generate modular file structure with separate folders for different concerns
   */
  private async generateModularStructure(capabilities: PluginCapabilities): Promise<void> {
    const srcDir = path.join(this.options.outputDir, 'src');
    const { config } = this.options;
    const platformHostname = new URL(config.platformUrl).hostname.toLowerCase();

    const commonReplacements = {
      PLATFORM_NAME: config.name,
      BASE_URL: config.baseUrl,
      PLATFORM_HOSTNAME: platformHostname,
      AUTH_HEADER: capabilities.hasAuth 
        ? `'Authorization': state.authToken ? 'Bearer ' + state.authToken : ''`
        : '',
    };

    // Generate GraphQL module
    if (capabilities.useGraphQL) {
      const graphqlDir = path.join(srcDir, 'graphql');
      await fs.mkdir(graphqlDir, { recursive: true });
      
      const queriesContent = await this.getSnippet('persisted-graphql-helper', commonReplacements);
      await fs.writeFile(path.join(graphqlDir, 'queries.ts'), queriesContent);
    }

    // Generate API module
    if (capabilities.useAPI) {
      const apiDir = path.join(srcDir, 'api');
      await fs.mkdir(apiDir, { recursive: true });
      
      const clientContent = await this.getSnippet('api-helper', commonReplacements);
      await fs.writeFile(path.join(apiDir, 'client.ts'), clientContent);
    }

    // Generate HTML parsing module
    if (capabilities.useHTML) {
      const htmlDir = path.join(srcDir, 'html');
      await fs.mkdir(htmlDir, { recursive: true });
      
      const helperContent = await this.getSnippet('html-helper', commonReplacements);
      await fs.writeFile(path.join(htmlDir, 'parser.ts'), helperContent);
    }

    // Generate mappers module
    if (capabilities.hasPlaylists || capabilities.hasLiveStreams) {
      const mappersDir = path.join(srcDir, 'mappers');
      await fs.mkdir(mappersDir, { recursive: true });
      
      const mappersContent = await this.getSnippet('mappers-template', commonReplacements);
      await fs.writeFile(path.join(mappersDir, 'index.ts'), mappersContent);
    }

    // Generate pagers module
    if (capabilities.hasPlaylists || capabilities.hasSearch) {
      const pagersDir = path.join(srcDir, 'pagers');
      await fs.mkdir(pagersDir, { recursive: true });
      
      let pagersContent = '';
      if (capabilities.hasSearch) {
        pagersContent += await this.getSnippet('search-pagers', commonReplacements) + '\n\n';
      }
      if (capabilities.hasComments) {
        pagersContent += await this.getSnippet('comment-pagers', commonReplacements);
      }
      
      if (pagersContent) {
        await fs.writeFile(path.join(pagersDir, 'index.ts'), pagersContent);
      }
    }

    // Generate state management module
    if (capabilities.hasAuth) {
      const stateDir = path.join(srcDir, 'state');
      await fs.mkdir(stateDir, { recursive: true });
      
      const stateContent = await this.getSnippet('state-management', commonReplacements);
      await fs.writeFile(path.join(stateDir, 'index.ts'), stateContent);
    }
  }

  /**
   * Assemble the main script that imports from modules
   */
  private async assembleMainScript(capabilities: PluginCapabilities): Promise<string> {
    const { config } = this.options;
    const platformHostname = new URL(config.platformUrl).hostname.toLowerCase();

    const commonReplacements = {
      PLATFORM_NAME: config.name,
      BASE_URL: config.baseUrl,
      PLATFORM_HOSTNAME: platformHostname,
      AUTH_HEADER: capabilities.hasAuth 
        ? `'Authorization': state.authToken ? 'Bearer ' + state.authToken : ''`
        : '',
    };

    // Build imports section
    let imports = '';
    if (capabilities.useGraphQL) {
      imports += `import { executeGqlQuery } from './graphql/queries';\n`;
    }
    if (capabilities.useAPI) {
      imports += `import { apiClient } from './api/client';\n`;
    }
    if (capabilities.useHTML) {
      imports += `import { parseHtml } from './html/parser';\n`;
    }
    if (capabilities.hasPlaylists || capabilities.hasLiveStreams) {
      imports += `import * as Mappers from './mappers';\n`;
    }
    if (capabilities.hasPlaylists || capabilities.hasSearch) {
      imports += `import * as Pagers from './pagers';\n`;
    }
    if (capabilities.hasAuth) {
      imports += `import { StateManager } from './state';\n`;
    }

    // Load method implementations
    const searchMethods = capabilities.hasSearch 
      ? await this.getSnippet('search-methods', commonReplacements) 
      : '';
    const playlistMethods = capabilities.hasPlaylists 
      ? await this.getSnippet('playlist-methods', commonReplacements) 
      : '';
    const commentMethods = capabilities.hasComments 
      ? await this.getSnippet('comment-methods', commonReplacements) 
      : '';
    const authMethods = capabilities.hasAuth 
      ? await this.getSnippet('auth-methods', commonReplacements) 
      : '';

    // Build state properties
    const stateProperties = capabilities.hasAuth 
      ? `authenticated: false,\n  authToken: ''`
      : '';
    
    // Build load state logic
    const loadState = capabilities.hasAuth
      ? `const savedState = JSON.parse(conf.state || '{}');\n  Object.assign(state, savedState);`
      : '';

    // Assemble the main script
    return await this.getFormattedTemplate('script.template.ts', {
      ...commonReplacements,
      IMPORTS: imports,
      STATE_PROPERTIES: stateProperties,
      LOAD_STATE: loadState,
      SEARCH_METHODS: searchMethods,
      PLAYLIST_METHODS: playlistMethods,
      COMMENT_METHODS: commentMethods,
      AUTH_METHODS: authMethods
    });
  }

  /**
   * Assemble the main script from template and snippets based on capabilities
   * @deprecated Use generateModularStructure + assembleMainScript instead
   */
  private async assembleScript(capabilities: PluginCapabilities): Promise<string> {
    const { config } = this.options;
    const platformHostname = new URL(config.platformUrl).hostname.toLowerCase();

    // Common replacements for all snippets
    const commonReplacements = {
      PLATFORM_NAME: config.name,
      BASE_URL: config.baseUrl,
      PLATFORM_HOSTNAME: platformHostname,
      AUTH_HEADER: capabilities.hasAuth 
        ? `'Authorization': state.authToken ? 'Bearer ' + state.authToken : ''`
        : '',
    };

    // Load snippets based on capabilities with replacements
    const searchMethods = capabilities.hasSearch 
      ? await this.getSnippet('search-methods', commonReplacements) 
      : '';
    const playlistMethods = capabilities.hasPlaylists 
      ? await this.getSnippet('playlist-methods', commonReplacements) 
      : '';
    const commentMethods = capabilities.hasComments 
      ? await this.getSnippet('comment-methods', commonReplacements) 
      : '';
    const authMethods = capabilities.hasAuth 
      ? await this.getSnippet('auth-methods', commonReplacements) 
      : '';
    
    const graphqlHelper = capabilities.useGraphQL 
      ? await this.getSnippet('graphql-helper', commonReplacements) 
      : '';
    const apiHelper = capabilities.useAPI 
      ? await this.getSnippet('api-helper', commonReplacements) 
      : '';
    const htmlHelper = capabilities.useHTML 
      ? await this.getSnippet('html-helper', commonReplacements) 
      : '';
    
    const searchPagers = capabilities.hasSearch 
      ? await this.getSnippet('search-pagers', commonReplacements) 
      : '';
    const commentPagers = capabilities.hasComments 
      ? await this.getSnippet('comment-pagers', commonReplacements) 
      : '';
    
    // Advanced features (Mappers, Pagers, State Management)
    const mappersHelper = (capabilities.hasPlaylists || capabilities.hasLiveStreams)
      ? await this.getSnippet('mappers-template', commonReplacements)
      : '';
    const pagersHelper = (capabilities.hasPlaylists || capabilities.hasSearch)
      ? await this.getSnippet('pagers-template', commonReplacements)
      : '';
    const stateManagement = capabilities.hasAuth
      ? await this.getSnippet('state-management', commonReplacements)
      : '';

    // Assemble the script with all replacements
    return await this.getFormattedTemplate('script.template.ts', {
      ...commonReplacements,
      SEARCH_METHODS: searchMethods,
      PLAYLIST_METHODS: playlistMethods,
      COMMENT_METHODS: commentMethods,
      AUTH_METHODS: authMethods,
      GRAPHQL_HELPER: graphqlHelper,
      API_HELPER: apiHelper,
      HTML_HELPER: htmlHelper,
      SEARCH_PAGERS: searchPagers,
      COMMENT_PAGERS: commentPagers,
      MAPPERS: mappersHelper,
      PAGERS: pagersHelper,
      STATE_MANAGEMENT: stateManagement
    });
  }
}
