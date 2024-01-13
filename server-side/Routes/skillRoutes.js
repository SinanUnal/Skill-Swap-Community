const express = require('express');
const router = express.Router();
const Skill = require('../models/SkillModel');
const authenticateToken = require('../middleware/authenticateToken')



router.post('/skills', authenticateToken, async (req, res) => {
  try {
    if(!req.body.name || !req.body.description) {
      return res.send({ message: 'Please provide skill name and description.'});
    }

    if(!req.user) {
      return res.send({ message: 'Unauthorized'});
    }

    const userId = req.user._id;

    
    const newSkillData = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      createdBy: userId
    }
    
    const createNewSkill = await Skill.create(newSkillData);
    res.send(createNewSkill);
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
    console.error(error);
    res.send({ message: 'Error fetching the skills '});
  }
});

router.get('/skills/:id',  async (req, res) => {
  try {
    const id = req.params.id;
    const skill = await Skill.findById(id);
    
    if(!skill){
     return res.send({ message: 'Skill not found'});
    }

    res.status(200).send(skill);
  } catch (error){
    console.error(error);
    res.send({ message: 'Error retrieving the skill'});
  }
});

router.put('/skills/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;
    const updatedSkill = await Skill.findByIdAndUpdate(id, updateData, { new: true});

    if(!updatedSkill){
     return res.send({ message: 'Skill not found'});
    }

    res.send(updatedSkill);
  } catch (error) {
    console.error(error);
    res.send({ message: 'Could not update the skill'});
  }
});

router.delete('/skills/:id', authenticateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedSkill = await Skill.findByIdAndDelete(id);

    if(!deletedSkill){
      return res.send({ message: 'Skill not found'});
    }

    res.send({ message: 'Skill deleted successfully'});
  } catch (error) {
    console.error(error); // for debugging do not forget to add this always
    res.send({ message: 'Skill could not be deleted'});
  }
});


 module.exports = router;