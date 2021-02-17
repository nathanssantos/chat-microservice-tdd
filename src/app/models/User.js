const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (Sequelize, DataTypes) => {
  const User = Sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: DataTypes.STRING,
      password: DataTypes.VIRTUAL,
      password_hash: DataTypes.STRING,
      name: DataTypes.STRING,
    },
    {
      hooks: {
        beforeSave: async (user) => {
          user.password_hash = await bcrypt.hash(user.password, 8);
        },
      },
    }
  );

  User.prototype.checkPassword = function (password) {
    return bcrypt.compare(password, this.password_hash);
  };

  User.prototype.generateToken = function () {
    return jwt.sign({ id: this.id }, process.env.APP_SECRET);
  };

  return User;
};
