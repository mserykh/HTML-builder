const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);

const stream = fs.ReadStream(filePath, {encoding: 'utf-8'});

stream.on('readable', function() {
  const data = stream.read();
  if (data) {
    console.log(data);
  }
});

stream.on('end', function() {
});

stream.on('error', function(err) {
  if (err.code == 'ENOENT') {
    console.log(`File with the name "${fileName}" does not exist. Please check the file name.`);
  } 
  else {
    console.error(err);
  }
});