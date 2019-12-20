const express = require('express');

const {
  register,
  login,
  findMe,
  forgotPassword
} = require('../controllers/auth');

// Import protect route middleware for findMe route
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, findMe);
router.post('/forgotpassword', forgotPassword);

module.exports = router;
