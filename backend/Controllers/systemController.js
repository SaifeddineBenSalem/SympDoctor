const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const DoctorApplication = require('../models/doctorApplication');
const Feedback = require('../models/feedback');

const secretKey = 'abcdefgh123AZERTY'; // Replace with a long, random string for security
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
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

exports.getFeedbackById  = async (req, res) => {
try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    const currentUser = await User.findUserById(decoded.userId);
    if (!(currentUser.role === "SuperAdmin" || currentUser.role === "Admin")) {
      return res.status(404).json({ message: 'No access' });
    }
    const applicationId = req.params.id;
    const application = await Feedback.findByFeedbackId(applicationId);
    if (application[0] === null || application[0] === undefined)
      return res.status(404).json({ message: 'Not found' });
    if (currentUser.role === "SuperAdmin" || currentUser.role === "Admin" )
      return res.json(application[0]);
    else {
      if (application[0].poster != currentUser.id  )
        return res.status(404).json({ message: 'Not allowed' });
      else 
      return res.json(application[0]);
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

exports.changePassword  = async (req, res) => {
  const {email,password} = req.body
  const user = await User.findByEmail(email);
  user.password = password;
  await User.updateUser(user);
  res.json(user);
  };

exports.verifySecurityQuestion  = async (req, res) => {
  const {email,question,answer} = req.body
  const user = await User.findByEmail(email);
  if (user) {
    if (user.security_question === question && user.security_reply === answer )
        res.json(user);
    else
        res.status(404).json({ message: 'Incorrect data ! please retry' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
  };
exports.getUserByEmail  = async (req, res) => {
  const {email} = req.body
  const user = await User.findByEmail(email);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
  };

exports.getUserById  = async (req, res) => {

const userId = req.params.id;
const user = await User.findUserById(userId);
if (user) {
  res.json(user);
} else {
  res.status(404).json({ message: 'User not found' });
}
};
exports.downloadApplication  = async (req, res) => {
try{
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    const currentUser = await User.findUserById(decoded.userId);
    if (!(currentUser.role === "SuperAdmin" || currentUser.role === "Admin")) {
      return res.status(404).json({ message: 'No access' });
    }
    const fileName = req.body.fileName;
  
    const filePath = path.join(__dirname, '../uploads/applications/', fileName);
  
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
        res.status(500).send('Error downloading the file');
      }
    });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

exports.getAllApplications  = async (req, res) => {
const {userId} = req.body;
const user = await User.findUserById(userId);
if (user === null ||user == undefined)
    return res.status(400).send('Undefined user');
else {
let listOfApplicaiton= null;
if (user.role === "Admin" || user.role ==="SuperAdmin")
  listOfApplicaiton=await  DoctorApplication.getAllApplications();
else 
  listOfApplicaiton=await  DoctorApplication.getApplicationsByApplicantId(userId);
res.json({ applications:listOfApplicaiton });
}
}



exports.getAllUsers  = async (req, res) => {
try {
    const user = await User.findAllUsers();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


exports.getApplicationById  = async (req, res) => {
try {
  console.log("Authorization Header:", req.headers.authorization);
  const userId1 = await verifyToken(req);
  console.log("hey");
  const currentUser = await User.findUserById(userId1);
  if (!(currentUser.role === "SuperAdmin" || currentUser.role === "Admin")) {
    return res.status(404).json({ message: 'No access' });
  }
  const applicationId = req.params.id;
  const application = await DoctorApplication.getApplicationById(applicationId);
  if (application[0] === null || application[0] === undefined)
    return res.status(404).json({ message: 'Not found' });
  if (currentUser.role === "SuperAdmin" || currentUser.role === "Admin" )
    return res.json(application[0]);
  else {
    if (application[0].applicant != currentUser.id  )
      return res.status(404).json({ message: 'Not allowed' });
    else 
    return res.json(application[0]);
  }
} catch (err) {
  return res.status(401).json({ error: 'Invalid token' });
}
};



exports.getUserByIdWithoutParam  = async (req, res) => {

try {
    const id = req.query.id; // Use req.query to get query parameters
    if (!id) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    const user = await User.findUserById(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
exports.getFeedbacks  = async (req, res) => {

      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secretKey);
      const user = await User.findUserById(decoded.userId);
      if (user === null ||user == undefined)
          return res.status(400).send('Login first');
      else {
      let listOfApplicaiton= null;
      if (user.role === "Admin" || user.role ==="SuperAdmin")
        listOfApplicaiton=await  Feedback.getAllFeedbacks();
      else 
        listOfApplicaiton=await  Feedback.findByPosterId(user.id);
      res.json({ applications:listOfApplicaiton });
      }
};


exports.getFeedbacksForHomePage = async (req, res) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    let decoded = null;

    if (token) {
      try {
        decoded = jwt.verify(token, secretKey);
      } catch (error) {
        // If token is expired or invalid, ignore it and continue
        console.log('Invalid or expired token. Ignoring...');
      }
    }

    // If decoded is null or undefined, it means the token was invalid or expired
    if (!decoded) {
      // Proceed without authentication
      let listOfApplications = await Feedback.getAllApplications();
      listOfApplications = shuffleArray(listOfApplications);
      const firstFiveApplications = listOfApplications.slice(0, 5);
      res.json({ applications: firstFiveApplications });
    } else {
      let user = await User.findUserById(decoded.userId);
      if (user) {
        return res.status(400).send('Logout first');
      } else {
        let listOfApplications = await Feedback.getAllApplications();
        listOfApplications = shuffleArray(listOfApplications);
        const firstFiveApplications = listOfApplications.slice(0, 5);
        res.json({ applications: firstFiveApplications });
      }
    }
  } catch (error) {
    console.error('Error in /getfeedbacksforhomepage:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}