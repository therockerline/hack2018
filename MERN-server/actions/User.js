const UserModel = require("../models/User");
var { check, validationResult } = require("express-validator/check");
const fs = require("fs");
const bodyparser = require("body-parser");
const bcrypt = require("bcrypt");

module.exports = {
    register: function(req, res){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    var user = new UserModel(req.body);
    user.password = user.hashPassword(user.password);
    user.img = './uploads/users/images/default.png'
    user
      .save()
      .then(user => {
        return res.json(user);
      })
    .catch(err => res.send(err));
    },
    login: function(req, res) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    UserModel.findOne({
      email: req.body.email,
      role: 'subscriber'
    }).then(function(user) {
        if (!user) {
          return res.send({ error: true, message: "User does not exist!" });
        }
        if (!user.comparePassword(req.body.password, user.password)) {
          return res.send({ error: true, message: "Wrong password!" });
        }
        req.session.user = user;
        req.session.isLoggedIn = true;
        return res.send({ message: "You are signed in" });
        res.send(user);
      })
      .catch(function(error) {
        console.log(error);
      });
    },
    logout: function(req, res){
    req.session.destroy();
    res.send({ message: "Logged out!" });
    },
    isLoggedIn: function(req, res, next) {
    if (req.session.isLoggedIn) {
      return next();
    } else {
    res.send('You are not logged in');
    }
    },
    newMyProfilePassword: function(req, res){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    UserModel.updateOne({email:req.session.user.email,password:req.session.user.password},
    {$set:{password:bcrypt.hashSync(req.body.new_password, 12)}  
    }).then(function(User) { if (!User) {
    return res.send({ error: true, message: "user does not exist!" });
    }
    return res.send({ message: "Password updated"});
    }).catch(function(error) {
    console.log(error);
    });
    },
    newMyProfileImage: function(req, res){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    if (Object.keys(req.files).length == 0) {
      return res.status(400).send('No files were uploaded.');
    }
    if (req.session.user){
      if (req.session.user.role == "subscriber") {
          var dirFile = './uploads/users/images/'+req.session.user._id+'.png';
          let sampleFile = req.files.image;
          sampleFile.mv(dirFile, function(err) {
          if (err)
          return res.status(500).send(err);
     });
     UserModel.updateOne({ email: req.session.user.email,img: req.session.user.img },{ $set: {img: dirFile } 
      }).then(function(User) { if (!User) {
          return res.send({ error: true, message: "user does not exist!" });
       }
    return res.send({ message: "Image updated"});
    }).catch(function(error) {
     console.log(error);
    });
    }
    }
    },
    getMyProfileImage: function(req, res){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    UserModel.findOne({img:req.session.user.img},{role:0,_v:0,_id:0,
    firstname:0,lastname:0,username:0,password:0,email:0,createdAt:0,updatedAt:0})
    .then(function(User) { if (!User) {
          return res.send({ error: true, message: "user does not exist!" });
    }
    return res.send(User);
    }).catch(function(error) {
      console.log(error);
    });
    },
    getMyGeoloc: function(req, res, next){
    where.is(req.ip, function(err, result) {
    req.geoip = result;
    next();
    });
    },
    exportpdf: function(req, res){
    res.json("sdasdsa");
    },
    info: function(req, res){
    res.json("sdasdsa");
    }
    
};