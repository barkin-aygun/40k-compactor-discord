# Using the Library in Another Project

This guide explains how to use the `generateDiscordText` library in your own project.

## Quick Start

The library requires access to the `modules/` folder from the parent project. Here are the recommended approaches:

## Method 1: Copy Required Files (Recommended for Simple Projects)

1. Copy the `lib/` folder to your project
2. Copy the `modules/` folder to your project (or create a symlink)
3. Ensure the folder structure maintains the relative path: `lib/` should be able to import from `../modules/`

```
your-project/
├── lib/
│   ├── index.js
│   ├── generateDiscordText.js
│   └── README.md
└── modules/
    ├── renderers.js
    ├── abbreviations.js
    ├── faction_colors.js
    └── utils.js
```

Then use:
```javascript
import { generateDiscordText, buildAbbreviationIndex } from './lib/index.js'
```

## Method 2: npm Local Package

1. In the `40kCompactor` project root, you can link the library:
   ```bash
   cd lib
   npm link
   ```

2. In your project:
   ```bash
   npm link @40k-compactor/discord-text
   ```

   **Note:** You'll still need access to the `modules/` folder. Consider copying it or using a monorepo setup.

## Method 3: Git Submodule

If both projects are in git:

```bash
# In your project
git submodule add <40kCompactor-repo-url> vendor/40kCompactor
```

Then import:
```javascript
import { generateDiscordText } from './vendor/40kCompactor/lib/index.js'
```

## Method 4: Monorepo Setup

If using a monorepo (npm workspaces, pnpm, yarn workspaces):

1. Add this project to your monorepo
2. Configure workspace to include both projects
3. Import normally

## Dependencies

The library depends on these modules (all included in the `modules/` folder):
- `modules/renderers.js` - Main rendering logic
- `modules/abbreviations.js` - Abbreviation generation
- `modules/faction_colors.js` - Faction color mappings
- `modules/utils.js` - Utility functions

All dependencies are pure JavaScript with no external npm packages required.

## Example

```javascript
import { generateDiscordText, buildAbbreviationIndex } from './lib/index.js'

// Your parsed army list data (from your own parser or the parsers in modules/parsers.js)
const parsedData = {
  SUMMARY: {
    LIST_TITLE: 'My Army',
    FACTION_KEYWORD: 'Space Marines',
    TOTAL_ARMY_POINTS: '2000 pts'
  },
  CHARACTER: [/* ... */],
  'OTHER DATASHEETS': [/* ... */]
}

// Build abbreviations
const abbrMap = buildAbbreviationIndex(parsedData)

// Generate Discord text
const output = generateDiscordText(parsedData, {
  useAbbreviations: true,
  wargearAbbrMap: abbrMap
})

console.log(output)
```

## Troubleshooting

**Import errors:** Make sure the `modules/` folder is accessible relative to `lib/`. The library uses `../modules/` imports.

**Module not found:** Ensure your project uses ES modules (`"type": "module"` in package.json) or use a bundler that supports ES modules.

