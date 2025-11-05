# Publishing Guide

This guide explains how to publish `@grayjay/source-generator` to npm.

## Prerequisites

1. You need an npm account. If you don't have one, create it at https://www.npmjs.com/signup
2. You need to be logged in to npm on your local machine

## Login to npm

```bash
npm login
```

Enter your username, password, and email when prompted.

## Publishing Steps

### 1. Verify the Package

Make sure everything is correct:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Test the CLI
npm test
```

### 2. Check Package Contents

Before publishing, verify what files will be included:

```bash
npm pack --dry-run
```

This will show you what files would be included in the package.

### 3. Update Version (if needed)

If this isn't the first publish, update the version number:

```bash
npm version patch   # for bug fixes (1.0.0 -> 1.0.1)
npm version minor   # for new features (1.0.0 -> 1.1.0)
npm version major   # for breaking changes (1.0.0 -> 2.0.0)
```

### 4. Publish to npm

For the first publish or public packages:

```bash
npm publish --access public
```

For subsequent publishes (if the package is already public):

```bash
npm publish
```

### 5. Verify the Publication

After publishing, verify that the package is available:

```bash
npm view @grayjay/source-generator
```

Or visit: https://www.npmjs.com/package/@grayjay/source-generator

## Testing the Published Package

After publishing, you can test the package by installing it globally:

```bash
npm install -g @grayjay/source-generator

# Test it
grayjay-generate --help

# Or using the short alias
gjsg --help
```

## Updating the Package

When you need to publish an update:

1. Make your changes
2. Update the version number (`npm version patch/minor/major`)
3. Commit and push your changes
4. Publish again with `npm publish`

## Important Files for npm

- `package.json` - Package configuration
- `.npmignore` - Files to exclude from the package
- `README.md` - Package documentation
- `LICENSE` - License file
- `dist/` - Built files (included)
- `src/` - Source files (excluded via .npmignore)

## Troubleshooting

### Error: 403 Forbidden

You may not have permission to publish under the `@grayjay` scope. Either:
- Get permission from the scope owner
- Publish under your own scope: `@yourusername/source-generator`
- Publish without a scope: `grayjay-source-generator`

To change the package name, edit `package.json`:

```json
{
  "name": "grayjay-source-generator",
  ...
}
```

### Error: Package already exists

If someone else has already published a package with this name, you'll need to choose a different name.

## Best Practices

1. Always test the package locally before publishing
2. Use semantic versioning (major.minor.patch)
3. Keep a changelog
4. Tag releases in git
5. Write good documentation

## Automated Publishing (Optional)

You can set up GitHub Actions to automatically publish to npm when you create a release:

1. Create a `.github/workflows/publish.yml` file
2. Add your npm token to GitHub Secrets
3. Configure the workflow to run on release

See GitHub Actions documentation for more details.
