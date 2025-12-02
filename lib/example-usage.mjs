#!/usr/bin/env node
/**
 * Example usage of the generateDiscordText library
 * 
 * This demonstrates how to use the library in another project.
 * 
 * To run: node lib/example-usage.mjs
 */

import { generateDiscordText, buildAbbreviationIndex } from './index.js'

// Example 1: Using string input (NEW - easiest way!)
console.log('=== Example 1: String Input (Auto-parse) ===\n')

const armyListText = `My Army (2000 points)

Space Marines
Strike Force (2000 points)
Gladius Task Force

CHARACTER

Captain (80 points)
  • 1x Bolt pistol
    1x Power sword
  • Warlord

OTHER DATASHEETS

Intercessor Squad (85 points)
  • 5x Bolt rifle

Tactical Squad (150 points)
  • 9x Boltgun
    1x Plasma gun`

// Simply pass the string - it will auto-detect format and parse!
const output1 = generateDiscordText(armyListText, {
  useAbbreviations: true
})

console.log(output1)
console.log('\n')

// Example 2: Using parsed object (for advanced use cases)
console.log('=== Example 2: Parsed Object Input ===\n')

const exampleParsedData = {
  SUMMARY: {
    LIST_TITLE: 'Example Army List',
    FACTION_KEYWORD: 'Space Marines',
    DISPLAY_FACTION: 'Space Marines',
    DETACHMENT: 'Gladius Task Force',
    TOTAL_ARMY_POINTS: '2000 pts'
  },
  CHARACTER: [
    {
      name: 'Captain',
      quantity: '1x',
      points: 80,
      items: [
        { name: 'Bolt pistol', quantity: '1x', type: 'wargear', nameshort: 'BP' },
        { name: 'Power sword', quantity: '1x', type: 'wargear', nameshort: 'PS' },
        { name: 'Warlord', quantity: '1x', type: 'special' }
      ]
    }
  ],
  'OTHER DATASHEETS': [
    {
      name: 'Intercessor Squad',
      quantity: '5x',
      points: 85,
      items: [
        { name: 'Bolt rifle', quantity: '5x', type: 'wargear', nameshort: 'BR' }
      ]
    },
    {
      name: 'Tactical Squad',
      quantity: '10x',
      points: 150,
      items: [
        { name: 'Boltgun', quantity: '9x', type: 'wargear' },
        { name: 'Plasma gun', quantity: '1x', type: 'wargear' }
      ]
    }
  ]
}

// Step 1: Build abbreviation index (optional - auto-built if not provided)
const abbrMap = buildAbbreviationIndex(exampleParsedData)
console.log('Built abbreviation map:', Object.keys(abbrMap.__flat_abbr || {}).length, 'items\n')

// Step 2: Generate Discord text with default options
const output2 = generateDiscordText(exampleParsedData, {
  useAbbreviations: true,
  wargearAbbrMap: abbrMap
})

console.log(output2)
console.log('\n')

// Example 3: Generate with custom colors
console.log('=== Example 3: Custom Colors ===\n')
const output3 = generateDiscordText(exampleParsedData, {
  useAbbreviations: true,
  wargearAbbrMap: abbrMap,
  colorMode: 'custom',
  colors: {
    unit: '#00FF00',
    wargear: '#FFFFFF',
    points: '#FFFF00',
    header: '#00FFFF'
  }
})

console.log(output3)
console.log('\n')

// Example 4: Plain text output
console.log('=== Example 4: Plain Text ===\n')
const output4 = generateDiscordText(exampleParsedData, {
  plain: true,
  useAbbreviations: true,
  wargearAbbrMap: abbrMap
})

console.log(output4)
console.log('\n')

// Example 5: With unit combining
console.log('=== Example 5: Combine Identical Units ===\n')
const dataWithDuplicates = {
  ...exampleParsedData,
  'OTHER DATASHEETS': [
    ...exampleParsedData['OTHER DATASHEETS'],
    {
      name: 'Intercessor Squad',
      quantity: '5x',
      points: 85,
      items: [
        { name: 'Bolt rifle', quantity: '5x', type: 'wargear', nameshort: 'BR' }
      ]
    }
  ]
}

const abbrMap2 = buildAbbreviationIndex(dataWithDuplicates)
const output5 = generateDiscordText(dataWithDuplicates, {
  useAbbreviations: true,
  wargearAbbrMap: abbrMap2,
  combineIdenticalUnits: true
})

console.log(output5)

