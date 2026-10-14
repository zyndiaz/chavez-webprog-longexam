import multer from "multer";
const storage = multer.memoryStorage();

const fileFilter = (_req, file, callback) => {
  if (["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.mimetype)) callback(null, true);
  else callback(new Error("Only JPG, PNG, WEBP, and GIF image files are allowed."));
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 4 * 1024 * 1024 } });
