import Image from '../models/image-model.js';
import Folder from '../models/folder-model.js';
import { cookieOption } from '../utils/cookieOption.js';
import { getTokens } from '../utils/token.js';
import { asyncFunc } from '../utils/asyncFunc.js';
import { apiError } from '../utils/apiError.js';
import { apiRes } from '../utils/apiRes.js';
import jwt from 'jsonwebtoken';
import { validateFields } from '../utils/validateFields.js';

const getUser = asyncFunc(async (req, res) => {
  const user = req.user;

  const token = await getTokens(user._id);

  user.token = token;

  await user.save();

  return res
    .status(201)
    .cookie('token', token, cookieOption())
    .json(new apiRes(201, user, 'user fetch successfully'));
});

const getFolders = asyncFunc(async (req, res) => {
  const user = req.user;

  const includeTrash = req.query.trash === 'true';

  const folders = await Folder.find({
    userId: user._id,
    isDeleted: includeTrash,
    isPermanentlyDeleted: false,
  });

  return res
    .status(200)
    .json(new apiRes(200, folders, 'Folders fetched successfully'));
});

const getImages = asyncFunc(async (req, res) => {
  const user = req.user;

  const folder = req.folder;

  const images = await Image.find({
    userId: user._id,
    folderId: folder._id,
    isPermanentlyDeleted: false,
  }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new apiRes(200, images, 'Images fetched successfully'));
});

const getTrash = asyncFunc(async (req, res) => {
  const user = req.user;

  const trashedFolders = await Folder.find({
    userId: user._id,
    isDeleted: true,
    isPermanentlyDeleted: false,
  });

  return res.status(200).json(
    new apiRes(
      200,
      {
        trashFolders: trashedFolders || null,
      },
      'Trash fetched successfully'
    )
  );
});

const getImage = asyncFunc(async (req, res) => {
  const { imageId } = req.params;
  const image = await Image.findById(imageId);
  if (!image) {
    throw new apiError(404, 'Image Not Found');
  }
  if (image.isPermanentlyDeleted) {
    throw new apiError(404, 'This image was permenetly deleted by user');
  }
  return res
    .status(200)
    .json(new apiRes(200, image, 'Image Fetch successfully'));
});

const getShareImage = asyncFunc(async (req, res) => {
  const { sToken } = req.params;
  const { password } = req.query;

  validateFields(res, { password });

  let decoded;
  try {
    decoded = jwt.verify(sToken, process.env.sTOKEN_SECRET);
  } catch (error) {
    throw new apiError(400, 'Invalid or expired token');
  }

  const sharedImage = await Image.findOne({
    _id: decoded._id,
    isPermanentlyDeleted: false,
  });

  if (!sharedImage) {
    throw new apiError(404, 'Image not Found');
  }

  const shareEntry = sharedImage.sToken.find((entry) => entry.token === sToken);
  if (!shareEntry) {
    throw new apiError(400, 'Invalid share link');
  }

  if (shareEntry.tokenExpiresAt && new Date() > shareEntry.tokenExpiresAt) {
    throw new apiError(400, 'Link expired');
  }

  const isCorrect = await sharedImage.isPasswordCorrect(password, shareEntry);
  if (!isCorrect) {
    throw new apiError(400, 'Incorrect password');
  }

  return res
    .status(200)
    .json(
      new apiRes(
        200,
        { name: sharedImage.name, url: sharedImage.url },
        'Shared Image Fetch successfully'
      )
    );
});

export { getUser, getFolders, getImages, getTrash, getImage, getShareImage };
