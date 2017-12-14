const expect = require("expect");
const request = require('supertest');

const {ObjectID} = require('mongodb');

const {User} = require('./../models/user');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const { todo2, populateTodo, users, populateUsers } = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodo);

describe('POST /todo',() => {

    let text = "This is from testing.";

    it("Should create a new to-do item and return it.", done => {

        request(app)
            .post('/todo')
            .set('x-auth', users[0].tokens[0].token)
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
          .post("/todo")
          .set("x-auth", users[0].tokens[0].token)
          .send({})
          .expect(res => {
            expect(res.status).toBe(400);
          })
          .end((err, res) => {
            if (err) return done(err);

            Todo.find()
              .then(todos => {
                expect(todos.length).toBe(2);
                done();
              })
              .catch(e => console.log(e));
          });
    });

});

describe('GET/ todo', () => {

    it('Should give back all the todos', (done) => {

        request(app)
          .get("/todo")
          .set("x-auth", users[0].tokens[0].token)
          .expect(200)
          .expect(res => {
            expect(res.body.todo.length).toBe(1);
          })
          .end(done);

    });

});

describe('GET/ todo/:id', () => {

    it('Should give back the to do with correct id', (done) => {

        request(app)
            .get(`/todo/${todo2[0]._id.toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todo2[0].text);
            })
            .end(done);

    });

    it("Should not give back the to do if the id is invalid.", done => {
      request(app)
        .get(`/todo/${todo2[1]._id.toHexString()}`)
        .set("x-auth", users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('Should return a 404 when nothing is found', (done) => {

        request(app)
            .get(`/todo/${new ObjectID().toHexString()}`)
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });

    it('Should return 404 for non id term - ', (done) => {

        request(app)
            .get("/todo/123")
            .set("x-auth", users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });

});

describe('Delete /todo/:id', () => {

    let idHex = todo2[1]._id.toHexString();

    it('Should delete the requested item and return it.', (done) => {

        request(app)
            .delete(`/todo/${idHex}`)
            .set("x-auth", users[1].tokens[0].token)            
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(idHex);

                Todo.findById(idHex).then(result => {
                    expect(result).toBeFalsy();
                }).catch(err => console.log(err));

            }).end(done);

    });

    it('Should not delete the requested item if the id invalid.', (done) => {

        request(app)
            .delete(`/todo/${idHex}`)
            .set("x-auth", users[0].tokens[0].token)            
            .expect(404)
            .expect(res => {

                Todo.findById(idHex).then(result => {
                    expect(result).toBeTruthy();
                }).catch(err => console.log(err));

            }).end(done);

    });

    it('Should return 404 when the id do no exist.', (done) => {

        let id = "5a2cbf8e88d0cc26d0";

        request(app)
            .delete(`/todo${id}`)
            .expect(404)
            .end(done);

    });

    it("Should return 404 when the id is invalid.", done => {
      let id = "123";

      request(app)
        .delete(`/todo${id}`)
        .expect(404)
        .end(done);
    });

});

describe('PATCH /todo/:id', () => {

    it('Should update the todo', (done) => {

        //grab id of first item
        let idHex = todo2[0]._id.toHexString();
        //update text, set completed true

        let text = {
            text: "This is updated from text 1",
            completed: true
        }

        request(app)
          .patch(`/todo/${idHex}`)
          .set("x-auth", users[0].tokens[0].token)
          .send(text)
          .expect(200)
          .expect(res => {
            expect(res.body.todo.text).toBe(text.text);
            expect(res.body.todo.completed).toBe(true);
            // expect(res.body.todo.completedAt).toBeA("number");
            expect(typeof res.body.todo.completedAt).toBe("number");
          })
          .end(done);


    });

    it("Should update the todo", done => {
      //grab id of first item
      let idHex = todo2[0]._id.toHexString();
      //update text, set completed true

      let text = { text: "This is updated from text 1", completed: true };

      request(app)
        .patch(`/todo/${idHex}`)
        .set("x-auth", users[1].tokens[0].token)
        .send(text)
        .expect(404)
        .end(done);
    });

    it('Should clear the completedAt when todo is not completed', (done) => {

        //grab id of first item
        let idHex = todo2[1]._id.toHexString();
        //update text, set completed false
        let text = {
            text: "This is updated from text 1",
            completed: false
        }
        //200
        request(app)
          .patch(`/todo/${idHex}`)
          .set("x-auth", users[1].tokens[0].token)
          .send(text)
          .expect(200)
          .expect(res => {
            expect(res.body.todo.text).toBe(text.text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeFalsy();
          })
          .end(done);
        //text is changed, completed false, completdAt id numm .toNotExist
        

    });

});

describe('Get /users /me', () => {
    
   it('Should return a valid user', (done) => {

        request(app)
          .get("/users/me")
          .set("x-auth", users[0].tokens[0].token)
          .expect(200)
          .expect(result => {
            expect(result.body.email).toBe(users[0].email);
          })
          .end(done);

    });

    it("Should return a 401 invalid user", done => {

      request(app)
        .get("/users/me")
        .expect(401)
        .expect(result => {
          expect(result.body).toEqual({});
        })
        .end(done);
    });

});

describe('POST /users', () => {

    it('Should create a user',(done) => {
       
        request(app)
        .post("/users")
        .send({
            email: "abczy@test.com",
            password: "123456"
        })
        .expect(200)
        .expect(res => {
            expect(res.body.email).toBe("abczy@test.com");
            expect(res.body._id).toBeTruthy();
            expect(res.header['x-auth']).toBeTruthy();
        })
        .end(done);

    });

    it('Should return 400 for invalid user request', (done) => {
        
        let email = 'ab';
        let pass = 'pass';
        request(app)
            .post('/users')
            .send({email, pass})
            .expect(400)
            .end(done);
    });

    it("Should return 400 for taken user email request", done => {
      let email = "userone@test.com";
      let pass = "pssass";
      request(app)
        .post("/users")
        .send({ email, pass })
        .expect(400)
        .end(done);
    });
    
});

describe('POST /Users/login', () => {
    
    it('Should return a token from existing user', (done) => {

        request(app)
        .post('/users/login')
        .send({email: users[1].email, password: users[1].password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
            if(err) return done(err);

            User.findById(users[1]._id).then((result) => {
                expect(result.toObject().tokens[1]).toMatchObject({access: 'auth', token: res.headers['x-auth']});
            done();
            }).catch(e => done(e));
        });
    });

    it('Should return 400 for invalid requests.',(done) => {

        let email = 'abcd@test.gmail.com';
        let password = '123456';

        request(app)
        .post('/users/login')
        .send({email, password})
        .expect(400)
        .expect((res) => {
            expect(res.body).toEqual({});
        }).end((err, res) => {
            if(err) return done(err);

            done();
        })
    });
});

describe('DELETE /users/me/token', () => {

    it('Should remove the auth token on logout.', (done) => {

        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err, res) => {
            if(err) return done(err);

            User.findOne({_id: users[0]._id}).then((user) => {
                expect(user.tokens.length).toBe(0);
                done();
            }).catch(err => done(err));
        });
    });
});