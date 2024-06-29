const express = require("express");
const multer = require("multer");
const XLSX = require("xlsx");
const { sequelize, Data } = require("./models/model");
const path = require("path");
const userRoutes = require("./routes/UserRoute");
const defectRoutes = require("./routes/DefectsRoute");
const operatorsRoutes = require("./routes/OperatorsRoute");
const actionsRoutes = require("./routes/ActionsRoute");
const raisedDefect = require("./routes/RaisedDefectsRoute");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const moment = require("moment");
const db = require("./db/connection");
// const WebSocket = require("ws");

const app = express();
const PORT = 4000;
const upload = multer({ dest: "uploads/" });
const server = http.createServer(app);
// const wss = new WebSocket.Server({ server });

// let clients = [];

// wss.on("connection", (ws) => {
//   clients.push(ws);
//   console.log("New client connected");
//   ws.on("close", () => {
//     clients = clients.filter((client) => client !== ws);
//     console.log("Client disconnected");
//   });
// });

// const notifyClients = (data) => {
//   console.log("Notifying clients:", clients, data);
//   clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(data));
//     }
//   });
// };

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use("/users", userRoutes);
app.use("/defects", defectRoutes);
app.use("/operators", operatorsRoutes);
app.use("/actions", actionsRoutes);
app.use("/raise_defects", raisedDefect);

// app.get("/api/zone-records", async (req, res) => {
//   try {
//     const currentDate = moment().format("YYYY-MM-DD");
//     const query = `
//       SELECT *
//       FROM zone
//       WHERE DATE(updated_at) = ?
//     `;

//     db.query(query, [currentDate], (err, rows) => {
//       if (err) {
//         return res.status(500).json({
//           status: 500,
//           message: "Error fetching zone records for current day",
//           error: err.message,
//         });
//       }

//       res.status(200).json({
//         status: 200,
//         message: "Zone records fetched successfully for current day",
//         error: null,
//         data: rows,
//       });
//     });
//   } catch (error) {
//     res.status(500).json({
//       status: 500,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// });

app.get("/api/zone-records", async (req, res) => {
  try {
    const currentDate = moment().format("YYYY-MM-DD");
    const query = `
      SELECT *
      FROM zone
      WHERE DATE(updated_at) = ? ORDER BY updated_at DESC
    `;

    db.query(query, [currentDate], async (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: 500,
          message: "Error fetching zone records for current day",
          error: err.message,
        });
      }

      // Fetch additional data (defects and operators) for each zone record
      const dataPromises = rows.map(async (row) => {
        const { defect_name, station_id } = row;

        // Fetch defect information
        const defectQuery = "SELECT * FROM defects WHERE defect_name = ?";
        const defect = await new Promise((resolve, reject) => {
          db.query(defectQuery, [defect_name], (err, defectResult) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(defectResult[0]);
          });
        });

        // Fetch operator information
        const operatorQuery = "SELECT * FROM operators WHERE station_id = ?";
        const operator = await new Promise((resolve, reject) => {
          db.query(operatorQuery, [station_id], (err, operatorResult) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(operatorResult[0]);
          });
        });

        return {
          ...row,
          defects: defect ? [defect] : [], // Format defects as array
          operators: operator ? [operator] : [], // Format operators as array
        };
      });

      // Execute all promises to fetch additional data
      const formattedData = await Promise.all(dataPromises);

      res.status(200).json({
        status: 200,
        message: "Zone records fetched successfully for current day",
        error: null,
        data: formattedData,
      });
    });
  } catch (error) {
    console.error("Error fetching zone records:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
});

async function uploadData(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  try {
    await sequelize.sync();
    for (const row of data) {
      await Data.create(row);
    }
    console.log("Data uploaded successfully!");
  } catch (error) {
    console.error("Error uploading data:", error);
  }
}

app.get("/upload", (req, res) => {
  const filePath = path.join(__dirname, "data.xlsx");
  uploadData(filePath)
    .then(() => res.send("File parsed and data inserted successfully"))
    .catch((err) => res.status(500).send("Error uploading data: " + err));
});

app.get("/fetch-data", async (req, res) => {
  try {
    const data = await Data.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).send("Error fetching data: " + error);
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// module.exports = { notifyClients };
