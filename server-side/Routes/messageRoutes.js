const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const Message = require('../models/MessageModel');


router.post('/messages/send', authenticateToken, async (req, res) => {
  try {
    const { receiver, messageText } = req.body;
    const sender = req.user.id;
    console.log(req.user);

    const message = await Message.create({ sender, receiver, messageText });
    res.status(201).send(message);
  } catch (error) {
    res.status(500).send({ message: 'Error sending message', error: error.message})
  }
});

router.get('/messages/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 }); // => Sorting by date, oldest first <=

    console.log({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    });
    res.status(200).send(messages)
  } catch (error) {
    res.status(500).send({ message: 'Error retrieving messages', error: error.message });
  }
});

module.exports = router;