// Multer é um midleware para upload de arquivos
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");


module.exports = {
    // configura pasta de destino do arquivo 
  dest: path.resolve(__dirname, "..", "..","react","src", "images"),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, "..", "..","react","src", "images"));
    },
    // configura nome do arquivos
    filename: (req, file, cb) => {
      
        

        file.key = `${file.originalname}`;

        cb(null, file.key);
      
    }
  }),
  // limite de tamcanho do arquivo
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  // define formatos suportados 
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];
    // confirma
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type."));
    }
  }
};