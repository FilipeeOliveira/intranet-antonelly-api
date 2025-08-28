import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { BadRequestException } from "@nestjs/common";

export const pdfFileInterceptor = (fieldName = "document") =>
  FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: "./uploads/documents",
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype === "application/pdf") {
        callback(null, true);
      } else {
        callback(new BadRequestException("Somente arquivos PDF são permitidos!"), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 },
  });
