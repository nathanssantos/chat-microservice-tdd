const request = require("supertest");
const app = require("../../src/app");
const truncate = require("../utils/truncate");
const factory = require("../factories");

describe("Message", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should create a message when authenticated", async () => {
    const user = await factory.create("User");

    const response = await request(app)
      .post("/send-message")
      .send({
        to_id: 2,
        text: "Message text",
      })
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should not create a message when not authenticated", async () => {
    const response = await request(app)
      .post("/send-message")
      .send({
        to_id: 2,
        text: "Message text",
      })
      .set("Authorization", `Bearer 123`);

    expect(response.status).toBe(401);
  });

  it("should not create a message with invalid text", async () => {
    const user = await factory.create("User");

    const response = await request(app)
      .post("/send-message")
      .send({
        to_id: 2,
        text: "",
      })
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(401);
  });

  it("should not create a message with invalid to_id", async () => {
    const user = await factory.create("User");

    const response = await request(app)
      .post("/send-message")
      .send({
        to_id: "abc",
        text: "Message text",
      })
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(401);
  });

  it("should return a message list when authenticated", async () => {
    const user1 = await factory.create("User", {
      email: "user1@test.com.br",
      password: "123123",
      name: "user 1",
    });
    const user2 = await factory.create("User", {
      email: "user2@test.com.br",
      password: "123123",
      name: "user 2",
    });

    const message1 = await request(app)
      .post("/send-message")
      .send({
        to_id: user2.id,
        text: "Message text",
      })
      .set("Authorization", `Bearer ${user1.generateToken()}`);

    expect(message1.status).toBe(200);

    const message2 = await request(app)
      .post("/send-message")
      .send({
        to_id: user1.id,
        text: "Message text",
      })
      .set("Authorization", `Bearer ${user2.generateToken()}`);

    expect(message2.status).toBe(200);

    const response1 = await request(app)
      .get("/message-list")
      .query({ correspondent_id: user2.id })
      .set("Authorization", `Bearer ${user1.generateToken()}`);

    expect(response1.status).toBe(200);
    expect(typeof response1.body).toBe("object");
    expect(Array.isArray(response1.body)).toBe(true);
    expect(response1.body.length).toBe(2);

    const response2 = await request(app)
      .get("/message-list")
      .query({ correspondent_id: user1.id })
      .set("Authorization", `Bearer ${user2.generateToken()}`);

    expect(response2.status).toBe(200);
    expect(typeof response2.body).toBe("object");
    expect(Array.isArray(response2.body)).toBe(true);
    expect(response2.body.length).toBe(2);
  });

  it("should not return a message list when not authenticated", async () => {
    const user1 = await factory.create("User", {
      email: "user1@test.com.br",
      password: "123123",
      name: "user 1",
    });
    const user2 = await factory.create("User", {
      email: "user2@test.com.br",
      password: "123123",
      name: "user 2",
    });

    const message1 = await request(app)
      .post("/send-message")
      .send({
        to_id: user2.id,
        text: "Message text",
      })
      .set("Authorization", `Bearer ${user1.generateToken()}`);

    expect(message1.status).toBe(200);

    const message2 = await request(app)
      .post("/send-message")
      .send({
        to_id: user1.id,
        text: "Message text",
      })
      .set("Authorization", `Bearer ${user2.generateToken()}`);

    expect(message2.status).toBe(200);

    const response1 = await request(app)
      .get("/message-list")
      .query({ correspondent_id: user2.id })
      .set("Authorization", `Bearer 123123`);

    expect(response1.status).toBe(401);

    const response2 = await request(app)
      .get("/message-list")
      .query({ correspondent_id: user1.id })
      .set("Authorization", `Bearer 123123`);

    expect(response2.status).toBe(401);
  });

  it("should not return a message list when no messages found", async () => {
    const user1 = await factory.create("User", {
      email: "user1@test.com.br",
      password: "123123",
      name: "user 1",
    });
    const user2 = await factory.create("User", {
      email: "user2@test.com.br",
      password: "123123",
      name: "user 2",
    });

    const response1 = await request(app)
      .get("/message-list")
      .query({ correspondent_id: user2.id })
      .set("Authorization", `Bearer ${user1.generateToken()}`);

    expect(response1.status).toBe(204);

    const response2 = await request(app)
      .get("/message-list")
      .query({ correspondent_id: user1.id })
      .set("Authorization", `Bearer ${user2.generateToken()}`);

    expect(response2.status).toBe(204);
  });

  it("should not return a message list with invalid correspondent_id", async () => {
    const user = await factory.create("User", {
      email: "user@test.com.br",
      password: "123123",
      name: "user",
    });

    const response1 = await request(app)
      .get("/message-list")
      .query({ correspondent_id: "abc" })
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response1.status).toBe(401);
  });
});
