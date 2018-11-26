const PostModel = require("../models/Post");
const bodyparser = require("body-parser");
var { check, validationResult } = require("express-validator/check");

module.exports = {
    addPost: function(req, res) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    var post = new PostModel(req.body);
    if (req.session.user) {
      if (req.session.user.role == "subscriber") {
      post.user = req.session.user._id;
      post
        .save()
        .then(post => {
          res.json(post);
        })
        .catch(error => {
          res.json(error);
        });
      } else {
      return res.send({ error: "Operazione non consentita" });
    }
    } else {
      return res.send({ error: "You are not logged in!" });
    }
    },
    showPosts: function(req, res) {
    PostModel.find()
      .populate("user", ["username", "email"])
      .sort({ vote: "desc" })
      .then(post => {
        res.json(post);
      })
      .catch(error => {
        res.json(error);
      });
    },
    updatePost: function(req, res){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    PostModel.updateOne({title: req.body.titolo},{$set:{post:req.body.contenuto}})
      .then(function(post) {
        if (!post) {
          return res.send({ error: true, message: "Post does not exist!" });
        }
        return res.send({ message: "Post updated",post: post});
      })
      .catch(function(error) {
      console.log(error);
      });
    },
    deletePost: function(req, res){
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    if (req.session.user){
      if (req.session.user.role == "subscriber") {
         PostModel.deleteOne({
          title: req.body.titolo
         }).then(function(post) {
        if (!post) {
          return res.send({ error: true, message: "Post does not exist!" });
        }
        return res.send({ message: "Post deleted",post: post});
      })
      .catch(function(error) {
      console.log(error);
      });
      }
    }
   },
   UpVotePost: function(req, res){
    PostModel.findById(req.body.id).then(function(post) {
      post.vote = post.vote + 1;
      post.save().then(function(post) {
      res.send(post);
      });
    });
   }	
};