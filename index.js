const express = require('express');
    morgan = require('morgan');
    bodyParser = require('body-parser');
    uuid = require('uuid');

const app = express();

//firing middleware, common in parameter logs basic data
app.use(morgan('common'));
//for client adding new info: body parser allows you to read body of HTTP requests within request hanglers by using-> req.body
app.use(bodyParser.json());
//in-memory temp array
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
    const movie = movies.find( movie => movie.Title === title )
    if (movie) { 
        res.status(200).json(movie);
    }else{
        res.status(400).send('movie not found')
    }
});

app.get('/movies/:genre', (req, res) => {
    res.send('This is the genre of the movie');
});

app.get('/movies/:director', (req, res) => {
    res.send('This is the director of the movie');
});

app.post('/account/newuser', (req, res) => {
    let newUser = req.body;

    if(!newUser.name) {
        const message = 'Missing "name" in request body';
        res.status(400).send(message);
    } else {
        users.push(newUser);
        res.status(201).send(newUser);
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