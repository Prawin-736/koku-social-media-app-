import dotenv from 'dotenv';
dotenv.config();
import ErrorHandler from '../../middleware/error-handler.js';
import PostRepository from './post-repository.js';
import UserRepository from '../user/user-repository.js';

export default class PostController {
  constructor() {
    this.postRepository = new PostRepository();
    this.userRepository = new UserRepository();
  }

  //----------------------uploadPost 
  async uploadPost(req, res, next) {
    const userId = req.userId;
    const file = req.file;
    const caption = req.body.caption;
    try {
      const post = await this.postRepository.addPost(userId, file, caption);
      if (post) {
        res.status(200).json(post);
      }
    } catch (err) {
      console.error('uploadPost controller Error : ', err);
      next(err);
    }
  }

  //-------------------------fetchAllPost 
  async fetchAllPost(req, res, next) {
    try {
      const userId = req.userId;
      const posts = await this.postRepository.getAllPost(userId);

      const user = await this.userRepository.findUser(userId);
      res.status(200).json({
        user: user,
        posts: posts,
      });
    } catch (err) {
      console.log('fetchAllPost controller Error : ', err);
      next(err);
    }
  }

  //-------------------------fetchAllUserPost 
  async fetchAllUserPost(req, res, next) {
    try {
      const userId = req.userId;
      const posts = await this.postRepository.getAllUserPost(userId);
      const user = await this.userRepository.findUser(userId);
      res.status(200).json({
        user: user,
        posts: posts,
      });
    } catch (err) {
      console.log('fetchAllUserPost controller Error : ', err);
      next(err);
    }
  }

  //---------editCaption preview caption input 
  async fetchCaption(req, res, next) {
    try {
      const postId = req.body.postId;

      const getPost = await this.postRepository.findPost(postId);
      res.status(200).send(getPost);
    } catch (err) {
      console.log('editCaption controller Error : ', err);
      next(err);
    }
  }

  //------editPost 
  async editPost(req, res, next) {
    try {
      const postId = req.body.postId;
      const captionInput = req.body.captionInput;

      const post = await this.postRepository.updateCaption(
        postId,
        captionInput
      );
      res.status(200).send(post);
    } catch (err) {
      console.log('editPost controller Error : ', err);
      next(err);
    }
  }

  //-----------delete post
  async deletePost(req, res, next) {
    try {
      const postId = req.body.postId;
      const post = await this.postRepository.deletePost(postId);
      if (post) {
        res.status(200).send(post);
      }
    } catch (err) {
      console.log('deletePost Controller Error : ', err);
      next(err);
    }
  }

  //---------------likePost 
  async likePost(req, res, next) {
    try {
      const postId = req.body.postId;
      const userId = req.userId;

      const post = await this.postRepository.likePost(postId, userId);
      res.status(200).json(post);
    } catch (err) {
      console.log('likePost controller Error : ', err);
      next(err);
    }
  }
}
