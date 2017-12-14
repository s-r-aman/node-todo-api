require('./config/config.js');
const express = require('express');
const bodyParser = require("body-parser");
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require('./models/user');
const { authenticate } = require('./middleware/authenticate');

const {ObjectID} = require('mongodb');

const app = express();

const port = process.env.PORT;

app.use(bodyParser.json());

//Create a new todo
app.post('/todo', authenticate, (req, res) => {

    let newTodo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    newTodo
        .save()
        .then( result => res.send(result))
        .catch(err => res.status(400).send(err));

});

//Get all todo
app.get('/todo', authenticate,(req, res) => {
    Todo
        .find({_creator: req.user._id})
        .then(todo => res.status(200).send({todo}))
        .catch(e => console.log(e));
});

//Get a single todo
app.get('/todo/:id',authenticate, (req, res) => {

    let id = req.params.id;

    if(!ObjectID.isValid(id)) return res.status(404).send('Bad Request');
 
    Todo.findOne({_id: id, _creator: req.user._id}).then((todo) => {
        if(todo === null){
            return res.status(404).send("Bad Request");
        }
        res.send({todo});
    }).catch((err) => res.status(400));
});

//Deleting single todo
app.delete('/todo/:id', authenticate, (req, res) => {

    let id = req.params.id;

    if(!ObjectID.isValid(id)) return res.status(404).send('Bad request');

    Todo.findOneAndRemove({_id:id, _creator: req.user._id}).then((todo) => {
        if(todo === null) return res.status(404).send('Bad request');

        res.send({todo});
    }).catch((err) => res.status(400));

});

//Updating single todo 
app.patch('/todo/:id',authenticate, (req, res) => {
    
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) return res.status(404).send();

    if( _.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }


    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set:body}, {new: true}).then(todo => {
        
        if(!todo) return res.status(404).send();
        res.send({todo});
    }).catch(e => console.log(e));

});

//Signup route
app.post('/users', (req, res) => {

    let body = _.pick(req.body, ['email', 'password']);

    let newUser = new User(body);

    newUser
        .save()
        .then(() => {
            return newUser.generateAuthToken();
        })
        .then((token) => {
            res.header('x-auth', token).send(newUser);
        })
        .catch(err => {
            res.status(400).send(err);
        });
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);    
});

//login route

app.post('/users/login', (req, res) => {
    
    body = _.pick(req.body, ['email', 'password']);

    User
    .findByCredentials(body.email, body.password)
    .then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => res.status(400).send());

});

//logout route

app.delete('/users/me/token', authenticate, (req, res) =>{
    req.user.removeToken(req.token).then(() =>{
        res.status(200).send();
    }).catch(() => res.status(400).send());
});

app.listen(3000, () => console.log(`Started on port ${port}`));

module.exports ={ app };