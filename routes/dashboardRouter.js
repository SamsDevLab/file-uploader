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
  dashboardController.addFile,
);

router.post(
  "/upload-file/folder/:id",
  upload.single("uploadedFile"),
  dashboardController.addFileToFolder,
);

router.post("/create-folder", dashboardController.addNewFolder);

router.get("/folders/:id", dashboardController.renderFolder);
router.post("/folders/:id/rename", dashboardController.renameFolder);
router.post("/folders/:id/delete", dashboardController.deleteFolder);

router.get("/files/:id/view-details", dashboardController.viewFileDetails);
router.get("/files/:id/download", dashboardController.downloadFile);
router.post("/files/:id/rename", dashboardController.renameFile);
router.post("/files/:id/delete", dashboardController.deleteFile);

module.exports = router;
