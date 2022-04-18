const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const morgan = require('morgan');
const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');    
const Movies = Models.Movie;
const Users = Models.User;
const { check, validationResult } = require('express-validator');


// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect( process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//adding the auth.js to our project. need to be AFTER middleware.
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

app.use(morgan('common')); //firing middleware, common in parameter logs basic data

app.use(bodyParser.json()); //for client adding new info: body parser allows you to read body of HTTP requests within request hanglers by using-> req.body





// Requests
// Get a list of all movies
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
      .then((movies) => {
          res.status(201).json(movies);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

app.get('/', (req, res) => {
  res.send('Check out these movies!');
});

// Get a movie by Title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
          res.json(movie);
      })
      .catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      });
});

// Get information about a genre
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Genre.Name' : req.params.Name })
   .then((movie) => {
       res.json(movie.Genre.Description);
   })
   .catch((err) => {
       console.error(err);
       res.status(500).send('Error: ' + err);
   });
});

// Get information about a director
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ 'Director.Name': req.params.Name })
   .then((movie) => {
       res.json(movie.Director);
   })
   .catch((err) => {
       console.error(err);
       res.status(500).send('Error: ' + err);
   });
});

//Add A User
/* Expects a JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthdate: Date
}*/
app.post('/users',
  [
      check('Username', 'Username needs 5 letters.').isLength({min: 5}),
      check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email is not valid').isEmail()
  ], (req, res) => {

      // check the validation object for errors
      let errors = validationResult(req);

      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }

  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username })
      .then((user) => {
          if (user) {
              return res.status(400).send(req.body.Username + 'already exists');
          } else {
              Users
                  .create({
                      Username: req.body.Username,
                      Password: hashedPassword,
                      Email: req.body.Email,
                      Birthday: req.body.Birthday
                  })
                  .then((user) =>{res.status(201).json(user) })
                  .catch((error) => {
                      console.error(error);
                      res.status(500).send('Error: ' + error);
                  })
          }
      })
      .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
      });
});

// Update a user's info, by username
/* Expects a JSON in this format
{
  Username: String, (required)
  Password: String, (required)
  Email: String, (required)
  Birthday: Date
}*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, { $set:
  {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
  }
},
{ new: true }, // This line makes sure that the updated document is returned
(err, updatedUser) => {
  if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
  } else {
      res.json(updatedUser);
  }
});
});

// Add a movie to a user's favorites list
app.post('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
      $push: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
      } else {
          res.json(updatedUser);
      }
  });
});

// Removes a movie from a user's favorite list
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
      $pull: { FavoriteMovies: req.params.MovieID }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
      } else {
          res.json(updatedUser);
      }
  });
});

// Delete a user by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
  .then((user) => {
      if (!user) {
          res.status(400).send(req.params.Username + ' was not found.');
      } else {
          res.status(200).send(req.params.Username + ' was deleted.');
      }
  })
  .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
  });
});


// Serves all files within the public folder 
app.use(express.static('public'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Oops! Something Broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});