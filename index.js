const express = require('express');
    morgan = require('morgan');
    bodyParser = require('body-parser');
    uuid = require('uuid');

const app = express();

//firing middleware, common in parameter logs basic data
app.use(morgan('common'));
//for client adding new info: body parser allows you to read body of HTTP requests within request hanglers by using-> req.body
app.use(bodyParser.json());

let topMovies = [
    {
        title: 'Good Will Hunting',
        director: 'Gus Van Sant',
        genre: 'drama',
        description: 'Will Hunting has a genius-level IQ but chooses to work as a janitor at MIT. When he solves a difficult graduate-level math problem, his talents are discovered by a professor, who decides to help the misguided youth reach his potential. When Will is arrested for attacking a police officer, the professor makes a deal to get leniency for him if he will get treatment from therapist Sean Maguire.'
    },
    {
        title: 'Sabrina',
        director: 'Billy Wilder',
        genre: 'drama-comedy',
        description: 'A playboy becomes interested in the daughter of his family chauffeur, but it is his more serious brother who would be the better man for her.'
    },
    {
        title: 'Forrest Gump',
        director: 'Robert Zemeckis',
        genre: 'drama-comedy',
        description: 'Forrest Gump, while not intelligent, has accidentally been present at many historic moments, but his true love, Jenny Curran, eludes him.'
    },
    {
        title: 'The Darjeeling Limited',
        director: 'Wes Anderson',
        genre: 'indie',
        description: 'A year after the death of their father, three brothers attempt to bond with each other by traveling together by train across India.'
    },
    {
        title: 'Roman Holiday',
        director: 'William Wyler',
        genre: 'romance-comedy',
        description: 'A runaway princess in Rome finds love with a reporter who knows her true identity.'
    },
    
]
// GET requests
//stand in
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('These are the top 10 movies!');
});

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