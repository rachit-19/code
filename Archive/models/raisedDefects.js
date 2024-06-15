const db = require("../db/connection");

class RaisedDefects {
  static createRaisedDefect(raisedDefect) {
    return new Promise((resolve, reject) => {
      const { engineSerialNumber, defect, actionTaken } = raisedDefect;
      const defectsString = defect.map((def) => def.label).join(", ");
      const actionString = actionTaken.map((action) => action.label).join(", ");
      const query =
        "INSERT INTO raised_defects (engine_serial_no, defects, actions) VALUES (?, ?, ?)";

      db.query(
        query,
        [engineSerialNumber, defectsString, actionString],
        (err, result) => {
          if (err) {
            reject({
              status: 500,
              message: "Error creating raised defect",
              error: err.message,
            });
            return;
          }
          resolve({
            status: 201,
            message: "Raised defect created successfully",
            error: null,
            data: result,
          });
        }
      );
    });
  }

  static getAllRaisedDefects() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM raised_defects";
      db.query(query, (err, rows) => {
        if (err) {
          reject({
            status: 500,
            message: "Error fetching raised defects",
            error: err.message,
          });
          return;
        }
        resolve({
          status: 200,
          message: "Raised defects fetched successfully",
          error: null,
          data: rows,
        });
      });
    });
  }

  static getRaisedDefectById(raisedDefectId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM raised_defects WHERE id = ?";
      db.query(query, [raisedDefectId], (err, rows) => {
        if (err) {
          reject({
            status: 500,
            message: "Error fetching raised defect by ID",
            error: err.message,
          });
          return;
        }
        if (rows.length === 0) {
          resolve({
            status: 404,
            message: "Raised defect not found",
            error: null,
            data: null,
          });
          return;
        }
        resolve({
          status: 200,
          message: "Raised defect fetched successfully",
          error: null,
          data: rows[0],
        });
      });
    });
  }

  static updateRaisedDefect(raisedDefectId, raisedDefectData) {
    return new Promise((resolve, reject) => {
      const { engineSerialNumber, defects, actionTaken } = raisedDefectData;
      const defectsString = defects.map((def) => def.label).join(", ");
      const actionString = actionTaken.map((action) => action.label).join(", ");
      const query =
        "UPDATE raised_defects SET engine_serial_no = ?, defects = ?, actions = ? WHERE id = ?";

      db.query(
        query,
        [engineSerialNumber, defectsString, actionString, raisedDefectId],
        (err, result) => {
          if (err) {
            reject({
              status: 500,
              message: "Error updating raised defect",
              error: err.message,
            });
            return;
          }
          resolve({
            status: 200,
            message: "Raised defect updated successfully",
            error: null,
            data: result,
          });
        }
      );
    });
  }

  static deleteRaisedDefect(raisedDefectId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM raised_defects WHERE id = ?";
      db.query(query, [raisedDefectId], (err, result) => {
        if (err) {
          reject({
            status: 500,
            message: "Error deleting raised defect",
            error: err.message,
          });
          return;
        }
        resolve({
          status: 200,
          message: "Raised defect deleted successfully",
          error: null,
          data: result,
        });
      });
    });
  }
}

module.exports = RaisedDefects;
