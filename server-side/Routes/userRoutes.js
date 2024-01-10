const express = require('express');
const router = express.Router();
const MvpUserModel = require('../models/MvpUserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
        const token = jwt.sign({ id: user._id }, 'first MvP project');
        res.send({ userId : user._id, token : token, message: 'Login is successful'});
    });
});


module.exports = router;