const { ObjectID } = require("mongodb");
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

console.log(userOneId);

let users = [{
    '_id': userOneId,
    'email': 'userone@test.com',
    'password': 'useronepass',
    'tokens': [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
},{
    'email': 'usertwoemail@gmail.com',
    'password': 'usertwopass'
}];

let todo2 = [
  {
    text: "Do something",
    _id: new ObjectID()
  },
  {
    text: "Do something 2",
    _id: new ObjectID(),
    completed: true,
    completedAt: 333
  }
];

const populateTodo = (done) => {
  
    Todo
    .remove({})
    .then(() => {
      return Todo.insertMany(todo2);
    })
    .then(() => done());
};

const populateUsers = done => {
  User.remove({})
    .then(() => {
      let userOne = new User(users[0]).save();
      let userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo])
    })
    .then(() => done());
};

module.exports = {
    todo2,
    populateTodo,
    users,
    populateUsers
}