import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  generateDiscordText, 
  detectFormat, 
  parseGwApp, 
  parseWtcCompact, 
  parseWtc, 
  parseNrGw, 
  parseNrNr, 
  parseLf,
  buildAbbreviationIndex
} from '40k-compactor/index.js'
import modalJSON from './modal.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// To keep track of our active games
const activeGames = {};

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  const { id, type, data } = req.body;
  console.log(id, type)
  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" command
    if (name === 'test') {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: InteractionResponseFlags.IS_COMPONENTS_V2,
          components: [
            {
              type: MessageComponentTypes.TEXT_DISPLAY,
              // Fetches a random emoji to send from a helper function
              content: `hello world ${getRandomEmoji()}`
            }
          ]
        },
      });
    } else if (name === '40k') {
      try {
        return res.send({
          "type": 9,
          "data": modalJSON
        });
      } catch (error) {
        console.error(`error: ${error}`);
        return res.status(500).json({ error: 'error' });
      }
    }
  } else if (type === InteractionType.MODAL_SUBMIT) {
      const { custom_id, components } = data;
       if (custom_id === '40k_list') {
        const style = components[1].component.values[0]
        const { value } = components[2].component;
        try {
          // Load skippable_wargear.json
          let skippableWargearMap = {};
          try {
            const configPath = path.join(__dirname, '40kCompactor', 'skippable_wargear.json');
            if (fs.existsSync(configPath)) {
              const content = fs.readFileSync(configPath, 'utf8');
              skippableWargearMap = JSON.parse(content);
            }
          } catch (e) {
            console.warn('Warning: Failed to load skippable_wargear.json', e.message);
          }

          // Split input into lines and detect format
          const lines = value.split(/\r?\n/);
          const format = detectFormat(lines);

          // Select the appropriate parser based on format
          const parser = {
            GW_APP: parseGwApp,
            WTC: parseWtc,
            WTC_COMPACT: parseWtcCompact,
            NR_GW: parseNrGw,
            NRNR: parseNrNr,
            LF: parseLf
          }[format];

          if (!parser) {
            return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `Error: Unsupported list format detected: ${format}`,
              },
            });
          }

          // Parse the list
          let parsedData;
          try {
            parsedData = parser(lines);
          } catch (parseError) {
            console.error('Error parsing list:', parseError);
            return res.send({
              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
              data: {
                content: `Error parsing list: ${parseError.message}`,
              },
            });
          }

          // Build abbreviation index
          let wargearAbbrDB = { __flat_abbr: {} };
          try {
            wargearAbbrDB = buildAbbreviationIndex(parsedData, {});
          } catch (e) {
            console.warn('Warning: Failed to build abbreviation index', e);
          }

          // Generate Discord text with proper parameters
          const renderOptions = {
            colorMode: 'faction',
            multilineHeader: false,
            colors: {},
            forcePalette: true
          };

        
          const plain = style.includes('plain')
          const useAbbrv = !style.includes('Extended')
          const output = generateDiscordText(
            parsedData,           // data
            plain,                // plain (false = Discord format)
            useAbbrv,                 // useAbbreviations
            wargearAbbrDB,        // wargearAbbrMap
            true,                 // hideSubunits
            skippableWargearMap,  // skippableWargearMap
            false,                // combineIdenticalUnits
            renderOptions,        // options
            false,                // noBullets
            false                 // hidePoints
          );

          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: output,
            },
          });
        } catch (e) {
          console.error(e);
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `Error: ${e.message}`,
            },
          });
        }
      }
    }
  }
);

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
