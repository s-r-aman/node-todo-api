const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');

let id = "5a2c2bac91b34a31a056f286";

Todo.find({complete: false}).then((todos) => console.log(todos));

Todo.findOne({_id: id}).then((todos) => console.log(todos));

Todo.findById(id).then(todos => console.log(todos));