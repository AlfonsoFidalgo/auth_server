const User = require('../models/user');
const jwt = require('jwt-simple');
const config = require('../config');


function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret)
}

module.exports.signup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //user exist?
  User.findOne({ email: email}, (err, existingUser) => {
    if (err) { return next(err);}

    if (!email || !password) {
      return res.status(422).send({ error: 'you must provide email and password'});
    }
    //if does exist, return error
    if(existingUser){
      return res.status(422).send({error: 'email in use'});
    }

    //if not, create and save
    const user = new User({
      email: email,
      password: password
    });

    user.save( (err) => {
      if(err){ return next(err)}

      //respond JWT
      res.json({ token: tokenForUser(user) });
    });


  });
}
