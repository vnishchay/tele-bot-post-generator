const readline = require("readline");
const path = require("path");

// Import your bot's main functionality
// Adjust this import to match your actual bot structure
const botModule = require("./your_bot_file");

// Create a mock context that simulates Telegram's context
const createMockContext = (message) => {
  return {
    message: {
      text: message,
      chat: {
        id: "test-chat-id",
      },
      from: {
        id: "test-user-id",
        first_name: "Test",
        username: "testuser",
      },
    },
    reply: (text) => {
      console.log("\nBOT RESPONSE:");
      console.log(text);
    },
    // Add any other methods your bot uses from the Telegram context
  };
};

// Set up command line interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("==== BOT LOCAL TESTER ====");
console.log('Type messages to send to your bot. Type "exit" to quit.\n');

const promptUser = () => {
  rl.question("YOU: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
      return;
    }

    try {
      // Create mock context with user input
      const ctx = createMockContext(input);

      // Process the message with your bot
      // Adjust this call based on your bot's structure
      if (input.startsWith("/")) {
        // Handle command
        const command = input.substring(1).split(" ")[0];
        if (botModule.commands && botModule.commands[command]) {
          await botModule.commands[command](ctx);
        } else {
          console.log("\nBOT RESPONSE:");
          console.log("Unknown command");
        }
      } else {
        // Handle regular message
        if (botModule.handleMessage) {
          await botModule.handleMessage(ctx);
        }
      }
    } catch (error) {
      console.error("\nERROR:");
      console.error(error);
    }

    promptUser();
  });
};

promptUser();
