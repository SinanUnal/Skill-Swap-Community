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
    console.log('Received userId:', userId);
    const currentUserId = req.user.id;
    console.log('Current authenticated userId:', currentUserId);

    if (userId === currentUserId) {
      console.log("UserId and currentUserId are the same, no messages to fetch.");
      return res.status(400).send({ message: "Cannot fetch messages: userId and currentUserId are the same." });
    }

    const query = {
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    };

    console.log("Executing query with conditions:", JSON.stringify(query, null, 2));

    const messages = await Message.find(query).sort({ createdAt: 1 });

    if (messages.length === 0) {
      console.log("No messages found for the query.");
    } else {
      console.log(`Found ${messages.length} messages.`);
      messages.forEach((msg, index) => {
        console.log(`Message ${index + 1}:`, JSON.stringify(msg, null, 2));
      });
    }

    res.status(200).send(messages);
  } catch (error) {
    console.error("Error in GET /messages/:userId:", error);
    res.status(500).send({ message: 'Error retrieving messages', error: error.message });
  }
});

router.delete('/messages/:messageId', authenticateToken, async (req, res) => {
  try {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);

    if(!message) {
      return res.status(404).send({ message: 'Message not found'});
    }

    if (message.sender.toString() !== req.user.id) {
      return res.status(403).send({ message: 'Not allowed to delete this message'});
    }

    await Message.deleteOne({ _id: messageId });
    res.status(200).send({ message: 'Message deleted successfully' });
  } catch (error) { 
    res.status(500).send({message: 'Error deleting message', error: error.message}); 
  }
});




// router.get('/messages/:userId', authenticateToken, async (req, res) => {
//   try {
//     const { userId } = req.params;
//     console.log('Receivde userId:', userId );
//     const currentUserId = req.user.id;

//     const query = {
//       $or: [
//         { sender: currentUserId, receiver: userId },
//         { sender: userId, receiver: currentUserId }
//       ]
//     };

    
//     console.log("Executing query:", query);
//     const messages = await Message.find(query).sort({ createdAt: 1 });
//     console.log("Messages found:", messages);

//     // const messages = await Message.find({
//     //   $or: [
//     //     { sender: currentUserId, receiver: userId },
//     //     { sender: userId, receiver: currentUserId }
//     //   ]
//     // }).sort({ createdAt: 1 }); // => Sorting by date, oldest first <=

//     // console.log({
//     //   $or: [
//     //     { sender: currentUserId, receiver: userId },
//     //     { sender: userId, receiver: currentUserId }
//     //   ]
//     // });
//     res.status(200).send(messages)
//   } catch (error) {
//     res.status(500).send({ message: 'Error retrieving messages', error: error.message });
//   }
// });

module.exports = router;