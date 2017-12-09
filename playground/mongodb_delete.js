const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    
    if(err) return console.log('Could not connect: \n', err);

    console.log('Connected successfully');

    // db
    // .collection('ToDos')
    // .findOneAndDelete({
    //     text: "prepare for exams"  
    // }).then(result => console.log(result))
    // .catch((err) => console.log(err));

    // db
    // .collection('Users')
    // .deleteOne({ name: 'Aman'})
    // .then(result => console.log(result.result))
    // .catch(err => console.log(err));

    db
      .collection("Users")
      .findOneAndDelete({ _id: new ObjectId("5a2bd72c9e5bf17b8e870797")})
      .then(result => console.log(result))
      .catch(err => console.log(err));

});