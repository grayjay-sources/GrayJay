# 🚀 Source Generator - Quick Reference Card

## New Templates at a Glance

### Code Patterns
| Template | Purpose | When to Use |
|----------|---------|-------------|
| `mappers-template.ts` | Data conversion | Every plugin (Asset→Video, Channel→Channel) |
| `pagers-template.ts` | Pagination | Multi-page results (search, home, channels) |
| `state-management.ts` | Token handling | Plugins with auth/tokens |
| `persisted-graphql-helper.ts` | GraphQL queries | Platforms using persisted queries (SHA256) |

### Platform Integrations
| Template | Purpose | When to Use |
|----------|---------|-------------|
| `algolia-search-helper.ts` | Algolia search | Joyn, Twitch, e-commerce platforms |

### Build & Deploy
| Template | Purpose | When to Use |
|----------|---------|-------------|
| `icon-generation-script.js` | SVG→PNG | Every plugin (icon automation) |
| `.github/workflows/build-and-deploy.yml` | CI/CD | Every plugin (auto-build) |

### Documentation
| Template | Purpose | When to Use |
|----------|---------|-------------|
| `IMPLEMENTATION_STATUS.template.md` | Progress tracking | Complex plugins |
| `DEPLOYMENT_GUIDE.template.md` | Deploy instructions | Every plugin |

---

## Quick Commands

```bash
# Basic plugin
npx @grayjay/source-generator create my-plugin

# With GraphQL
npx @grayjay/source-generator create my-plugin --graphql persisted

# With Algolia
npx @grayjay/source-generator create my-plugin --algolia

# Full-featured
npx @grayjay/source-generator create my-plugin \
  --graphql persisted \
  --algolia \
  --include-mappers \
  --include-pagers \
  --advanced-state \
  --workflow \
  --comprehensive-docs
```

---

## Code Snippets

### Using Mappers
```typescript
import { PlatformAssetToGrayjayVideo } from './Mappers';

source.getHome = function() {
  const data = fetchData();
  const videos = data.map(item => PlatformAssetToGrayjayVideo(config.id, item));
  return new VideoPager(videos, hasMore, {});
};
```

### Using Pagers
```typescript
return new PlatformSearchPager(
  videos,        // results
  hasMore,       // boolean
  context,       // search params
  page,          // current page
  searchCallback // next page function
);
```

### Persisted GraphQL
```typescript
const [error, data] = executePersistedGqlQuery({
  operationName: 'GetUser',
  persistedQuery: { version: 1, sha256Hash: 'abc123...' },
  variables: { userId: '123' }
});
```

### Algolia Search
```typescript
const [error, result] = searchWithAlgolia(query, page, 20);
const videos = result.hits.map(hit => /* map */);
```

### State Management
```typescript
source.enable = function(conf, settings, saveStateStr) {
  loadSavedState(saveStateStr);
  if (!isTokenValid()) refreshAuthToken();
};

source.saveState = () => JSON.stringify(state);
```

---

## File Structure

```
generated-plugin/
├── src/
│   ├── Script.ts         ← Main orchestration
│   ├── Mappers.ts        ← Data conversion
│   ├── Pagers.ts         ← Pagination logic
│   ├── constants.ts      ← Config/URLs
│   ├── util.ts           ← Helpers
│   └── gqlQueries.ts     ← GraphQL queries
├── types/
│   ├── plugin.d.ts       ← GrayJay API
│   └── types.d.ts        ← Platform types
├── build/                ← Deployed files
├── assets/               ← Icons (SVG+PNG)
├── scripts/
│   └── generate-icon.js  ← Icon automation
├── .github/workflows/    ← CI/CD
└── docs/                 ← Status & guides
```

---

## npm Scripts

```json
{
  "build": "rollup -c",
  "dev": "rollup -c -w",
  "generate-icon": "node scripts/generate-icon.js",
  "prettier": "npx prettier --write ./src/**/*.ts"
}
```

---

## Platform Examples

### GraphQL with Persisted Queries
- GitHub GraphQL API
- Joyn (streaming)
- Shopify

### Algolia Search
- Joyn
- Twitch
- Stripe Docs
- Many e-commerce sites

### Both
- Twitch (GraphQL + Algolia)

---

## Migration Checklist

Upgrading existing plugin:
- [ ] Add Mappers.ts
- [ ] Add Pagers.ts
- [ ] Enhance state management
- [ ] Add icon generation script
- [ ] Add GitHub Actions workflow
- [ ] Generate IMPLEMENTATION_STATUS.md
- [ ] Generate DEPLOYMENT_GUIDE.md
- [ ] Update package.json scripts
- [ ] Test build process

---

## Resources

- **Full Guide:** JOYN_INTEGRATION_SUMMARY.md
- **Enhancements:** ENHANCEMENTS.md
- **Templates:** ./templates/snippets/
- **Example:** grayjay-source-joyn (Joyn implementation)

---

**Version:** 2.0.0-alpha  
**Templates:** 10 new files  
**Lines:** ~1,600 production code  
**Status:** ✅ Ready to use

