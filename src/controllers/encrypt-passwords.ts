// 密码加密脚本

import bcrypt from 'bcryptjs';
import Account from '../models/account'; // 请根据实际项目的路径调整
import mongoose from 'mongoose'; // 如果你使用的是 mongoose 连接数据库
import dotenv from 'dotenv'; // 如果你使用 dotenv 进行环境变量管理

// 初始化 dotenv 环境变量
dotenv.config();

const encryptExistingPasswords = async () => {
  try {
    // 连接数据库
    await mongoose.connect('mongodb://localhost:27017/taoadmin'); // 删除 useNewUrlParser 和 useUnifiedTopology
    console.log('Connected to MongoDB');

    // 获取所有账户
    const accounts = await Account.find({});

    for (let account of accounts) {
      // 如果密码未加密 (假设未加密的密码没有 '$2b$' 前缀)
      if (!account.password.startsWith('$2b$')) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(account.password, saltRounds);

        // 更新用户密码为加密后的哈希值
        account.password = hashedPassword;
        await account.save();
        console.log(`Account ${account.phone} password updated.`);
      }
    }

    console.log('All accounts have been updated.');
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    // 断开数据库连接
    mongoose.connection.close();
  }
};

// 执行脚本
encryptExistingPasswords();
