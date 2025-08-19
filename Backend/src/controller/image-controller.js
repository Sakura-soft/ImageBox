import Image from '../models/image-model.js';
import { apiError } from '../utils/apiError.js';
import { apiRes } from '../utils/apiRes.js';
import { asyncFunc } from '../utils/asyncFunc.js';
import { validateFields } from '../utils/validateFields.js';
import { uploadImages } from '../service/imageKit.js';
import { formatFileSize } from '../utils/formatFileSize.js';
import { planLimits } from '../models/user-model.js';

const addImages = asyncFunc(async (req, res) => {
  const user = req.user;

  const folder = req.folder;

  if (folder.isDeleted) {
    throw new apiError(404, 'Folder not found');
  }

  const files = req.files;

  if (!files || files.length === 0) {
    throw new apiError(400, 'No images for upload');
  }

  let uploadedImages = [];

  let storage = user?.metadata?.storageUsed || 0;

  const storageLimit = user?.metadata?.storageLimit || planLimits.free;

  let folderSize = folder?.size || 0;

  let totalIncomingSize = files.reduce(
    (acc, file) => acc + (file.size || 0),
    0
  );

  if (storage + totalIncomingSize > storageLimit) {
    throw new apiError(403, `Storage limit exceeded, upgraed your plan.`);
  }

  const imagesToCreate = [];
  let uploadResults = [];

  for (const file of files) {
    const uploadResult = await uploadImages(file.path, file.originalname);
    uploadResults.push({ file, uploadResult });
  }

  for (const { file, uploadResult } of uploadResults) {
    const imageSize = uploadResult?.size || file.size || 0;

    imagesToCreate.push({
      name: file.originalname || uploadResult?.name,
      url: uploadResult?.url || uploadResult?.thumbnailUrl,
      height: uploadResult?.height || 0,
      width: uploadResult?.width || 0,
      size: uploadResult?.size || 0,
      formatedSize: formatFileSize(uploadResult?.size) || 0,
      folderId: folder._id,
      userId: user._id,
    });

    storage += imageSize;
    folderSize += imageSize;
  }

  const insertedImages = await Image.insertMany(imagesToCreate);

  uploadedImages = insertedImages;

  user.metadata.storageUsed = storage;
  user.metadata.formatedStorageUsed = formatFileSize(storage);
  await user.save();

  folder.size = folderSize;
  folder.formatedSize = formatFileSize(folderSize);
  await folder.save();

  return res.status(200).json(
    new apiRes(
      200,
      {
        addedImages: uploadedImages,
        updatedFolderSize: {
          size: folder.size,
          formatedSize: folder.formatedSize,
        },
        updatedStorage: {
          storageUsed: user?.metadata?.storageUsed,
          formatedStorageUsed: user?.metadata?.formatedStorageUsed,
        },
      },
      'All uploads done'
    )
  );
});

const updateImage = asyncFunc(async (req, res) => {
  const { name } = req.body;

  const image = req.image;

  if (image.isDeleted) {
    throw new apiError(404, 'image not found');
  }

  validateFields(res, { name });

  if (name != image.name) {
    image.name = name;
    await image.save();
  }

  return res
    .status(200)
    .json(new apiRes(200, image, 'image name updated successfully'));
});

const favorite = asyncFunc(async (req, res) => {
  const image = req.image;

  image.favorite = !image.favorite;

  if (image.isDeleted) {
    throw new apiError(404, 'image not found');
  }

  await image.save();

  const message = image.favorite
    ? 'Image marked as favorite successfully'
    : 'Image removed from favorites successfully';

  return res.status(200).json(new apiRes(200, image, message));
});

const createShareLink = asyncFunc(async (req, res) => {
  const { password, expiryDate } = req.body;

  const image = req.image;

  validateFields(res, { password });

  const { token, tokenExpiresAt } = image.generateSToken(expiryDate);

  image.password = password || null;

  image.sTokenExpiresAt = expiryDate ? new Date(expiryDate) : null;

  image.sToken.push({
    token,
    password,
    tokenExpiresAt,
  });

  await image.save();

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

  return res.status(200).json(
    new apiRes(
      200,
      {
        token,
        image,
        expiresAt: image.sTokenExpiresAt,
        url: `${frontendUrl}/image/preview/share/${token}`,
      },
      'Share link created successfully'
    )
  );
});

const deleteMultipleImages = asyncFunc(async (req, res) => {
  const { imageIds } = req.body;
  const user = req.user;
  const folder = req.folder;

  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
    throw new apiError(400, 'No image selected to delete');
  }

  const images = await Image.find({ _id: { $in: imageIds } });

  if (!images || images.length === 0) {
    throw new apiError(404, 'Images not found to delete');
  }

  if (images.some((img) => String(img.userId) !== String(user._id))) {
    throw new apiError(
      401,
      'You are not authorized to delete some of these images.'
    );
  }

  const storage = images.reduce((acc, img) => acc + (img.size || 0), 0);

  await Image.updateMany(
    { _id: { $in: imageIds } },
    { $set: { isPermanentlyDeleted: true } }
  );

  if (user?.metadata) {
    user.metadata.storageUsed = Math.max(
      user.metadata.storageUsed - storage,
      0
    );
    user.metadata.formatedStorageUsed = formatFileSize(
      user.metadata.storageUsed
    );
    await user.save();
  }

  if (folder) {
    folder.size = Math.max(folder.size - storage, 0);
    folder.formatedSize = formatFileSize(folder.size);
    await folder.save();
  }

  return res.status(200).json(
    new apiRes(
      200,
      {
        updatedUserMetadata: user.metadata,
        updateFolderSize: {
          size: folder.size,
          formatedSize: folder.formatedSize,
        },
      },
      `${imageIds.length} images deleted successfully`
    )
  );
});

const deleteImage = asyncFunc(async (req, res) => {
  const image = req.image;

  const folder = req.folder;

  const user = req.user;

  image.isPermanentlyDeleted = true;
  if (user?.metadata && image.size) {
    user.metadata.storageUsed = Math.max(
      user.metadata.storageUsed - image.size,
      0
    );
    user.metadata.formatedStorageUsed = formatFileSize(
      user.metadata.storageUsed
    );
    await user.save();
  }

  if (folder && image.size) {
    folder.size = Math.max(folder.size - image.size, 0);
    folder.formatedSize = formatFileSize(folder.size);
    await folder.save();
  }

  await image.save();

  return res.status(200).json(
    new apiRes(
      200,
      {
        updatedUserMetadata: user.metadata,
        updateFolderSize: {
          size: folder.size,
          formatedSize: folder.formatedSize,
        },
      },
      'Image deleted permanently successfully'
    )
  );
});

export {
  addImages,
  updateImage,
  favorite,
  deleteImage,
  createShareLink,
  deleteMultipleImages,
};
