const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost/ToDoApp', (err, db) => {
    
    if(err) return console.log('Could not connect to the Database.', err);

    console.log('Conneted successfuly to the db.');

    // db
    //   .collection("ToDos")
    //   .findOneAndUpdate(
    //         { 
    //           _id: new ObjectId("5a2bddf99e5bf17b8e8708ab")
    //         },
    //         {
    //             $set: { complete: true}
    //         },
    //         {
    //             returnOriginal: false
    //         }
    //     )
    //   .then(data => console.log(data));

    db
      .collection("Users")
      .updateOne(
           { location: "New Delhi" },
           { $inc: { age: 1 } })
      .then(data => console.log(data));

});