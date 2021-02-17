const request = require("supertest");
const app = require("../../src/app");
const truncate = require("../utils/truncate");
const factory = require("../factories");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should return a user list when authenticated", async () => {
    const user = await factory.create("User");

    const response = await request(app)
      .get("/user-list")
      .set("Authorization", `Bearer ${user.generateToken()}`);

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe("object");
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should not return a user list when not authenticated", async () => {
    const response = await request(app)
      .get("/user-list")
      .set("Authorization", `Bearer 123`);

    expect(response.status).toBe(401);
  });
});
