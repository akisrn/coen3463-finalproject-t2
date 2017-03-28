var express = require('express');
var passport = require('passport');
var LabAdmin = require('../models/user-schema');
var RoomData = require('../models/room-schema');
var router = express.Router();


router.get('/', function (req, res)
 {

    if(req.user)
     {
        RoomData.find(function(err, RoomsData)
         {
            if (err)
             { throw err; }
            else
             {
               res.render('index', { RoomsData: RoomsData,
                                     title: "CpE Room Management System",
                                     user: req.user
                                  });
             }
         });
     }
    else
     {
        res.render('login', { title: 'Login || CpE Room Management System' });
     }

 });

router.get('/register', function(req, res)
 {
    res.render('register', { user : req.user,
                             title: "Register || CpE Room Management System" 
                           });
 });

router.post('/register', function(req, res)
 {

	var newUser = { 
                    username    : req.body.username,
					first_name  : req.body.firstname
                  }

    LabAdmin.findOne({username: newUser.username}, function(err, getUsername)
     {
        if(!getUsername)
         {
            LabAdmin.register(new LabAdmin(newUser), req.body.password, function(err, account)
             {
                if (err)
                 {
                    console.log(err.toString());
                    res.render('register', { errorRegistration: 'Registration error! Try again!',
                        					 title: "Register || To-Do List"
                        				    });
                 }
                 else 
                 {
                    passport.authenticate('local')(req, res, function ()
                     {
                        console.log('Registration successful!');
                        res.redirect('/');
                     });
                 }
             });
         }
        else
         {
          console.log('Username already exists!')
          res.render('register', { errorRegistration: 'USERNAME already exists!',
                                   title: "Register || To-Do List"
                                 });
         }
     });
 });

router.get('/login', function(req, res)
 {
    res.render('login', { user : req.user,
    				      title: "Login || To-Do List" 
    					});
 });

router.post('/login', function(req, res, next)
 {
    passport.authenticate('local', function(err, user)
     {
        if(!err)
         {
            if(!user)
             {
                res.render('login', { errorLogin: "Invalid USERNAME or PASSWORD!",
                                      title: "Login || To-Do List"
                                    });
             }
            else
             {
                req.logIn(user, function(err)
                 {
                    if(!err)
                     {
                        res.redirect('/');
                        console.log('Login success!');
                     }
                    else
                     {
                        res.render('login', { errorLogin: "Login Error! Try again!",
                                              title: "Login || To-Do List"
                                            });
                     }
                 })
             }
         }
         
        else
         {
           res.render('login', { errorLogin: "Authentication Failed!",
                                 title: "Login || To-Do List"
                               });
         }
     })(req, res, next);
 });

router.get('/logout', function(req, res)
 {
    req.logout();
    res.redirect('/');
 });

module.exports = router;