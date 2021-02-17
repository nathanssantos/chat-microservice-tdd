const { Op } = require("sequelize");
const { Message } = require("../models");
const validateString = require("../../utils/validateString");
const validateId = require("../../utils/validateId");

class MessageController {
  async sendMessage(req, res) {
    const { to_id, text } = req.body;

    if (!validateString(text) || !validateId(to_id)) {
      return res.status(401).json({ message: "Invalid message data" });
    }

    const message = await Message.create({
      from_id: req.userId,
      to_id,
      text,
    });

    return res.status(200).json({ message: "Message sent", id: message.id });
  }

  async getMessageList(req, res) {
    const { correspondent_id } = req.query;

    if (!validateId(correspondent_id)) {
      return res.status(401).send({ message: "invalid correspondent id" });
    }

    const messageList = await Message.findAll({
      where: {
        [Op.or]: [
          { from_id: req.userId, to_id: correspondent_id },
          { from_id: correspondent_id, to_id: req.userId },
        ],
      },
    });

    if (!messageList || !messageList.length) {
      return res.status(204).send({ message: "no messages found" });
    }

    return res.status(200).json(messageList);
  }
}

module.exports = new MessageController();
