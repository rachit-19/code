// routes/defectRoutes.js
const express = require("express");
const router = express.Router();
const operatorController = require("../controller/OperatorsController");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, operatorController.createOperator);
router.post(
  "/bulk_operators",
  authenticateToken,
  operatorController.createBulkOperators
);
router.get("/", authenticateToken, operatorController.getAllOperators);
router.get("/:id", authenticateToken, operatorController.getOperatorById);
router.put("/:id", authenticateToken, operatorController.updateOperator);
router.delete("/:id", authenticateToken, operatorController.deleteOperator);

module.exports = router;
