const fs = require('fs');
const { EOL } = require('os');
const path = require('path');
const { stdout } = require('process');
const process = require('process');
const readline = require('readline');

const filePath = path.join(__dirname, 'text.txt');
const rl = readline.createInterface(process.stdin, process.stdout);
const myFile = fs.createWriteStream(filePath);

stdout.write('Hi! Please type a text you want to have in a file: \n');

rl.on('line', (userInput) => {
  if(userInput.toString() ==='exit') {
    rl.close();
    return;
  }

  myFile.write(`${userInput}${EOL}`);
  rl.prompt();
});

rl.on('SIGINT', () => {
  rl.close();
});

rl.on('close', () => {
  stdout.write('\nTyping is canceled. The entered text is saved to the file. Bye!');
});
