import { Request, Response, NextFunction } from 'express';
// 每次请求的时间戳、请求方法和请求路径，记录后调用 next() 将控制权交给下一个中间件或路由处理程序
const logger = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date().toISOString();
  console.log(`[${now}] ${req.method} ${req.url}`);
  next();
};

export default logger;
