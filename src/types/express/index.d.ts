// src/types/express/index.d.ts
import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload; // 根据实际用户对象定义类型
    }
  }
}
