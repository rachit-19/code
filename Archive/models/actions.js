const db = require("../db/connection");

class Actions {
  static createAction(action) {
    return new Promise((resolve, reject) => {
      const { action_name } = action;
      const query = "INSERT INTO actions (action_name) VALUES (?)";
      db.query(query, [action_name], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static createBulkActions(actions) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(actions) || actions.length === 0) {
        reject(new Error("Invalid input: expected an array of actions"));
        return;
      }

      const query = "INSERT INTO actions (action_name) VALUES ?";
      const values = actions.map((action) => [action.action_name]);

      db.query(query, [values], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static getAllActions() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM actions";
      db.query(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  static getActionById(actionId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM actions WHERE id = ?";
      db.query(query, [actionId], (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        if (rows.length === 0) {
          resolve(null);
          return;
        }
        resolve(rows[0]);
      });
    });
  }

  static updateAction(actionId, actionData) {
    return new Promise((resolve, reject) => {
      const { action_name } = actionData;
      const query = "UPDATE actions SET action_name = ? WHERE id = ?";
      db.query(query, [action_name, actionId], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static deleteAction(actionId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM actions WHERE id = ?";
      db.query(query, [actionId], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}

module.exports = Actions;
