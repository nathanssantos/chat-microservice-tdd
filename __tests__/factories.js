const faker = require("faker");
const { factory } = require("factory-girl");
const { User } = require("../src/app/models");

factory.define("User", User, {
  email: faker.internet.email(),
  password: "123123",
  name: faker.name.firstName() + faker.name.lastName(),
});

module.exports = factory;
