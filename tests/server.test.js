const expect = require("expect");
const request = require('supertest');

const {app} = require('./../server/server');
const {Todo} = require('./../server/models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => done())
});

describe('POST /todo',() => {

    let text = "This is from testing.";

    it("Should create a new to-do item and return it.", done => {

        request(app)
            .post('/todo')
            .send({text})
            .expect((res) => {
                expect(res.body.text).toBe(text);
            }).end((err, res) => {
                if(err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

});

