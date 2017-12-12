// const {SHA256} = require('crypto-js');

// let message = "Hey there";

// let hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hashed: ${hash}`);

const bcrypt = require('bcryptjs');

let myPass = "pass123";

// bcrypt.genSalt(11, (err, salt) => {
//     bcrypt.hash(myPass, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

let hashed = '$2a$11$w/jISogtRzn929K9IriqVef4ZNEcNaiwloOkshfEK0cqGgP3U65x.';

bcrypt.compare('fasfa', hashed, (err, result) =>{
    console.log(result);
} )

