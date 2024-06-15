const Action = require("../models/actions");

exports.createAction = async (req, res) => {
  try {
    await Action.createAction(req.body);
    res.status(201).send("Action created successfully");
  } catch (err) {
    console.error("Error creating action:", err);
    res.status(500).send("Error creating action");
  }
};

exports.createBulkActions = async (req, res) => {
  try {
    await Action.createBulkActions(req.body);
    res.status(201).send("Bulk actions created successfully");
  } catch (err) {
    console.error("Error creating bulk actions:", err);
    res.status(500).send("Error creating bulk actions");
  }
};

exports.getAllActions = async (req, res) => {
  try {
    const actions = await Action.getAllActions();
    res.json(actions);
  } catch (err) {
    console.error("Error getting actions:", err);
    res.status(500).send("Error getting actions");
  }
};

exports.getActionById = async (req, res) => {
  try {
    const actionId = req.params.id;
    const action = await Action.getActionById(actionId);
    if (!action) {
      res.status(404).send("Action not found");
      return;
    }
    res.json(action);
  } catch (err) {
    console.error("Error getting action:", err);
    res.status(500).send("Error getting action");
  }
};

exports.updateAction = async (req, res) => {
  try {
    const actionId = req.params.id;
    await Action.updateAction(actionId, req.body);
    res.send("Action updated successfully");
  } catch (err) {
    console.error("Error updating action:", err);
    res.status(500).send("Error updating action");
  }
};

exports.deleteAction = async (req, res) => {
  try {
    const actionId = req.params.id;
    await Action.deleteAction(actionId);
    res.status(200).send("Action deleted successfully");
  } catch (err) {
    console.error("Error deleting action:", err);
    res.status(500).send("Error deleting action");
  }
};
