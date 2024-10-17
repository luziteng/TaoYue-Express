// src/controllers/accountController.ts
import Account from '../models/account';
import { STATUS_CODES } from '../constants/statusCodes';
import { successResponse, errorResponse } from '../utils/response';
import bcrypt from 'bcryptjs'; //用于对密码进行加密和验证。
import jwt from 'jsonwebtoken';// 生成token

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';  // 通过环境变量获取 JWT 密钥
// 登录接口
export const login  = async (req: any, res: any) => {
  const { phone, password } = req.body;

  // 校验请求体中的手机号和密码
  if (!phone || !password) {
    return res.status(STATUS_CODES.OK).send(errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR,'手机号码与密码为必填' ));
  }

  try {
    // 根据手机号查找用户
    const account = await Account.findOne({ phone });

    if (!account) {
      return res.status(STATUS_CODES.OK).send(errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR,'账号不存在'));
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, account.password);
    console.log('isPasswordValid',isPasswordValid,password, account.password)
    if (!isPasswordValid) {
      return res.status(STATUS_CODES.OK).send(errorResponse( STATUS_CODES.INTERNAL_SERVER_ERROR,'密码错误'));
    }

    // 生成 JWT token，有效期 24 小时
    const token = jwt.sign({ id: account._id, role: account.role }, JWT_SECRET, {
      expiresIn: '24h', // 设置 token 过期时间为 24 小时
    });

    // 返回 token 和账号信息
    return res.status(STATUS_CODES.OK).send(successResponse({
        token,
        id: account._id,
        phone: account.phone,
        role: account.role,
        status: account.status,
        wechat: account.wechat,
        images: account.images,
    }));
  } catch (error) {
    if (error instanceof Error) {  
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'Login failed', error: error.message });
    }else{
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'Login failed', error: error });
    }
  }
};

// 增加账号
export const addAccount = async (req: any, res: any) => {
  const { username,password, role, wechat, phone, address, status, images } = req.body;

  // 校验必填字段
  if (!username || typeof username !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入账号名称' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入账号密码' });
  }
  if (!role || typeof role !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请选择账号权限' });
  }
  if (!address || typeof address !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入地址' });
  }
  if (!status || typeof status !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请选择账号状态' });
  }
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) { // 简单校验手机号码格式
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入正确的手机号' });
  }                       

  try {
    // 对密码进行加密
    const saltRounds = 10; // 可以根据安全需求调整盐值大小
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 新账户数据
    const newAccountData = {
      username,
      password: hashedPassword, // 保存加密后的密码
      role,
      wechat,
      phone,
      address,
      status,
      images: images || [],
    };

    const newAccount = new Account(newAccountData);
    await newAccount.save();
    
    res.status(STATUS_CODES.CREATED).send(successResponse(newAccount, '账号新建成功'));
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send(errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to create account', error.message));
    } else {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .send(errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to create account', error));
    }
  }
};
// 编辑账号
export const editAccount = async (req: any, res: any) => {
  const { id } = req.params; // 从请求参数中获取用户 ID
  const { username, password, role, wechat, phone, address, status, images } = req.body;

  // 校验必填字段
  if (!username || typeof username !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入账号名称' });
  }
  if (!role || typeof role !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请选择账号权限' });
  }
  if (!address || typeof address !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入地址' });
  }
  if (!status || typeof status !== 'string') {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请选择账号状态' });
  }
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) { // 简单校验手机号码格式
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: '请输入正确的手机号' });
  }

  try {
    // 查找账户
    const account = await Account.findById(id);
    if (!account) {
      return res.status(STATUS_CODES.NOT_FOUND).send({ message: '账号不存在' });
    }

    // 更新账户字段
    account.username = username;
    account.role = role;
    account.phone = phone;
    account.address = address;
    account.status = status;
    account.wechat = wechat || account.wechat; // 如果前端未传值，保留原值
    account.images = images || account.images; // 如果前端未传值，保留原值

    // 如果提供了新的密码，则加密并更新
    if (password) {
      const saltRounds = 10;
      account.password = await bcrypt.hash(password, saltRounds);
    }

    await account.save(); // 保存更改
    res.status(STATUS_CODES.OK).send(successResponse(account, '账号更新成功'));
  } catch (error) {
    if (error instanceof Error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to update account', error.message));
    } else {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send(errorResponse(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to update account', error));
    }
  }
};

// 查询账号
export const getAccounts  = async (req: any, res: any) => {
  try {
    // 获取分页参数
    const page = parseInt(req.query.page as string, 10) || 1;
    const size = parseInt(req.query.size as string, 10) || 10; // 使用 size 替代 limit

    // 获取筛选参数
    const filter = req.query.filter as string; // 假设是个字符串，用于匹配手机号码或地址

    // 构建查询条件
    const query: any = {};
    if (filter) {
      query.$or = [
        { phone: { $regex: filter, $options: 'i' } },
        { address: { $regex: filter, $options: 'i' } },
      ]; // 支持根据 filter 查询手机号码或地址
    }

    const skip = (page - 1) * size;

    const accounts = await Account.find(query)
      .skip(skip)
      .limit(size); // 这里仍然使用 limit 来限制返回的数据量

    const total = await Account.countDocuments(query);

    res.status(STATUS_CODES.OK).send(successResponse({
      data: accounts,
      total,
      page,
      size, // 返回 size 而不是 limit
    },'successly'));
  } catch (error) {
    if (error instanceof Error) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'Failed to retrieve accounts', error: error.message });
    } else {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: 'Failed to retrieve accounts', error });
    }
  }
};

// 删除账号
export const deleteAccount  = async (req: any, res: any) => {
  const { id } = req.params;

  try {
    const deletedAccount = await Account.findByIdAndDelete(id);
    if (!deletedAccount) {
      return res.status(404).send({ message: 'Account not found' });
    }
    res.status(200).send({ message: 'Account deleted successfully', account: deletedAccount });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).send({ message: 'Failed to delete account', error: error.message });
    } else {
      res.status(500).send({ message: 'Failed to delete account', error });
    }
  }
};
