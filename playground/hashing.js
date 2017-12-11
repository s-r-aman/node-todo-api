const {SHA256} = require('crypto-js');

let message = "Hey there";

let hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hashed: ${hash}`);

