const express = require('express');
    morgan = require('morgan');

const app = express();

//firing middleware, common in parameter logs basic data
app.use(morgan('common'));

// GET requests
//json because an API will be here eventually.
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