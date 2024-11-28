import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { STATUS_CODES } from '../constants/statusCodes';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';
// 不需要验证 token 的路由
const noAuthRoutes = ['/login']; // 在这里添加不需要 token 的路由

export const authenticateToken = (req: any, res: any, next: NextFunction): void => {
  const token = req.headers['authorization'];

  // 检查请求路径是否在不需要 token 的路由中
  if (noAuthRoutes.includes(req.path)) {
    return next(); // 如果是，无需进行 token 校验，直接跳过
  }

  // 如果没有 token
  if (!token) {
    return res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'token 失效' });
  }

  // 验证 token
  jwt.verify(token.split(' ')[1], JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Invalid or expired token' });
    }
    
    req.user = user; // @ts-ignore
    next();
  });
};

// 权限检查中间件
export const checkAdminRole = (req: any, res: Response, next: NextFunction): void => {
  if (req.user?.role !== 'admin') {
    res.status(STATUS_CODES.UNAUTHORIZED).send({ message: '只有管理员才能访问该资源' });
    return; // 这里使用 return 结束函数，但不返回任何值
  }
  next(); // 如果是管理员角色，则继续执行
};