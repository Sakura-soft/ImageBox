import { Router } from 'express';
import {
  addImages,
  updateImage,
  favorite,
  deleteImage,
  createShareLink,
  deleteMultipleImages,
} from '../controller/image-controller.js';
import { folder } from '../middleware/folder.js';
import { auth } from '../middleware/auth.js';
import { image } from '../middleware/image.js';
import { upload } from '../middleware/multer-middleware.js';

const imageRouter = Router();

imageRouter
  .route('/add/:folderId')
  .post(auth, folder, upload.array('images'), addImages);

imageRouter.route('/update/:imageId').put(auth, image, updateImage);

imageRouter.route('/favorite/:imageId').put(auth, image, favorite);

imageRouter
  .route('/delete/:imageId/:folderId')
  .put(auth, image, folder, deleteImage);

imageRouter
  .route('/deleteMultipleImages/:folderId')
  .put(auth, folder, deleteMultipleImages);

imageRouter
  .route('/createSharedLink/:imageId')
  .post(auth, image, createShareLink);

export default imageRouter;
