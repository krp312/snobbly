'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { DATABASE_URL, TEST_DATABASE_URL } = require('../config');
const { Album, User } = require('../models');
const { closeServer, runServer, app } = require('../server');

chai.use(chaiHttp);

const USER = {
};

function tearDownDb() {
}

function seedBlogPostData() {
}

function seedUserData() {
}

// if doing 2 promises, make sure to use promise.all, return it

describe('album discusser API', function() {
  it('should return true', function() {
    true === true;
  });
});
