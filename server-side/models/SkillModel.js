const mongoose = require('mongoose');


const UserSkills = mongoose.model('Skill', {
  name: String,
  description: String,
  category: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});



module.exports = UserSkills;