import { mongoose, Schema } from 'mongoose';

export const userSchema = new Schema({
  username: {
    type: String,
  },
  DOB: {
    type: String,
  },
  gender: {
    type: String,
  },
  email: {
    type: String,
  },
  profilepicture: {
    type: String,
  },
  password: {
    type: String,
  },
  otp: {
    otpHash: {
      type: String,
      required: false,
    },
    expiresIn: {
      type: Date,
      required: false,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  friend: {
    friendList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    requestReceived: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
    requestSent: [
      {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
    ],
  },
  tokens: [
    {
      token: {
        type: String,
      },
      time: {
        type: Date,
      },
    },
  ],
  displayMode: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
});

export const UserModel = mongoose.model('user', userSchema);
