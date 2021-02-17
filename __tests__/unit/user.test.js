const brcrypt = require("bcryptjs");
const { User } = require("../../src/app/models");
const truncate = require("../utils/truncate");

describe("User", () => {
  beforeEach(async () => {
    await truncate();
  });

  it("should encrypt user password", async () => {
    const user = await User.create({
      email: "user@test.com.br",
      name: "user",
      password: "123123",
    });

    const compareHash = await brcrypt.compare("123123", user.password_hash);

    expect(compareHash).toBe(true);
  });
});
