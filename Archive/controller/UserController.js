// controllers/userController.js
const User = require("../models/user");
const Auth = require("../models/auth");

exports.loginUser = async (req, res) => {
  try {
    const token = await Auth.loginUser(req.body);
    res.json(token);
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(401).send(err.message);
  }
};


exports.createUser = async (req, res) => {
  try {
    await User.createUser(req.body);
    res.status(201).send("User created successfully");
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).send("Error creating user");
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error getting users:", err);
    res.status(500).send("Error getting users");
  }
};

exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getUserById(userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }
    res.json(user);
  } catch (err) {
    console.error("Error getting user:", err);
    res.status(500).send("Error getting user");
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.updateUser(userId, req.body);
    res.send("User updated successfully");
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).send("Error updating user");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await User.deleteUser(userId);
    // res.send("User deleted successfully");
    res.status(200).send("User deleted successfully");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Error deleting user");
  }
};
