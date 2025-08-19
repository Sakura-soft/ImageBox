import app from './app.js';
import dotenv from 'dotenv';
import ConnectDB from './db/db.js';

dotenv.config({
  path: './.env',
});

const PORT = process.env.PORT || 3000;

ConnectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch(() => {
    console.log('mongoDB connection error', error);
  });
