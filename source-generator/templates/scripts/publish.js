#!/usr/bin/env node

/**
 * Publish script to trigger GitHub release workflow
 * 
 * Usage:
 *   npm run publish [version]
 *   node scripts/publish.js [version]
 * 
 * Requirements:
 *   - GITHUB_TOKEN environment variable with repo permissions
 *   - Git repository with GitHub remote
 */

const https = require('https');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getGitHubInfo() {
  try {
    // Get remote URL
    const remoteUrl = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
    
    // Parse GitHub owner and repo from URL
    // Supports: https://github.com/owner/repo.git or git@github.com:owner/repo.git
    let match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
    
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

function getCurrentVersion() {
  try {
    const configPath = path.join(process.cwd(), 'config.json');
    if (!fs.existsSync(configPath)) {
      return 1;
    }
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return config.version || 1;
  } catch (error) {
    console.warn('⚠️  Could not read current version from config.json');
    return 1;
  }
}

function triggerWorkflow(owner, repo, version, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      ref: 'main',
      inputs: {
        version: version.toString()
      }
    });
    
    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: `/repos/${owner}/${repo}/actions/workflows/release.yml/dispatches`,
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'User-Agent': 'GrayJay-Source-Generator'
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 204) {
          resolve();
        } else {
          reject(new Error(`GitHub API error ${res.statusCode}: ${body}`));
        }
      });
    });
    
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function publish() {
  console.log('\n🚀 GrayJay Plugin Publisher\n');
  
  // Get version from command line or increment current
  const currentVersion = getCurrentVersion();
  const newVersion = process.argv[2] ? parseInt(process.argv[2]) : currentVersion + 1;
  
  if (isNaN(newVersion) || newVersion < 1) {
    console.error('❌ Invalid version number. Must be a positive integer.');
    process.exit(1);
  }
  
  console.log(`📦 Current version: ${currentVersion}`);
  console.log(`📦 New version: ${newVersion}`);
  
  // Check for GITHUB_TOKEN
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('\n❌ GITHUB_TOKEN environment variable not set');
    console.error('\nTo publish, you need a GitHub Personal Access Token with repo permissions.');
    console.error('Create one at: https://github.com/settings/tokens');
    console.error('\nThen set it as an environment variable:');
    console.error('  export GITHUB_TOKEN=your_token_here');
    console.error('\nOr run manually:');
    console.error('  GITHUB_TOKEN=your_token npm run publish');
    process.exit(1);
  }
  
  // Get GitHub repository info
  console.log('\n🔍 Detecting GitHub repository...');
  let gitHubInfo;
  try {
    gitHubInfo = getGitHubInfo();
    console.log(`✅ Repository: ${gitHubInfo.owner}/${gitHubInfo.repo}`);
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }
  
  // Trigger the workflow
  console.log('\n🎬 Triggering release workflow...');
  try {
    await triggerWorkflow(gitHubInfo.owner, gitHubInfo.repo, newVersion, token);
    console.log('✅ Release workflow triggered successfully!');
    console.log(`\n📋 Check progress at:`);
    console.log(`   https://github.com/${gitHubInfo.owner}/${gitHubInfo.repo}/actions`);
    console.log(`\n🎉 Release will be available at:`);
    console.log(`   https://github.com/${gitHubInfo.owner}/${gitHubInfo.repo}/releases/tag/v${newVersion}`);
  } catch (error) {
    console.error(`❌ Failed to trigger workflow: ${error.message}`);
    process.exit(1);
  }
}

publish().catch((error) => {
  console.error(`❌ Unexpected error: ${error.message}`);
  process.exit(1);
});

