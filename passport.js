const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy, //to authenticate via HTTP Header
  Models = require('./models.js'),
  passportJWT = require('passport-jwt');

let Users = Models.User;
//to create a JWT
let JWTStrategy = passportJWT.Strategy;
let ExtractJWT = passportJWT.ExtractJwt;

//defines basic HTTP authentication for login requests.
passport.use(
  new LocalStrategy(
    {
      usernameField: 'Name',
      passwordField: 'Password'
    },
    (name, password, callback) => {
      console.log(name + '  ' + password);
      Users.findOne({ Name: name }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log('incorrect name');
          return callback(null, false, {
            message: 'Incorrect name or password.'
          });
        }

        console.log('finished');
        return callback(null, user);
      });
    }
  )
);

//JWT authentication code, called “JWTStrategy,” authenticates users based on the JWT submitted alongside request.
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret' //signature verifies the sender of the JWT (the client).
    },
    (jwtPayload, callback) => {
      return Users.findById(jwtPayload._id)
        .then(user => {
          console.log(user, 'jwtStrategy');
          return callback(null, user);
        })
        .catch(error => {
          return callback(error);
        });
    }
  )
);
