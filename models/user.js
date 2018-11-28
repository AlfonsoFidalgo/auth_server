const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
//model definition
const userSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  password: String
});

//psw encriptation
userSchema.pre('save', (next) => {
  const user = this;

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err);}

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err){ return next(err);}
      console.log(hash)
      user.password = hash;
      next();
    })
  })
})

//model class creation
const ModelClass = mongoose.model('user', userSchema);


//export the model
module.exports = ModelClass;
