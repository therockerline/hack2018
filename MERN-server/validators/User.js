const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
var { check, validationResult } = require("express-validator/check");

  const changeImageValidation = [
    check("image")
      .not()
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

  const changePassValidation = [
    check("current_password")
      .not()
      .isEmpty()
      .withMessage("Current password is required")
      .custom(function(value, { req }) {
      if (!bcrypt.compareSync(value, req.session.user.password)) {
      throw new Error(req.body);
      }
      return value;
      }),
    check("new_password")
      .not()
      .isEmpty()
      .withMessage("New Password is required"),
    check("new_password_con")
      .not()
      .isEmpty()
      .withMessage("Password is required")
      .custom(function(value, { req }) {
    if (value !== req.body.new_password) {
      throw new Error(req.body);
    }
    return value;
    })
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
      return UserModel.findOne({ email: value }).then(function(user) {
        if (user) {
          throw new Error("This email is already in use");
        }
      });
    })
];



module.exports =  {
 changeImageValidation : changeImageValidation,
 logValidation : logValidation,
 regValidation : regValidation,
 changePassValidation : changePassValidation
};