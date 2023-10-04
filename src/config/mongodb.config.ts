import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = `mongodb://${process.env.MONGO_HOST}:${Number(process.env.MONGO_PORT)}/${process.env.MONGO_DB}?authSource=admin`;

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: true
    });
    console.log('Connected to DB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export default connectDatabase;
