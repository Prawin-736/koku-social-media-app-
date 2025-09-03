import ErrorHandler from '../../middleware/error-handler.js';
import { PostModel } from './postSchema.js';
import { CommentModel } from '../comment/commentSchema.js';
import mongoose from 'mongoose';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { generateSignedUrl } from '../../../aws/s3SignedUrl.js';
import path from 'node:path';
import { s3Client } from '../../../aws/s3Client.js';

export default class PostRepository {
  //-----------------add post 
  async addPost(userId, file, caption) {
    if (!file) {
      throw new ErrorHandler('No file uploaded', 400);
    }

    const fileExtension = path.extname(file.originalname);

    const timeStampKey = Date.now();

    const key = `kokuApp/post/${userId}${timeStampKey}${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    const date = new Date();
    //explicitly tell to use default local (undefined)
    const datePart = date.toLocaleDateString(undefined, {
      month: 'long',
      day: 'numeric',
    });

    const timePart = date
      .toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toLowerCase();

    const formattedDateTime = `${datePart} at ${timePart}`;
    // ------------adds the post to database
    try {
      await s3Client.send(command);
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      const newPost = new PostModel({
        caption: caption,
        post: fileUrl,
        posttime: formattedDateTime,
        user: userId,
      });
      await newPost.save();

      return newPost;
    } catch (err) {
      console.error('addPost repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  //--------------------------gets All Post 
  async getAllPost(userId) {
    try {
      const posts = await PostModel.find()
        .populate('user')
        .populate('likes')
        .populate('comment');
      if (!posts) {
        throw new ErrorHandler('No posts yet. Be the first to post!', 404);
      }
      const updatePosts = await Promise.all(
        posts.map(async (post) => {
          // to take copy of the original mongoose document to perevent from making changes in orginal mongoose
          const postObj = post.toObject();

          if (!postObj.user.profilepicture) {
            // generating signed in postimage
            //to get only the path part of the url
            const postKey = new URL(postObj.post).pathname.slice(1);
            const postSignedUrl = await generateSignedUrl(postKey);
            postObj.post = postSignedUrl;

            return { postObj: postObj, userId: userId };
          }
          // generating signed in postimage
          //to get only the path part of the url
          const profilePictureKey = new URL(
            postObj.user.profilepicture
          ).pathname.slice(1);
          const profilePictureSignedUrl =
            await generateSignedUrl(profilePictureKey);
          postObj.user.profilepicture = profilePictureSignedUrl;
          const postKey = new URL(postObj.post).pathname.slice(1);
          const postSignedUrl = await generateSignedUrl(postKey);
          postObj.post = postSignedUrl;

          return { postObj: postObj, userId: userId };
        })
      );
      return updatePosts;
    } catch (err) {
      console.log('getAllPost repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  //--------------------------gets All User Post
  async getAllUserPost(userId) {
    try {
      const posts = await PostModel.find({ user: userId })
        .populate('user')
        .populate('likes')
        .populate('comment');
      if (!posts) {
        throw new ErrorHandler('No posts yet. Be the first to post!', 404);
      }
      const updatePosts = await Promise.all(
        posts.map(async (post) => {
          // to take copy of the original mongoose document to perevent from making changes in orginal mongoose
          const postObj = post.toObject();

          if (!postObj.user.profilepicture) {
            // generating signed in postimage
            //to get only the path part of the url
            const postKey = new URL(postObj.post).pathname.slice(1);
            const postSignedUrl = await generateSignedUrl(postKey);
            postObj.post = postSignedUrl;

            return { postObj: postObj, userId: userId };
          }
          // generating signed in postimage
          //to get only the path part of the url
          const profilePictureKey = new URL(
            postObj.user.profilepicture
          ).pathname.slice(1);
          const profilePictureSignedUrl =
            await generateSignedUrl(profilePictureKey);
          postObj.user.profilepicture = profilePictureSignedUrl;
          const postKey = new URL(postObj.post).pathname.slice(1);
          const postSignedUrl = await generateSignedUrl(postKey);
          postObj.post = postSignedUrl;

          return { postObj: postObj, userId: userId };
        })
      );
      return updatePosts;
    } catch (err) {
      console.log('getAllPost repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  //-------------------------find post for caption preview 
  async findPost(postId) {
    try {
      const post = await PostModel.findById(postId);
      return post;
    } catch (err) {
      console.log('findPost repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  //--------------------------update caption 
  async updateCaption(postId, captionInput) {
    try {
      const post = await PostModel.findByIdAndUpdate(
        postId,
        { $set: { caption: captionInput } },
        { new: true }
      );
      return post;
    } catch (err) {
      console.log('updateCaption repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  //-------------------delete post 
  async deletePost(postId) {
    try {
      const post = await PostModel.findById(postId);
      if (!post) {
        throw new ErrorHandler('post not found', 404);
      }

      //this removes the leading "/" before specific url before the key
      let s3Key = post.post;
      if (post.post.startsWith('http')) {
        const s3Url = new URL(post.post);
        // remove leading '/'
        s3Key = s3Url.pathname.slice(1);
      }

      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: s3Key,
      };

      // deleting postImage from aws s3
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);

      // deleting comments related to the post
      const deleteComments = await CommentModel.deleteMany({ post: postId });

      // deleting post
      const postDelete = await PostModel.findByIdAndDelete(postId);
      return postDelete;
    } catch (err) {
      console.log('deletePost Repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }

  //--------------------like post 
  async likePost(postId, userId) {
    try {
      const post = await PostModel.findById(postId).populate('likes');
      if (!post) {
        throw new ErrorHandler('No post found', 404);
      }

      //checking post like by this user
      const alreadyLiked = post.likes.some(
        (like) => like._id.toString() === userId
      );

      if (alreadyLiked) {
        //if already liked remove user like for the post
        const updatedPost = await PostModel.findByIdAndUpdate(
          postId,
          { $pull: { likes: new mongoose.Types.ObjectId(userId) } },
          { new: true }
        );
        return updatedPost;
      } else {
        // if not already liked add user like for the post
        const updatedPost = await PostModel.findByIdAndUpdate(
          postId,
          { $addToSet: { likes: userId } },
          { new: true }
        );
        return updatedPost;
      }
    } catch (err) {
      console.log('likePost repository Error : ', err);
      throw new ErrorHandler('something went wrong with database', 500);
    }
  }
}
