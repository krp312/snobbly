const albumSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    artist: { type: String, required: true },
    tags: [],
    ratings: {
      'one': { type: Number, default: 0 },
      'two': { type: Number, default: 0 },
      'three': { type: Number, default: 0 },
      'four': { type: Number, default: 0 },
      'five': { type: Number, default: 0 }
    },
    comments: []
  },
  { timestamps: true }
);

const commentSchema = mongoose.Schema(  // if only ever living in album, then just use plain object instead of schema
  {
    id:
    timestamp:
    username:
    content:
  },
  { timestamps: true }
);

// put comments on both album and user? updates will have to go to both places though. new schema is more appropriate here. then call 
// comments in both user and albums schemas

// second option is the way i have it now
  // user page will need subdocument search
// third option is i don't even remember

// album tags enum object instead of genre collection