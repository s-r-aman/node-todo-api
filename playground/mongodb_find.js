const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if(err){
        return console.log('Could not submit the data: ', err);
    }

    console.log('Successfully connected to the database.');

    // db
    //   .collection("ToDos")
    //   .find({ _id: new ObjectID('5a2bcde69e5bf17b8e870424')})
    //   .toArray()
    //   .then(data => {
    //     console.log("To Do's: \n", JSON.stringify(data, undefined, 2));
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });

    db
      .collection("Users")
      .find({name: "Aman"})
      .toArray()
      .then(data => {
        console.log("User: \n", JSON.stringify(data, undefined,2));
      })
      .catch(err => {
        console.log(err);
      });
});
