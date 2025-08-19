import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  getUser,
  getFolders,
  getImages,
  getTrash,
  getImage,
  getShareImage,
} from '../controller/get-controller.js';
import { folder } from '../middleware/folder.js';

const getRouter = Router();

getRouter.route('/user').get(auth, getUser);

getRouter.route('/folders').get(auth, getFolders);

getRouter.route('/images/:folderId').get(auth, folder, getImages);

getRouter.route('/trash').get(auth, getTrash);

getRouter.route('/image/:imageId').get(getImage);

getRouter.route('/image/share/:sToken').get(getShareImage);

export default getRouter;
