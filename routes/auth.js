const express = require('express');

const {
  register,
  login,
  findMe,
  forgotPassword,
  resetpassword,
  updateDetails,
  updatePassword
} = require('../controllers/auth');

// Import protect route middleware for findMe route
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, findMe);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:token', resetpassword);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;
