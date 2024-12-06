import express from 'express';
import upload from '../middlewares/upload.middleware.js';
import{isLoggedIn} from '../middlewares/auth.middleware.js';
import { uploadFile, downloadFile, deleteFile } from '../controllers/file.controller.js';

const router = express.Router();

// File Upload
router.route("/upload").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    uploadFile
)

// File Download
router.get('/download/:id', isLoggedIn, downloadFile); // By ID
router.get('/download-by-filename/:filename', isLoggedIn, downloadFile); // By filename

// File Delete
router.delete('/:id', isLoggedIn, deleteFile);

export default router;
