const express = require('express');
const router = express.Router();

var userController = require("./assets/user.controller.js")

router.route('/') 
    .get(userController.getUser);
    
router.route('/register')
    .post(userController.registerUser);

module.exports = router;