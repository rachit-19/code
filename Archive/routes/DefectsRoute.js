// routes/defectRoutes.js
const express = require("express");
const router = express.Router();
const defectController = require("../controller/DefectsController");
const authenticateToken = require("../middleware/authenticate");

router.post("/", authenticateToken, defectController.createDefect);
router.post("/bulk_defects", authenticateToken, defectController.createBulkDefect);
router.get("/", authenticateToken, defectController.getAllDefects);
router.get("/:id", authenticateToken, defectController.getDefectById);
router.put("/:id", authenticateToken, defectController.updateDefect);
router.delete("/:id", authenticateToken, defectController.deleteDefect);

module.exports = router;
