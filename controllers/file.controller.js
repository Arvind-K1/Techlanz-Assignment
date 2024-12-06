import File from "../models/file.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import cloudinary from "cloudinary";



import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import { AppError } from "../utils/appError.js";


const uploadFile = asyncHandler(async (req, res, next) => {
  const { originalname, size, mimetype } = req.files?.avatar[0];

//   console.table(originalname, size, mimetype )

const avatarLocalPath = req.files?.avatar[0]?.path;
console.log(avatarLocalPath);



if (!avatarLocalPath){
    return next(new AppError("File is required",400))
}


const avatar = await uploadOnCloudinary(avatarLocalPath);
console.log(avatar)

if(!avatar){
    return next(new AppError("Failed to upload file",500))
}


  // Save metadata to the database
  const file = await File.create({
    filename: originalname,
    size,
    mimetype,
    avatar: avatar.url,
    cloudinaryId: avatar.public_id, // Cloudinary ID for deletion
    uploadTimestamp: new Date(),
    uploader: req.user._id, // User ID of the uploader
  });

  if (!file) {
    return next(new AppError("File upload failed", 400));
  }


  res.status(201).json({
    success: true,
    message: "file uploaded successfully",
    data: file,
  });
});

const downloadFile = asyncHandler(async (req, res, next) => {
  const { id, filename } = req.params;

  // Find file by ID or filename
  const file = id ? await File.findById(id) : await File.findOne({ filename });

  if (!file) {
    return next(new AppError("File not uploaded", 400));
  }

//   if (file.localPath && fs.existsSync(file.localPath)) {
//     // If file is stored locally
//     const localFilePath = path.resolve(file.localPath);
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename="${file.filename}"`
//     );
//     res.setHeader("Content-Type", file.mimetype);
//     return res.download(localFilePath);
//   }

  if (file.avatar) {
    // If file is stored on Cloudinary
    return res.redirect(file.avatar); // Redirect to Cloudinary URL for download
  }

  res.status(404).json({
    message: "file source not found",
  });
});

const deleteFile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  // Find file by ID
  const file = await File.findById(id);

  if (!file) {
    return next(new AppError("File not found", 404));
  }

//   // Delete from local storage
//   if (file.localPath && fs.existsSync(file.localPath)) {
//     fs.unlinkSync(file.localPath);
//   }

  // Delete from Cloudinary
  if (file.cloudinaryId) {
    await cloudinary.uploader.destroy(file.cloudinaryId);
  }

  // Delete metadata from the database
  await file.remove();

  res.status(200).json({
    message: "file deleted successfully",
  });
});

export { uploadFile, downloadFile, deleteFile };
