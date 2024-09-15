const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const DoctorApplication = require('../models/doctorApplication');
const Feedback = require('../models/feedback');
const secretKey = 'abcdefgh123AZERTY'; // Replace with a long, random string for security

async function verifyToken(req) {
  const token = req.headers['authorization']?.split(' ')[1]; // Ensure correct extraction of token
  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded = await jwt.verify(token, secretKey);
    return decoded.userId;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

exports.AcceptFeedback  = async (req, res) => {
try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    
    const user = await User.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!(user.role === "SuperAdmin" || user.role === "Admin")) {
      return res.status(403).json({ message: 'No access' });
    }
    const applicationId = req.params.id;
    const application = await Feedback.findByFeedbackId(applicationId);
    if (application[0] === null || application[0] === undefined)
      return res.status(404).json({ message: 'Application not found !' });
    const timestampMs = Date.now();
    const dateString1 = new Date(timestampMs).toLocaleString();
    await Feedback.AcceptFeedback(applicationId,"Accepted",user.id,dateString1);
    res.status(200).json({ message: 'Application declined successfully' });
  
  } catch (error) {
    console.error('Error in accepintg feedback :', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}


exports.DeclineFeedback  = async (req, res) => {
try {
    console.log("hey");
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    
    const user = await User.findUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!(user.role === "SuperAdmin" || user.role === "Admin")) {
      return res.status(403).json({ message: 'No access' });
    }
    const applicationId = req.params.id;
    const application = await Feedback.findByFeedbackId(applicationId);
    if (application[0] === null || application[0] === undefined)
      return res.status(404).json({ message: 'Application not found !' });
    const {reason} =req.body;
    if (reason === null || reason === undefined || reason ==='' )
      return res.status(404).json({ message: 'Reason cannot be empty' });
    const timestampMs = Date.now();
    const dateString1 = new Date(timestampMs).toLocaleString();
    await Feedback.DeclineFeedback(applicationId,"Declined",user.id,dateString1,reason);
    res.status(200).json({ message: 'Application declined successfully' });
  
  } catch (error) {
    console.error('Error in accepintg feedback :', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

exports.declineApplication  = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log(`Token received: ${token}`);
        const decoded = jwt.verify(token, secretKey);
        console.log(`Decoded token: ${JSON.stringify(decoded)}`);
        const user = await User.findUserById(decoded.userId);
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
    
        if (!(user.role === "SuperAdmin" || user.role === "Admin")) {
          return res.status(403).json({ message: 'No access' });
        }
        const applicationId = req.params.id;
        const application = await DoctorApplication.getApplicationById(applicationId);
        if (application[0] === null || application[0] === undefined)
          return res.status(404).json({ message: 'Application not found !' });
        const {reason} =req.body;
        if (reason === null || reason === undefined || reason ==='' )
          return res.status(404).json({ message: 'Reason cannot be empty' });
          await DoctorApplication.declineApplication(applicationId,reason,"Declined");
          res.status(200).json({ message: 'Application declined successfully' });
        
      } catch (error) {
        console.error('Error in declineApplication:', error);
        res.status(401).json({ error: 'Unauthorized' });
      }
}
exports.updateRole  = async (req, res) => {

const {role} = req.body;
  const userId1 = await verifyToken(req);
  const currentUser = await User.findUserById(userId1);
  if (!(currentUser.role === "SuperAdmin" || currentUser.role === "Admin")) {
    return res.status(404).json({ message: 'No access' });
  }
  const userId = req.params.id;
  const user = await User.findUserById(userId);
  if (currentUser.role === "SuperAdmin"){
    user.role = role;
    await User.updateUser(user);
    return res.json(user);
  } else {
    if (user.role === "SuperAdmin")
      return res.status(404).json({ message: 'You cannot change this user\'s role' });
    if ( (user.role === "Admin" || user.role ==="Client") && (role === "Admin" || role === "Client")){
      user.role= role;
      await User.updateUser(user);
      return res.json(user);
    } 
     if ( (user.role === "Doctor" || user.role === "SuperDoctor") && (role === "Doctor" || role === "Client" || role === "SuperDoctor") ){
      user.role= role;
      await User.updateUser(user);
      return res.json(user);
    }
  }

};
exports.banUser  = async (req, res) => {
try {
    const userId1 = await verifyToken(req);
    const currentUser = await User.findUserById(userId1);
    if (!(currentUser.role === "SuperAdmin" || currentUser.role === "Admin")) {
      return res.status(404).json({ message: 'No access' });
    }
    const userId = req.params.id;
    const user = await User.findUserById(userId);

    if (currentUser.role === "Admin" && user.role === "SuperAdmin") {
      return res.status(404).json({ message: 'You cannot ban a super admin' });
    }

    if (user) {
      user.banned = !user.banned;
      await User.updateUser(user);
      return res.json(user);
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
exports.acceptApplication  = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, secretKey);
        
        const user = await User.findUserById(decoded.userId);
        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }
    
        if (!(user.role === "SuperAdmin" || user.role === "Admin")) {
          return res.status(403).json({ message: 'No access' });
        }
        const applicationId = req.params.id;
        const application = await DoctorApplication.getApplicationById(applicationId);
        if (application[0] === null || application[0] === undefined)
          return res.status(404).json({ message: 'Application not found !' });
        await DoctorApplication.AcceptApplication(applicationId,"Accepted");
        const applicant = await User.findUserById(application[0].applicant);
        applicant.role = "Doctor";
        await User.updateUser(applicant);
        res.status(200).json({ message: 'Application declined successfully' });
        
      } catch (error) {
        console.error('Error in declineApplication:', error);
        res.status(401).json({ error: 'Unauthorized' });
      }
}