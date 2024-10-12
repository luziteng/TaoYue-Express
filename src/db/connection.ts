// src/db/connection.ts用于管理与 MongoDB 的连接。是 MongoDB 的连接字符串，taoadmin 是数据库的名字。启动时会自动创建数据库。
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/taoadmin');
        console.log('MongoDB connected successfully');
      } catch (error) {
        if (error instanceof Error) {
          console.error('MongoDB connection failed:', error.message);
        } else {
          console.error('MongoDB connection failed:', error);
        }
        process.exit(1);
      }
};

export default connectDB;
