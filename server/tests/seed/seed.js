const { ObjectID } = require("mongodb");
const jwt = require('jsonwebtoken');

const { Todo } = require('./../../models/todo');
const { User } = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

console.log(userOneId);

let users = [
  {
    _id: userOneId,
    email: "userone@test.com",
    password: "useronepass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userOneId, access: "auth" }, process.env.JWT_SECRET).toString()
      }
    ]
  },
  {
    _id: userTwoId,
    email: "usertwoemail@gmail.com",
    password: "usertwopass",
    tokens: [
      {
        access: "auth",
        token: jwt.sign({ _id: userTwoId, access: "auth" }, process.env.JWT_SECRET).toString()
      }
    ]
  }
];

let todo2 = [
  {
    text: "Do something",
    _id: new ObjectID(),
    _creator: userOneId
  },
  {
    text: "Do something 2",
    _id: new ObjectID(),
    completed: true,
    _creator: userTwoId,
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