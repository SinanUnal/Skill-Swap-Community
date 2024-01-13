const express = require('express');
const router = express.Router();
const MvpUserModel = require('../models/MvpUserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');



router.post('/signup', async (req, res) => {
  if(!req.body.username || !req.body.password) {
    res.send({ message : 'Please fill the necessary section'});
    return;
  }
    const userExist = await MvpUserModel.findOne({ username: req.body.username });
    if(userExist != null){
      res.send({ message: 'This user is already exist'});
    }else{
      bcrypt.hash(req.body.password, 10 , async (err, hash) => {
        if(err){
          res.status(500).send({ message: 'Wrong password'});
          return;
        }
        const newUser = {
          username: req.body.username,
          password: hash,
          bio: req.body.bio || '',
          skills: req.body.skills || []
        };
        await MvpUserModel.create(newUser);
        res.send({ message: 'User is created successfully'});
      });
    }
});


router.post('/login', async (req, res) => {
  if(!req.body.username || !req.body.password) {
    res.send({ message: 'Please fill the necessary section'});
  }
  const user = await MvpUserModel.findOne({ username: req.body.username});
  if(!user){
   return res.status(401).send({ message: 'Wrong username or password'});
  }  
    bcrypt.compare(req.body.password, user.password, function (err, result) {
      if(err || !result) {
        return res.send({ message:'Wrong username or password'});
      }
        const token = jwt.sign({ id: user._id }, "Mvp project");
        res.send({ userId : user._id, token : token, message: 'Login is successful'});
    });
});

router.get('/users', async (req, res) => {
  try {
    const users = await MvpUserModel.find({});

    if(!users) {
      res.send({ message: 'No user found'});
    }

    res.send(users);
  } catch (error) {
    console.error(error);
    res.send({ message: 'No user found'});
  }
});

router.get('/users/:id', authenticateToken, async (req, res) => {
  try {
    const user = await MvpUserModel.findById(req.params.id).select('-password');
    if(!user) {
      return res.send({ message: 'User not found'});
    }
    res.send(user);
  } catch (error) {
    console.error(error);
    res.send({ message: 'Error fetching user'});
  }
});

router.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    const updateData = {
      username: req.body.username,
      bio: req.body.bio
    }

    const updatedUser = await MvpUserModel.findByIdAndUpdate(req.params.id, updateData, { new: true}).select('-password');

    if(!updatedUser) {
      res.send({ message: 'User not found'});
    }

    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.send({ message: 'Error updating user information'});
  }
});


module.exports = router;