const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');

const morgan = require('morgan');
const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');
    
const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Directors;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
    

//firing middleware, common in parameter logs basic data
app.use(morgan('common'));
//for client adding new info: body parser allows you to read body of HTTP requests within request hanglers by using-> req.body
app.use(bodyParser.json());


//Add a user
/* We’ll expect JSON in this format
{
  ID: Integer,
  Username: String,
  Password: String,
  Email: String,
  Birthday: Date
}*/

//POST
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
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

app.get('/users', (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//get user by username
app.get('/users:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


app.get('/', (req, res) => {
    res.send('My flixdB');
});

// GET requests, read, return JSON object when at /movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send("Error: " + err);
        });
});

//colon becomes a property on req.params object
app.get('/movies/:title', (req, res) => {
    //object destructuring, creating a new variable title that is equal to the property of the same name to the object on right of equal sign.
    const { title } = req.params;
    //find() method sits on array, applying it to the movies array. takes function as argument. 
                               //when this below true, send the value to equal movie
    const movie = movies.find( movie => movie.title === title )
    if (movie) { 
        res.status(200).json(movie);
    }else{
        res.status(400).send('movie not found')
    }
});

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find( movie => movie.genre === genreName ).genre //this .genre at the end makes it so it ONLY returns genre information
    
    if (genre) { 
        res.status(200).json(genre);
    }else{
        res.status(400).send('genre not found')
    }
});

app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = movies.find( movie => movie.director === directorName ).director //this .genre at the end makes it so it ONLY returns genre information
    
    if (director) { 
        res.status(200).json(director);
    }else{
        res.status(400).send('director not found')
    }
});


//UPDATE
app.put('/users/:id', (req, res) => {
    //body parser allows us to read from the body
    const { id } = req.params;
    const updatedUser = req.body;
    
    let user = users.find( user => user.id == id );

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('user not found');
    }
})


app.put('/users/:id/:movieTitle', (req, res) => {
    //body parser allows us to read from the body
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added`);
    } else {
        res.status(400).send('movie not found');
    }
})

//DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    
    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !==movieTitle);
        res.status(200).send(`${movieTitle} has been deleted`);
    } else {
        res.status(400).send('movie not found');
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    
    let user = users.find( user => user.id == id );

    if (user) {
        users = users.filter(user => user.id != id );
        res.json(users)
        //res.status(200).send(`user ${id} has been deleted`);
    } else {
        res.status(400).send('user not found');
    }
})

// serving all files in the public folder instead of res.sendFile() function over and over.
app.use(express.static('public'));

//error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });