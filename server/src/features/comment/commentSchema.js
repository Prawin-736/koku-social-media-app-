import { Schema, mongoose } from 'mongoose';

export const commentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'post',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  comment: {
    type: String,
  },
  commenttime: {
    type: String,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
});

export const CommentModel = mongoose.model('comment', commentSchema);
