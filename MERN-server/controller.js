const bodyparser = require("body-parser");
var { check, validationResult } = require("express-validator/check");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Post = require("./models/Post");

module.exports = function(app) {

  const postValidation = [
    check("post")
      .not()
      .isEmpty()
      .withMessage("Please write something.")
  ];

  const logValidation = [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
  ];

  const regValidation = [
    check("email")
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email should be an email address"),
    check("firstname")
      .not()
      .isEmpty()
      .withMessage("First name is required")
      .isLength({ min: 2 })
      .withMessage("Name should be at least 2 letters")
      .matches(/^([A-z]|\s)+$/)
      .withMessage("Name cannot have numbers"),
    check("lastname")
      .not()
      .isEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 2 })
      .withMessage("Last name should be at least 2 letters"),
    check("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 2 })
      .withMessage("Username should be at least 2 letters"),
    check("password")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password should be at least 6 characters"),
    check(
      "password_con",
      "Password confirmation  is required or should be the same as password"
    ).custom(function(value, { req }) {
    if (value !== req.body.password) {
      throw new Error(req.body);
    }
    return value;
    }),
    check("email").custom(value => {
      return User.findOne({ email: value }).then(function(user) {
        if (user) {
          throw new Error("This email is already in use");
        }
      });
    })
];

function addPost(req, res) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    var post = new Post(req.body);
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
  }

function register(req, res){
  var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    var user = new User(req.body);
    user.password = user.hashPassword(user.password);
    user
      .save()
      .then(user => {
        return res.json(user);
      })
.catch(err => res.send(err));
}

function isLoggedIn(req, res, next) {
    if (req.session.isLoggedIn) {
      next();
    } else {
    res.send('You are not logged in');
    }
}

function loginUser(req, res) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
    }
    User.findOne({
      email: req.body.email,
      role: 'subscriber'
    })
      .then(function(user) {
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
}

 function showPosts(req, res) {
    Post.find()
      .populate("user", ["username", "email"])
      .sort({ vote: "desc" })
      .then(post => {
        res.json(post);
      })
      .catch(error => {
        res.json(error);
      });
}


function deletePost(req, res){
  var errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
  }
  Post.deleteOne(req.body.post, function(err, obj) {
    if (err) throw err;
    console.log("1 post deleted");
    db.close();
  });
}

function fileUploader(req, res){
if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let sampleFile = req.files.sampleFile;
  sampleFile.mv('/upload/filename.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
    res.send('File uploaded!');
  });
}




function ModifyMyProfile(req, res){
var errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.send({ errors: errors.mapped() });
  }
 User.UpdateOne({username:req.session.user});
 if (err)
      return res.status(500).send(err);
    res.send('Profile modified');
}


function logout(req, res){
  req.session.destroy();
  res.send({ message: "Logged out!" });
}

function example(req, res){
res.json("sdasdsa");
}

function info(req, res){
res.json("sdasdsa");
}

app.get("/", example);
app.get("/info");
app.post("/api/register", regValidation, register);
app.post("/api/login", logValidation, loginUser);
app.get("/api/account", isLoggedIn);
app.post('/api/account/upload', fileUploader, isLoggedIn);
app.post('/api/account/modifyme', ModifyMyProfile, isLoggedIn);
app.post("/api/add/post", isLoggedIn, postValidation, addPost);
app.post("/api/del/post/id", isLoggedIn);
app.post("/api/mod/post/id", isLoggedIn);
app.post("/api/add/post/id/to/user/id" , isLoggedIn);
app.post("api/user/id", isLoggedIn);
app.post("/api/users", isLoggedIn);
app.post("/api/search/post", isLoggedIn);
app.post("/api/post/id", isLoggedIn);
app.get("/api/posts", showPosts);
app.get("/api/logout", logout);

}