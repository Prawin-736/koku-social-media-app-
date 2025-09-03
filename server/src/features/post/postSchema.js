import { mongoose, Schema } from 'mongoose';

export const postSchema = new Schema({
  caption: {
    type: String,
  },
  post: {
    type: String,
  },
  posttime: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  comment: [{ type: Schema.Types.ObjectId, ref: 'comment' }],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
    },
  ],
});

export const PostModel = mongoose.model('post', postSchema);
