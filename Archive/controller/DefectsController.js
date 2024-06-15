const Defect = require("../models/defects");
// const { notifyClients } = require("../app");




exports.createDefect = async (req, res) => {
  // console.log("Notifying clients:");
  // clients.forEach((client) => {
  //   if (client.readyState === WebSocket.OPEN) {
  //     client.send(JSON.stringify(req.body));
  //   }
  // });
  // notifyClients(req.body);
  try {
    await Defect.createDefect(req.body);
    res.status(201).send("Defect created successfully");
  } catch (err) {
    console.error("Error creating defect:", err);
    res.status(500).send("Error creating defect");
  }
};

exports.createBulkDefect = async (req, res) => {
  try {
    await Defect.createBulkDefects(req.body);
    res.status(201).send("Bulk Defect created successfully");
    // Optionally notify clients about the bulk upload
    req.body.forEach((defect) => notifyClients(defect));
  } catch (err) {
    console.error("Error creating bulk defect:", err);
    res.status(500).send("Error creating bulk defect");
  }
};

exports.getAllDefects = async (req, res) => {
  try {
    const defects = await Defect.getAllDefects();
    res.json(defects);
  } catch (err) {
    console.error("Error getting defects:", err);
    res.status(500).send("Error getting defects");
  }
};

exports.getDefectById = async (req, res) => {
  try {
    const defectId = req.params.id;
    const defect = await Defect.getDefectById(defectId);
    if (!defect) {
      res.status(404).send("Defect not found");
      return;
    }
    res.json(defect);
  } catch (err) {
    console.error("Error getting defect:", err);
    res.status(500).send("Error getting defect");
  }
};

exports.updateDefect = async (req, res) => {
  try {
    const defectId = req.params.id;
    await Defect.updateDefect(defectId, req.body);
    res.send("Defect updated successfully");
    notifyClients(req.body);
  } catch (err) {
    console.error("Error updating defect:", err);
    res.status(500).send("Error updating defect");
  }
};

exports.deleteDefect = async (req, res) => {
  try {
    const defectId = req.params.id;
    await Defect.deleteDefect(defectId);
    res.status(200).send("Defect deleted successfully");
    notifyClients({ id: defectId, deleted: true });
  } catch (err) {
    console.error("Error deleting defect:", err);
    res.status(500).send("Error deleting defect");
  }
};
