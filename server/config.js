import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const url = process.env.DB_URL;
const dbName = process.env.DB_NAME;

export const mongooseConnect = async () => {
  try {
    await mongoose.connect(url, {
      //     useNewUrlParser:true,
      // userUnifiedTopology:true,
      dbName: dbName,
    });

    console.log('mongoose is connected to localHost 3000..');
  } catch (err) {
    console.log(err);
  }
};
