const mongoose = require('mongoose');

const MvpUser = mongoose.model('User', {
  username : String,
  password : String,
  bio: String,
});

module.exports = MvpUser;