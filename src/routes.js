const routes = require("express").Router();

const authMiddleware = require("./app/middlewares/auth");

const AuthController = require("./app/controllers/AuthController");
const RegisterController = require("./app/controllers/RegisterController");
const UserController = require("./app/controllers/UserController");
const MessageController = require("./app/controllers/MessageController");

// Public routes
routes.post("/auth", AuthController.signIn);
routes.post("/register", RegisterController.register);

routes.use(authMiddleware);

// Private routes
routes.get("/user-list", UserController.getUserList);
routes.post("/send-message", MessageController.sendMessage);
routes.get("/message-list", MessageController.getMessageList);

module.exports = routes;
