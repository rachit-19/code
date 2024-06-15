const db = require("../db/connection");

class Operator {
  static createOperator(operator) {
    return new Promise((resolve, reject) => {
      const { operator_name, station_id } = operator;
      const query =
        "INSERT INTO operators (operator_name, station_id) VALUES (?, ?)";
      db.query(query, [operator_name, station_id], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static createBulkOperators(operators) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(operators) || operators.length === 0) {
        reject(new Error("Invalid input: expected an array of operators"));
        return;
      }

      const query =
        "INSERT INTO operators (operator_name, station_id) VALUES ?";
      const values = operators.map((operator) => [
        operator.operator_name,
        operator.station_id,
      ]);

      db.query(query, [values], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static getAllOperators() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM operators";
      db.query(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  static getOperatorById(operatorId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM operators WHERE id = ?";
      db.query(query, [operatorId], (err, rows) => {
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

  static updateOperator(operatorId, operatorData) {
    return new Promise((resolve, reject) => {
      const { operator_name, station_id } = operatorData;
      const query =
        "UPDATE operators SET operator_name = ?, station_id = ? WHERE id = ?";
      db.query(
        query,
        [operator_name, station_id, operatorId],
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
  }

  static deleteOperator(operatorId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM operators WHERE id = ?";
      db.query(query, [operatorId], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}

module.exports = Operator;
