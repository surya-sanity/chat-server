const userController = require("../controllers/userController.js");
const { protect, adminProtect } = require("../middlewares/authMiddleware");

const userRouter = require("express").Router();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.loginUser);
userRouter.get("/current", protect, userController.getCurrentUser);
userRouter.get("/all", protect, userController.getAllUsers);
userRouter.get("/chats/:id", protect, userController.getChatsByUserId);
userRouter.put("/update", protect, userController.updateUser);
userRouter.delete("/deleteAll", adminProtect, userController.deleteAllUsers);
userRouter.delete(
  "/deleteUser/:id",
  adminProtect,
  userController.deleteUserById
);

module.exports = userRouter;
