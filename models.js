'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const genreSchema = mongoose.Schema({
  name: { type: String, required: true }
});

const tagSchemaGenerator = () => {
  const tags = {};
  genres.forEach((genre) => {
    tags[genre] = { type: Number, default: 0 };
  });

  return tags;
};

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
    }
  },
  { timestamps: true }
);

const userSchema = mongoose.Schema(
  // properties
);

// blogPostSchema.virtual('authorName').get(function() {
//   return `${this.author.firstName} ${this.author.lastName}`.trim();
// });

// blogPostSchema.methods.apiRepr = function() {
//   return {
//     id: this._id,
//     author: this.authorName,
//     content: this.content,
//     title: this.title,
//     created: this.created
//   };
// };

// userSchema.statics.hashPassword = function(password) {
//   return bcrypt.hash(password, 10);
// };

// userSchema.methods.validatePassword = function(password) {
//   return bcrypt.compare(password, this.password);
// };

// userSchema.methods.apiRepr = function() {
//   return {
//     username: this.username,
//     firstName: this.firstName,
//     lastName: this.lastName
//   };
// };

const Album = mongoose.model('Album', albumSchema);
const User = mongoose.model('User', userSchema);
const Genre = mongoose.model('Genre', genreSchema);

module.exports = { Album, User, Genre };