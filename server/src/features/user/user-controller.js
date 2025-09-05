import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcrypt';
import UserRepository from './user-repository.js';
import ErrorHandler from '../../middleware/error-handler.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }



async findUser(req, res, next) {
  const userId = req.userId;
  try {
    const result = await this.userRepository.getUser(userId);

    // return username and displayMode
    //fallbacks to light mode when diplaymode is undefined.
    const response = {
      username: result.username,
      displayMode: result.displayMode || 'light'  
    };

    if (result.profilepicture) {
      response.profilepicture = result.profilepicture;
    }

    return res.status(200).send(response); 
  } catch (err) {
    console.log('findUser controller Error : ', err);
    next(err);
  }
}


  //signUp
  async signUp(req, res, next) {
    const { username, DOB, gender, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 12);
    try {
      const checkUserExsist = await this.userRepository.checkUserExsist(email);
      if (!checkUserExsist) {
        const result = await this.userRepository.signUp(
          username,
          DOB,
          gender,
          email,
          hashPassword
        );

        res.status(201).json({ message: result.message });
      }
    } catch (err) {
      console.log('signUp controller error : ', err);
      next(err);
    }
  }

  async generateOtpSend(req, res, next) {
    const { email } = req.body;
    try {
      const user = await this.userRepository.checkUserExsist(email);
      if (!user) {
        throw new ErrorHandler(
          'No account found with this email. Please try again or create a new account. 🔍'
        );
      }
      // generate OTP
      const generateOTP = () => {
        return Math.floor(1000 + Math.random() * 9000).toString();
      };
      const otp = generateOTP();
      const otpHash = await bcrypt.hash(otp, 12);
      const expiresIn = Date.now() + 5 * 60 * 1000;
      const userId = user._id;

      const otpUpdatedUser = await this.userRepository.addOtp(
        otpHash,
        expiresIn,
        userId
      );
      if (otpUpdatedUser) {
        //setup nodemailer
        let transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.NODEMAILER_EMAILID,
            pass: process.env.NODEMAILER_PASS,
          },
        });

        //  Set up email data
        let mailOptions = {
          from: `"KoKu Support" <${process.env.NODEMAILER_EMAILID}>`,
          to: user.email,
          subject: 'KoKu Password Reset OTP',
          text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
          html: `
        <div>
            <h2>KoKu Account Verification</h2>
            <p>Hello <strong>${user.username}</strong>,</p>
            <p>Use the OTP below to complete the password reset request. This OTP is valid for 5 minutes:</p>
            <h3>${otp}</h3>
            <p class="mb-2">If you did not request this, please ignore this email.</p>
            <p>– Team KoKu </p>
        </div>
    `,
        };

        //send OTP using nodemailer

        await transporter.sendMail(mailOptions);

        const token = jwt.sign(
          { email: user.email, userId: user._id, userName: user.username },
          process.env.JWT_OTP_SECRETKEY,
          { expiresIn: '15m' }
        );
        res.cookie('jwtOtp', token, {
          httpOnly: true,
          secure: false, // only over HTTPS in production (process.env.NODE_ENV === "production")//important to know
          sameSite: 'strict',
          maxAge: 5 * 60 * 1000, // 5 minutes
        });
        res
          .status(200)
          .json({ success: true, message: 'OTP sent successfully' });
      }
    } catch (err) {
      console.log('emailVerify controller Error :', err);
      next(err);
    }
  }

  async verifyOtp(req, res, next) {
    const userId = req.userId;
    const email = req.email;
    const userName = req.userName;
    const otp = req.body.otpInput;

    try {
      const verify = await this.userRepository.verifyOtp(userId, otp);
      if (verify) {
        const token = jwt.sign(
          { email: email, userId: userId, userName: userName },
          process.env.JWT_NEW_PASS_SECRETKEY,
          { expiresIn: '15m' }
        );

        res.cookie('jwtNewPass', token, {
          httpOnly: true,
          secure: false, // only over HTTPS in production (process.env.NODE_ENV === "production")//important to know
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000, // 15 minutes
        });

        res.clearCookie('jwtOtp');

        res.status(200).json({
          message: '✅ Code verified! Redirecting you to reset your password..',
        });
      }
    } catch (err) {
      console.log('verifyOtp userController Error : ', err);
      next(err);
    }
  }

  async getUserEmail(req, res, next) {
    try {
      const userId = req.userId;
      const user = await this.userRepository.getUserAccount(userId);
      res.status(200).json(user);
    } catch (err) {
      console.log('getUserEmail controller Error : ', err);
      next(err);
    }
  }

  //signIn 
  async signIn(req, res, next) {
    const { email, password } = req.body;
    try {
      const result = await this.userRepository.signIn(email, password);
      if (result) {
        const token = jwt.sign(
          {
            email: result.email,
            userId: result._id,
            userName: result.username,
          },
          process.env.JWT_SECRETKEY,
          { expiresIn: '1h' }
        );

        //add token to database
        const time = new Date();
        const addToken = await this.userRepository.addToken(
          result._id,
          token,
          time
        );

        if (addToken) {
          res.cookie('jwt', token, {
            httpOnly: true,
            secure: false, // only over HTTPS in production
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000, // 1hour
          });
          res.status(200).json({ message: '✅ Login succesfull' });
        }
      } else {
        throw new ErrorHandler('Authentication failed. Please try again.', 400);
      }
    } catch (err) {
      next(err);
    }
  }

  async newPassword(req, res, next) {
    try {
      const userId = req.userId;
      const newPassword = req.body.newPassword;
      const confirmPassword = req.body.confirmPassword;
      if (newPassword !== confirmPassword) {
        throw new ErrorHandler(
          '🔶 New and confirm passwords must be the same.',
          400
        );
      }
      const hashPassword = await bcrypt.hash(newPassword, 12);
      const result = await this.userRepository.updatePassword(
        userId,
        hashPassword
      );
      if (result) {
        res.status(200).json({
          message:
            '✅ Password changed successfully! 🚀Taking you to the login page...',
        });
      }

    } catch (err) {
      console.log('newPassword controller Error : ', err);
      next(err);
    }
  }

  // upload profile picture 
  async uploadProfilePicture(req, res, next) {
    try {
      const file = req.file;
      const userId = req.userId;

      const result = await this.userRepository.uploadProfilePicture(
        userId,
        file
      );
      res.status(200).json({ message: result.message });
    } catch (err) {
      console.log('uploadProfilePicture controller Error : ', err);
      next(err);
    }
  }

  // removeProfilePicture 
  async removeProfilePicture(req, res, next) {
    try {
      const userId = req.userId;
      const result = await this.userRepository.removeProfilePicture(userId);
      res.status(200).json({ message: result.message });
    } catch (err) {
      console.log('removeProfilePicture controller Error : ', err);
      next(err);
    }
  }

  //logout user 
  async logOutUser(req, res, next) {
    try {
      const userId = req.userId;
      const userTokenCookie = req.cookies.jwt;

      const removeToken = await this.userRepository.removeUserToken(
        userId,
        userTokenCookie
      );
      if (removeToken) {
        res.clearCookie('jwt');
        res.status(200).json(removeToken);
      }
    } catch (err) {
      console.log('logOUtUser controller Error : ', err);
      next(err);
    }
  }

  //logOutAll 
  async logOutAll(req, res, next) {
    try {
      const userId = req.userId;

      const removeAllToken = await this.userRepository.removeAllToken(userId);
      if (removeAllToken) {
        res.clearCookie('jwt');
        res.status(200).json(removeAllToken);
      }
    } catch (err) {
      console.log('logOutAll controller Error : ', err);
      next(err);
    }
  }

  //updateDisplayMode
  async updateDisplayMode(req, res, next) {
    try {
      const userId = req.userId;
      const { mode } = req.body;

      const updateMode = await this.userRepository.updatMode(userId, mode);
      if (updateMode) {
        res.status(200).json(updateMode);
      }
    } catch (err) {
      console.log('updateDisplayMode controller Error : ', err);
      next(err);
    }
  }

  //get display mode
  async getDisplayMode(req, res, next) {
    try {
      const userId = req.userId;
      const displayMode = await this.userRepository.getDisplayMode(userId);
      if (displayMode) {
        res.status(200).json(displayMode);
      }
    } catch (err) {
      console.log('getDisplayMode controller Error : ', err);
      next(err);
    }
  }

  //getUserDetail
  async getUserDetail(req, res, next) {
    const userId = req.userId;
    try {
      const user = await this.userRepository.getUserDetail(userId);
      res.status(200).json(user);
    } catch (err) {
      console.log('getUserDetail controller Error : ', err);
      next(err);
    }
  }

  //updateUserDetail
  async updateUserDetail(req, res, next) {
    const userId = req.userId;
    const username = req.body.username;
    const dob = req.body.DOB;
    const gender = req.body.gender;
    try {
      const user = await this.userRepository.updateUserDetail(
        userId,
        username,
        dob,
        gender
      );
      if (user) {
        res.status(200).json(user);
      }
    } catch (err) {
      console.log('updateUserDetail Controller Error : ', err);
      next(err);
    }
  }
  //get friends count and members count 
  async gerFriendsAndMembersCount(req, res, next) {
    const userId = req.userId;
    try {
      const result =
        await this.userRepository.gerFriendsAndMembersCount(userId);
      if (result) {
        res.status(200).json(result);
      }
    } catch (err) {
      console.log('getFriendsAndMembersCount controller Error : ', err);
      next(err);
    }
  }
  //-------------friend section

  //addFriend 
  async addFriend(req, res, next) {
    try {
      const userId = req.userId;
      const otherUserId = req.body.otherUserId;
      const result = await this.userRepository.addFriend(userId, otherUserId);
      res.status(200).json(result);
    } catch (err) {
      console.log('addFriend controller Error : ', err);
      next(err);
    }
  }

  //unfriend 
  async unfriend(req, res, next) {
    try {
      const userId = req.userId;
      const otherUserId = req.body.otherUserId;
      const result = await this.userRepository.unfriend(userId, otherUserId);
      res.status(200).json(result);
    } catch (err) {
      console.log('unfriend controller Error : ', err);
      next(err);
    }
  }

  //send friend Request 
  async sendFriendRequest(req, res, next) {
    try {
      const userId = req.userId;
      const otherUserId = req.body.otherUserId;

      const result = await this.userRepository.sendFriendRequest(
        userId,
        otherUserId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log('sendFrienRequest controller Error', err);
      next(err);
    }
  }

  //cancel friend Request 
  async cancelFriendRequest(req, res, next) {
    try {
      const userId = req.userId;
      const otherUserId = req.body.otherUserId;

      const result = await this.userRepository.cancelFriendRequest(
        userId,
        otherUserId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log('cancelFriendRequest controller Error : ', err);
      next(err);
    }
  }

  //confirm friend request
  async confirmFriendRequest(req, res, next) {
    try {
      const userId = req.userId;
      const otherUserId = req.body.otherUserId;
      const result = await this.userRepository.confirmFriendRequest(
        userId,
        otherUserId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log('confirmFriendRequest controller Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  //delete friend request cancle request
  async deleteFriendRequest(req, res, next) {
    try {
      const userId = req.userId;
      const otherUserId = req.body.otherUserId;

      const result = await this.userRepository.deleteFriendRequest(
        userId,
        otherUserId
      );
      res.status(200).json(result);
    } catch (err) {
      console.log('deleteFriendRequest controller Error : ', err);
      next(err);
    }
  }

  //getAllUsers
  async getAllUsers(req, res, next) {
    const userId = req.userId;
    try {
      const users = await this.userRepository.getAllUsers();
      if (users) {
        res.status(200).json({ users, userId });
      }
    } catch (err) {
      console.log('getAllUsers controller Errors : ', err);
      next(err);
    }
  }

  //getAllFriends
  async getAllFriends(req, res, next) {
    const userId = req.userId;
    try {
      const users = await this.userRepository.getAllUsers();
      const currentUser = await this.userRepository.findUser(userId);

      if (users && currentUser) {
        res.status(200).json({ users, currentUser });
      }
    } catch (err) {
      console.log('getAllUsers controller Errors : ', err);
      next(err);
    }
  }
  //-------------friend section--------------------//
}
