import { validationResult, body } from 'express-validator';

export default class userValidation {
  //----------------!!!!!!!!!!! signUpValidation !!!!!!!!

  static async signUpValidation(req, res, next) {
    const rules = [
      body('username')
        .notEmpty()
        .withMessage('🔶 Please fill out all required fields.')
        .isLength({ min: 4, max: 12 })
        .withMessage('🔶 Name should have atleast 5 to 12 characters'),

      body('DOB')
        .notEmpty()
        .withMessage('🔶 Please fill out all required fields.')
        .isISO8601()
        .withMessage('🔶 Please enter a valid date (YYYY-MM-DD).')
        .custom((value) => {
          const dob = new Date(value);
          const today = new Date();

          const age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();

          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }

          if (age < 18) {
            throw new Error(
              '🔶 You need to be at least 18 years old to sign up.'
            );
          }

          return true;
        }),

      body('gender')
        .notEmpty()
        .withMessage('🔶 Please fill out all required fields.')
        .isIn(['male', 'female', 'other'])
        .withMessage('🔶 Please select a valid gender.'),

      body('email')
        .notEmpty()
        .withMessage('🔶 Please fill out all required fields.')
        .isEmail()
        .withMessage('🔶 Enter a valid email address'),

      body('password')
        .notEmpty()
        .withMessage('🔶 Please fill out all required fields.')
        .isLength({ min: 8, max: 16 })
        .withMessage('🔶 Password should have 8 to 16 characters')
        .matches(/[!@#$%&*?]/)
        .withMessage(
          '🔶 Password should include at least one special character like !@#$%&*?'
        ),
    ];

    // Run all validation rules   run method returns promise.
    await Promise.all(rules.map((rule) => rule.run(req)));

    // Get validation results
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    } else {
      next();
    }
  }

  //----------------!!!!!!!!!!! signUpValidation !!!!!!!!-------------------------//

  //----------------!!!!!!!!!!! signInvalidation !!!!!!!!

  static async signInvalidation(req, res, next) {
    const rules = [
      body('email')
        .notEmpty()
        .withMessage('🔶 Please enter your email address')
        .isEmail()
        .withMessage('🔶 Please enter a valid email address'),
      body('password').notEmpty().withMessage('🔶 Please enter your password'),
    ];

    // Run validations sequentially to preserve order
    //it is similar to forEach loop but this can handle await
    for (let rule of rules) {
      await rule.run(req);
    }

    // Get validation results
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    } else {
      next();
    }
  }

  //----------------!!!!!!!!!!! signInvalidation !!!!!!!! ------------------------//

  //----------------!!!!!!!!!!! emailvalidation !!!!!!!!

  static async emailValidation(req, res, next) {
    const rules = [
      body('email')
        .notEmpty()
        .withMessage('🔶 Please enter your email address')
        .isEmail()
        .withMessage('🔶 Please enter a valid email address'),
    ];

    for (let rule of rules) {
      await rule.run(req);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    } else {
      next();
    }
  }

  //----------------!!!!!!!!!!! emailvalidation !!!!!!!!-----------------//

  //----------------!!!!!!!!!!! otpvalidation

  static async otpValidation(req, res, next) {
    const rules = [
      body('otpInput')
        .notEmpty()
        .withMessage('🔶 Please enter your one time password'),
    ];

    for (let rule of rules) {
      await rule.run(req);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    } else {
      next();
    }
  }

  //----------------!!!!!!!!!!! otpvalidation !!!!!!!!-----------------//

  //----------------!!!!!!!!!!! newPasswordvalidation !!!!!!!!

  static async newPasswordValidation(req, res, next) {
    const rules = [
      body('newPassword')
        .notEmpty()
        .withMessage('🔶 Both password fields must be filled.')
        .isLength({ min: 8, max: 16 })
        .withMessage('🔶 Password should have 8 to 16 characters')
        .matches(/[!@#$%&*?]/)
        .withMessage(
          '🔶 Password should include at least one special character like !@#$%&*?'
        ),
    ];
    for (let rule of rules) {
      await rule.run(req);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    } else {
      next();
    }
  }

  //----------------!!!!!!!!!!! newPasswordvalidation !!!!!!!!-----------------//

  //----------------!!!!!!!!!!! userProfileUpdateValidation !!!!!!!!

  static async userProfileUpdateValidation(req, res, next) {
    const rules = [
      body('username')
        .notEmpty()
        .withMessage('🔶 Username is required. Please fill it in.')
        .isLength({ min: 4, max: 12 })
        .withMessage('🔶 Name should have atleast 5 to 12 characters'),

      body('DOB')
        .notEmpty()
        .withMessage('🔶 Please fill out all required fields.')
        .isISO8601()
        .withMessage('🔶 Please enter a valid date (YYYY-MM-DD).')
        .custom((value) => {
          const dob = new Date(value);
          const today = new Date();

          const age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();

          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
          }

          if (age < 18) {
            throw new Error(
              '🔶 You cannot update your date of birth to reflect an age under 18.'
            );
          }

          return true;
        }),

      body('gender')
        .notEmpty()
        .withMessage('🔶 Please fill out all required fields.')
        .isIn(['male', 'female', 'other'])
        .withMessage('🔶 Please select a valid gender.'),
    ];
    for (let rule of rules) {
      await rule.run(req);
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors
          .array()
          .map((err) => ({ field: err.param, message: err.msg })),
      });
    } else {
      next();
    }
  }
}

//----------------!!!!!!!!!!! userProfileUpdateValidation !!!!!!!!-----------------//
