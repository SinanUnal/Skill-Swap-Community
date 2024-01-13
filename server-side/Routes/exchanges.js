const express = require('express');
const router = express.Router();
const SkillExchange = require('../models/ExchangeModel');


router.post('/exchanges', async (req, res) => {
  try {

    const { requester, skillOffered, skillRequested } = req.body;

    if(!requester || !skillOffered || !skillRequested ){
      return res.send({ message: 'Required missing fields'});
    }

    const newExchange = await SkillExchange.create({ requester, skillOffered, skillRequested});

    res.send(newExchange);

  } catch (error) {
    console.error(error);
    res.send({ message: 'Error creating exchange request'});
  }
});

router.get('/exchanges', async (req, res) => {
  try {

    // TODO: Replace with actual logged-in user's ID after implementing authentication
    const userId = '659f610f30544e7ed8a9ddd2';

    const exchanges = await SkillExchange.find({
      $or: [{ requester: userId }, { recipient: userId }]
    }).populate('requester skillOffered skillRequested');

    res.send(exchanges);
  } catch (error) {
    console.error(error);
    res.send({ message: 'Error retrieving exchange requests'});
  }
});

router.put('/exchanges/:id', async (req, res) => {
  try {
    const exchangeId = req.params.id;
    const { status } = req.body;

    if(!status || !['pending', 'accepted', 'declined', 'completed'].includes(status)) {
      return res.send({ message: 'Invalid or missing status' });
    }
      const updatedExchange = await SkillExchange.findByIdAndUpdate(exchangeId, { status }, { new: true });

    if(!updatedExchange) {
      return res.send({ message: 'Exchange request not found '});
    }

    res.send(updatedExchange);
  } catch (error) {
    console.error(error);
    res.send({ message: 'Error updating exchange request'});
  }
});

module.exports = router;