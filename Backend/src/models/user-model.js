import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { formatFileSize } from '../utils/formatFileSize.js';

export const planLimits = {
  free: 1024 * 1024 * 100,
  pro: 1024 * 1024 * 2_000,
  premium: 1024 * 1024 * 10_000,
};

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profilePhoto: {
      type: String,
    },
    metadata: {
      premiumPlan: {
        type: String,
        enum: ['free', 'pro', 'premium'],
        default: 'free',
      },
      premiumExpiresAt: {
        type: Date,
        default: null,
      },
      storageUsed: {
        type: Number,
        default: 0,
      },
      trashStorage: {
        type: Number,
        default: 0,
      },
      formatedTrashStorage: {
        type: String,
        trim: true,
        default: '0',
      },
      formatedStorageUsed: {
        type: String,
        trim: true,
        default: '0',
      },
      storageLimit: {
        type: Number,
        default: planLimits.free,
      },
      formatedStorageLimit: {
        type: String,
        trim: true,
        default: formatFileSize(planLimits.free),
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    resetPasswordOtp: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generatToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: process.env.TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model('User', userSchema);

export default User;
