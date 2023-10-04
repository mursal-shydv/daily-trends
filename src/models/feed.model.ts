import mongoose from 'mongoose';
import { IFeed } from '../interfaces';

const feedSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: false },
  location: { type: String, required: false },
});

const FeedModel = mongoose.model<IFeed & mongoose.Document>('Feed', feedSchema);

export default FeedModel;