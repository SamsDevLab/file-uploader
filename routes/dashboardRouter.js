const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const requireAuth = require("../middleware/requireAuth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});
const supabase = require("../config/supabase");
const validateFileUpload = require("../middleware/validateFileUpload");
const standardizeFilePath = require("../middleware/standardizeFilePath");
const { StorageApiError } = require("@supabase/supabase-js");
const { StorageError } = require("@supabase/storage-js");

router.get("/", requireAuth, dashboardController.renderDashboard);

router.post(
  "/upload-file",
  upload.single("uploadedFile"),
  validateFileUpload,
  // standardizeFilePath,
  // async function uploadFile(req, res, next) {
  //   const { data, error } = await supabase.storage
  //     .from("uploads")
  //     .upload(req.file.filePath, req.file.buffer, {
  //       contentType: req.file.mimetype,
  //       upsert: false,
  //     });
  //   if (error) {
  //     // res.end();
  //     // const statusCode = Number(error.statusCode);
  //     // const errors = { statusCode: statusCode, errors: error.message };
  //     // req.file.error = errors;

  //     return res.status(400).json({ error: `${error.message}` });
  //   } else {
  //     await dashboardController.addFile(req, res);
  //   }
  //   // return res.redirect("/dashboard");
  // },
);

router.post(
  "/upload-file/folder/:id",
  upload.single("uploadedFile"),
  standardizeFilePath,
  async function uploadFile(req, res) {
    const { data, error } = await supabase.storage
      .from("uploads")
      .upload(req.file.filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });
    if (error) {
      // Needs to be addressed!
      console.error(error);
    } else {
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
