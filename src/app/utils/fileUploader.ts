import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import config from "../config";
import { TCloudinaryResponse } from "../interfaces/file";

cloudinary.config({
  cloud_name: config.cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

const storage = multer.memoryStorage();

const multipleUpload = multer({ storage });

const singleUpload = multer({ storage });

export const fileUploader = {
  singleUpload,
  multipleUpload,
};
