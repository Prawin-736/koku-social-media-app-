import express from 'express';
import { userRouter } from './src/features/user/user-router.js';
import { mainRouter } from './src/features/main/main-router.js';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mongooseConnect } from './config.js';
import cookieParser from 'cookie-parser';
import { checkS3Connection } from './aws/checkS3Connection.js';
import { postRouter } from './src/features/post/post-router.js';
import cors from 'cors';
import { commentRouter } from './src/features/comment/comment-router.js';
import { startExpiredUserChecker } from './src/middleware/checkExpiredUsers.js';

// setting to get absoulte path
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, '../client/src')));

//removes all expired token.it checks token is expired for the user every 5 minutes.
startExpiredUserChecker();

app.use('/api/user', userRouter);
app.use('/api/main', mainRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);

//errormiddleware
app.use((err, req, res, next) => {
  const statusCode = err.code || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    errors: [{ field: '', message }],
  });
});

// 404 error handling
app.use((req, res) => {
  res.status(404).json({
    error: 'API not found',
    code: 404,
  });
});

app.listen(3000, () => {
  console.log('server is listening in localHost 3000...');
  mongooseConnect();
  checkS3Connection();
});
