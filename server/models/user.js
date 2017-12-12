const mongoose = require("mongoose");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

let UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      unique: true,
      validate: {
        validator: value => {
          return validator.isEmail(value);
        },
        message: "{VALUE} is nor a valid email"
      }
    },

    password: {
      type: String,
      require: true,
      minlength: 6
    },

    tokens: [
      {
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    usePushEach: true
  }
);

UserSchema.methods.toJSON = function() {
  let user = this;

  let userObject = user.toObject();

  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function() {
  let user = this;
  let access = 'auth';

  console.log('Entered the token invoke');
  console.log(user);

  let token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
  
  console.log(token);

  user.tokens.push({access, token});

  // user.tokens = user.tokens.concat([{ access, token }]);

  console.log(user);

  return user
          .save()
          .then(() => {
            console.log('Saved user with token successfully, returning the token');
            return token;
          })
          .catch(e => console.log(e)); 

};

UserSchema.statics.findByToken = function (token){
  let User = this;

  let decoded;
  try{
    decoded = jwt.verify(token, 'abc123'); 
    console.log(decoded);
  }catch (e){
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });

};

let User = mongoose.model("User", UserSchema);

module.exports = {
  User
};
