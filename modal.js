const modalJSON = {
  "custom_id": "40k_list",
  "title": "40K List Compactor",
  "components": [
    {
      type: 10,
      content: `This app makes it super easy to submit your list within the limits of a Discord message. Credit goes to @desjani for all his hard work on [40KCompactor](https://desjani.github.io/40kCompactor/), [support him by buying him a ko-fi](https://ko-fi.com/U7U7Z3Q0S)!`
    },
    {
      "type": 18,
      "label": "List Style",
      "description": "Select the style of the list",
      "component": {
        "type": 3, // ComponentType.STRING_SELECT
        "custom_id": "list_style",
        "placeholder": "Discord (Compact)",
        "options": [
          {
            "label": "Discord (Compact)",
            "value": "discordCompact",
            "description": "Compact mode, Discord optimized",
            "emoji": { "name": "📦" }
          },
          {
            "label": "Discord (Extended)",
            "value": "discordExtended",
            "description": "Extended, Discord optimized",
            "emoji": { "name": "📜" }
          },
          {
            "label": "Plain Text",
            "value": "plainText",
            "description": "Plain text version",
            "emoji": { "name": "📄" }
          },
          {
            "label": "Plain Text (extended)",
            "value": "plainTextExtended",
            "description": "Detailed, plain text",
            "emoji": { "name": "📝" }
          }
        ]
      }
    },
    {
      "type": 18,
      "label": "Your List",
      "description": "Copy paste from GW App or WTC-Compact",
      "component": {
        "type": 4,
        "custom_id": "40k_list_input",
        "style": 2,
        "min_length": 100,
        "max_length": 10000,
        "placeholder": "Paste your list here (GW App or WTC-Compact)",
        "required": true
      }
    },
    
  ],
}

export default modalJSON