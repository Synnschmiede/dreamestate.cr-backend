import multer from "multer";

const storage = multer.memoryStorage();

const multipleUpload = multer({ storage });

const singleUpload = multer({ storage });

export const fileUploader = {
  singleUpload,
  multipleUpload,
};
