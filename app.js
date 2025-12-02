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
import { generateDiscordText } from './lib/generateDiscordText.js'

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
      console.log("received");
      return res.send({
        "type": 9,
        "data": {
          "custom_id": "40k_list",
          "title": "40K List Compactor",
          "components": [
            {
              "type": 18,
              "label": "Your List",
              "description": "Copy paste from GW App or WTC-Compact",
              "component": {
                "type": 4,
                "custom_id": "40k_list_input",
                "style": 2,
                "min_length": 100,
                "max_length": 4000,
                "placeholder": "Paste your list here (GW App or WTC-Compact)",
                "required": true
              }
            }
          ]
        }
      }
      );
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  } else if (type === InteractionType.MODAL_SUBMIT) {
    const { custom_id, components } = data;
    if (custom_id === '40k_list') {
      const { value } = components[0].component;
      const output = generateDiscordText(value, {
        hideSubunits: true,
        colorMode: 'faction',
      });
      console.log(output);
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: output,
        },
      });
    }
  }
});

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
