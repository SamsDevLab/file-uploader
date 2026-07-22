const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const requireAuth = require("../middleware/requireAuth");
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });

router.get("/", requireAuth, dashboardController.renderDashboard);

router.post(
  "/upload-file",
  upload.single("uploadedFile"),
  function (req, res, next) {
    console.log(req.file);
  },
);

router.post("/create-folder", dashboardController.addNewFolder);

router.get("/folders/:id", dashboardController.accessFolder);

module.exports = router;
