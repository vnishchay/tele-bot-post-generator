// const TelegramBot = require("node-telegram-bot-api");
// const { OpenAI } = require("openai");
// const mongoose = require("mongoose");
// const { MongoMemoryServer } = require("mongodb-memory-server");

// // Mock dependencies
// jest.mock("node-telegram-bot-api");
// jest.mock("openai");
// // Mock mongoose.connect to prevent actual connections
// jest.mock("mongoose", () => {
//   const actualMongoose = jest.requireActual("mongoose");
//   return {
//     ...actualMongoose,
//     connect: jest.fn().mockResolvedValue(actualMongoose),
//   };
// });

// // Import the Content model
// const Content = require("../models/content");

// let mongoServer;

// describe("Telegram Bot Tests", () => {
//   beforeAll(async () => {
//     // Set up in-memory MongoDB for testing
//     mongoServer = await MongoMemoryServer.create();
//     const uri = mongoServer.getUri();
//     await mongoose.connect(uri);

//     // Setup environment variables for testing
//     // process.env.TELEGRAM_BOT_TOKEN = "test_token";
//     // process.env.OPENAI_API_KEY = "test_openai_key";
//     // process.env.MONGODB_URI = uri; // Set this to prevent actual DB connection in index.js
//   });

//   afterAll(async () => {
//     await mongoose.disconnect();
//     await mongoServer.stop();
//   });

//   beforeEach(() => {
//     // Clear mocks before each test
//     jest.clearAllMocks();

//     // Setup basic mocks for TelegramBot
//     TelegramBot.mockImplementation(() => {
//       return {
//         on: jest.fn(),
//         onText: jest.fn(),
//         sendMessage: jest.fn(),
//       };
//     });
//   });

//   test("Bot initializes correctly", () => {
//     // Import the bot module (which will use our mocks)
//     const botModule = require("../index");

//     // Check if TelegramBot was initialized with the correct token
//     expect(TelegramBot).toHaveBeenCalledWith(process.env.TELEGRAM_BOT_TOKEN, {
//       polling: true,
//     });

//     // Check if bot.on was called for message handling
//     const mockBotInstance = TelegramBot.mock.instances[0];
//     expect(mockBotInstance.on).toHaveBeenCalledWith(
//       "message",
//       expect.any(Function)
//     );
//   });

//   test("Bot responds to /start command", () => {
//     // Setup the mock onText to store and execute the callback
//     let startCallback;
//     const mockOnText = jest.fn((pattern, callback) => {
//       if (pattern.toString() === /\/start/.toString()) {
//         startCallback = callback;
//       }
//     });

//     // Setup TelegramBot instance with our mock
//     const mockBot = {
//       on: jest.fn(),
//       onText: mockOnText,
//       sendMessage: jest.fn(),
//     };

//     // Mock the constructor to return our mockBot
//     TelegramBot.mockImplementation(() => mockBot);

//     // Import the bot which should register handlers on our mock
//     const botModule = require("../index");

//     // Ensure the onText method was called
//     expect(mockBot.onText).toHaveBeenCalled();

//     // Find the call for /start
//     const startCallArgs = mockBot.onText.mock.calls.find(
//       (call) => call[0].toString() === /\/start/.toString()
//     );

//     // Extract the callback
//     const startHandler = startCallArgs ? startCallArgs[1] : null;
//     expect(startHandler).toBeTruthy();

//     // Create a mock message
//     const mockMsg = { chat: { id: 12345 } };

//     // Call the handler
//     startHandler(mockMsg);

//     // Check if sendMessage was called with welcome message
//     expect(mockBot.sendMessage).toHaveBeenCalledWith(
//       12345,
//       expect.stringContaining("Welcome")
//     );
//   });

//   test("Bot responds to help command", () => {
//     // Setup the mock onText to store and execute the callback
//     let helpCallback;
//     const mockOnText = jest.fn((pattern, callback) => {
//       if (pattern.toString() === /\/help/.toString()) {
//         helpCallback = callback;
//       }
//     });

//     // Setup TelegramBot instance with our mock
//     const mockBot = {
//       on: jest.fn(),
//       onText: mockOnText,
//       sendMessage: jest.fn(),
//     };

//     // Mock the constructor to return our mockBot
//     TelegramBot.mockImplementation(() => mockBot);

