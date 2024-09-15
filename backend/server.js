// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');

const mysql = require('mysql2');


const app = express();
const port = process.env.PORT || 5000;
app.use('/uploads', express.static('uploads'));

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'hello', 
  database: 'sympdoctor',
  port:3306
});

db.connect(err => {
  if (err) {
    console.error('error connecting to the database:', err);
    return;
  }
  console.log('connected to the database');
});

app.use(session({
  name: 'loggingSession',
  secret: 'donottouchthis', // Change to a secure random string
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if using HTTPS
}));

// Routes
const userRoutes = require('./routes/users');
const disease = require('./routes/diseases');
const feedbackRoutes = require('./routes/feedback');

app.use('/api/users', userRoutes);
app.use('/api/diseases', disease);
app.use('/api/feedback', feedbackRoutes);
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
