const express = require('express');
const app = express();
app.use(express.json());
const connection = require('./connection');
const userRoutes = require('./Routes/userRoutes');
const skillRoutes = require('./Routes/skillRoutes');
const exchanges = require('./Routes/exchanges');
const messageRoutes = require('./Routes/messageRoutes');

const cors = require('cors');
app.use(cors({
  origin:'*',
}));


const port = 3636;

app.use(userRoutes);
app.use(skillRoutes);
app.use(exchanges);
app.use(messageRoutes);






app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});