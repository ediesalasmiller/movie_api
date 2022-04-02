const express = require('express');
    morgan = require('morgan');
    bodyParser = require('body-parser');
    uuid = require('uuid');
    const mongoose = require('mongoose');
    const Models = require('./models.js');
    
    const Movies = Models.Movie;
    const Users = Models.User;
    mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
    
const app = express();

//firing middleware, common in parameter logs basic data
app.use(morgan('common'));
//for client adding new info: body parser allows you to read body of HTTP requests within request hanglers by using-> req.body
app.use(bodyParser.json());
//in-memory temp array

let users = [
    {
        id: 1,
        name: "Queen",
        favoriteMovies:[]
    },
    {
        id: 2,
        name: "Chris",
        favoriteMovies:["Sabrina"]
    }
]
let movies = [
    {
        "title": "Good Will Hunting",
        "director": "Gus Van Sant",
        "genre": "drama",
        "description": "Will Hunting has a genius-level IQ but chooses to work as a janitor at MIT. When he solves a difficult graduate-level math problem, his talents are discovered by a professor, who decides to help the misguided youth reach his potential. When Will is arrested for attacking a police officer, the professor makes a deal to get leniency for him if he will get treatment from therapist Sean Maguire."
    },
    {
        "title": "Sabrina",
        "director": "Billy Wilder",
        "genre": "drama-comedy",
        "description": "A playboy becomes interested in the daughter of his family chauffeur, but it is his more serious brother who would be the better man for her."
    },
    {
        "title": "Forrest Gump",
        "director": "Robert Zemeckis",
        "genre": "drama-comedy",
        "description": "Forrest Gump, while not intelligent, has accidentally been present at many historic moments, but his true love, Jenny Curran, eludes him."
    },
    {
        "title": "The Darjeeling Limited",
        "director": "Wes Anderson",
        "genre": "indie",
        "description": "A year after the death of their father, three brothers attempt to bond with each other by traveling together by train across India."
    },
    {
        "title": "Roman Holiday",
        "director": "William Wyler",
        "genre": "romance-comedy",
        "description": "A runaway princess in Rome finds love with a reporter who knows her true identity."
    },
    
]

//CREATE
app.post('/users', (req, res) => {
    //body parser allows us to read from the body
    const newUser = req.body;

    if(!newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400)
    }
})

// READ
app.get('/', (req, res) => {
    res.send('An API of movies');
});

// GET requests, READ
app.get('/movies', (req, res) => {
    res.json(movies);
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