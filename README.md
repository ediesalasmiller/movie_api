# REST Movie API
### MERN stack
* generating a server-side API component of a movies web application that provides users with access to information about different movies, directors, and genres. 
* Users are be able to sign up, update their personal information, and create a list of their favorite movies.

## User Stories 
* As a user, I want to be able to receive information on movies, directors, and genres so that I can learn more about movies I’ve watched or am interested in.
* As a user, I want to be able to create a profile so I can save data about my favorite movies


## Essential Features
* Return a list of ALL movies to the user
* Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
* Return data about a genre (description) by name/title (e.g., “Thriller”)
* Return data about a director (bio, birth year, death year) by name
* Allow new users to register
* Allow users to update their user info (username, password, email, date of birth)
* Allow users to add a movie to their list of favorites
* Allow users to remove a movie from their list of favorites
* Allow existing users to deregister

## Technical Elements
* JavaScript
* API is a Node.js and Express Application
* REST(representational state transfer) architecture API using HTTP to request access and use data
* MongoDB - nonSQL
* Business logic modeled with Mongoose
* JSON format for each movie
* Tested using Postman
* Bearer token authorization stored locally