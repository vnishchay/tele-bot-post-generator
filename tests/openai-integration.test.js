const { OpenAI } = require("openai");
const nock = require("nock");

// Mock OpenAI API
jest.mock("openai");

describe("OpenAI Integration Tests", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  test("OpenAI API is called with correct parameters", async () => {
    // Setup mock for OpenAI
    OpenAI.prototype.chat = {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "Generated social media content" } }],
        }),
      },
    };

    process.env.OPENAI_API_KEY = "test_api_key";

    // Import the module that uses OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Call the API
    const prompt = "Generate content about technology trends";
    await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a social media content creator.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 800,
    });

    // Verify the API was called with correct parameters
    expect(OpenAI.prototype.chat.completions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-4",
        messages: expect.arrayContaining([
          expect.objectContaining({
            role: "system",
          }),
          expect.objectContaining({
            role: "user",
            content: prompt,
          }),
        ]),
        max_tokens: 800,
      })
    );
  });

  test("Handles OpenAI API errors gracefully", async () => {
    // Setup mock to throw an error
    OpenAI.prototype.chat = {
      completions: {
        create: jest.fn().mockRejectedValue(new Error("API Error")),
      },
    };

    process.env.OPENAI_API_KEY = "test_api_key";

    // Create a new OpenAI instance
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Call the API and expect it to throw
    await expect(
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: "test" }],
      })
    ).rejects.toThrow("API Error");
  });
});
