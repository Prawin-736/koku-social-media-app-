import express from 'express';
import path from 'path';
import multer from 'multer';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { jwtAuth } from '../../middleware/jwt.js';
import PostController from './post-controller.js';

const postController = new PostController();

// setting this to get absoulte path .
const __dirname = dirname(fileURLToPath(import.meta.url));

export const postRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//post 
postRouter.post('/', jwtAuth, upload.single('postImage'), (req, res, next) => {
  postController.uploadPost(req, res, next);
});

//fetch all posts 
postRouter.get('/', jwtAuth, (req, res, next) => {
  postController.fetchAllPost(req, res, next);
});

//fetch all user specfic posts 
postRouter.get('/user', jwtAuth, (req, res, next) => {
  postController.fetchAllUserPost(req, res, next);
});

//preview caption 
postRouter.post('/fetchCaption', jwtAuth, (req, res, next) => {
  postController.fetchCaption(req, res, next);
});

//edit post 
postRouter.post('/editPost', jwtAuth, (req, res, next) => {
  postController.editPost(req, res, next);
});

//delete post 
postRouter.post('/deletePost', jwtAuth, (req, res, next) => {
  postController.deletePost(req, res, next);
});

//like post 
postRouter.post('/likePost', jwtAuth, (req, res, next) => {
  postController.likePost(req, res, next);
});
