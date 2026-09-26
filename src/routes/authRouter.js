const express = require('express');
const router = express.Router();
const { registraionValidation, loginValidation } = require('../middleware/validation');
const { register, login } = require('../controllers/authController');

router.post('/register', registraionValidation, register);
router.post('/login', loginValidation, login);

module.exports = router;