import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const imageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    height: {
      type: Number,
      default: 0,
    },
    width: {
      type: Number,
      default: 0,
    },
    size: {
      type: Number,
      default: 0,
    },
    formatedSize: {
      type: String,
      trim: true,
      default: null,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    isPermanentlyDeleted: {
      type: Boolean,
      default: false,
    },
    sToken: [
      {
        token: {
          type: String,
          default: null,
          trim: true,
        },
        tokenExpiresAt: {
          type: Date,
          default: null,
        },
        password: {
          type: String,
          trim: true,
          default: null,
        },
      },
    ],
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

imageSchema.pre('save', async function (next) {
  if (!this.isModified('sToken')) return next();
  for (const tokenObj of this.sToken) {
    if (tokenObj.password && !tokenObj.password.startsWith('$2b$')) {
      tokenObj.password = await bcrypt.hash(tokenObj.password, 10);
    }
  }
  next();
});

imageSchema.methods.isPasswordCorrect = async function (password, tokenObj) {
  return await bcrypt.compare(password, tokenObj.password);
};

imageSchema.methods.generateSToken = function (expiryDate) {
  const now = Date.now();
  let token,
    tokenExpiresAt = null;
  if (expiryDate) {
    const expiresAt = new Date(expiryDate).getTime();
    const durationSeconds = Math.floor((expiresAt - now) / 1000);
    token = jwt.sign(
      { _id: this._id, url: this.url },
      process.env.sTOKEN_SECRET,
      { expiresIn: durationSeconds }
    );
    tokenExpiresAt = new Date(expiresAt);
  } else {
    token = jwt.sign(
      { _id: this._id, url: this.url },
      process.env.sTOKEN_SECRET
    );

    tokenExpiresAt = null;
  }

  return { token, tokenExpiresAt };
};

const Image = mongoose.model('Image', imageSchema);

export default Image;
