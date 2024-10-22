const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const User = require('./models/User');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const session = require('express-session');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Landing Page Route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// Configure Multer for profile picture upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
  const upload = multer({ storage });
  
  app.post('/register', upload.single('profilePicture'), async (req, res) => {
    try {
      const { name, email, gender, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = new User({
        name,
        email,
        gender,
        profilePicture: req.file.filename,
        password: hashedPassword
      });
  
      await newUser.save();
      res.redirect('/login');  // Redirect to login page after successful registration
    } catch (err) {
      res.status(500).send('Error during registration');
    }
  });
  app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(400).send('User not found');
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send('Invalid credentials');
      }
  
      // Set session user ID
      req.session.userId = user._id;
  
      // On successful login, redirect to their dashboard
      res.redirect('/dashboard');
    } catch (err) {
      res.status(500).send('Error during login');
    }
  });
  
  app.get('/dashboard', async (req, res) => {
    // Fetch the user and their matches from the database (add your authentication logic here)
    const user = await User.findById(req.user.id);  // Assume req.user contains the logged-in user info
    const matches = await User.find({ gender: { $ne: user.gender } });  // Fetch users of the opposite gender for matching
  
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
  });
  app.get('/api/dashboard', async (req, res) => {
    try {
      const user = await User.findById(req.user.id);  // Get the logged-in user
      const matches = await User.find({ gender: { $ne: user.gender } });  // Get opposite gender matches
  
      res.json({ user, matches });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching dashboard data' });
    }
  });
  
  app.post('/api/find-match', async (req, res) => {
    try {
      const user = await User.findById(req.user.id);  // Get the logged-in user
      const possibleMatches = await User.find({ gender: { $ne: user.gender } });  // Find users of the opposite gender
  
      if (possibleMatches.length === 0) {
        return res.json({ success: false, message: 'No matches available at the moment' });
      }
  
      const randomIndex = Math.floor(Math.random() * possibleMatches.length);
      const match = possibleMatches[randomIndex];  // Randomly select a match
  
      res.json({ success: true, match });
    } catch (err) {
      res.status(500).json({ error: 'Error finding match' });
    }
  });
  

// Configure session middleware
app.use(session({
  secret: 'soul-sphere-secret',  // Replace with a more secure secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true if using HTTPS
}));

// Middleware to check if user is logged in
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/login');
  }
}
// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

data.matches.forEach(match => {
    const matchDiv = document.createElement('div');
    matchDiv.classList.add('match-card');
    matchDiv.innerHTML = `
      <img src="/uploads/${match.profilePicture}" alt="${match.name}" class="profile-pic">
      <p>${match.name} (${match.gender})</p>
    `;
    matchesContainer.appendChild(matchDiv);
  });
  app.post('/api/find-match', async (req, res) => {
    try {
      const user = await User.findById(req.session.userId);
      const possibleMatches = await User.find({
        gender: { $ne: user.gender },
        age: { $gte: user.age - 5, $lte: user.age + 5 },  // Filter by age range
        location: user.location  // Filter by location
      });
  
      if (possibleMatches.length === 0) {
        return res.json({ success: false, message: 'No matches available at the moment' });
      }
  
      const randomIndex = Math.floor(Math.random() * possibleMatches.length);
      const match = possibleMatches[randomIndex];  // Randomly select a match
  
      res.json({ success: true, match });
    } catch (err) {
      res.status(500).json({ error: 'Error finding match' });
    }
  });
  