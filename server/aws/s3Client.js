import dotenv from 'dotenv';
dotenv.config();
import { S3Client } from '@aws-sdk/client-s3';

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

export const s3Client = new S3Client({
  region: region,
  credentials: {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
  },
});
