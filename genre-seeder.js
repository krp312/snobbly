// even though the console will look like this didn't work, it worked
'use strict';

const seeder = require('mongoose-seed');
const { Genre } = require('./models.js');

seeder.connect('mongodb://localhost/album-discusser', function() {
 
  // Load Mongoose models 
  seeder.loadModels(['models.js']);
 
  // Clear specified collections 
  seeder.clearModels(['Genre'], function() {
 
    // Callback to populate DB once collections have been cleared 
    seeder.populateModels(data, function() {
      // seeder.disconnect(); 
      const fs = require('fs');
      const text = fs.readFileSync('./genres.txt').toString('utf-8');
      const textByLine = text.split('\n');
      textByLine.forEach((genre) => {
        Genre.create( { name: genre } );
      });
    });
 
  });
});

// this needs to be here
var data = [
  {
    'model': 'Genre',
    'documents': [
    ]
  }
];

// Album.create({
//   artist: 'Lorde',
//   name: 'Pure Heroine',
//   tags: ['art rock', 'electropop'],
//   ratings: {
//     'one':   25,
//     'two':   5,
//     'three': 3,
//     'four':  2,
//     'five':  26
//   },
//   comments: [
//     {
//       'username' : 'brtny4lyf',
//       'content' : 'just leave her alone'
//     },
//     {
//       'username' : 'juggalos_icp',
//       'content' : 'magnetism how does it work'
//     }
//   ]
// });