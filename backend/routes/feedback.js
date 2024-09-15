const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const secretKey = 'abcdefgh123AZERTY';
const User = require('../models/user');
const Feedback = require('../models/feedback');

const usersController = require('../Controllers/userController');
const adminController = require('../Controllers/adminController');
const systemController = require('../Controllers/systemController');



router.post('/declinefeedback/:id', adminController.DeclineFeedback);
router.post('/acceptfeedback/:id', adminController.AcceptFeedback);
router.post('/getfeedbacksforhomepage', systemController.getFeedbacksForHomePage);
router.post('/acceptfeedback/:id', adminController.AcceptFeedback);
router.post('/getfeedbacks', systemController.getFeedbacks);

router.post('/post', usersController.postFeedback);

router.get('/getfeedbackbyid/:id', systemController.getFeedbackById);


module.exports = router;
