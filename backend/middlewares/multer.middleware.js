import multer from "multer";
import { v4 as uuidv4 } from "uuid"; 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    // Add uuid to filename to make it unique
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const ext = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${ext}`);
  },
});

export const upload = multer({ storage });
