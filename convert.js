const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, 'assets');

fs.readdir(assetsDir, (err, files) => {
  if (err) throw err;

  files.forEach(file => {
    if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')) {
      const ext = path.extname(file);
      const baseName = path.basename(file, ext);
      const inputPath = path.join(assetsDir, file);
      const outputPath = path.join(assetsDir, `${baseName}.webp`);

      sharp(inputPath)
        .webp({ quality: 80 })
        .toFile(outputPath)
        .then(() => {
          console.log(`Converted ${file} to ${baseName}.webp`);
        })
        .catch(err => {
          console.error(`Error converting ${file}:`, err);
        });
    }
  });
});
