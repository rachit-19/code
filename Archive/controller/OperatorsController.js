const Operator = require("../models/operators");

exports.createOperator = async (req, res) => {
  try {
    await Operator.createOperator(req.body);
    res.status(201).send("Operator created successfully");
  } catch (err) {
    console.error("Error creating operator:", err);
    res.status(500).send("Error creating operator");
  }
};

exports.createBulkOperators = async (req, res) => {
  try {
    await Operator.createBulkOperators(req.body);
    res.status(201).send("Bulk Operators created successfully");
  } catch (err) {
    console.error("Error creating bulk operators:", err);
    res.status(500).send("Error creating bulk operators");
  }
};

exports.getAllOperators = async (req, res) => {
  try {
    const operators = await Operator.getAllOperators();
    res.json(operators);
  } catch (err) {
    console.error("Error getting operators:", err);
    res.status(500).send("Error getting operators");
  }
};

exports.getOperatorById = async (req, res) => {
  try {
    const operatorId = req.params.id;
    const operator = await Operator.getOperatorById(operatorId);
    if (!operator) {
      res.status(404).send("Operator not found");
      return;
    }
    res.json(operator);
  } catch (err) {
    console.error("Error getting operator:", err);
    res.status(500).send("Error getting operator");
  }
};

exports.updateOperator = async (req, res) => {
  try {
    const operatorId = req.params.id;
    await Operator.updateOperator(operatorId, req.body);
    res.send("Operator updated successfully");
  } catch (err) {
    console.error("Error updating operator:", err);
    res.status(500).send("Error updating operator");
  }
};

exports.deleteOperator = async (req, res) => {
  try {
    const operatorId = req.params.id;
    await Operator.deleteOperator(operatorId);
    res.status(200).send("Operator deleted successfully");
  } catch (err) {
    console.error("Error deleting operator:", err);
    res.status(500).send("Error deleting operator");
  }
};