//     // Import the bot which should register handlers on our mock
//     const botModule = require("../index");

//     // Ensure the onText method was called
//     expect(mockBot.onText).toHaveBeenCalled();

//     // Find the call for /help
//     const helpCallArgs = mockBot.onText.mock.calls.find(
//       (call) => call[0].toString() === /\/help/.toString()
//     );

//     // Extract the callback
//     const helpHandler = helpCallArgs ? helpCallArgs[1] : null;
//     expect(helpHandler).toBeTruthy();

//     // Create a mock message
//     const mockMsg = { chat: { id: 12345 } };

//     // Call the handler
//     helpHandler(mockMsg);

//     // Check if sendMessage was called with help message
//     expect(mockBot.sendMessage).toHaveBeenCalledWith(
//       12345,
//       expect.stringContaining("How to use this bot")
//     );
//   });

//   test("Bot generates content for allowed user", async () => {
//     // Setup mock for on method to capture the message handler
//     const mockOn = jest.fn();
//     let messageHandler;
//     mockOn.mockImplementation((event, callback) => {
//       if (event === "message") {
//         messageHandler = callback;
//       }
//     });

//     // Setup TelegramBot instance with our mock
//     const mockBot = {
//       on: mockOn,
//       onText: jest.fn(),
//       sendMessage: jest.fn(),
//     };

//     // Mock the constructor to return our mockBot
//     TelegramBot.mockImplementation(() => mockBot);

//     // Set up OpenAI mock response
//     OpenAI.prototype.chat = {
//       completions: {
//         create: jest.fn().mockResolvedValue({
//           choices: [
//             { message: { content: "Generated content for social media" } },
//           ],
//         }),
//       },
//     };

//     // Import the bot which should register handlers on our mock
//     const botModule = require("../index");

//     // Ensure the on method was called for messages
//     expect(mockBot.on).toHaveBeenCalledWith("message", expect.any(Function));
//     expect(messageHandler).toBeDefined();

//     // Create a mock message from allowed user
//     const mockMsg = {
//       chat: { id: 12345 },
//       from: { id: 12345 },
//       text: "Generate content about AI",
//     };

//     // Call the message handler
//     await messageHandler(mockMsg);

//     // Check if bot sent processing message
//     expect(mockBot.sendMessage).toHaveBeenCalledWith(
//       12345,
//       expect.stringContaining("Generating content")
//     );

//     // Check if OpenAI was called with the right prompt
//     expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalledWith(
//       expect.objectContaining({
//         messages: expect.arrayContaining([
//           expect.objectContaining({
//             role: "user",
//             content: "Generate content about AI",
//           }),
//         ]),
//       })
//     );

//     // Check if bot sent the generated content
//     expect(mockBot.sendMessage).toHaveBeenLastCalledWith(
//       12345,
//       expect.stringContaining("Generated content for social media")
//     );
//   });

//   test("Bot rejects unauthorized user", async () => {
//     // Setup mock for on method to capture the message handler
//     const mockOn = jest.fn();
//     let messageHandler;
//     mockOn.mockImplementation((event, callback) => {
//       if (event === "message") {
//         messageHandler = callback;
//       }
//     });

//     // Setup TelegramBot instance with our mock
//     const mockBot = {
//       on: mockOn,
//       onText: jest.fn(),
//       sendMessage: jest.fn(),
//     };

//     // Mock the constructor to return our mockBot
//     TelegramBot.mockImplementation(() => mockBot);

//     // Import the bot which should register handlers on our mock
//     const botModule = require("../index");

//     // Ensure the on method was called for messages
//     expect(mockBot.on).toHaveBeenCalledWith("message", expect.any(Function));
//     expect(messageHandler).toBeDefined();

//     // Create a mock message from unauthorized user
//     const mockMsg = {
//       chat: { id: 99999 },
//       from: { id: 99999 },
//       text: "Generate content about AI",
//     };

//     // Call the message handler
//     await messageHandler(mockMsg);

//     // Check if bot sent unauthorized message
//     expect(mockBot.sendMessage).toHaveBeenCalledWith(
//       99999,
//       expect.stringContaining("not authorized")
//     );

//     // Ensure OpenAI was not called
//     expect(OpenAI.prototype.chat?.completions?.create).not.toHaveBeenCalled();
//   });
// });
