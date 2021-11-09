const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const dirWithStyles = path.join(__dirname, 'styles');
const bundleFileDir = 'project-dist';
const bundleFileName = 'bundle.css';

async function createCssBundle() {
  const bundleFile = path.join(__dirname, bundleFileDir, bundleFileName);
  const ws = fs.createWriteStream(bundleFile, 'utf-8');
  
  const files = await readdir(dirWithStyles, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(dirWithStyles, file.name);

    if (file.isFile() && path.extname(filePath) === '.css') {
      const rs = fs.createReadStream(filePath, 'utf-8');
      rs.pipe(ws);
    }
  }
}

createCssBundle();
