const request = require("supertest");
const app = require("../../src/app");
const truncate = require("../utils/truncate");

describe("Register", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should create a user with valid data", async () => {
    const response = await request(app).post("/register").send({
      email: "user@test.com.br",
      password: "123123",
      name: "user",
    });

    expect(response.status).toBe(200);
  });

  it("should not create a user with invalid data", async () => {
    const response = await request(app).post("/register").send({
      email: 123123,
      password: "123123",
      name: "user",
    });

    expect(response.status).toBe(401);
  });

  it("should not create a user with password shorter than 6 characters", async () => {
    const response = await request(app).post("/register").send({
      email: "user@test.com.br",
      password: "123",
      name: "user",
    });

    expect(response.status).toBe(401);
  });

  it("should return the id when a user is created", async () => {
    const response = await request(app).post("/register").send({
      email: "user@test.com.br",
      password: "123123",
      name: "user",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(typeof response.body.id).toBe("number");
  });
});
