// routes/defectRoutes.js
const express = require("express");
const router = express.Router();
const actionController = require("../controller/ActionsController");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, actionController.createAction);
router.post(
  "/bulk_actions",
  authenticateToken,
  actionController.createBulkActions
);
router.get("/", authenticateToken, actionController.getAllActions);
router.get("/:id", authenticateToken, actionController.getActionById);
router.put("/:id", authenticateToken, actionController.updateAction);
router.delete("/:id", authenticateToken, actionController.deleteAction);

module.exports = router;
