const { User } = require("../models");

class UserController {
  async getUserList(req, res) {
    const userList = await User.findAll();

    return res.status(200).json(
      userList.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
      }))
    );
  }
}

module.exports = new UserController();
