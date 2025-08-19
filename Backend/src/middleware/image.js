import Image from '../models/image-model.js';
import { apiError } from '../utils/apiError.js';
import { asyncFunc } from '../utils/asyncFunc.js';
import { validateFields } from '../utils/validateFields.js';

export const image = asyncFunc(async (req, res, next) => {
  const { imageId } = req.params;

  const user = req.user;

  validateFields(res, { imageId });

  const image = await Image.findById(imageId);

  if (!image) {
    throw new apiError(404, 'image not found');
  }
  if (String(image.userId) !== String(user._id)) {
    throw new apiError(401, 'you have not permission to access this image');
  }

  req.image = image;

  next();
});
