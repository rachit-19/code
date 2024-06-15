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
