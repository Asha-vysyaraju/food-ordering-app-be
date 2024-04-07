import { UNAUTHORIZED } from '../constants/httpStatus.js';
import auth from './auth.js';
const admin = (req, res, next) => {
  if (!req.user.isAdmin) res.status(UNAUTHORIZED).send();

  return next();
};

export default [auth, admin];