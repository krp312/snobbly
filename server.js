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
app.use(express.static('dist'));

app.use(morgan('common'));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, OPTIONS');
  next();
});

mongoose.Promise = global.Promise;

const basicStrategy = new BasicStrategy((username, password, callback) => {
  let validatedUser;
  User
    .findOne({username})
    .then(function(user) {
      validatedUser = user;
      if (!user) {
        return callback(null, false);
      }

      return user.validatePassword(password);
    })
    .then(function(passwordToBeTested) {
      if (passwordToBeTested === false) {
        return callback(null, false);
      }

      return callback(null, validatedUser);
    })
    .catch(error => callback(error));
});

passport.use(basicStrategy);
app.use(passport.initialize());

let authenticator = passport.authenticate('basic', { session: false });

// router.get('/me',
//   passport.authenticate('basic', {session: false}),
//   (req, res) => res.json({user: req.user.apiRepr()})
// );

// ---------
// endpoints
// ---------

let validGenres = [];

app.get('/', (req, res) => {
  res.status(200).sendFile(__dirname + '/views/index.html');
});

app.get('/albums/', (req, res) => {
  const newAlbum = {
    artist: req.query.artist,
    name: req.query.name
  };

  Album
    .find({ name: req.query.name })
    .count()
    .then(count => {
      if (count > 0) {
        return Album
          .find({ name: req.query.name })
          .then(result => {
            res.json(result);  // returns an array with 1 album object in it
          });
      }
      else {
        return Album
          .create(newAlbum)
          .then(result => {   // returns the album object here
            res.status(201).json(result);
          });
      }
    })
    .catch(err => res.status(500).send(err.stack));
});

// 596f06f6a8697cc121e07366
// lorde pure heroine
app.put('/albums/:id/tags', authenticator, (req, res) => {
  Genre
    .find( { name: req.body.tag } )
    .count()
    .then(count => {
      if (count === 1) {
        Album
          .findById(req.params.id)
          .then(album => {
            if ( album.tags.indexOf(req.body.tag) > -1 ) {
              return res.status(500).send('error');
            }
            Album
              .findByIdAndUpdate( { _id: req.params.id }, { $push: { tags: req.body.tag } } )
              .then(() => {
                return Album.findById(req.params.id);
              })
              .then(result => res.status(201).json(result)); // to send back updated version        
          });
      }
    })
    .catch(err => {
      res.status(500).json({ error: 'something went terribly wrong' });
    });
});

// return all genres if there isn't a query string
// if there is a query string, return all matching genres
app.get('/genres', (req, res) => {
  if (!(req.query.q)) {
    Genre
      .find()
      .then(result => {
        res.json(result);
      });
  } else {
    Genre
      .find({ name: { $regex: '.*' + req.query.q + '.*' } })
      .then(result => {
        res.json(result);
      })
      .catch(err => res.status(500).json('error'));
  }
});

app.post('/users', (req, res) => {
  if (!req.body) {
    return res.status(400).json({message: 'No request body'});
  }

  if (!('username' in req.body)) {
    return res.status(422).json({message: 'Missing field: username'});
  }

  let {username, password, firstName, lastName} = req.body;

  if (typeof username !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: username'});
  }

  username = username.trim();

  if (username === '') {
    return res.status(422).json({message: 'Incorrect field length: username'});
  }

  if (!(password)) {
    return res.status(422).json({message: 'Missing field: password'});
  }

  if (typeof password !== 'string') {
    return res.status(422).json({message: 'Incorrect field type: password'});
  }

  password = password.trim();

  if (password === '') {
    return res.status(422).json({message: 'Incorrect field length: password'});
  }

  User
    .find( { username: req.body.username } )
    .count()
    .then(count => {
      if (count > 0) {
        return res.status(400);
      }
      return User.hashPassword(req.body.password);
    })
    .then(password => {
      return User
        .create({
          username: req.body.username,
          password: password,
          firstName: req.body.firstName,
          lastName: req.body.lastName
        });
    })
    .then(user => {
      return res.status(201).send(user.apiRepr());
    })
    .catch(err => {
      res.status(500).json({message: 'Error!'});
    });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
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

module.exports = { runServer, app, closeServer };