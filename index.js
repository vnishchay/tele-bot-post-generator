require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const mongoose = require("mongoose");
const Content = require("./models/content");
const axios = require("axios");

// Initialize Deepseek client
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// Initialize Telegram Bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Add this code after initializing the bot
// This enables the bot to work on platforms like Heroku
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Telegram Content Generator Bot is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Add after your express app initialization
// Keep the service alive on free tiers
if (process.env.NODE_ENV === "production") {
  require("./keep-alive");
}

// Connect to MongoDB

console.log(process.env.MONGODB_URI);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Optional: Filter allowed users
const allowedUsers = process.env.ALLOWED_USER_IDS
  ? process.env.ALLOWED_USER_IDS.split(",").map((id) => parseInt(id))
  : [];

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome to the Content Generator Bot! Send me a topic or prompt, and I'll generate social media content for you."
  );
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "How to use this bot:\n\n" +
      "1. Simply send a topic or prompt\n" +
      "2. Wait for the AI to generate content\n" +
      "3. Receive and use the content for your social media\n\n" +
      "Commands:\n" +
      "/start - Start the bot\n" +
      "/help - Show this help message\n" +
      "/history - Show your last 5 generated contents"
  );
});

// Handle /history command
bot.onText(/\/history/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const history = await Content.find({ userId: msg.from.id })
      .sort({ createdAt: -1 })
      .limit(5);

    if (history.length === 0) {
      return bot.sendMessage(
        chatId,
        "You have no content generation history yet."
      );
    }

    let historyMessage = "Your recent content:\n\n";
    history.forEach((item, index) => {
      historyMessage += `${index + 1}. Prompt: "${item.prompt}"\n`;
      historyMessage += `Generated: ${new Date(
        item.createdAt
      ).toLocaleString()}\n\n`;
    });

    bot.sendMessage(chatId, historyMessage);
  } catch (error) {
    console.error("Error fetching history:", error);
    bot.sendMessage(
      chatId,
      "Failed to fetch your history. Please try again later."
    );
  }
});

// Handle incoming messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  // Skip command messages
  if (text.startsWith("/")) return;

  // Check if user is allowed (if ALLOWED_USER_IDS is set)
  if (allowedUsers.length > 0 && !allowedUsers.includes(userId)) {
    return bot.sendMessage(
      chatId,
      "Sorry, you are not authorized to use this bot."
    );
  }

  // Let user know we're processing
  bot.sendMessage(
    chatId,
    "Generating content based on your prompt... Please wait."
  );

  try {
    // Generate content with Deepseek
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content:
              "You are a social media content creator. Generate engaging, creative content for social media posts based on the user's prompt. Include hashtags and emojis where appropriate. Format your response as: 1. Caption for Instagram/Facebook, 2. Short caption for Twitter/X, 3. Content idea for LinkedIn.",
          },
          {
            role: "user",
            content: text,
          },
        ],
        max_tokens: 800,
      },
      {
        headers: {
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedContent = response.data.choices[0].message.content;

    // Save to database
    const newContent = new Content({
      userId: userId,
      prompt: text,
      content: generatedContent,
    });
    await newContent.save();

    // Send back to user
    bot.sendMessage(
      chatId,
      `Here's your generated content:\n\n${generatedContent}\n\nReady to use for your social media posts!`
    );
  } catch (error) {
    console.error("Error generating content:", error);
    bot.sendMessage(
      chatId,
      "Sorry, there was an error generating your content. Please try again later."
    );
  }
});

console.log("Bot is running...");
