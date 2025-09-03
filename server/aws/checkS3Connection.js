import { ListBucketsCommand } from '@aws-sdk/client-s3';
import { s3Client } from './s3Client.js';
import dotenv from 'dotenv';
dotenv.config();

export const checkS3Connection = async () => {
  try {
    const commond = new ListBucketsCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
    });
    const response = await s3Client.send(commond);
    console.log('S3 connection successful :', response.Buckets);
  } catch (error) {
    console.log('S3 connection failed :', error);
  }
};
