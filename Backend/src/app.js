import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './router/user-route.js';
import { errorHandler } from './utils/errorHandler.js';
import folderRouter from './router/folder-route.js';
import imageRouter from './router/image-route.js';
import getRouter from './router/get-route.js';

const app = express();

app.use(
  cors({
    origin: ['https://imagebox-six.vercel.app', 'http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.static('public'));

// routes
app.use('/api/v1/user', userRouter);

app.use('/api/v1/folder', folderRouter);

app.use('/api/v1/image', imageRouter);

app.use('/api/v1/get', getRouter);

app.use(errorHandler);

export default app;
