import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import { BadRequestException } from "@nestjs/common";

export const imageFileInterceptor = (fieldName = "image") =>
  FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: "./uploads/communiques",
      filename: (req, file, callback) => {
        // Corrige caracteres especiais
        const originalName = Buffer.from(file.originalname.trim(), "latin1").toString("utf8");
        const nameWithoutExt = originalName.replace(extname(originalName), "");

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extension = extname(originalName);

        callback(null, `${uniqueSuffix}${extension}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

      if (allowedMimeTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        callback(
          new BadRequestException(
            "Somente imagens PNG, JPG, JPEG ou WEBP são permitidas!"
          ),
          false
        );
      }
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });
