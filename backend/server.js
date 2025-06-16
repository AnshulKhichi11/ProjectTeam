const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
require('dotenv').config();
const app = express();
connectDB();
const path = require('path');
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/auth'));

app.use(session({
  secret: 'yourSecretKey', 
  resave: false,
  saveUninitialized: false
}));

// Only if file not found, serve index.html
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/dashboard', (req, res) => {
  res.render('dashboard'); // This will render views/dashboard.ejs
});

app.get('/login', (req, res) => {
  res.render('index'); // This will render views/login.ejs
});

app.get('/logout', (req, res) => {
  if (!req.session) return res.redirect('/login'); // Prevent error if session is missing
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));