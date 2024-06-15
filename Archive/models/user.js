const db = require("../db/connection");

class User {
  static createUser(user) {
    return new Promise((resolve, reject) => {
      const { name, email, password, age, mobile, role, address } = user;
      const query =
        "INSERT INTO users (name, email, password, age, mobile, role, address) VALUES (?, ?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [name, email, password, age, mobile, role, address],
        (err, result) => {
          if (err) {
            const errorResponse = {
              status: 500,
              message: "Failed to create user.",
              error: err.message, // or customize as needed
            };
            reject(errorResponse);
            return;
          }
          const successResponse = {
            status: 201,
            message: "User created successfully.",
            data: result,
          };
          resolve(successResponse);
        }
      );
    });
  }

  static getAllUsers() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users";
      db.query(query, (err, rows) => {
        if (err) {
          const errorResponse = {
            status: 500,
            message: "Failed to fetch users.",
            error: err.message, // or customize as needed
          };
          reject(errorResponse);
          return;
        }
        const successResponse = {
          status: 200,
          message: "Users fetched successfully.",
          data: rows,
        };
        resolve(successResponse);
      });
    });
  }

  static getUserById(userId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE id = ?";
      db.query(query, [userId], (err, rows) => {
        if (err) {
          const errorResponse = {
            status: 500,
            message: "Failed to fetch user.",
            error: err.message, // or customize as needed
          };
          reject(errorResponse);
          return;
        }
        if (rows.length === 0) {
          const notFoundResponse = {
            status: 404,
            message: "User not found.",
          };
          resolve(notFoundResponse);
          return;
        }
        const successResponse = {
          status: 200,
          message: "User fetched successfully.",
          data: rows[0],
        };
        resolve(successResponse);
      });
    });
  }

  static updateUser(userId, userData) {
    return new Promise((resolve, reject) => {
      const { name, age, mobile, role, address } = userData;
      const query =
        "UPDATE users SET name = ?, age = ?, mobile = ?, role = ?, address = ? WHERE id = ?";
      db.query(
        query,
        [name, age, mobile, role, address, userId],
        (err, result) => {
          if (err) {
            const errorResponse = {
              status: 500,
              message: "Failed to update user.",
              error: err.message, // or customize as needed
            };
            reject(errorResponse);
            return;
          }
          const successResponse = {
            status: 200,
            message: "User updated successfully.",
            data: result,
          };
          resolve(successResponse);
        }
      );
    });
  }

  static deleteUser(userId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM users WHERE id = ?";
      db.query(query, [userId], (err, result) => {
        if (err) {
          const errorResponse = {
            status: 500,
            message: "Failed to delete user.",
            error: err.message, // or customize as needed
          };
          reject(errorResponse);
          return;
        }
        const successResponse = {
          status: 200,
          message: "User deleted successfully.",
          data: result,
        };
        resolve(successResponse);
      });
    });
  }
}

module.exports = User;
