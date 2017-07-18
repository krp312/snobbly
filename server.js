'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { BasicStrategy } = require('passport-http');
const { DATABASE_URL, PORT } = require('./config');
const { Album, User, Genre } = require('./models');

const app = express();

app.use(express.static('public'));

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

mongoose.Promise = global.Promise;

// ---------
// endpoints
// ---------

app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/views/index.html');
});

app.post('/albums', (req, res) => {
  Album
    .create(req.body)
    .then(result => res.send(result));
});

app.get('/genres', (req, res) => {
  if (!(req.query.q)) {
    Genre
      .find()
      .then(result => res.json(result));
  } else {
    Genre
      .find( { name: { $regex : '.*' + req.query.q + '.*' } } )
      .then(result => res.send(result));
  }
});

let authenticator = passport.authenticate('basic', {session: false});

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  console.log('inside runserver');
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
  console.log('am i being hit???');
  runServer().catch(err => console.error(err));
}

module.exports = {runServer, app, closeServer};