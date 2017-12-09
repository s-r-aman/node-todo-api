const expect = require("expect");
const request = require('supertest');

const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

let todo2 = [
    {
        text: "Do something",
        _id: new ObjectID
    },
    {
        text: "Do something 2",
        _id: new ObjectID
    }
]

beforeEach((done) => {
    Todo.remove({}).then(() => {
         return Todo.insertMany(todo2);
    }).then(() => done());
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

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    

    it('Should not create an invalid to-do', (done) => {
        request(app)
            .post('/todo')
            .send({ })
            .expect((res) => {
                expect(res.status).toBe(400);
            }).end((err, res) => {
                if(err) return done(err);

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2 );
                    done();
                }).catch((e) => console.log(e));
            });
    });

});

describe('GET/ todo', () => {

    it('Should give back all the todos', (done) => {

        request(app)
          .get("/todo")
          .expect(200)
          .expect(res => {
            expect(res.body.todo.length).toBe(2);
          })
          .end(done);

    });

});

describe('GET/ todo/id', () => {

    it('Should give back the to do with correct id', (done) => {

        request(app)
            .get(`/todo/${todo2[0]._id.toHexString()}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todo2[0].text);
            }).end(done);

    });

    it('Should return a 404 when nothing is found', (done) => {

        request(app)
            .get(`/todo/${(new ObjectID).toHexString()}`)
            .expect(404)
            .end(done);

    });

    it('Should return 404 for non id term - ', (done) => {

        request(app)
            .get('/todo/123')
            .expect(404)
            .end(done);

    });

});
