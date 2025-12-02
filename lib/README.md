# generateDiscordText Library

A simple library wrapper that exposes the `generateDiscordText` function for compacting Warhammer 40,000 army lists into Discord-friendly format.

## Using in Another Project

### Option 1: Copy the Library Files (Simplest)

Copy the following to your project:
- `lib/` folder (this entire directory)
- `modules/` folder (required dependencies)

Then import:
```javascript
import { generateDiscordText, buildAbbreviationIndex } from './lib/index.js'
```

### Option 2: Use as Local npm Package

In your project, add this as a local dependency:

```json
{
  "dependencies": {
    "@40k-compactor/discord-text": "file:../path/to/40kCompactor/lib"
  }
}
```

Then import:
```javascript
import { generateDiscordText, buildAbbreviationIndex } from '@40k-compactor/discord-text'
```

**Note:** This requires the parent `modules/` folder to be accessible, so you may need to copy both `lib/` and `modules/` folders.

### Option 3: Git Submodule

Add this repository as a git submodule:

```bash
git submodule add <repository-url> path/to/40kCompactor
```

Then import:
```javascript
import { generateDiscordText, buildAbbreviationIndex } from './path/to/40kCompactor/lib/index.js'
```

### Option 4: Publish to npm (Future)

If published to npm, you can install it:

```bash
npm install @40k-compactor/discord-text
```

Then import:
```javascript
import { generateDiscordText, buildAbbreviationIndex } from '@40k-compactor/discord-text'
```

## Usage

### Simple Usage (String Input - Recommended)

The easiest way is to pass your army list as a string. The library will automatically detect the format and parse it:

```javascript
import { generateDiscordText } from './lib/index.js'

// Your army list as a string (supports GW App, New Recruit, ListForge formats)
const armyListText = `My Army (2000 points)

Space Marines
Strike Force (2000 points)
Gladius Task Force

CHARACTER

Captain (80 points)
  • 1x Bolt pistol
    1x Power sword`

// Generate Discord text - it auto-detects format and parses!
const output = generateDiscordText(armyListText, {
  useAbbreviations: true,
  colorMode: 'faction' // or 'custom', 'none'
})

console.log(output)
```

### Advanced Usage (Parsed Object Input)

For more control, you can parse the data yourself and pass the parsed object:

```javascript
import { generateDiscordText, buildAbbreviationIndex } from './lib/index.js'
import { parseGwApp, detectFormat } from './modules/parsers.js'

// Parse your army list first
const lines = armyListText.split('\n')
const format = detectFormat(lines)
const parsedData = parseGwApp(lines) // or other parser based on format

// Build abbreviation index (optional - auto-built if not provided)
const abbrMap = buildAbbreviationIndex(parsedData)

// Generate Discord text
const output = generateDiscordText(parsedData, {
  useAbbreviations: true,
  wargearAbbrMap: abbrMap,
  hideSubunits: false,
  combineIdenticalUnits: false,
  colorMode: 'custom',
  colors: {
    unit: '#FFFFFF',
    subunit: '#808080',
    wargear: '#FFFFFF',
    points: '#FFFF00',
    header: '#FFFF00'
  }
})

console.log(output)
```

## API

### `generateDiscordText(data, options)`

Generates Discord-formatted text from army list data (string or parsed object).

**Parameters:**
- `data` (string|Object): Raw army list text string OR parsed army list data object
  - If string: Automatically detects format (GW App, WTC, New Recruit, ListForge) and parses it
  - If object: Uses the parsed data directly (backward compatible)
- `options` (Object): Configuration options
  - `plain` (boolean, default: `false`): Output plain text without ANSI colors
  - `useAbbreviations` (boolean, default: `true`): Use abbreviations for wargear
  - `wargearAbbrMap` (Object, default: `null`): Abbreviation map from `buildAbbreviationIndex()`
  - `hideSubunits` (boolean, default: `false`): Hide subunit details and aggregate wargear
  - `skippableWargearMap` (Object, default: `null`): Map of wargear to skip (from `skippable_wargear.json`)
  - `combineIdenticalUnits` (boolean, default: `false`): Combine identical units
  - `colorMode` (string, default: `'none'`): Color mode - `'none'`, `'custom'`, or `'faction'`
  - `colors` (Object, default: `null`): Custom colors object `{ unit, subunit, wargear, points, header }`
  - `forcePalette` (boolean, default: `false`): Force ANSI palette instead of truecolor
  - `autoBuildAbbreviations` (boolean, default: `true`): Automatically build abbreviations if not provided

**Returns:** (string) Formatted Discord text

**Throws:** (Error) If `data` is a string but the format cannot be detected or parsed

**Example:**
```javascript
try {
  const output = generateDiscordText(armyListString, { useAbbreviations: true })
  console.log(output)
} catch (error) {
  console.error('Failed to parse army list:', error.message)
}
```

### `buildAbbreviationIndex(parsedData)`

Builds an abbreviation index from parsed data.

**Parameters:**
- `parsedData` (Object): Parsed army list data

**Returns:** (Object) Abbreviation map to pass to `generateDiscordText`

## Testing

Run the test script:

```bash
npm run lib:test
```

## Example Output

```
```ansi
Test Army | Space Marines | Gladius Task Force | 2000 pts

* Captain (BP, PS) [80]
* Intercessor Squad (5x BR) [85]
```
```

## Using in Another Project

See [USAGE.md](./USAGE.md) for detailed instructions on integrating this library into your own project.

**Quick Summary:**
- Copy `lib/` and `modules/` folders to your project
- Or use as a git submodule
- Or link as a local npm package
- The library has no external npm dependencies

