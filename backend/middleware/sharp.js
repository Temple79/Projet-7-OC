const sharp = require('sharp');
const fs = require('fs');

module.exports = (req, res, next) => {
  if (!req.file) {
    console.log("Aucune image !");
    return next();
  }
  sharp(req.file.path)
    .metadata()
    .then((metadata) => {
      if (metadata.width > 600) {
        return sharp(req.file.path).resize({ width: 600 }).toBuffer();
      } else {
        return sharp(req.file.path).toBuffer();
      }
    })
    .then((data) => {
      fs.writeFile(req.file.path, data, (err) => {
        if (err) {
          console.log(err);
          next(err);
        }
        next();
      });
    })
    .catch((err) => {
      next(err);
    });
};