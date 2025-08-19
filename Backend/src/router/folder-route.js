import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  cleanUpTrashFolder,
  createFolder,
  deleteFolder,
  deleteFolderpermanently,
  updatedFolder,
} from '../controller/folder-controller.js';
import { folder } from '../middleware/folder.js';

const folderRouter = Router();

folderRouter.route('/create').post(auth, createFolder);

folderRouter.route('/update/:folderId').put(auth, folder, updatedFolder);

folderRouter.route('/delete/:folderId').delete(auth, folder, deleteFolder);

folderRouter
  .route('/deleteFolderpermanently/:folderId')
  .delete(auth, folder, deleteFolderpermanently);

folderRouter
  .route('/trash/cleanUpTrashFolder')
  .delete(auth, cleanUpTrashFolder);

export default folderRouter;
