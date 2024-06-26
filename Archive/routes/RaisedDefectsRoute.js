// routes/defectRaiseRoutes.js
const express = require("express");
const router = express.Router();
const raisedDefectsController = require("../controller/RaisedDefectsController");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, raisedDefectsController.createRaisedDefect);
router.post(
  "/bulk_raise_defects",
  authenticateToken,
  raisedDefectsController.createBulkRaisedDefect
);
router.get(
  "/defectsReport",
  authenticateToken,
  raisedDefectsController.defectsReport
);
router.get("/", authenticateToken, raisedDefectsController.getAllRaisedDefects);
router.get("/:id", authenticateToken, raisedDefectsController.getRaisedDefectById);
router.put("/:id", authenticateToken, raisedDefectsController.updateRaisedDefect);
router.delete("/:id", authenticateToken, raisedDefectsController.deleteRaisedDefect);



module.exports = router;
