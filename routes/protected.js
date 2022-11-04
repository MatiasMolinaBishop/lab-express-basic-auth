const express = require('express');
const router = express.Router();
//const bcrypt = require("bcryptjs");
//const saltRounds = 10;

const {isLoggedIn, isLoggedOut} = require("../middleware/routes-guard.js")

//const User = require("../models/User.model");
const mongoose = require('mongoose');

router.get('/main', isLoggedIn,(req, res) =>{
    res.render('protected/main')
})

router.get('/private', isLoggedIn,(req,res) =>{
    res.render('protected/private')
})

module.exports = router;