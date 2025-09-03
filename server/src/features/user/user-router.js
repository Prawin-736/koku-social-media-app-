import express from 'express';
import path from 'path';
import multer from 'multer';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import userValidation from '../../middleware/user-validation.js';
import UserController from './user-controller.js';
import { jwtAuth, jwtNewPassAuth } from '../../middleware/jwt.js';
import { jwtOtpAuth } from '../../middleware/jwt.js';

// setting this to get absoulte path
const __dirname = dirname(fileURLToPath(import.meta.url));

export const userRouter = express.Router();
const userController = new UserController();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//-----------userLoginPage

userRouter.get('/signIn', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../client/src/user/Signin.html'));
});

userRouter.post(
  '/signIn',
  userValidation.signInvalidation,
  (req, res, next) => {
    userController.signIn(req, res, next);
  }
);

//-----------userLoginPage---------------------//

//-----------userSignUpPage

userRouter.get('/signUp', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../client/src/user/Signup.html'));
});

userRouter.post(
  '/signUp',
  userValidation.signUpValidation,
  (req, res, next) => {
    userController.signUp(req, res, next);
  }
);

//-----------userSignUpPage-------------------------//

//----------------forgotPasswordPage

userRouter.get('/forgotPassword', (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../../../client/src/user/Forgotpassword.html')
  );
});
userRouter.post(
  '/forgotPassword',
  userValidation.emailValidation,
  (req, res, next) => {
    userController.generateOtpSend(req, res, next);
  }
);

//----------------forgotPasswordPage-----------------//

//------------------otpVerificationPage

userRouter.get('/otpverification', jwtOtpAuth, (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../../../client/src/user/verification.html')
  );
});

userRouter.post(
  '/otpverification',
  jwtOtpAuth,
  userValidation.otpValidation,
  (req, res, next) => {
    userController.verifyOtp(req, res, next);
  }
);

//  resendOtp
userRouter.post('/resendOtp', jwtOtpAuth, (req, res, next) => {
  userController.generateOtpSend(req, res, next);
});

//------------------otpVerificationPage-------------------------//

//--------------------newPasswordPage

userRouter.get('/newPassword', jwtNewPassAuth, (req, res) => {
  res.sendFile(
    path.join(__dirname, '../../../../client/src/user/Newpassword.html')
  );
});

userRouter.post(
  '/newPassword',
  jwtNewPassAuth,
  userValidation.newPasswordValidation,
  (req, res, next) => {
    userController.newPassword(req, res, next);
  }
);

//--------------------newPasswordPage-------------------//

//-----------------userSection

// upload profile picture
userRouter.post(
  '/profilepicture',
  jwtAuth,
  upload.single('profileImage'),
  (req, res, next) => {
    userController.uploadProfilePicture(req, res, next);
  }
);

// remove Profile picture
userRouter.post('/removeprofilepicture', jwtAuth, (req, res, next) => {
  userController.removeProfilePicture(req, res, next);
});

// for getting username and profile picture after login
userRouter.get('/userId', jwtAuth, (req, res, next) => {
  userController.findUser(req, res, next);
});

//for getting userEmail for verificatin page
userRouter.get('/userEmail', jwtOtpAuth, (req, res, next) => {
  userController.getUserEmail(req, res, next);
});

// for getting all userDetail for userDetailContainer
userRouter.get('/userDetail', jwtAuth, (req, res, next) => {
  userController.getUserDetail(req, res, next);
});

// for updating userDetail for userDetailContainer
userRouter.post(
  '/userDetail',
  jwtAuth,
  userValidation.userProfileUpdateValidation,
  (req, res, next) => {
    userController.updateUserDetail(req, res, next);
  }
);

//logout user
userRouter.post('/logout', jwtAuth, (req, res, next) => {
  userController.logOutUser(req, res, next);
});

//logoutAll user from all devices
userRouter.post('/logoutAll', jwtAuth, (req, res, next) => {
  userController.logOutAll(req, res, next);
});

//disploy mode
userRouter.post('/displayMode', jwtAuth, (req, res, next) => {
  userController.updateDisplayMode(req, res, next);
});

userRouter.get('/displayMode', jwtAuth, (req, res, next) => {
  userController.getDisplayMode(req, res, next);
});
//-----------------userSection--------------//

//-------------friend Section

// for getting all friends and membersCount
userRouter.get('/userCount', jwtAuth, (req, res, next) => {
  userController.gerFriendsAndMembersCount(req, res, next);
});

//add friend 
userRouter.post('/addFriend', jwtAuth, (req, res, next) => {
  userController.addFriend(req, res, next);
});

//un friend
userRouter.post('/unFriend', jwtAuth, (req, res, next) => {
  userController.unfriend(req, res, next);
});

//cancel friend request 
userRouter.post('/cancelFriendRequest', jwtAuth, (req, res, next) => {
  userController.cancelFriendRequest(req, res, next);
});

//confirm friend request
userRouter.post('/confirmFriendRequest', jwtAuth, (req, res, next) => {
  userController.confirmFriendRequest(req, res, next);
});

//delete friend request 
userRouter.post('/deleteFriendRequest', jwtAuth, (req, res, next) => {
  userController.deleteFriendRequest(req, res, next);
});

//get all the users. 
userRouter.get('/getAllUsers', jwtAuth, (req, res, next) => {
  userController.getAllUsers(req, res, next);
});

//get all friends 
userRouter.get('/getAllFriends', jwtAuth, (req, res, next) => {
  userController.getAllFriends(req, res, next);
});
//-------------friend Section------------------//
