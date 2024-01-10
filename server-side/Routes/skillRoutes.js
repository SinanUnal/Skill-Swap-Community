const express = require('express');
const router = express.Router();
const Skill = require('../models/SkillModel');



router.post('/skills', async (req, res) => {
  try {
    if(!req.body.name || !req.body.description) {
      return res.send({ message: 'Please provide skill name and description.'});
    }
    const skill = new Skill({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      // createdBy: req.user._id
    });

    await skill.save();
    res.send({ message: 'Skill created successfully'});
  } catch (error) {
    console.log(error);
    res.send({ message: 'Error creating skill'});
  }
});

router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find({});
    res.status(200).send(skills);
  } catch (error) {
    res.send({ message: 'Error fetching the skills '})
  }
})
 module.exports = router;