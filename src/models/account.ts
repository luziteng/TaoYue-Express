// src/models/account.ts
import mongoose, { Schema, Document } from 'mongoose';

interface IAccount extends Document {
  username:string;
  phone: string;
  password: string;
  role: string; // 权限角色
  status:string;// 状态
  wechat?: string; // 微信绑定信息
  images?: Array<any>; // 护照信息
  address:string;// 门店地址
  createdAt:Date;// 生成日期
  updatedAt:Date; // 更新日期
}

const AccountSchema: Schema = new Schema({
  username:{ type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String,required: true, default: 'common' }, // 默认角色为普通用户 admin:超级管理员；common:一般用户；vip:vip用户；special:特殊用户
  status: { type: String,required: true, default: 'start' }, // 状态：启用：start;禁用：forbid;postpone:缴费逾期；
  wechat: { type: String, default: null },
  address:{ type: String, default: null},
  createdAt: { type: Date, default: Date.now }, // 默认为当前时间
  updatedAt: { type: Date, default: Date.now }, // 默认为当前时间
  images: { type: Array, default: null },
});

const Account = mongoose.model<IAccount>('Account', AccountSchema);
export default Account;
