const {MongoClient, ObjectId} = require('mongodb');

let id1 = new ObjectId();
let id2 = new ObjectId();

console.log(id1);
console.log(id2);

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if(err){
        console.log('Unable to connect to MongoDB.', err);
        return;
    }

    console.log('Connected to MongoDb Server');

    // db.collection('ToDos').insertOne({
    //     text: "Something to do",
    //     completed: false
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Could not submit data. ', err);
    //     }
    //     console.log('Successfully submitted data: \n', JSON.stringify(result.ops));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Aman',
    //     age: 19,
    //     location: 'New Delhi'
    // }, (err, result) => {
    //     if(err){
    //         return console.log('Could not submit the data: ', err);
    //     }

    //     console.log('Submitted the data successfully : \n', JSON.stringify(result.ops[0]._id.getTimestamp()));

    // });

    db.close();
});