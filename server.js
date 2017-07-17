'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');

const { DATABASE_URL, PORT } = require('./config');
const { Album, User } = require('./models');

const app = express();

app.use(express.static('public'));

app.use(morgan('common'));
app.use(bodyParser.json());

mongoose.Promise = global.Promise;

// const basicStrategy = new BasicStrategy((username, password, callback) => {
//   let validatedUser;
//   User
//     .findOne({username})
//     .then(function(user) {
//       validatedUser = user;
//       if (!user) {
//         return callback(null, false);
//       }

//       return user.validatePassword(password);
//     })
//     .then(function(passwordToBeTested) {
//       if (passwordToBeTested === false) {
//         return callback(null, false);
//       }

//       return callback(null, validatedUser);
//     })
//     .catch(error => callback(error));
// });

// passport.use(basicStrategy);
// app.use(passport.initialize());

// ---------
// endpoints
// ---------

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

let authenticator = passport.authenticate('basic', {session: false});

// post needs required fields
// don't forget error handling
// 500 for everything
// 400 for missing fields
// req.user is the authenticated user data
// .find({username: req.body.username})
// 201 for successful post
// .findByIdAndRemove(req.params.id)
// 204 for delete
// put, 201 if successful
// if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
//   res.status(400).json({
//     error: 'Request path id and request body id values must match'
// });
// const updated = {};
// const updateableFields = ['title', 'content', 'author'];
// updateableFields.forEach(field => {
//   if (field in req.body) {
//     updated[field] = req.body[field];
//   }
// });
// .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
// .findByIdAndRemove(req.params.id)
// 204 success delete

// app.use('*', function(req, res) {
//   res.status(404).json({message: 'Not Found'});
// });


let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {runServer, app, closeServer};