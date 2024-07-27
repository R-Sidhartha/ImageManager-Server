const express = require('express');
const { registerUser, authUser, getUserProfile } = require('../controllers/UserController');
const { protect } = require('../middleware/AuthMiddleware');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Validation rules
const userValidationRules = [
  body('username')
    .isString()
    .isLength({ min: 5 })
    .withMessage('UserName should be at least 5 characters'),
  body('email')
    .isEmail()
    .withMessage('Invalid email address'),
  body('password')
    .isString()
    .isLength({ min: 5 })
    .withMessage('Password should be at least 5 characters'),
];

// Middleware to handle validation
const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

// Routes
router.post('/', userValidationRules, validate, registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;
