import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../../server/aws/s3Client.js';
import dotenv from 'dotenv';
dotenv.config();

export const generateSignedUrl = async (key, expiresIn = 3600) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    expiresIn: 3600,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  // console.log("first checking area :",signedUrl)
  return signedUrl;
};
