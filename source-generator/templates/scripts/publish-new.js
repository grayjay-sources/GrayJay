#!/usr/bin/env node

/**
 * Automated Publishing Script for GrayJay Plugin
 * 
 * This script:
 * 1. Reads the current version from dist/config.json
 * 2. Bumps the version (patch by default, or specify version)
 * 3. Updates dist/config.json with the new version
 * 4. Builds the plugin
 * 5. Signs the plugin (generates signature and public key)
 * 6. Generates a QR code for the plugin
 * 7. Commits the changes
 * 8. Creates a git tag
 * 9. Pushes to GitHub (triggers release workflow)
 * 
 * Usage:
 *   npm run publish        # Bumps patch version
 *   npm run publish 2      # Sets version to 2
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'dist', 'config.json');
const QR_CODE_PATH = path.join(__dirname, '..', 'assets', 'qrcode.png');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function getCurrentVersion() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      log('⚠️  config.json not found. Building first...', colors.yellow);
      execSync('npm run build', { stdio: 'inherit' });
    }
    
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    return config.version || 1;
  } catch (error) {
    log('⚠️  Could not read current version from config.json', colors.yellow);
    return 1;
  }
}

function getGitHubInfo() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
    const repoUrl = packageJson.repository?.url || execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    
    // Parse GitHub owner and repo from URL
    const match = repoUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    
    if (!match) {
      throw new Error('Could not parse GitHub repository from git remote');
    }
    
    return {
      owner: match[1],
      repo: match[2].replace(/\.git$/, '')
    };
  } catch (error) {
    throw new Error(`Failed to get GitHub info: ${error.message}`);
  }
}

function generateQRCode(url) {
  log('\n📱 Generating QR code...', colors.cyan);
  
  try {
    const QRCode = require('qrcode');
    QRCode.toFile(QR_CODE_PATH, url, {
      width: 512,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });
    log(`✅ QR code generated: ${QR_CODE_PATH}`, colors.green);
  } catch (error) {
    log(`⚠️  Failed to generate QR code: ${error.message}`, colors.yellow);
  }
}

async function publish() {
  log('\n🚀 GrayJay Plugin Publisher\n', colors.cyan);
  
  // Step 1: Get version
  const currentVersion = getCurrentVersion();
  const newVersion = process.argv[2] ? parseInt(process.argv[2]) : currentVersion + 1;
  
  if (isNaN(newVersion) || newVersion < 1) {
    log('❌ Invalid version number. Must be a positive integer.', colors.red);
    process.exit(1);
  }
  
  log(`📦 Current version: ${currentVersion}`, colors.cyan);
  log(`📦 New version: ${newVersion}`, colors.cyan);
  
  // Step 2: Get GitHub info for install URL
  let githubInfo;
  try {
    githubInfo = getGitHubInfo();
    log(`✅ Repository: ${githubInfo.owner}/${githubInfo.repo}`, colors.green);
  } catch (error) {
    log(`❌ ${error.message}`, colors.red);
    process.exit(1);
  }
  
  // Step 3: Build the plugin
  log('\n🔨 Building plugin...', colors.yellow);
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 4: Update version in config.json
  log('\n📝 Updating version in config.json...', colors.cyan);
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const oldVersion = config.version || 1;
  config.version = newVersion;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2) + '\n', 'utf8');
  log(`📦 Version bumped: ${oldVersion} → ${newVersion}`, colors.cyan);
  
  // Step 5: Sign the plugin
  log('\n🔐 Signing plugin...', colors.yellow);
  try {
    execSync('npm run sign', { stdio: 'inherit' });
  } catch (error) {
    log('❌ Signing failed. Make sure OpenSSL is installed.', colors.red);
    process.exit(1);
  }
  
  // Reload config after signing to get signature
  const signedConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  
  // Step 6: Generate QR code
  const installUrl = `grayjay://plugin/${signedConfig.sourceUrl}`;
  generateQRCode(installUrl);
  
  // Step 7: Commit changes
  log('\n📝 Committing changes...', colors.cyan);
  execSync('git add dist/ assets/qrcode.png', { stdio: 'inherit' });
  execSync(`git commit -m "chore: Release v${newVersion}" -m "- Updated version to ${newVersion}" -m "- Signed plugin" -m "- Generated QR code"`, { stdio: 'inherit' });
  log('✅ Changes committed', colors.green);
  
  // Step 8: Create git tag
  log(`\n🏷️  Creating git tag v${newVersion}...`, colors.cyan);
  execSync(`git tag -a v${newVersion} -m "Release v${newVersion}"`, { stdio: 'inherit' });
  log(`✅ Tag created: v${newVersion}`, colors.green);
  
  // Step 9: Push to GitHub
  log('\n📤 Pushing to GitHub...', colors.yellow);
  execSync('git push && git push --tags', { stdio: 'inherit' });
  log('✅ Pushed successfully!', colors.green);
  
  log(`\n✅ Publication complete!\n`, colors.green);
  log(`📋 Summary:`, colors.cyan);
  log(`   Version: v${newVersion}`, colors.reset);
  log(`   Repository: ${githubInfo.owner}/${githubInfo.repo}`, colors.reset);
  log(`   Install URL: ${installUrl}`, colors.reset);
  log(`\n📦 GitHub Release will be created automatically`, colors.cyan);
  log(`   Check: https://github.com/${githubInfo.owner}/${githubInfo.repo}/releases/tag/v${newVersion}`, colors.reset);
}

publish().catch((error) => {
  log(`❌ Unexpected error: ${error.message}`, colors.red);
  console.error(error);
  process.exit(1);
});
