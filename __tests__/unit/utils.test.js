const validateEmail = require("../../src/utils/validateEmail");
const validateId = require("../../src/utils/validateId");
const validateString = require("../../src/utils/validateString");

describe("validateEmail", () => {
  it("should return true when email is valid", async () => {
    expect(validateEmail("user@test.com.br")).toBe(true);
    expect(validateEmail("user@test.com")).toBe(true);
    expect(validateEmail("user@test.co")).toBe(true);
    expect(validateEmail("n@w.co")).toBe(true);
  });

  it("should return false when email is invalid", async () => {
    expect(validateEmail("usertest.com.br")).toBe(false);
    expect(validateEmail("usertest.com.br.br")).toBe(false);
    expect(validateEmail("usertest.br")).toBe(false);
    expect(validateEmail("")).toBe(false);
  });
});

describe("validateString", () => {
  it("should return true when string is valid", async () => {
    expect(validateString("abcde")).toBe(true);
    expect(validateString("abc de")).toBe(true);
    expect(validateString("abc de 123")).toBe(true);
  });

  it("should return false when string is invalid", async () => {
    expect(validateString("")).toBe(false);
    expect(validateString(1)).toBe(false);
    expect(validateString(123)).toBe(false);
    expect(validateString(null)).toBe(false);
  });
});

describe("validateId", () => {
  it("should return true when id is valid and greater than 0", async () => {
    expect(validateId(1)).toBe(true);
    expect(validateId(123123)).toBe(true);
    expect(validateId("123")).toBe(true);
  });

  it("should return false when id is invalid, negative or equal to 0", async () => {
    expect(validateId(0)).toBe(false);
    expect(validateId(-123)).toBe(false);
    expect(validateId(123.123)).toBe(false);
    expect(validateId("")).toBe(false);
    expect(validateId("abc")).toBe(false);
  });
});
