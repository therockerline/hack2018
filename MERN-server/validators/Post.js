var { check, validationResult } = require("express-validator/check");

const postValidation = [
    check("post")
      .not()
      .isEmpty()
      .withMessage("Please write something.")
  ];

module.exports =  {
 postValidation : postValidation
};

  