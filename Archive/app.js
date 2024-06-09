const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const { sequelize, Data } = require('./models/model');
const path = require('path');


const app = express();
const PORT = 4000;
const upload = multer({ dest: 'uploads/' });


app.use(express.static('public/login'));

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
      console.log('Data uploaded successfully!');
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  }

  app.get("/", (req, res) => {
    if (true) {
      res.sendFile(path.join(__dirname, "public", "index.html"));
    } else {
      res.redirect("/login");
    }
  });

  app.get('/upload', (req, res) => {
    const filePath = path.join(__dirname, 'data.xlsx');
    uploadData(filePath)
      .then(() => res.send('File parsed and data inserted successfully'))
      .catch((err) => res.status(500).send('Error uploading data: ' + err));
  });

  app.get('/fetch-data', async (req, res) => {
    try {
      const data = await Data.findAll();
      res.json(data);
    } catch (error) {
      res.status(500).send('Error fetching data: ' + error);
    }
  });

// Start the HTTP server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
