import User from '../models/user-model.js';
import { apiError } from './apiError.js';

const getTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const token = user.generatToken();
    user.token = token;
    await user.save({
      validateBeforeSave: false,
    });
    return token;
  } catch (error) {
    throw new apiError(500, 'Something went wrong while generating tokens');
  }
};

export { getTokens };
