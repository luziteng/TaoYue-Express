import express from 'express'; // 正确导入
import { addAccount, getAccounts, deleteAccount ,editAccount } from '../controllers/accountController';
// import authenticateToken from '../middlewares/authenticateToken';
// import { JwtPayload } from 'jsonwebtoken';
const router = express.Router();

// // 需要认证的接口示例
// router.get('/profile', authenticateToken, (req: Request, res: Response) => {
//   // @ts-ignore
//   const user = req.user as string | JwtPayload; // 强制类型转换
//   res.status(200).send({ message: 'Profile data', user });
// });

router.put('/accounts/:id',editAccount )// 编辑账号

router.post('/account', addAccount); // 增加账号
router.get('/accountList', getAccounts); // 查询所有账号
router.delete('/account/:id', deleteAccount); // 删除账号

export default router;