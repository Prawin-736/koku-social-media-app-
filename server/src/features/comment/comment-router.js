import express from 'express';
import CommentController from './comment-controller.js';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jwtAuth } from '../../middleware/jwt.js';

const commentController = new CommentController();
const __dirname = dirname(fileURLToPath(import.meta.url));
export const commentRouter = express.Router();

// postComment (CHECKED)
commentRouter.post('/', jwtAuth, (req, res, next) => {
  commentController.postComment(req, res, next);
});

// fetch comment (CHECKED)
commentRouter.get('/', jwtAuth, (req, res, next) => {
  commentController.fetchComment(req, res, next);
});

// delete comment (CHECKED)
commentRouter.delete('/', jwtAuth, (req, res, next) => {
  commentController.deleteComment(req, res, next);
});

// like comment (CHECKED)
commentRouter.post('/like', jwtAuth, (req, res, next) => {
  commentController.likeComment(req, res, next);
});
