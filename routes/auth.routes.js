const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const {isLoggedIn, isLoggedOut} = require("../middleware/routes-guard.js")

const User = require("../models/User.model");
//const { default: mongoose } = require('mongoose');
const mongoose = require('mongoose');

router.get('/signup', isLoggedOut, (req, res) =>{
    res.render('auth/signup')
})

router.post('/signup', isLoggedOut, async (req,res) =>{
    console.log(req.body)
    const {username, password} = req.body

    if(!username || !password){
        res.render('auth/signup', {error: 'All fields are mandatory. Please provide your username and password.'});
        return;
    }

    try{
        const salt = bcrypt.genSaltSync(saltRounds)
        const hash = bcrypt.hashSync(password, salt)

        const userDb = await User.create({
            username,
            password: hash
        })
        req.session.currentUser = userDb
        res.redirect('/profile')
    }catch(err){
        console.log(err)
          if (err.code === 11000) {
            res.status(500).render("auth/signup", { error: "The email should be unique" })
          }
    }
})
router.get('/profile',isLoggedIn,(req,res) => {
  console.log('SESSION =====> ', req.session);
    res.render('users/user-profile', { userInSession: req.session.currentUser });
})

router.get('/login', isLoggedOut, (req, res) =>{
    res.render('auth/login')
})

router.post("/login", isLoggedOut, async(req, res) => {
    console.log(req.session)
    const { username, password } = req.body
  
    if ( !username || !password) {
      res.render("auth/login", { error: "Please provide a username & password"})
      return
    }
    try {
      const userDb = await User.findOne({username})
      if (!userDb) {
        res.render("auth/login", { error: "Usernot registered, Try again" })
      } else if (bcrypt.compareSync(password, userDb.password)){
        req.session.currentUser = userDb
        console.log(userDb)
        res.redirect('/profile')//ON MY IRONHACK THEY USE REDIRECT WHY?  (NOW CHNAGING TO IRONHACK TO SEE IF WORKS)
      } else {
        res.render("auth/login", { error: "Incorrect password, Try again" })
      }
    }catch (err) {
      console.log(err)
    }
  })

  router.post('/logout', isLoggedIn, (req, res, next) => {
    req.session.destroy(err => {
      if (err) next(err);
      res.redirect('/');
    });
  });


module.exports = router;