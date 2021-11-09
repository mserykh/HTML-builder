const fs =  require('fs/promises');
const path = require('path');

const dirNameNew = 'files-copy';
const dirPathNew = path.join(__dirname, dirNameNew);

const dirNameOriginal = 'files';
const dirPathOriginal = path.join(__dirname, dirNameOriginal);

async function copyDir(src, dest) {
  await fs.rm(dest, { force: true, recursive: true });
  
  const filesOriginal = await fs.readdir(src, { withFileTypes: true });

  for (let file of filesOriginal) {
    const fileSource = path.join(src, file.name);
    const fileDestination = path.join(dest, file.name);
    if (file.isFile()) {
      await fs.mkdir(dest, { recursive: true });
      await fs.copyFile(fileSource, fileDestination);
    } else {
      await copyDir(fileSource, fileDestination);
    }
  }
}

copyDir(dirPathOriginal, dirPathNew);
