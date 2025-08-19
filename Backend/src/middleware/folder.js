import Folder from '../models/folder-model.js';
import { apiError } from '../utils/apiError.js';
import { asyncFunc } from '../utils/asyncFunc.js';
import { validateFields } from '../utils/validateFields.js';

export const folder = asyncFunc(async (req, res, next) => {
  const { folderId } = req.params;

  const user = req.user;

  validateFields(res, { folderId });

  const folder = await Folder.findById(folderId);

  if (!folder) {
    throw new apiError(404, 'Folder not found');
  }
  if (String(folder.userId) !== String(user._id)) {
    throw new apiError(401, 'you have not permission to access this folder');
  }

  req.folder = folder;

  next();
});
