const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Content = require("../models/content");

let mongoServer;

describe("Content Model Tests", () => {
  beforeAll(async () => {
    // Set up in-memory MongoDB for testing
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database between tests
    await mongoose.connection.dropDatabase();
  });

  test("can create a new content entry", async () => {
    const contentData = {
      userId: 12345,
      prompt: "Test prompt",
      content: "Generated test content",
    };

    const content = new Content(contentData);
    const savedContent = await content.save();

    // Check if the saved data matches our input
    expect(savedContent.userId).toBe(contentData.userId);
    expect(savedContent.prompt).toBe(contentData.prompt);
    expect(savedContent.content).toBe(contentData.content);
    expect(savedContent.createdAt).toBeInstanceOf(Date);
  });

  test("fails when required fields are missing", async () => {
    const contentData = {
      // Missing userId
      prompt: "Test prompt",
      content: "Generated test content",
    };

    const content = new Content(contentData);

    // Expect validation error
    await expect(content.save()).rejects.toThrow();
  });

  test("can find content by userId", async () => {
    // Create test entries
    await Content.create({
      userId: 12345,
      prompt: "Test prompt 1",
      content: "Generated content 1",
    });

    await Content.create({
      userId: 12345,
      prompt: "Test prompt 2",
      content: "Generated content 2",
    });

    await Content.create({
      userId: 67890,
      prompt: "Test prompt 3",
      content: "Generated content 3",
    });

    // Find entries by userId
    const foundContent = await Content.find({ userId: 12345 });

    expect(foundContent).toHaveLength(2);
    expect(foundContent[0].prompt).toBe("Test prompt 1");
    expect(foundContent[1].prompt).toBe("Test prompt 2");
  });

  test("can limit and sort history results", async () => {
    // Create several entries with different dates
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i); // Create entries with different dates

      await Content.create({
        userId: 12345,
        prompt: `Test prompt ${i}`,
        content: `Generated content ${i}`,
        createdAt: date,
      });
    }

    // Get the latest 5 entries
    const history = await Content.find({ userId: 12345 })
      .sort({ createdAt: -1 })
      .limit(5);

    expect(history).toHaveLength(5);

    // The entries should be sorted from newest to oldest
    for (let i = 0; i < 4; i++) {
      expect(history[i].createdAt > history[i + 1].createdAt).toBe(true);
    }

    // Check we got the right 5 entries (newest ones)
    expect(history[0].prompt).toBe("Test prompt 1");
    expect(history[4].prompt).toBe("Test prompt 5");
  });
});
