// src/middlewares/errorHandler.ts
// 创建一个全局错误处理器，统一返回状态码和错误信息。该中间件捕获所有未处理的错误，返回 500 状态码和错误信息。
// 使用 err instanceof Error 来安全地访问错误信息。

import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES } from '../constants/statusCodes';
import { errorResponse } from '../utils/response';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(
    errorResponse(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Internal Server Error',
      err instanceof Error ? err.message : err
    )
  );
};

export default errorHandler;
