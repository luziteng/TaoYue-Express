// src/utils/response.ts
// 为了使前端更方便地处理响应，你可以统一所有的响应格式。例如，定义一个统一的响应结构，包括 code、message 和 data。
export const successResponse = (data: any, message = 'Success') => {
    return {
      code: 200,
      message,
      data,
    };
  };
  
  export const errorResponse = (code: number, message: string, data: any = null) => {
    return {
      code,
      message,
      data,
    };
  };
  