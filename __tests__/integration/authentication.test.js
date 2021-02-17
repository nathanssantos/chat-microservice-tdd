const request = require("supertest");
const app = require("../../src/app");
const truncate = require("../utils/truncate");
const factory = require("../factories");

describe("Authentication", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should authenticate with valid credentials", async () => {
    const user = await factory.create("User");

    const response = await request(app).post("/auth").send({
      email: user.email,
      password: "123123",
    });

    expect(response.status).toBe(200);
  });

  it("should not authenticate with invalid credentials", async () => {
    const user = await factory.create("User");

    const response = await request(app).post("/auth").send({
      email: user.email,
      password: "123456",
    });

    expect(response.status).toBe(401);
  });

  it("should not authenticate with invalid data", async () => {
    const user = await factory.create("User");

    const response = await request(app).post("/auth").send({
      user: user.email,
      pass: "123456",
    });

    expect(response.status).toBe(401);
  });

  it("should not authenticate with not registered email", async () => {
    const response = await request(app).post("/auth").send({
      email: "email@email.com",
      password: "123123",
    });

    expect(response.status).toBe(401);
  });

  it("should return jwt token when authenticated", async () => {
    const user = await factory.create("User");

    const response = await request(app).post("/auth").send({
      email: user.email,
      password: "123123",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  it("should be able to access private routes when authenticated", async () => {
    const user = await factory.create("User");

    const response = await request(app)
      .get("/user-list")
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
  });

  it("should not be able to access private routes without jwt token", async () => {
    const response = await request(app).get("/user-list");

    expect(response.status).toBe(401);
  });

  it("should not be able to access private routes with invalid jwt token", async () => {
    const response = await request(app)
      .get("/user-list")
      .set("Authorization", `Bearer 123123`);

    expect(response.status).toBe(401);
  });
});
