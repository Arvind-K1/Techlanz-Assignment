import multer from "multer";
import multerMimeTypesFilter from "@meanie/multer-mime-types-filter";

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 50 mb in size max. limit
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    multerMimeTypesFilter(allowedTypes);
    cb(null, true);
  },
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//       cb(null, './uploads')
//   },
//   filename: function (req, file, cb) {
//       cb(null,file.originalname)
//   }
// })

// const upload = multer({storage: storage})

export default upload;
