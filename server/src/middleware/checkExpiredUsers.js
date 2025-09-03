import jwt from 'jsonwebtoken';
import { UserModel } from '../features/user/userSchema.js';

const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);

    const now = Math.floor(Date.now() / 1000);

    //return true when token is expired and false if the token is still valid
    return decoded.exp < now;
  } catch (err) {
    return true;
  }
};

export const checkAndLogoutExpiredUsers = async () => {
  try {
    // Finding  all users that have at least one token
    const users = await UserModel.find({ 'tokens.token': { $ne: null } });

    console.log('checkAndLogoutExpiredUsers is checking');

    for (const user of users) {
      // Tracking the tokens that need to be removed
      const expiredTokens = user.tokens
        .filter((tokenObj) => isTokenExpired(tokenObj.token)) //here it filter all the token which are expired.
        .map((tokenObj) => tokenObj.token); //creating an array and storing all the expired together.

      if (expiredTokens.length > 0) {
        console.log(`Logging out expired user: ${user.username}`);

        // Remove all expired tokens from user.tokens array using $pull with $in operator
        await UserModel.updateOne(
          { _id: user._id },
          { $pull: { tokens: { token: { $in: expiredTokens } } } }
        );
      }
    }
  } catch (err) {
    console.log('checkAndLogoutExpiredUsers Error: ', err);
  }
};

export function startExpiredUserChecker() {
  // Runs immediatly when server runs.
  checkAndLogoutExpiredUsers();

  // Then run every 5 minutes
  setInterval(checkAndLogoutExpiredUsers, 5 * 60 * 1000);
}
