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

app.post('/todo', (req, res) => {

    debugger;
    let newTodo = new Todo({
        text: req.body.text
    });

    newTodo
        .save()
        .then( result => res.send(result))
        .catch(err => res.status(400).send(err));

});


app.get('/todo', (req, res) => {
    Todo
        .find()
        .then(todo => res.status(200).send({todo}))
        .catch(e => console.log(e));
});

app.get('/todo/:id', (req, res) => {

    let id = req.params.id;

    if(!ObjectID.isValid(id)) return res.status(404).send('Bad Request');
 
    Todo.findById(id).then((todo) => {
        if(todo === null){
            return res.status(404).send("Bad Request");
        }
        res.send({todo});
    }).catch((err) => res.status(400));
});

app.delete('/todo/:id', (req, res) => {

    let id = req.params.id;

    if(!ObjectID.isValid(id)) return res.status(404).send('Bad request');

    Todo.findByIdAndRemove(id).then((todo) => {
        if(todo === null) return res.status(404).send('Bad request');

        res.send({todo});
    }).catch((err) => res.status(400));

});

app.patch('/todo/:id', (req, res) => {
    
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) return res.status(404).send();

    if( _.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }


    Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then(todo => {
        
        if(!todo) return res.status(404).send();
        res.send({todo});
    }).catch(e => console.log(e));

});

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