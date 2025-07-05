
const express = require('express');
  const router = express.Router();
  const User = require('../models/User');

 
  // Login
  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      req.session.userId = user._id;
      res.status(200).json({ message: 'Logged in', user: { name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Logout
  router.post('/logout', (req, res) => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out' });
    });
  });

  module.exports = router;
