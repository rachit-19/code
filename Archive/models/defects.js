const db = require("../db/connection");

class Defect {
  static createDefect(defect) {
    return new Promise((resolve, reject) => {
      const { defect_name, station_id, screen_no } = defect;
      const query =
        "INSERT INTO defects (defect_name, station_id, screen_no) VALUES (?, ?, ?)";
      db.query(query, [defect_name, station_id, screen_no], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  // static createBulkDefects(defects) {
  //   return new Promise((resolve, reject) => {
  //     if (!Array.isArray(defects) || defects.length === 0) {
  //       reject(new Error("Invalid input: expected an array of defects"));
  //       return;
  //     }

  //     const query =
  //       "INSERT INTO defects (defect_name, station_id, screen_no) VALUES ?";
  //     const values = defects.map((defect) => [
  //       defect.defect_name,
  //       defect.station_id,
  //       defect.screen_no,
  //     ]);

  //     db.query(query, [values], (err, result) => {
  //       if (err) {
  //         reject(err);
  //         return;
  //       }
  //       resolve(result);
  //     });
  //   });
  // }

  static async createBulkDefects(defects) {
    return new Promise((resolve, reject) => {
      if (!Array.isArray(defects) || defects.length === 0) {
        reject(new Error("Invalid input: expected an array of defects"));
        return;
      }

      // First, delete all existing defects
      const deleteQuery = "DELETE FROM defects";
      db.query(deleteQuery, (deleteErr, deleteResult) => {
        if (deleteErr) {
          reject(deleteErr);
          return;
        }

        // Proceed with inserting new defects
        const insertQuery =
          "INSERT INTO defects (defect_name, station_id, screen_no) VALUES ?";
        const values = defects.map((defect) => [
          defect.defect_name,
          defect.station_id,
          defect.screen_no,
        ]);

        db.query(insertQuery, [values], (insertErr, insertResult) => {
          if (insertErr) {
            reject(insertErr);
            return;
          }
          resolve(insertResult);
        });
      });
    });
  }

  static getAllDefects() {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM defects";
      db.query(query, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(rows);
      });
    });
  }

  static getDefectById(defectId) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM defects WHERE id = ?";
      db.query(query, [defectId], (err, rows) => {
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

  static updateDefect(defectId, defectData) {
    return new Promise((resolve, reject) => {
      const { number, name } = defectData;
      const query = "UPDATE defects SET number = ?, name = ? WHERE id = ?";
      db.query(query, [number, name, defectId], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  static deleteDefect(defectId) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM defects WHERE id = ?";
      db.query(query, [defectId], (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}

module.exports = Defect;
