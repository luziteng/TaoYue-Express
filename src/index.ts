import express from 'express';
import connectDB from './db/connection';
import logger from './middlewares/logger';
import cors from 'cors'; // 使用官方 cors 包
import routes from './routes';
import errorHandler from './middlewares/errorHandler';
import { STATUS_CODES } from './constants/statusCodes';
import dotenv from 'dotenv'; // 为了让 Node.js 读取 .env 文件中的环境变量，需要安装 dotenv 库

const app = express();
const port = 3000;

// 连接 MongoDB
connectDB();

// 中间件
app.use(express.json());
app.use(logger);
app.use(cors());

// 路由
app.use('/api', routes);

// 处理 404
app.use((req, res, next) => {
  res.status(STATUS_CODES.NOT_FOUND).send({ message: '接口未找到' });
});

// 全局错误处理
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// 加载 .env 文件中的环境变量
dotenv.config();
