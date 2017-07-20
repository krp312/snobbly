'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { DATABASE_URL, TEST_DATABASE_URL } = require('../config');
const { Album, User, Genre } = require('../models');
const { closeServer, runServer, app } = require('../server');

chai.use(chaiHttp);

const USER = {
  username: faker.internet.userName(),
  unhashedPassword: 'test',
  password: '$2a$10$mjFeHXylKADWX8/HCsOQAu418D.VDL6.tjpgGUH82BrS8XMOecVuW',
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName()
};

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

const ALBUM = {
  name: faker.random.words(),
  artist: faker.name.firstName()
};

function seedOneAlbum() {
  console.log('seeding one album');
  return Album.create(ALBUM);
}

function seedAlbumDatabase() {
  console.log('seeding album database');

  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push(
      {
        name: faker.random.words(),
        artist: faker.name.firstName()
      }
    );
  }

  return Album.insertMany(seedData);
}

function seedGenreDatabase() {
  console.log('seeding genre database');

  const seedData = [
    { name: 'chillwave' },
    { name: 'gammeldans' },
    { name: 'gandrung' }
  ];

  return Genre.insertMany(seedData);
}

function seedOneUserData() {
  console.log('seeding one user');
  return User.create(USER);
}

describe('album discusser API', function () {
  before(function () {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function () {
    const seedingFunctions = [
      seedOneAlbum(),
      seedAlbumDatabase(),
      seedGenreDatabase(),
      seedOneUserData()
    ];

    return Promise.all(seedingFunctions);
  });

  afterEach(function () {
    return tearDownDb();
  });

  after(function () {
    return closeServer();
  });

  describe('the root GET endpoint', function () {
    it('should have a 200 status when calling it', function () {
      return chai.request(app)
        .get('/')
        .then(res => {
          res.should.have.status(200);
        });
    });
  });

  describe('the /albums GET endpoint', function () {
    it('should return the searched album if it\'s already in the database', function () {
      let album;
      return chai.request(app)
        .get('/albums')
        .query({ name: ALBUM.name, artist: ALBUM.artist })
        .then(result => {
          album = result.body[0];
          result.should.have.status(200);
          result.should.be.json;
          result.body.should.be.an('array');
          album.should.include.keys('name', 'artist');
          album.name.should.equal(ALBUM.name);
          album.artist.should.equal(ALBUM.artist);
        });
    });

    it('should create a new album if the album doesn\'t exist in the database', function () {
      let album;
      let oldCount;
      const neverInAMillionYearsAlbum = {
        name: faker.random.words(),
        artist: faker.name.firstName()
      };

      Album
        .find(neverInAMillionYearsAlbum)
        .count()
        .then(count => {
          count.should.equal(0);
        });

      return chai.request(app)
        .get('/albums')
        .query(neverInAMillionYearsAlbum)
        .then(result => {
          result.should.have.status(201);

          album = result.body;
          album.should.be.an('object');
          album.name.should.equal(neverInAMillionYearsAlbum.name);
          album.artist.should.equal(neverInAMillionYearsAlbum.artist);

          return Album
            .find(neverInAMillionYearsAlbum)
            .count()
            .then(count => {
              count.should.equal(1);
            });
        });
    });
  });

  describe('the PUT albums & tags endpoint', function () {
    it('should allow you to add a tag to an album', function () {
      function getRandomAlbumId() {
        return Album
          .findOne()
          .then(album => {
            return album._id;
          });
      }

      function getRandomGenre() {
        return Genre
          .findOne()
          .then(genre => {
            return genre.name;
          });
      }

      let randomAlbumId;
      let randomGenre;
      let newAlbum;

      return Promise.all([getRandomAlbumId(), getRandomGenre()])
        .then(result => {
          randomAlbumId = result[0];
          randomGenre = result[1];
        })
        .then(() => {
          return chai.request(app)
            .put(`/albums/${randomAlbumId}/tags`)
            .send({ tag: randomGenre })
            .then(result => {
              newAlbum = result.body;
              result.should.have.status(201);
              result.should.be.json;

              newAlbum.tags.should.be.an('array');
              newAlbum.tags.should.include(randomGenre);

              return Album.findById(randomAlbumId);
            })
            .then(updatedAlbum => {
              updatedAlbum.tags.should.include(randomGenre);
              updatedAlbum.name.should.equal(newAlbum.name);
            });
        });
    });
  });

  describe('the GET for genres', function () {
    it('should return all genres if there is no query string', function () {
      let genreList;
      return chai.request(app)
        .get('/genres')
        .then(result => {
          genreList = result.body;
          genreList.should.be.an('array');
          genreList.should.have.length.of.at.least(1);
          result.should.have.status(200);
          result.should.be.json;

          return Genre.count();
        })
        .then(count => {
          genreList.should.have.lengthOf(count);
        });
    });

    it('should return all matching genres given a query string', function () {
      let genreList;
      const queryString = 'ga';
      return chai.request(app)
        .get('/genres')
        .query({ q: queryString })
        .then(result => {
          genreList = result.body;
          genreList.should.be.an('array');
          result.should.have.status(200);
          genreList.length.should.equal(2);

          return Genre
            .find({ name: { $regex: '.*' + queryString + '.*' } })
            .count();
        })
        .then(count => {
          genreList.should.have.lengthOf(count);
        });
    });
  });

  describe('POST endpoint for users', function () {
    it('should create a new user if the username doesn\'t already exist', function () {
      const mockUser = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      };

      let user;
      return chai.request(app)
        .post('/users')
        .send(mockUser)
        .then(result => {
          result.should.have.status(201);
          user = result.body;
          user.should.include.keys('username', 'firstName', 'lastName');

          return User.find( { username: mockUser.username } );
        })
        .then(databaseUser => {
          databaseUser[0].username.should.equal(user.username);
          databaseUser[0].firstName.should.equal(user.firstName);
          databaseUser[0].lastName.should.equal(user.lastName);
        })
    });
  });
});