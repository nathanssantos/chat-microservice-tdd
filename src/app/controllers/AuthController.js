const { User } = require("../models");
const validateEmail = require("../../utils/validateEmail");
const validateString = require("../../utils/validateString");

class AuthController {
  async signIn(req, res) {
    const { email, password } = req.body;

    if (
      !validateString(email) ||
      !validateString(password) ||
      !validateEmail(email)
    ) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name },
      token: user.generateToken(),
    });
  }
}

module.exports = new AuthController();
