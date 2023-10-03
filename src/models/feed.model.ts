import mongoose from 'mongoose';
import { IFeed } from '../interfaces';

const feedSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, required: false },
    link: { type: String, required: true },
    image: { type: String, required: false },
    publishedDate: { type: Date, required: true },
});

const FeedModel = mongoose.model<IFeed & mongoose.Document>('Feed', feedSchema);

export default FeedModel;