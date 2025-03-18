// config/database.js
import mongoose from 'mongoose';
import 'dotenv/config'; // Load environment variables once (already done in app.js)

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;