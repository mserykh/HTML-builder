const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const projectDist = 'project-dist';
const projectDistPath = path.join(__dirname, projectDist);

const template = 'template.html';

const styles = 'styles';
const assets = 'assets';
const components = 'components';

const templatePath = path.join(__dirname, template);
const stylesSourcePath = path.join(__dirname, styles);
const assetsSourcePath = path.join(__dirname, assets);
const componentsSourcePath = path.join(__dirname, components);

const style = 'style.css';
const index = 'index.html';

const assetsDestPath = path.join(projectDistPath, assets);
const stylePath = path.join(projectDistPath, style);
const indexPath = path.join(projectDistPath, index);

async function buildHtml() {
  let templateContent = await fsPromises.readFile(templatePath, {encoding: 'utf-8'});
 
  const files = await fsPromises.readdir(componentsSourcePath, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(componentsSourcePath, file.name);
    if (file.isFile() && path.extname(filePath) === '.html') {
      const fileContent = await fsPromises.readFile(filePath, {encoding: 'utf-8'});
      const component = file.name.replace('.html', '')
      templateContent = templateContent.replace(`{{${component}}}`, fileContent);
    }
  }
  await fsPromises.writeFile(indexPath, templateContent);
}

async function mergeStyles() {
  const ws = fs.createWriteStream(stylePath, 'utf-8');
  
  const files = await fsPromises.readdir(stylesSourcePath, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(stylesSourcePath, file.name);

    if (file.isFile() && path.extname(filePath) === '.css') {
      const rs = fs.createReadStream(filePath, 'utf-8');
      rs.pipe(ws);
    }
  }
}

async function copyAssets(src, dest) {
  await fsPromises.rm(dest, { force: true, recursive: true });

  const filesOriginal = await fsPromises.readdir(src, { withFileTypes: true });

  for (let file of filesOriginal) {
    const fileSource = path.join(src, file.name);
    const fileDestination = path.join(dest, file.name);
    await fsPromises.mkdir(dest, { recursive: true });
    if (file.isFile()) {
      await fsPromises.copyFile(fileSource, fileDestination);
    } else {
      await copyAssets(fileSource, fileDestination);
    }
  }
}

async function buildProject() {
  await fsPromises.mkdir(projectDistPath, { recursive: true });
  await buildHtml();
  await mergeStyles();
  await copyAssets(assetsSourcePath, assetsDestPath);
}

buildProject();
