const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const requireAuth = require("../middleware/requireAuth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const supabase = require("../config/supabase");
const standardizeFilePath = require("../middleware/standardizeFilePath");

router.get("/", requireAuth, dashboardController.renderDashboard);

router.post(
  "/upload-file",
  upload.single("uploadedFile"),
  standardizeFilePath,
  async function uploadFile(req, res) {
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(req.filePath, req.file);
    if (error) {
      console.error(error);
    } else {
      req.file.filePath = data.path;
      dashboardController.addFile(req, res);
    }
  },
);

router.post(
  "/upload-file/folder/:id",
  upload.single("uploadedFile"),
  standardizeFilePath,
  async function uploadFile(req, res) {
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(req.filePath, req.file);
    if (error) {
      console.error(error);
    } else {
      req.file.filePath = data.path;
      dashboardController.addFileToFolder(req, res);
    }
  },
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
