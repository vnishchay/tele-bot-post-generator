const TelegramBot = require("node-telegram-bot-api");
const OpenAI = require("openai");

// Initialize OpenAI API
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Test OpenAI connection
async function testOpenAIConnection() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: "Hello" }],
      max_tokens: 10,
    });
    return response.choices[0].message.content ? true : false;
  } catch (error) {
    console.error("OpenAI connection test failed:", error);
    return false;
  }
}

// Add command handler before the message handler
bot.onText(/\/test/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(chatId, "Testing OpenAI connection...");

  const isConnected = await testOpenAIConnection();

  bot.sendMessage(
    chatId,
    isConnected
      ? "✅ OpenAI connection is working properly!"
      : "❌ Failed to connect to OpenAI API. Please check your configuration."
  );
});

// Handle incoming messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Process the message
  // ...existing code...
});
