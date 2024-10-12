import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { STATUS_CODES } from '../constants/statusCodes';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Token is required' });
    return;  // 确保不返回 Response 对象
  }

  // 验证 token
  jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
    if (err) {
      res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Invalid or expired token' });
      return;  // 确保不返回 Response 对象
    }
    // @ts-ignore
    // 将解码后的用户信息保存到请求对象中
    req.user = user;
    next();  // 确保调用了 next()
  });
};

export default authenticateToken;
