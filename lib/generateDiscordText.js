// Library wrapper for generateDiscordText
// Exports the generateDiscordText function from renderers.js as a standalone library

import { generateDiscordText as _generateDiscordText } from '../modules/renderers.js'
import { detectFormat, parseGwApp, parseWtcCompact, parseWtc, parseNrGw, parseNrNr, parseLf } from '../modules/parsers.js'
import { buildAbbreviationIndex as _buildAbbreviationIndex } from '../modules/abbreviations.js'

/**
 * Generate Discord-formatted text from army list data (string or parsed object)
 * 
 * @param {string|Object} data - Raw army list text string OR parsed army list data object
 * @param {Object} options - Configuration options
 * @param {boolean} options.plain - If true, output plain text without ANSI colors
 * @param {boolean} options.useAbbreviations - If true, use abbreviations for wargear (default: true)
 * @param {Object} options.wargearAbbrMap - Abbreviation map (auto-generated if not provided and useAbbreviations is true)
 * @param {boolean} options.hideSubunits - If true, hide subunit details and aggregate wargear
 * @param {Object} options.skippableWargearMap - Map of wargear to skip (from skippable_wargear.json)
 * @param {boolean} options.combineIdenticalUnits - If true, combine identical units
 * @param {string} options.colorMode - Color mode: 'none', 'custom', or 'faction'
 * @param {Object} options.colors - Custom colors object { unit, subunit, wargear, points, header }
 * @param {boolean} options.forcePalette - If true, force ANSI palette instead of truecolor
 * @param {boolean} options.autoBuildAbbreviations - If true, automatically build abbreviations from parsed data (default: true)
 * @returns {string} Formatted Discord text
 * @throws {Error} If data is a string but format cannot be detected or parsed
 */
export function generateDiscordText(data, options = {}) {
  // Default options
  const {
    plain = false,
    useAbbreviations = true,
    wargearAbbrMap = null,
    hideSubunits = false,
    skippableWargearMap = null,
    combineIdenticalUnits = false,
    colorMode = 'none',
    colors = null,
    forcePalette = false,
    autoBuildAbbreviations = true
  } = options

  let parsedData = data
  let abbrMap = wargearAbbrMap

  // If data is a string, parse it first
  if (typeof data === 'string') {
    const lines = data.split('\n')
    const format = detectFormat(lines)
    
    const parser = {
      GW_APP: parseGwApp,
      WTC: parseWtc,
      WTC_COMPACT: parseWtcCompact,
      NR_GW: parseNrGw,
      NRNR: parseNrNr,
      LF: parseLf
    }[format]

    if (!parser) {
      throw new Error(`Unsupported list format. Detected format: ${format}. Supported formats: GW App, New Recruit (WTC-Compact, GW, or NR formats), or ListForge (Detailed).`)
    }

    parsedData = parser(lines)
  }

  // Auto-build abbreviations if not provided and abbreviations are enabled
  if (useAbbreviations && !abbrMap && autoBuildAbbreviations) {
    abbrMap = _buildAbbreviationIndex(parsedData)
  }

  // Build options object for the underlying function
  const renderOptions = {
    colorMode,
    colors,
    forcePalette
  }

  // Call the underlying function with all parameters
  return _generateDiscordText(
    parsedData,
    plain,
    useAbbreviations,
    abbrMap,
    hideSubunits,
    skippableWargearMap,
    combineIdenticalUnits,
    renderOptions
  )
}

// Re-export helper functions for convenience
export { buildFactionColorMap, HIDE_ALL } from '../modules/renderers.js'
export { buildAbbreviationIndex, makeAbbrevForName } from '../modules/abbreviations.js'

