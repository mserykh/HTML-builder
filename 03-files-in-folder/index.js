const fs =  require('fs/promises');
const path = require('path');
const chalk = require('chalk');

const secretFolderPath = path.join(__dirname, 'secret-folder');

async function readDirectory() {
  try {
    const files = await fs.readdir(secretFolderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const fileName = file.name.trim();
        const fileNameToLog = fileName.split('.')[0];
        const filePath = path.join(secretFolderPath, fileName);
        const fileExt = path.extname(filePath);
        const stats = await fs.stat(filePath);
        const fileSize = stats.size;
        
        console.log(chalk.hex('#B07FFC')(`${fileNameToLog} - ${fileExt.slice(1)} - ${fileSize/1024}kb`));
      }
    }
  }
  catch(err) {
    console.log(err);
  }
}

readDirectory();
