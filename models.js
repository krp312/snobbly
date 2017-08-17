'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const genreSchema = mongoose.Schema({
  name: { type: String, required: true }
});

const albumSchema = mongoose.Schema(
  {
    name:   { type: String, required: true },
    artist: { type: String, required: true },
    tags: [],
    ratings: {
      'one':   { type: Number, default: 0 },
      'two':   { type: Number, default: 0 },
      'three': { type: Number, default: 0 },
      'four':  { type: Number, default: 0 },
      'five':  { type: Number, default: 0 }
    },
    comments: []
  },
  { timestamps: true }
);

const userSchema = mongoose.Schema(
  {
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    firstName: String,
    lastName: String,
    admin: {type: Boolean, required: true, default: false}
  }    
);

userSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.apiRepr = function() {
  return {
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName
  };
};

const Album = mongoose.model('Album', albumSchema);
const User = mongoose.model('User', userSchema);
const Genre = mongoose.model('Genre', genreSchema);

module.exports = { Album, User, Genre };