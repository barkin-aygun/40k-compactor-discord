// Simple test script for the library
import { generateDiscordText, buildAbbreviationIndex } from './generateDiscordText.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Example parsed data structure (minimal example)
const exampleData = {
  SUMMARY: {
    LIST_TITLE: 'Test Army',
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
        { name: 'Bolt pistol', quantity: '1x', type: 'wargear' },
        { name: 'Power sword', quantity: '1x', type: 'wargear' }
      ]
    }
  ],
  'OTHER DATASHEETS': [
    {
      name: 'Intercessor Squad',
      quantity: '5x',
      points: 85,
      items: [
        { name: 'Bolt rifle', quantity: '5x', type: 'wargear' }
      ]
    }
  ]
}

console.log('Testing generateDiscordText library...\n')

// Test 1: String input (NEW!)
console.log('=== Test 1: String Input (Auto-parse) ===')
const sampleText = `Test Army (2000 points)

Space Marines
Strike Force (2000 points)
Gladius Task Force

CHARACTER

Captain (80 points)
  • 1x Bolt pistol
    1x Power sword

OTHER DATASHEETS

Intercessor Squad (85 points)
  • 5x Bolt rifle`

try {
  const output1 = generateDiscordText(sampleText, {
    useAbbreviations: true
  })
  console.log(output1)
} catch (e) {
  console.error('Error:', e.message)
}
console.log('\n')

// Test 2: Parsed object input (backward compatible)
console.log('=== Test 2: Parsed Object Input ===')
const output2 = generateDiscordText(exampleData, {
  useAbbreviations: true,
  hideSubunits: false
})
console.log(output2)
console.log('\n')

// Test 3: With abbreviations built from data
console.log('=== Test 3: With Abbreviation Index ===')
const abbrMap = buildAbbreviationIndex(exampleData)
const output3 = generateDiscordText(exampleData, {
  useAbbreviations: true,
  wargearAbbrMap: abbrMap,
  hideSubunits: false
})
console.log(output3)
console.log('\n')

// Test 4: Plain text output
console.log('=== Test 4: Plain Text Output ===')
const output4 = generateDiscordText(exampleData, {
  plain: true,
  useAbbreviations: true,
  wargearAbbrMap: abbrMap
})
console.log(output4)
console.log('\n')

// Test 5: With custom colors
console.log('=== Test 5: Custom Colors ===')
const output5 = generateDiscordText(exampleData, {
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
console.log(output5)
console.log('\n')

// Test 6: Real sample file (if available)
console.log('=== Test 6: Real Sample File ===')
try {
  const samplePath = join(__dirname, '../samples/GWAPPSample.txt')
  const realSample = readFileSync(samplePath, 'utf-8')
  const output6 = generateDiscordText(realSample, {
    useAbbreviations: true,
    colorMode: 'faction'
  })
  console.log(output6.substring(0, 500) + '...\n')
} catch (e) {
  console.log('Sample file not found, skipping...\n')
}

console.log('All tests completed!')

