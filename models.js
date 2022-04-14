const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String
    },
    Actors: [String],
    InagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

//hashPassword function, hashes the password
userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

//validatePassword function conpares submitted hased passwords with the hashed passwords stored in db
userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};
//below code will create collections called "db.movies" and "db.users"
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

//below code export model and allow you to import into index.js file
module.exports.Movie = Movie;
module.exports.User = User;

