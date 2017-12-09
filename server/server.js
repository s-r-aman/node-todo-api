const express = require('express');
const bodyPaerser = require('body-parser');

const { mongoose } = require("./db/mongoose");
const { Todo } = require("./models/todo");
const { User } = require('./models/user');

const app = express();

app.use(bodyPaerser.json());

app.post('/todo', (req, res) => {
    let newTodo = new Todo({
        text: req.body.text
    });

    newTodo
        .save()
        .then( result => res.send(result))
        .catch(err => res.status(400).send(err));

})

app.listen(3000, () => console.log('Started on port 3000'));
