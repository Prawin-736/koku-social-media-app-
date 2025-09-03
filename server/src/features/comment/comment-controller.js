import ErrorHandler from '../../middleware/error-handler.js';
import commentRepository from './comment-repository.js';
import dotenv from 'dotenv';
import { generateSignedUrl } from '../../../aws/s3SignedUrl.js';
import { PostModel } from '../post/postSchema.js';
dotenv.config();

export default class CommentController {
  constructor() {
    this.commentRepository = new commentRepository();
  }

  //post comment 
  async postComment(req, res, next) {
    const postId = req.body.postId;
    const userId = req.userId;
    const commentData = req.body.commentInput;
    const date = new Date();

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

    const commentTime = `${datePart} at ${timePart}`;

    try {
      const comment = await this.commentRepository.postComment(
        postId,
        userId,
        commentData,
        commentTime
      );

      //stores the commentId of the comment in the post
      const updatedPostWithCommentId = await PostModel.findByIdAndUpdate(
        postId,
        { $push: { comment: comment._id } },
        { new: true }
      );
      const post = await PostModel.findById(postId);
      const commentCount = post.comment.length;

      if (updatedPostWithCommentId) {
        const commentObj = comment.toObject();

        const profilePictureKey = new URL(
          commentObj.user.profilepicture
        ).pathname.slice(1);

        const profilePictureSignedUrl =
          await generateSignedUrl(profilePictureKey);

        commentObj.user.profilepicture = profilePictureSignedUrl;
        res
          .status(201)
          .json({ comment: commentObj, commentCount: commentCount });
      }
    } catch (err) {
      console.log('postComment Controller Error : ', err);
      next(err);
    }
  }

  //fetch comment
  async fetchComment(req, res, next) {
    const postId = req.query.postId;
    const userId = req.userId;

    try {
      const comments = await this.commentRepository.fetchComment(postId);

      const commentsWithUpdatedDp = await Promise.all(
        comments.map(async (comment) => {
          const commentObj = comment.toObject();

          if (commentObj.user.profilepicture) {
            const profilePictureKey = new URL(
              commentObj.user.profilepicture
            ).pathname.slice(1);
            const profilePictureSignedUrl =
              await generateSignedUrl(profilePictureKey);
            commentObj.user.profilepicture = profilePictureSignedUrl;
          }

          return commentObj;
        })
      );
      return res
        .status(200)
        .json({ comment: commentsWithUpdatedDp, user: userId });
    } catch (err) {
      console.log('fetch comments controller Error:', err);
      next(err);
    }
  }

  //delete comment 
  async deleteComment(req, res, next) {
    const commentId = req.query.commentId;
    try {
      const comment = await this.commentRepository.deleteComment(commentId);

      if (comment) {
        // deleting the commendId stored in post
        const result = await PostModel.findByIdAndUpdate(
          comment.post,
          { $pull: { comment: commentId } },
          { new: true }
        );
        if (result) {
          res.status(200).json(comment);
        }
      }
    } catch (err) {
      console.log('deleteComment controller Error : ', err);
      next(err);
    }
  }

  //like comment 
  async likeComment(req, res, next) {
    const userId = req.userId;
    const commentId = req.body.commentId;

    try {
      const comment = await this.commentRepository.findComment(commentId);
      if (!comment) {
        throw new ErrorHandler('comment not found', 404);
      }

      const alreadyLiked = comment.likes.some(
        (like) => like._id.toString() === userId
      );

      if (alreadyLiked) {
        const removeLike = await this.commentRepository.removeLikeToComment(
          commentId,
          userId
        );
        return res.status(200).json(removeLike);
      } else {
        const addLike = await this.commentRepository.addLikeToComment(
          commentId,
          userId
        );
        return res.status(200).json(addLike);
      }
    } catch (err) {
      console.log('likeComment controller Error : ', err);
      next(err);
    }
  }
}
