require('./config/config.js');
const express = require('express');
const bodyPaerser = require("body-parser");
const _ = require('lodash');

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require('./models/user');

const {ObjectID} = require('mongodb');

const app = express();

const port = process.env.PORT;

app.use(bodyPaerser.json());

app.post('/todo', (req, res) => {
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

    var id = req.params.id;

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

app.listen(3000, () => console.log(`Started on port ${port}`));

module.exports ={ app };