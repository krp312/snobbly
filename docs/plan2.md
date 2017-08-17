----------------------
user stories and flows
----------------------
DONE:
    tagging albums
      1. user goes to album page. if album page isn't there, create one
      3. user clicks a tag from available list
      4. tag updates +1, max 1 vote per tag
      5. vote value updates in dom

as a user i'd like to
  have my own account
    1. enter in credentials
    2. create new user in users collection with hashed password
    rating albums
      1. user goes to album page. if album page isn't there, create one
      2. user clicks a rating from a list of 1 to 5
      3. rating updates by 1, max 1 vote
      4. vote value is an average
    commenting albums
      1. user goes to album page. if album isn't there, create one
      2. user types a comment in a field box, clicks submit
      3. the comment and the album id, together, are stored in the user's document in an object
      4. the album page will update by searching all the users collection where the ID is the same as the album id
        * use a virtual to assemble these comments with the user's ID, so only that user can edit it later
      5. list comments by date
  CRUD *only* my comments and not other users
    from user view
      1. login as a registered user
      2. display my comments as a list
      3. to edit, PUT endpoint to the index (bc it's in an array)
    from album view
      1. login
      2. look at all the comments (which should be displayed by username). grab the comment by searching the users collection by date created?
as an admin i'd like to
  edit album properties
    1. login
    2. go to an album, delete stuff
    3. PUT on any/all fields, maybe using a .save()?
  delete users
    1. login
    2. see users
    3. delete


-----------------------------
technical goals, among others
-----------------------------
- all genre dbs will have to be preseeded
- Briefly show the wireframes and user stories (so Joe has context)
- Demo basic CRUD features using client app (or Postman)
- Show working set of Integration Tests. At least 1 test per endpoint

for every feature -- tests, auth, front end, online
try fetch api
state management front end
dev and prod dbs
use router
how to seed db properly
front end code
testing
router
CORS
error handling!
'*' endpoint
.populate?
.save on actual document, not instance
search and sort

------------
daily pacing
------------
mon - CI
tues/wed - core features, testing
thurs - code review
thurs aft/fri morning - prep for demo, polish, documentation

"Music Club"

fetch album metadata from an api
  autocomplete (1/2 a day)
  keep or edit
  or go through node app, saves to my database?

----------
data model
----------
{
  name: 'DAMN.'
  id: 1a2s3ed3f
  artist: 'Kendrick Lamar"
  year: 2017
  tags: {
    'hip hop': 1, // user sees list of tags -> selects a tag, can vote only once -> updates value in the album doc
    'rap rock': 2,
    'country': 48234
  },
  ratings: {
    'one': 1,
    'two': 2,
    'three': 1,
    'four': 0,
    'five': 48234
  }
}

user
----
{
  username:
  password:
  id: 2$6786dasds6&*4#@
  firstName:
  lastName:
  comments: [
    {
      albumId: '1a2s3d4f'
      date created:
      comment: 'lorem ipsum...'
    }
  ]
}


roadmap
------

============== DONE AREA ==============

1) Unit Tests for existing endpoints
  - PUT /album/:id/tags?
  - POST /albums?
  - GET /genres?

1.1) test for user creation endpoint

1.5) tests for auth

promise error handling
test naming scheme
return check
reflections
how to test the incorrect auth
heroku transition
start page styling
header for results
sign up pop up
auth only for posting comments and updating tags
dummy doc with comments
comments, demonstrating 2 diff users

============== DONE AREA ==============
https://courses.thinkful.com/node-001v5/project/3.2.8 and afternoon blurb from 7/21
virtual, apiRepr()
understand front end code
organize code so it can be presented
color in header divs with proper width
static width, not too wide
github readme & other friday-morning-link stuff
admin view
router
refactor, including put endpoint (in sandbox.js)
enum genre solution: http://mongoosejs.com/docs/api.html#schema_string_SchemaString-enum

2) Feature -- Authentication
  ** UI page (use same page as login) for signup (route = POST /users to create a user)
    * For the UI use input type=text, and input type=password, and a signup button (input type=button)

3) Feature -- Admin, with tests
  ** UI admin page (has the ability to delete a user and album)
  ** UI Add a link somewhere on main screen to the admin page if user.admin == true
  * all with admin check (admin property on user schema, predetermined 1 admin user)
    x DELETE /users/:username
    x DELETE /albums/:name
     PUT /users (username, new_username, new_password)
  * UI three 
  x tests for all the endpoints

-----------

4) Feature -- Comments, with tests. subdocuments? ask chris (response: see sandbox-comment-model.js)
  ** PUT /albums/:id/comments (follow the same pattern we did for adding tags)
    ** UI will be a text field on the main screen and a button to add comment (the backend will have to know who the authenticated user is to add their username)

5) Feature -- User Dashboard
  * UI page that displays the user's username (once again fetch from headers or some other source)
  * Only be able to see their own user
  /ui_user/:id (12345) (54123)

7) Feature -- Search by Tag

would be nice maybe in the future
---------------------------------
6) Feature -- Add comment editing to User Dashboard



placeholder.html
ajax query -> /ui/index and take the content of that and put it in the placeholder div
<div id=placeholder>
</div>


endpoint GET /ui/index
  // Load the index.html
  // Return the index.html

