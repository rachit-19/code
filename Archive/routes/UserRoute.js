// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/UserController");
const authenticateToken = require("../middleware/authenticate");

router.post("/login", userController.loginUser);
router.post("/", authenticateToken, userController.createUser);
router.get("/", authenticateToken, userController.getAllUsers);
router.get("/:id", authenticateToken, userController.getUserById);
router.put("/:id", authenticateToken, userController.updateUser);
router.delete("/:id", authenticateToken, userController.deleteUser);

module.exports = router;
