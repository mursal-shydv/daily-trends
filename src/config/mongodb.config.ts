import mongoose from 'mongoose';

const MONGO_HOSTNAME = 'localhost';
const MONGO_PORT = '27017';
const MONGO_DB = 'dailyTrends';

const MONGO_URI = `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: true
    });
    console.log("Connected to DB successfully")
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDatabase;
