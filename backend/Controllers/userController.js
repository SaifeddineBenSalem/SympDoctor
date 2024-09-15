const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const DoctorApplication = require('../models/doctorApplication');
const secretKey = 'abcdefgh123AZERTY'; // Replace with a long, random string for security
const Feedback = require('../models/feedback');

async function getUserPublicIP() {
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      const ipAddress = response.data.ip;
      return ipAddress;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      return null;
    }
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
  exports.uploadProfilePhoto = async (req, res) => {
    const file = req.file;
    const { userId } = req.body;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    const user = await User.findUserById(userId);
    user.photo = file.filename;
    await User.updateUser(user);
    res.json({ message: 'File uploaded successfully.', file: file });
  };
  
  exports.applyToBeADoctor = async (req, res) => {
    const file = req.file;
    const { userId } = req.body;
    if (!file) {
      return res.status(400).send('No file uploaded.');
    }
    const timestampMs = Date.now();
    const dateString1 = new Date(timestampMs).toLocaleString();
    DoctorApplication.create(userId, file.filename, dateString1);
    res.json({ message: 'File uploaded successfully.', file: file });
  };

  exports.profileEdit  = async (req, res) => {
  const { user_id, firstName, lastName, email, username,gender,birthdate,country,phoneNumber,address,newPassword,oldpassword,repeatNewPassword,facebook,linkedin,website,securityQuestion,securityResponse } = req.body;
  try {
    // Check if email already exists
    const existingUser = await User.findUserById(user_id);
    if (oldpassword == null || oldpassword == '' || oldpassword == ' ') { // This checks for null or undefined
        return res.status(400).send('You need to type your password.');
    }
    if (existingUser.password != oldpassword) 
      return res.status(400).send('Your password is inconnrect');

    if (firstName == null || firstName == '' || firstName == ' ') { // This checks for null or undefined
      return res.status(400).send('First Name is required');
    }
    if (lastName == null || firstName == '') { // This checks for null or undefined
      return res.status(400).send('Last Name is required');
    }
    if (email == null || email == '') { // This checks for null or undefined
      return res.status(400).send('Email Name is required');
    }
    if (username == null || username == '') { // This checks for null or undefined
      return res.status(400).send('Username Name is required');
    }
    if (gender == null || gender == '') { // This checks for null or undefined
      return res.status(400).send('Gender Name is required');
    }
    if (birthdate == null || birthdate == '') { // This checks for null or undefined
      return res.status(400).send('Birthdate is required');
    }

  const birthDate = new Date(birthdate);
  const currentDate = new Date();
  let ipAddress = await getUserPublicIP();
  console.log(ipAddress);
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDifference = currentDate.getMonth() - birthDate.getMonth();
  const dayDifference = currentDate.getDate() - birthDate.getDate();

  // Adjust age if the current month/day is before the birth month/day
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }
  if (age <18) { // This checks for null or undefined
    return res.status(400).send('You should be 18 or above in order to be in this website ');
  }
  if (facebook != '' && facebook != ' ' && facebook != undefined && facebook != null ){
    if (!facebook.includes('https://www.facebook.com/')) {
      return res.status(400).send('Facebook url is not respected');
    }
  }
  if (linkedin != '' && linkedin != ' ' && linkedin != undefined && linkedin != null ){
    if (!linkedin.includes('https://www.linkedin.com/')) {
      return res.status(400).send('Linkedin url is not respected');
    }
  }
    if (existingUser.username != username) {
      const user2 = await User.findByUserName(username);
      if (user2)
        return res.status(400).send('Username already exists');
      else 
        existingUser.username = username;
    }
    if (existingUser.email != email) {
      const user2 = await User.findByEmail(email);
      if (user2)
        return res.status(400).send('Email already exists');
      else 
        existingUser.email = email;
    }
    if (newPassword != null && newPassword  != '') {
      if (existingUser.password ===  newPassword) 
        return res.status(400).send('Old password is similar to the new password');
      if (newPassword != repeatNewPassword )
        return res.status(400).send('New password doesn\'t match with the repeated one.');
      existingUser.password = newPassword;
    }
    if (securityQuestion != null && securityQuestion != undefined && securityQuestion != ''){
      if (securityResponse === '' || securityResponse === ' ' || securityResponse === null || securityResponse === undefined){
        return res.status(400).send('Security response cannot be empty if you\'re changing it. ');
      } else {
        existingUser.security_question = securityQuestion;
        existingUser.security_reply = securityResponse;
      }
    }
    console.log(securityResponse);
    if (securityResponse != '' && securityResponse != ' ' && securityResponse != null && securityResponse != undefined){
      if (securityQuestion === null || securityQuestion === undefined || securityQuestion === ''){
        return res.status(400).send('Security question cannot be empty if you\'re changing it. ');
      }
      else {
        existingUser.security_question = securityQuestion;
        existingUser.security_reply = securityResponse;
      }
    }
    existingUser.first_name=firstName;
    existingUser.last_name = lastName;
    existingUser.birthdate = birthdate;
    existingUser.phoneNumber=phoneNumber;
    existingUser.address = address;
    existingUser.country=country;
    existingUser.gender=gender;
    existingUser.facebook=facebook;
    existingUser.linkedin=linkedin;
    existingUser.website= website;
    existingUser.ip= ipAddress;
    
        // Create new user
    const userId = await User.updateUser(existingUser);
    res.status(201).send('Error registering user');
    //res.status(201).send(`User with ID ${userId} Updated successfully`);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
  };
  exports.login = async (req,res) => {
    const { username, password } = req.body;
  try {
    let user = await User.findByEmail(username) || await User.findByUserName(username);

    if (!user) {
      return res.status(400).send('The email, username or password you entered is incorrect. Please try again.');
    } else {
      if ( user.password !== password)
        return res.status(400).send('The email, username or password you entered is incorrect. Please try again.');
      if (user.banned == 1)
        return res.status(400).send('Access denied: You are banned.');
    }
    const timestampMs = Date.now();
    const dateString1 = new Date(timestampMs).toLocaleString();
    user.last_login=dateString1;
    user.ip = await getUserPublicIP();
    User.updateUser(user);
    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' }); // Adjust expiration as needed
    req.session.userId = user.id;
    console.log('Session userId set:', req.session.userId);
    res.status(200).json({ token }); // Send the token back to the client
  } catch (error) {
    console.error('Error Logging in', error);
    res.status(500).send('Error Logging in');
    }
  };
  exports.register = async (req, res) => {
    const { firstName, lastName, email, username, password,gender,birthdate,country,security_question,securityreply,repeatpassword,confirmemail } = req.body;
    try {
      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).send('Email already exists');
      }
      if (!firstName) return res.status(400).send('First name cannot be empty');
      if (!lastName) return res.status(400).send('Last name cannot be empty');
      if (!email) return res.status(400).send('Email cannot be empty');
      if (!username) return res.status(400).send('Username cannot be empty');
      if (!password) return res.status(400).send('Password cannot be empty');
      if (!gender || gender ==='') return res.status(400).send('Gender cannot be empty');
      if (!birthdate) return res.status(400).send('Birthdate cannot be empty');
      if (!country) return res.status(400).send('Country cannot be empty');
      if (!security_question ||security_question === '') return res.status(400).send('Security question cannot be empty');
      if (!securityreply) return res.status(400).send('Security response cannot be empty');
      if (!repeatpassword ) return res.status(400).send('Repeated question cannot be empty');
      if (!confirmemail ) return res.status(400).send('Confirmed email cannot be empty');
      if (confirmemail != email) return res.status(400).send('Emails doesn\'t correspond');
      if (password != repeatpassword) return res.status(400).send('passwords doesn\'t match');
      // Calculate age
      const birthDateObj = new Date(birthdate);
      let age = new Date().getFullYear() - birthDateObj.getFullYear();
      const monthDifference = new Date().getMonth() - birthDateObj.getMonth();
      const dayDifference = new Date().getDate() - birthDateObj.getDate();
    
      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
      }
    
      if (age < 18) {
        return res.status(400).send('Age must be 18 or above');
      }
      // Create new user
      const ip = await getUserPublicIP();
      const userId = await User.create(firstName, lastName, email, username, password,gender,ip,birthdate,country,security_question,securityreply);
      res.status(201).send(`User with ID ${userId} registered successfully`);
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Error registering user');
    }
  };


  exports.postFeedback = async (req, res) => {
    try{
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, secretKey);
      console.log(decoded);
      currentUser = await User.findUserById(decoded.userId);
      if (currentUser === null || currentUser === undefined)
          return res.status(404).json({ message: 'You need to login' });
      const {feedbackOfUser,ratingOfUser}= req.body;
      if (feedbackOfUser === null || feedbackOfUser === undefined || feedbackOfUser === '' || feedbackOfUser === ' ')
          return res.status(404).json({ message: 'Feedback should not be empty ' });
      console.log("hey");
      const feedbackExist = await Feedback.findByPosterIdAndStatus(currentUser.id,"Pending");
      console.log(feedbackExist);
      if (!(feedbackExist[0] === null || feedbackExist[0] === undefined))
          return res.status(404).json({ message: 'You already have a pending request' });
      const timestampMs = Date.now();
      const dateString1 = new Date(timestampMs).toLocaleString();
      await Feedback.create(feedbackOfUser,currentUser.id,dateString1,ratingOfUser);
      return res.status(200).json({ message: 'Done' });
  } catch (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
