import Folder from '../models/folder-model.js';
import { apiError } from '../utils/apiError.js';
import { apiRes } from '../utils/apiRes.js';
import { asyncFunc } from '../utils/asyncFunc.js';
import { formatFileSize } from '../utils/formatFileSize.js';
import { validateFields } from '../utils/validateFields.js';

const createFolder = asyncFunc(async (req, res) => {
  const { name } = req.body;

  const user = req.user;

  validateFields(res, { name });

  const folder = await Folder.create({
    name,
    userId: user._id,
  });

  if (!folder) {
    throw new apiError(500, 'faild to create folder, Please try again later.');
  }

  return res
    .status(200)
    .json(new apiRes(200, folder, 'Folder created successfully'));
});

const updatedFolder = asyncFunc(async (req, res) => {
  const { name } = req.body;

  const folder = req.folder;

  if (folder.isDeleted) {
    throw new apiError(404, 'Folder not found');
  }

  validateFields(res, { name });

  if (folder?.name !== name) {
    folder.name = name;
    await folder.save();
  }

  return res
    .status(200)
    .json(new apiRes(200, folder, 'Folder updated successfully'));
});

const deleteFolder = asyncFunc(async (req, res) => {
  const folder = req.folder;

  const user = req.user;

  const isRestoring = folder.isDeleted;

  folder.isDeleted = !folder.isDeleted;

  folder.deletedAt = Date.now();

  if (user?.metadata && folder.size) {
    if (isRestoring) {
      const updatedTrashStorage = Math.max(
        0,
        user.metadata.trashStorage - folder.size
      );
      user.metadata.trashStorage = updatedTrashStorage;
      user.metadata.formatedTrashStorage = formatFileSize(updatedTrashStorage);
      await user.save();
    } else {
      const updatedTrashStorage = Math.max(
        0,
        user.metadata.trashStorage + folder.size
      );

      user.metadata.trashStorage = updatedTrashStorage;

      user.metadata.formatedTrashStorage = formatFileSize(updatedTrashStorage);
      await user.save();
    }
    await user.save();
  }

  await folder.save();

  const message = folder.isDeleted
    ? 'Folder and all included images deleted successfully'
    : 'Folder and all included images restored successfully';

  return res
    .status(200)
    .json(
      new apiRes(200, { folder, updatedUserMetadata: user.metadata }, message)
    );
});

const deleteFolderpermanently = asyncFunc(async (req, res) => {
  const folder = req.folder;

  const user = req.user;

  folder.isPermanentlyDeleted = true;

  if (user?.metadata && folder.size) {
    const updatedStorage = Math.max(0, user.metadata.storageUsed - folder.size);
    const updatedTrashStorage = Math.max(
      0,
      user.metadata.trashStorage - folder.size
    );
    user.metadata.storageUsed = updatedStorage;
    user.metadata.trashStorage = updatedTrashStorage;
    user.metadata.formatedStorageUsed = formatFileSize(updatedStorage);
    user.metadata.formatedTrashStorage = formatFileSize(updatedTrashStorage);
    await user.save();
  }

  await folder.save();

  return res
    .status(200)
    .json(
      new apiRes(
        200,
        { updatedUserMetadata: user.metadata },
        'Folder deleted permanently successfully'
      )
    );
});

const cleanUpTrashFolder = asyncFunc(async (req, res) => {
  const user = req.user;

  const trashFolders = await Folder.find({
    userId: user._id,
    isDeleted: true,
    isPermanentlyDeleted: false,
  });

  let totalFreedStorage = 0;

  const folderIds = trashFolders.map((folder) => folder._id);

  totalFreedStorage = trashFolders.reduce(
    (acc, folder) => acc + (folder.size || 0),
    0
  );

  if (folderIds.length > 0) {
    await Folder.updateMany(
      { _id: { $in: folderIds } },
      { $set: { isPermanentlyDeleted: true } }
    );
  }

  if (user?.metadata && totalFreedStorage > 0) {
    user.metadata.trashStorage = Math.max(
      0,
      user.metadata.trashStorage - totalFreedStorage
    );
    user.metadata.storageUsed = Math.max(
      0,
      user.metadata.storageUsed - totalFreedStorage
    );
    user.metadata.formatedTrashStorage = formatFileSize(
      user.metadata.trashStorage
    );
    user.metadata.formatedStorageUsed = formatFileSize(
      user.metadata.storageUsed
    );
    await user.save();
  }

  return res
    .status(200)
    .json(
      new apiRes(
        200,
        { updatedUserMetadata: user.metadata },
        'trash clean up successfully'
      )
    );
});

export {
  createFolder,
  updatedFolder,
  deleteFolder,
  deleteFolderpermanently,
  cleanUpTrashFolder,
};
