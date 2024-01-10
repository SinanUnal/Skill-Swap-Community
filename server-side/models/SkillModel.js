const mongoose = require('mongoose');


const userSkills = mongoose.model('Skill', {
  name: String,
  description: String,
  category: String,
  // createdBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User'
  // }
});



module.exports = userSkills;