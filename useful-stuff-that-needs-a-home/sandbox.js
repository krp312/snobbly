'use strict';

const { Album, Genre } = require('./models.js');
const mongoose = require('mongoose');
const { DATABASE_URL } = require('./config');
mongoose.connect(DATABASE_URL, () => {
  
  // Genre
  //   .find({ name: req.body.tag })
  //   .count()
  //   .then(count => {
  //     if (count === 1) {
  //       Album
  //         .findById(req.params.id)
  //         .then(album => {
  //           if (album.tags.indexOf(req.body.tag) > -1) {
  //             return res.status(500).send('error');
  //           }
  Album
    .findByIdAndUpdate( { _id: '596fa296bebce933fb43fdaf' }, { $addToSet: { tags: { $each: ['foo', 'bar', 'baz'] } } }, { new: true } )
    .then((doc) => {
      console.log(doc)
      // return Album.findById(req.params.id)
    })
    // .then(result => { 
    //   return res.status(201).json(result);  // to send back updated version     
    // });
  //       });
  //   }
  //   else {
  //     throw Error;  // review why this needs to be here
  //   }
  // })
  // Album
  //   .findOne()
  //   .then(album => {
  //     console.log('album', album);
  //     return Album.findOne()
  //   })
  //   .then(foo => {
  //     console.log('test', foo);
  //   });
})



