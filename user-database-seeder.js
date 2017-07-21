'use strict';

// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const faker = require('faker');
const mongoose = require('mongoose');

// const should = chai.should();

// const { DATABASE_URL, TEST_DATABASE_URL } = require('./config');
const { Album, User, Genre } = require('./models');
const { closeServer, runServer, app } = require('./server');
const DATABASE_URL = 'mongodb://dev:1@ds123371.mlab.com:23371/album-discusser';
const bcrypt = require('bcryptjs');

function hashme(password) {
  return bcrypt.hashSync(password, 10);
};

// chai.use(chaiHttp);

// mongo ds123371.mlab.com:23371/album-discusser -u dev -p 1

function seedUserDatabase() {
  mongoose.connect(DATABASE_URL, () => {
    return User.remove({})
      .then(() => {
        User.insertMany([
          {
            username: 'krp312',
            password: hashme('bananas'),
            firstName: 'Kris',
            lastName: 'Panahon',
            admin: false
          },
          {
            username: 'bball4lyf',
            password: hashme('96bulls'),
            firstName: 'Michael',
            lastName: 'Jordan',
            admin: false
          },
          {
            username: 'mscott',
            password: hashme('dundermifflin'),
            firstName: 'Michael',
            lastName: 'Scott',
            admin: true
          }
        ]);
      });
  });
}

seedUserDatabase();


// {
// 	"_id" : ObjectId("597183b45ecb70638baaa2ea"),
// 	"__v" : 0,
// 	"username" : "krp312",
// 	"password" : "$2a$10$ojJACvL6FfYyQYcdgjh8y.jJtKxUfHg91WhaZhfbslxErHr2PW25e",
// 	"firstName" : "Kris",
// 	"lastName" : "Panahon",
// 	"admin" : false
// }
// {
// 	"_id" : ObjectId("597183b45ecb70638baaa2eb"),
// 	"__v" : 0,
// 	"username" : "bball4lyf",
// 	"password" : "$2a$10$zQ1eifMq2ZrBs3vMdvgCf.pRXVDEu4AKw6Z4kTTL5nBFtojIM45aC",
// 	"firstName" : "Michael",
// 	"lastName" : "Jordan",
// 	"admin" : false
// }
// {
// 	"_id" : ObjectId("597183b45ecb70638baaa2ec"),
// 	"__v" : 0,
// 	"username" : "mscott",
// 	"password" : "$2a$10$U/wzDHJ/hi7ahGZ.QxQ.fuwzlajmCojXCm7YnYfR/iBUl14Hik9Z.",
// 	"firstName" : "Michael",
// 	"lastName" : "Scott",
// 	"admin" : true
// }