const { User } = require("../models");
const validateEmail = require("../../utils/validateEmail");
const validateString = require("../../utils/validateString");

class UserController {
  async register(req, res) {
    const { name, email, password } = req.body;

    if (
      !validateString(name) ||
      !validateString(email) ||
      !validateString(password) ||
      !validateEmail(email)
    ) {
      return res.status(401).json({ message: "Invalid user data" });
    }

    if (password.length < 6) {
      return res.status(401).json({
        message: "User password must be at least 6 characters long",
      });
    }
    const user = await User.create({ name, email, password });
    return res.status(200).json({ message: "User created", id: user.id });
  }
}

module.exports = new UserController();
