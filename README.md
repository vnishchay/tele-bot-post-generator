# Content Generator Bot - Run Instructions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB installed locally or a MongoDB Atlas account
- Telegram account
- OpenAI API key

## Setup Steps

1. **Create a Telegram Bot**

   - Open Telegram and search for [@BotFather](https://t.me/BotFather)
   - Send `/newbot` command
   - Follow the instructions to create a new bot
   - Copy the API token provided by BotFather

2. **Configure Environment Variables**

   - Open the `.env` file
   - Replace `your_telegram_bot_token` with the token from BotFather
   - Replace `your_openai_api_key` with your OpenAI API key
   - Update the MongoDB URI if needed
   - Optionally, add your Telegram user ID to restrict access

3. **Install Dependencies**

   - Open a terminal in the project directory
   - Run: `npm install`

4. **Start MongoDB** (if using locally)

   - Start your MongoDB service
   - For Windows: `net start MongoDB`
   - For macOS/Linux: `sudo systemctl start mongod`

5. **Run the Bot**

   - Run: `npm start`
   - Or for development with auto-reload: `npm run dev`

6. **Test the Bot**
   - Open Telegram and search for your bot
   - Start a conversation with `/start`
   - Send a prompt to generate content

# Adding Your Bot to Telegram

## Creating the Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start a conversation** with BotFather
3. **Send the command** `/newbot`
4. **Name your bot** when prompted (e.g., "Content Generator")
5. **Create a username** for your bot (must end with "bot", e.g., "ContentGeneratorBot")
6. **Save the API token** BotFather gives you
7. **Add the token** to your `.env` file as `TELEGRAM_BOT_TOKEN`

## Start Using Your Bot

1. **Search for your bot** by the username you created (e.g., @ContentGeneratorBot)
2. **Start a conversation** by clicking the "Start" button or sending `/start`
3. **Send prompts** to generate content for your social media posts
4. **Use commands** like `/help` to get assistance and `/history` to see your recent generations

## Adding Bot to Groups (Optional)

1. **Open the group** where you want to add the bot
2. **Click the group name** at the top to open group info
3. **Click "Add members"** (or "Add people" depending on your platform)
4. **Search for your bot** by username
5. **Select the bot** and confirm by adding it

## Bot Privacy Settings (Optional)

By default, bots can only see messages that specifically mention them or commands directed at them. If you want your bot to see all messages in a group:

1. **Talk to @BotFather** again
2. **Send** `/mybots`
3. **Select your bot** from the list
4. **Select "Bot Settings"**
5. **Select "Group Privacy"**
6. **Select "Turn off"**

Note: For most use cases, it's better to leave privacy mode on and use commands or direct mentions to interact with your bot.

## Troubleshooting

- If you see connection errors with MongoDB, ensure the service is running
- If the bot doesn't respond, check your Telegram token
- If content generation fails, verify your OpenAI API key and quota
- If your bot doesn't respond, make sure your application is running
- Verify that the token in your `.env` file matches exactly what BotFather provided
- Check that your user ID is included in the `ALLOWED_USER_IDS` if you've restricted access

## Testing

We use Jest for testing the bot functionality. The tests cover:

1. **Bot Functionality**: Testing commands and message handling
2. **Content Model**: Testing database operations
3. **OpenAI Integration**: Testing API interactions

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run a specific test file
npm test -- tests/bot.test.js
```

### Test Structure

- `tests/bot.test.js`: Tests for Telegram bot functionality
- `tests/content-model.test.js`: Tests for MongoDB model
- `tests/openai-integration.test.js`: Tests for OpenAI API integration

The tests use:

- Jest as the test runner
- MongoDB Memory Server for database testing
- Nock for HTTP request mocking
- Jest mocks for dependencies

### Continuous Integration

You can add these tests to your CI pipeline using GitHub Actions or similar services.
