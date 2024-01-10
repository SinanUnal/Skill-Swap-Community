const express = require('express');
const app = express();
app.use(express.json());
const connection = require('./connection');
const MvpUserModel = require('./models/MvpUserModel');
const Skill = require('./models/SkillModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userRoutes = require('./Routes/userRoutes');
const skillRoutes = require('./Routes/skillRoutes');

const cors = require('cors');
app.use(cors({
  origin:'*',
}));


const port = 3636;

app.use(userRoutes);
app.use(skillRoutes);






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});