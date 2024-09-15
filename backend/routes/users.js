
// routes/users.js
const express = require('express');
const router = express.Router();
const path = require('path');
const axios = require('axios');

const multer = require('multer');

const jwt = require('jsonwebtoken');
const secretKey = 'abcdefgh123AZERTY'; // Replace with a long, random string for security

const usersController = require('../Controllers/userController');
const adminController = require('../Controllers/adminController');
const systemController = require('../Controllers/systemController');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/applications/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // Extract file extension
      cb(null, file.fieldname + '-' + Date.now() + ext); // Generate a unique filename
  }
});
const fileFilter = function (req, file, cb) {
  const allowedTypes = ['.pdf'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(fileExt)) {
      return cb(new Error('Only PDF files are allowed!'));
  }
  cb(null, true);
};

const storagePhoto = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/profilephoto/'); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
      const ext = path.extname(file.originalname); // Extract file extension
      cb(null, file.fieldname + '-' + Date.now() + ext); // Generate a unique filename
  }
});
const fileFilterPhotos = function (req, file, cb) {
  const allowedTypes = ['.png','.jpg','.jpeg'];
  const fileExt = path.extname(file.originalname).toLowerCase();
  if (!allowedTypes.includes(fileExt)) {
      return cb(new Error('Only png,jpg or jpeg files are allowed!'));
  }
  cb(null, true);
};



const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter // Apply the file filter here
});
const uploadPhoto = multer({ 
  storage: storagePhoto, 
  fileFilter: fileFilterPhotos // Apply the file filter here
});

router.post('/downloadapplication', systemController.downloadApplication);



router.post('/applytobeadoctor', upload.single('fileUpload'), usersController.applyToBeADoctor);

router.post('/uploadprofilephoto', uploadPhoto.single('fileUpload'), usersController.uploadProfilePhoto);



router.post('/getapplications', systemController.getAllApplications);



router.post('/getallusers', systemController.getAllUsers);




router.get('/getapplicationbyid/:id', systemController.getApplicationById);

router.get('/getuserbyid', systemController.getUserByIdWithoutParam);
// Register user
router.post('/register', usersController.register);
router.post('/profile/edit', usersController.profileEdit);
router.post('/login', usersController.login);
// Route to serve the dashboard page

router.post('/acceptapplication/:id', adminController.acceptApplication);
router.post('/declineapplication/:id', adminController.declineApplication);
router.get('/getuserbyid/:id', systemController.getUserById);
router.post('/getuserbyemail', systemController.getUserByEmail);

router.post('/changepassword', systemController.changePassword);

router.post('/verifysecurityquestion', systemController.verifySecurityQuestion);


router.post('/updaterole/:id', adminController.updateRole);
router.post('/ban/:id', adminController.banUser);




router.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
      res.status(400).send('File upload error: ' + err.message);
  } else {
      res.status(400).send(err.message);
  }
});

module.exports = router;
