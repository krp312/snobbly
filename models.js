'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const albumSchema = mongoose.Schema({
  // properties
});

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

module.exports = { Album, User };