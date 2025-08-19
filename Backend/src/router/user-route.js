import { Router } from 'express';
import {
  singup,
  verifyOtp,
  login,
  resetPasswordOtp,
  resetPassword,
  updateUser,
  logOut,
  userNameAvailable,
} from '../controller/user-controller.js';
import { upload } from '../middleware/multer-middleware.js';
import { auth } from '../middleware/auth.js';

const userRouter = Router();

userRouter.get('/test', (req, res) => res.json({ ok: true }));

userRouter.route('/singup').post(upload.single('profilePhoto'), singup);

userRouter.route('/verifyOtp').post(verifyOtp);

userRouter.route('/login').post(login);

userRouter.route('/reset-pass-otp').post(resetPasswordOtp);

userRouter.route('/reset-pass').post(resetPassword);

userRouter
  .route('/update')
  .put(auth, upload.single('profilePhoto'), updateUser);

userRouter.route('/logout').put(auth, logOut);

userRouter.route('/userNameAvailable').get(userNameAvailable);

export default userRouter;
