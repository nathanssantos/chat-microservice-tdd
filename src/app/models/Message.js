module.exports = (Sequelize, DataTypes) => {
  const Message = Sequelize.define("Message", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    text: DataTypes.STRING,
    from_id: DataTypes.INTEGER,
    to_id: DataTypes.INTEGER,
  });

  return Message;
};
