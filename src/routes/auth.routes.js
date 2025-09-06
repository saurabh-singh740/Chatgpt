const express = require('express');
const authcControllers = require('../controllers/auth.controller');

const router = express.Router();


router.post('/register',authcControllers.registerUser);


router.post('/login',authcControllers.loginUser);



module.exports = router;