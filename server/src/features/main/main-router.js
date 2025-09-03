import express from 'express';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jwtAuth } from '../../middleware/jwt.js';

// setting this to get absoulte path
const __dirname = dirname(fileURLToPath(import.meta.url));

export const mainRouter = express.Router();

mainRouter.get('/', jwtAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../../../../client/src/main/main.html'));
});
mainRouter.get('/user-name', jwtAuth, (req, res) => {
  res.json({ userName: req.userName, userId: req.userId });
});
