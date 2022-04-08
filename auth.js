const jwtSecret = 'your_jwt_secret'; //this must be same key used in JWTStrategy

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); //my local passport file

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //this is the username to be encoded in JWT
        expiresIn: '7d',
        algorithm: 'HS256' //this is the algorithm used to sign or encode the values of the KWT
    });
}

/* POST login. */
module.exports = (router) => {
    router.post('/login', (req, res) => {
      passport.authenticate('local', { session: false }, (error, user, info) => {
        if (error || !user) {
          return res.status(400).json({
            message: 'Something is not right',
            user: user
          });
        }
        req.login(user, { session: false }, (error) => {
          if (error) {
            res.send(error);
          }
          let token = generateJWTToken(user.toJSON());
          return res.json({ user, token });
        });
      })(req, res);
    });
  } 