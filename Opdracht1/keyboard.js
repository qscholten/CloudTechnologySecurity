const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//6.
/*
rl.on('line', (input) => {
  console.log(`Received: ${input}`);
});
*/
//7.
/*
function receive(input) {
  console.log(`Received: ${input}`);
}
rl.on('line', receive);
*/
//8
/*
function receive(input) {
  console.log(`Jouw naam is: ${input}`);
}
rl.question('Wat is jouw naam?\n', receive)
function reminder() {
  console.log('Let op! De vraag is nog niet beantwoord.');
}
const mytimeout = setTimeout(function(){reminder()}, 1);
*/
//9
/*
function receive(input) {
  console.log(`Jouw naam is: ${input}`);
  rl.question('Wat is jouw achternaam?\n', receive)
}
rl.question('Wat is jouw naam?\n', receive)
function reminder() {
  console.log('Let op! De vraag is nog niet beantwoord.');
}
const mytimeout = setTimeout(function(){reminder()}, 1);
*/
//10
/*
function receive(input) {
  console.log(`Received: ${input}`);
}
rl.on('line', receive);
rl.on('line', receive);
*/
//11
function receive(input) {
  console.log(`Received: ${input}`);
  if (input == 'quit') {
    rl.close();
  }
}
rl.on('line', receive);