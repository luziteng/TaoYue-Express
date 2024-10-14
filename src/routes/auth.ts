// 账号相关路由
import { login } from '../controllers/accountController';
import express from 'express'; // 正确导入
const router = express.Router();
router.post('/login', login); // 登录
export default router;