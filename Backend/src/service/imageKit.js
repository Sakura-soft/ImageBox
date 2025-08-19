import ImageKit from 'imagekit';
import fs from 'fs';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export const uploadToImageKit = async (filePath, fileName) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName,
      folder: '/user-profilePhoto',
      useUniqueFileName: true,
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export const uploadImages = async (filePath, fileName) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName,
      folder: '/user-images',
      useUniqueFileName: true,
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    throw error;
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
