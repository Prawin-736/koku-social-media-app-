import dotenv from 'dotenv';
dotenv.config();
import ErrorHandler from '../../middleware/error-handler.js';
import { UserModel } from './userSchema.js';
import bcrypt from 'bcrypt';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../../aws/s3Client.js';
import { generateSignedUrl } from '../../../aws/s3SignedUrl.js';
import path from 'path';

export default class UserRepository {
  async checkUserExsist(email) {
    try {
      const user = await UserModel.findOne({ email });
      if (user) {
        throw new ErrorHandler('User already exists! 🚫');
      } else {
        return user;
      }
    } catch (err) {
      console.log('checkUserExsist repository Error: ', err);
      throw new ErrorHandler('User already exists! 🚫', 404);
    }
  }

  //gets username and profile picture for the user..
  async getUser(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new ErrorHandler('User not found', 404);
      }

      const response = {
        username: user.username,
      };

      // Add displayMode if it exists
      if (user.displayMode !== undefined) {
        response.displayMode = user.displayMode;
      }

      // Add signed profile picture URL if it exists
      if (user.profilepicture) {
        const key = new URL(user.profilepicture).pathname.slice(1);
        response.profilepicture = await generateSignedUrl(key);
      }

      return response;
    } catch (err) {
      console.error('getUser repository error:', err);
      throw new ErrorHandler('Something went wrong', 500);
    }
  }

  async getUserAccount(userId) {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (err) {
      console.log('getUserAccount respository Error :', err);
      throw new ErrorHandler('user not found', 404);
    }
  }

  async signUp(username, DOB, gender, email, password) {
    try {
      const newUser = new UserModel({ username, DOB, gender, email, password });
      await newUser.save();
      return { message: '✅ Account successfully created!' };
    } catch (err) {
      console.log('signUp repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  async signIn(email, password) {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) {
        throw new ErrorHandler('🔶 Username or password is incorrect', 400);
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        throw new ErrorHandler('🔶 Username or password is incorrect', 400);
      }
      return user;
    } catch (err) {
      console.log('signIn repository Error : ', err);
      throw err;
    }
  }

  async addToken(userId, token, time) {
    try {
      const user = await UserModel.findById(userId);

      //user token is equal to 4 than remove the token from array start (old token)
      if (user.tokens.length === 4) {
        await UserModel.updateOne(
          //important to know
          { _id: userId },
          { $pop: { tokens: -1 } } // -1 removes the first element; 1 removes the last
        );
      }

      //adding the token to the user
      const addTokenToUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          $push: {
            tokens: {
              token: token,
              expiresIn: time,
            },
          },
        },
        { new: true }
      );

      return addTokenToUser;
    } catch (err) {
      console.log('addToken repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  //getting user tokens
  async fetchUserToken(userId) {
    try {
      const user = await UserModel.findById(userId);
      const userTokens = user.tokens;
      return userTokens;
    } catch (err) {
      console.log('fetchUserToken repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  //remove current login token from tokens
  async removeUserToken(userId, userTokenCookie) {
    try {
      const result = await UserModel.findByIdAndUpdate(
        userId,
        {
          $pull: {
            tokens: { token: userTokenCookie },
          },
        },
        { new: true }
      );

      return result;
    } catch (err) {
      console.log('removeUserToken repository Error : ', err);
      throw new ErrorHandler('something went wrong with database.', 500);
    }
  }

  //removeAllToken for the user 
  async removeAllToken(userId) {
    try {
      const result = await UserModel.updateOne(
        { _id: userId },
        { $set: { tokens: [] } },
        { new: true }
      );

      return result;
    } catch (err) {
      console.log('removeAllToken repository Error : ', err);
      throw new ErrorHandler('somthing went wrong with database.', 500);
    }
  }

  async updatePassword(userId, hashPassword) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: { password: hashPassword },
        },
        { new: true }
      );
      return user;
    } catch (err) {
      console.log('updatePassword repository Error: ', err);
      throw err;
    }
  }

  // uploadProfilePicture 
  async uploadProfilePicture(userId, file) {
    if (!file) {
      throw new ErrorHandler('No file uploaded', 400);
    }
    //  file extension
    const fileExtension = path.extname(file.originalname);
    const key = `kokuApp/profile-pictures/${userId}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await s3Client.send(command);
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      await UserModel.findByIdAndUpdate(
        userId,
        { profilepicture: fileUrl },
        { new: true }
      );
      return { message: 'Profile picture uploaded successfully' };
    } catch (err) {
      console.log('UploadProfilePicture repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  // removeProfilePicture
  async removeProfilePicture(userId) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new ErrorHandler('User not found', 404);
      }

      if (user.profilepicture) {
        const params = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: user.profilepicture,
        };

        const command = new DeleteObjectCommand(params);
        await s3Client.send(command);

        await UserModel.updateOne(
          { _id: userId },
          { $unset: { profilepicture: '' } }
        );
        return { message: 'Profile picture removed successfully' };
      }
    } catch (err) {
      console.log('removeProfilePicture repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  async addOtp(otpHash, expiresIn, userId) {
    try {
      const otpUpdatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            'otp.otpHash': otpHash,
            'otp.expiresIn': expiresIn,
            'otp.isUsed': false,
          },
        },
        { new: true }
      );
      return otpUpdatedUser;
    } catch (err) {
      console.log('addOtp repository Error: ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  async verifyOtp(userId, otp) {
    try {
      const user = await UserModel.findById(userId);

      if (!user) {
        throw new ErrorHandler('⚠️ User not found', 400);
      }

      const otpChecking = await bcrypt.compare(otp, user.otp.otpHash);
      if (!otpChecking) {
        throw new ErrorHandler(
          '⚠️ Incorrect OTP. Please check and try again.',
          400
        );
      }
      if (user.otp.isUsed === true) {
        throw new ErrorHandler(
          '⚠️ Incorrect or expired OTP. Please try again.',
          400
        );
      }
      const otpIsused = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: { 'otp.isUsed': true },
        },
        { new: true }
      );
      if (otpIsused) {
        return otpChecking;
      }
    } catch (err) {
      console.log('verifyOtp Error : ', err);
      throw err;
    }
  }

  //updatMode
  async updatMode(userId, mode) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          displayMode: mode,
        },
        { new: true }
      );

      return user.displayMode;
    } catch (err) {
      console.log('updateMode repository Error : ', err);
      throw new ErrorHandler('something went wrong with database.', 500);
    }
  }

  //getDisplayMOde
  async getDisplayMode(userId) {
    try {
      const user = await UserModel.findById(userId);
      return user.displayMode;
    } catch (err) {
      console.log('getDisplayMode repository Error : ', err);
      throw new ErrorHandler('somthing went wrong with database.', 500);
    }
  }
  //getUserDetail
  async getUserDetail(userId) {
    try {
      const user = await UserModel.findById(userId);
      if (!user) {
        throw new ErrorHandler('user not found', 404);
      }
      const userObj = user.toObject();

      if (!userObj.profilepicture) {
        return userObj;
      } else {
        const profilePictureKey = new URL(
          userObj.profilepicture
        ).pathname.slice(1);
        const profilePictureSignedUrl =
          await generateSignedUrl(profilePictureKey);
        userObj.profilepicture = profilePictureSignedUrl;
        return userObj;
      }
    } catch (err) {
      console.log('getUserDetail repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  //updateUserDetail 
  async updateUserDetail(userId, username, dob, gender) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            username: username,
            DOB: dob,
            gender: gender,
          },
        },
        { new: true }
      );

      return user;
    } catch (err) {
      console.log('updateUserDetail repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  // getFriendsAndMemverscount 
  async gerFriendsAndMembersCount(userId) {
    try {
      const members = await UserModel.find();
      const friends = await UserModel.findById(userId);

      const membersCount = members.length;
      const friendsCount = friends.friend.friendList.length;

      return { membersCount, friendsCount };
    } catch (err) {
      console.log('gerFriendsAndMembersCount repository Error : ', err);
      throw new ErrorHandler('somthing went wrong with database.', 500);
    }
  }
  //-----------------friend section

  //add friend
  async addFriend(userId, otherUserId) {
    try {
      const sendRequest = await UserModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            'friend.requestSent': otherUserId,
          },
        },
        { new: true }
      );
      const requestReceived = await UserModel.findByIdAndUpdate(
        otherUserId,
        {
          $addToSet: {
            'friend.requestReceived': userId,
          },
        },
        { new: true }
      );

      if (sendRequest && requestReceived) {
        return 'add Friend is successfull';
      }
    } catch (err) {
      console.log('addFriend repository Error : ', err);
      throw new ErrorHandler('somthing went wrong with database', 500);
    }
  }

  //unFriend 
  async unfriend(userId, otherUserId) {
    try {
      const removeFriend = await UserModel.findByIdAndUpdate(
        userId,
        {
          $pull: { 'friend.friendList': otherUserId },
        },
        { new: true }
      );

      const removeFriendOtherUser = await UserModel.findByIdAndUpdate(
        otherUserId,
        {
          $pull: { 'friend.friendList': userId },
        },
        { new: true }
      );

      if (removeFriend && removeFriendOtherUser) {
        return 'unfriend successfull';
      }
    } catch (err) {
      console.log('unfriend repository Error : ', err);
      throw new ErrorHandler('somthing went wrong with database.', 500);
    }
  }

  //sendFriend request
  async sendFriendRequest(userId, otherUserId) {
    try {
      const requestSent = await UserModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: { 'friend.requestSent': otherUserId },
        },
        { new: true }
      );

      const requestReceived = await UserModel.findByIdAndUpdate(
        otherUserId,
        {
          $addToSet: { 'friend.requestReceived': userId },
        },
        { new: true }
      );

      if (requestSent && requestReceived) {
        return 'success';
      }
    } catch (err) {
      console.log('sendFriendRequest repository Error : ', err);
      throw new ErrorHandler('somthing went wrong with database.', 500);
    }
  }

  //cancel friend request
  async cancelFriendRequest(userId, otherUserId) {
    try {
      const currentUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          $pull: {
            'friend.requestSent': otherUserId,
          },
        },
        { new: true }
      );
      const otherUser = await UserModel.findByIdAndUpdate(
        otherUserId,
        {
          $pull: {
            'friend.requestReceived': userId,
          },
        },
        { new: true }
      );

      if (currentUser && otherUser) {
        return 'cancel Friend Request successfull';
      }
    } catch (err) {
      console.log('cancelFriendRequest repository Error : ', err);
      throw new ErrorHandler('somthing went wrong with database.', 500);
    }
  }

  //confirm friend request
  async confirmFriendRequest(userId, otherUserId) {
    try {
      const currentUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          $addToSet: {
            'friend.friendList': otherUserId,
          },
          $pull: {
            'friend.requestReceived': otherUserId,
          },
        },
        { new: true }
      );

      const otherUser = await UserModel.findByIdAndUpdate(
        otherUserId,
        {
          $addToSet: {
            'friend.friendList': userId,
          },
          $pull: {
            'friend.requestSent': userId,
          },
        },
        { new: true }
      );

      if (currentUser && otherUser) {
        return 'confirm friend request successfull';
      }
    } catch (err) {
      console.log('confirmFriendRequest repository Error : ', err);
      throw new ErrorHandler('somthing went wrong with database', 500);
    }
  }

  //delete friend request
  async deleteFriendRequest(userId, otherUserId) {
    try {
      const currentUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          $pull: {
            'friend.requestReceived': otherUserId,
          },
        },
        { new: true }
      );

      const otherUser = await UserModel.findByIdAndUpdate(
        otherUserId,
        {
          $pull: {
            'friend.requestSent': userId,
          },
        },
        { new: true }
      );

      if (currentUser && otherUser) {
        return 'delete friend request successfull';
      }
    } catch (err) {
      console.log('deleteFriendRequest repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  async getAllUsers() {
    try {
      const users = await UserModel.find();
      const usersObj = users.map((user) => user.toObject());

      for (const user of usersObj) {
        if (!user.profilepicture) {
          continue;
        }
        const profilePictureKey = new URL(user.profilepicture).pathname.slice(
          1
        );
        const profilePictureSignedUrl =
          await generateSignedUrl(profilePictureKey);
        user.profilepicture = profilePictureSignedUrl;
      }
      return usersObj;
    } catch (err) {
      console.log('getAllUsers repository Error : ', err);
      throw new ErrorHandler('somethig went wrong with database.', 500);
    }
  }

  async findUser(userId) {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (err) {
      console.log('findUser repository Error : ', err);
      throw new ErrorHandler('somethig went wrong with database.', 500);
    }
  }

  //-----------------friend section----------------------//
}
